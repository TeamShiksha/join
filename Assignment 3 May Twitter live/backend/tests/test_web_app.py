import io
import pytest
from flask import Flask
from flask_jwt_extended import JWTManager, create_refresh_token
from werkzeug.datastructures import FileStorage

# --- 1. Fixture: create and configure our Flask test app ---
@pytest.fixture
def app(monkeypatch, tmp_path):
    from ..web_app import create_app  # adjust if your factory is named differently
    app = create_app({
        'TESTING': True,
        'JWT_SECRET_KEY': 'test-secret',
        'UPLOAD_FOLDER': str(tmp_path / "uploads"),
        'COMPRESS_IMAGE_FOLDER': str(tmp_path / "compressed"),
        'MAX_CONTENT_LENGTH': 1024,
        'ALLOWED_EXTENSIONS': {'jpg', 'jpeg'},
    })
    JWTManager(app)
    return app

# --- 2. Helper to stub Database.execute_query ---
class DummyResponse:
    def __init__(self, data):
        self.data = data

@pytest.fixture(autouse=True)
def stub_db(monkeypatch):
    def fake_exec(sql, params=None):
        return DummyResponse(data=[])
    monkeypatch.setattr("web_app.db.Database.execute_query", fake_exec)
    return fake_exec

# --- 3. Test /register endpoint ---
def test_register_no_json(client):
    resp = client.post('/register')
    assert resp.status_code == 400
    assert b"Request body must be JSON" in resp.data

@pytest.mark.parametrize("payload, expected_error", [
    ({}, b"Username is required"),
    ({"username":"ab","password":"secret"}, b"Invalid username"),
    ({"username":"alice","password":""}, b"Password is required"),
    ({"username":"alice","password":"123"}, b"Invalid password"),
])
def test_register_validation_errors(client, payload, expected_error):
    resp = client.post('/register', json=payload)
    assert resp.status_code == 400
    assert expected_error in resp.data

def test_register_conflict(client, stub_db):
    stub_db.return_value = DummyResponse(data=[{"id": 1}])
    resp = client.post('/register', json={
        "username":"bob", "password":"goodpass", "name":"Bob"
    })
    assert resp.status_code == 409
    assert b"already registered" in resp.data

def test_register_success(client, stub_db, monkeypatch):
    calls = []
    def fake_exec(sql, params=None):
        calls.append(sql)
        if sql.startswith("SELECT"):
            return DummyResponse(data=[])
        else:
            return DummyResponse(data=[{"id":42}])
    monkeypatch.setattr("web_app.db.Database.execute_query", fake_exec)
    resp = client.post('/register', json={
        "username":"carol", "password":"strongpw", "name":"Carol"
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert data['data']['id'] == 42
    assert data['data']['username'] == 'carol'

# --- 4. Test /login endpoint ---
def test_login_no_json(client):
    resp = client.post('/login')
    assert resp.status_code == 400
    assert b"must be JSON" in resp.data

def test_login_missing_fields(client):
    resp = client.post('/login', json={"username":"x"})
    assert resp.status_code == 400

def test_login_invalid_credentials(client, stub_db):
    stub_db.return_value = DummyResponse(data=[])
    resp = client.post('/login', json={"username":"x","password":"y"})
    assert resp.status_code == 401

def test_login_bad_password(client, stub_db, monkeypatch):
    hashed = "pbkdf2:sha256:..."
    stub_db.return_value = DummyResponse(data=[{"id":1,"username":"bob","password":hashed}])
    monkeypatch.setattr("werkzeug.security.check_password_hash", lambda h, p: False)
    resp = client.post('/login', json={"username":"bob","password":"pw"})
    assert resp.status_code == 401

def test_login_success(client, stub_db):
    import werkzeug.security as ws
    real_hash = ws.generate_password_hash("pw")
    stub_db.return_value = DummyResponse(data=[{"id":7,"username":"dan","password":real_hash,"name":"Dan"}])
    resp = client.post('/login', json={"username":"dan","password":"pw"})
    assert resp.status_code == 200
    out = resp.get_json()
    assert "access_token" in out['data']
    assert out['data']['user']['username']=="dan"

# --- 5. Test /refresh endpoint ---
def test_refresh_invalid_token(client):
    resp = client.post('/refresh')
    assert resp.status_code == 401

def test_refresh_user_not_found(client, stub_db):
    token = create_refresh_token(identity=99, additional_claims={"username":"x","user_id":99})
    stub_db.return_value = DummyResponse(data=[])
    resp = client.post('/refresh', headers={"Authorization":f"Bearer {token}"})
    assert resp.status_code == 404

def test_refresh_success(client, stub_db):
    token = create_refresh_token(identity=5, additional_claims={"username":"y","user_id":5})
    stub_db.return_value = DummyResponse(data=[{"id":5,"username":"y"}])
    resp = client.post('/refresh', headers={"Authorization":f"Bearer {token}"})
    assert resp.status_code == 200
    assert "access_token" in resp.get_json()['data']

# --- 6. Tests for image endpoints ---
def make_image_file(name, content=b"x"):
    return FileStorage(stream=io.BytesIO(content), filename=name)

def test_upload_no_file(client):
    token = create_refresh_token(identity=1, additional_claims={"username":"u","user_id":1})
    resp = client.post('/upload', headers={"Authorization":f"Bearer {token}"})
    assert resp.status_code == 400
    assert b"No file part" in resp.data

def test_upload_empty_filename(client):
    token = create_refresh_token(identity=1, additional_claims={"username":"u","user_id":1})
    empty = FileStorage(stream=io.BytesIO(b"x"), filename="")
    resp = client.post('/upload', headers={"Authorization":f"Bearer {token}"}, data={'file': empty})
    assert resp.status_code == 400
    assert b"No selected file" in resp.data

def test_upload_bad_ext(client):
    token = create_refresh_token(identity=1, additional_claims={"username":"u","user_id":1})
    bad = make_image_file("test.png")
    resp = client.post('/upload', headers={"Authorization":f"Bearer {token}"}, data={'file': bad})
    assert resp.status_code == 400
    assert b"not allowed" in resp.data

def test_upload_success(client, stub_db, monkeypatch):
    token = create_refresh_token(identity=2, additional_claims={"username":"u","user_id":2})
    good = make_image_file("img.jpg", content=b"a"*100)
    monkeypatch.setattr("web_app.db.Database.execute_query", lambda *args, **kw: None)
    resp = client.post('/upload', headers={"Authorization":f"Bearer {token}"}, data={'file': good})
    assert resp.status_code == 200
    assert b"uploaded successfully" in resp.data

def test_list_images(client, stub_db):
    token = create_refresh_token(identity=3, additional_claims={"username":"z","user_id":3})
    stub_db.return_value = DummyResponse(data=[{"id":10,"filename":"a.jpg","filepath":"/x"}])
    resp = client.get('/list', headers={"Authorization":f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['data']['images'][0]['filename']=="a.jpg"

def test_download_not_found(client, stub_db):
    token = create_refresh_token(identity=4, additional_claims={"username":"x","user_id":4})
    stub_db.return_value = []
    resp = client.get('/download_original/999', headers={"Authorization":f"Bearer {token}"})
    assert resp.status_code == 404

# ... add more tests as needed ... 