import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

UPLOAD_DIR = "uploads"
CONVERTED_DIR = "converted"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(CONVERTED_DIR, exist_ok=True)


def test_upload_image():
    file_path = "images/1.jpg"
    with open(file_path, "rb") as f:
        response = client.post("/upload-image/", files={"file": ("1.jpg", f, "image/jpeg")})
    assert response.status_code == 200
    assert response.json() == {
                "filename": "1.jpg",
                "status": "uploaded"
}


def test_convert_image():
    response = client.post("/convert-image/", params={"filename": "1.jpg"})
    assert response.status_code == 200
    assert response.json() == {
            "filename": "1.jpg",
            "status": "converted"
}


def test_get_images():
    response = client.get("/uploaded-images/")
    assert response.status_code == 200
    assert response.json() == [
        "1.jpg"
    ]


def test_download_convert_image():
    with open("images/1.jpg", "rb") as f:
        client.post("/upload-image/", files={"file": ("1.jpg", f, "image/jpeg")})
    client.post("/convert-image/", params={"filename": "1.jpg"})
    response = client.get("/download-converted-image/", params={"filename": "1.jpg"})
    assert response.status_code == 200

    assert response.headers["content-type"] == "image/jpeg"

