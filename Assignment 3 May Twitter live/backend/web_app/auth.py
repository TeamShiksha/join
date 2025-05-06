from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import timedelta
from .utils import validate_username, validate_password, generate_response
from .db import Database

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return generate_response('Request body must be JSON', 400)
        
    username = data.get('username')
    password = data.get('password')
    name = data.get('name', '')
    
    error = None
    if not username:
        error = 'Username is required.'
    elif not validate_username(username):
        error = 'Invalid username (must be at least 3 characters).'
    elif not password:
        error = 'Password is required.'
    elif not validate_password(password):
        error = 'Invalid password (must be at least 6 characters).'

    if error is None:
        try:
            existing_users = Database.execute_query(f"SELECT id FROM user WHERE username = '{username}'")
            if existing_users and len(existing_users) > 0:
                return generate_response(f"User {username} is already registered", 409)
            else:
                response = Database.execute_query(f"INSERT INTO user (username, password, name) VALUES ('{username}', '{generate_password_hash(password)}', '{name}')")
                
                if not response.data:
                    raise Exception("Failed to insert user")
                
                new_user = response.data[0]
                return generate_response(
                    'Registration successful', 
                    201,
                    {'username': username, 'id': new_user['id']}
                )
                
        except Exception as e:
            current_app.logger.error(f"Database error: {e}")
            return generate_response('Database error during registration', 500, error=str(e))

    return generate_response(error, 400)


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return generate_response('Request body must be JSON', 400)
        
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return generate_response('Username and password are required', 400)
    
    try:
        response = Database.execute_query(f"SELECT * FROM user WHERE username = '{username}'")
        users = response.data
        
        if not users or len(users) == 0:
            return generate_response('Invalid credentials', 401)
        
        user = users[0]
        if not check_password_hash(user['password'], password):
            return generate_response('Invalid credentials', 401)

        additional_claims = {
            'username': user['username'],
            'user_id': user['id']
        }
        
        access_token = create_access_token(
            identity=user['id'],
            additional_claims=additional_claims,
            expires_delta=timedelta(hours=1)
        )
        refresh_token = create_refresh_token(
            identity=user['id'],
            additional_claims=additional_claims,
            expires_delta=timedelta(days=30)
        )
        
        return generate_response(
            'Login successful', 
            200, 
            {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'name': user.get('name', '')
                }
            }
        )

    except Exception as e:
        current_app.logger.error(f"Login error: {e}")
        return generate_response('Database error during login', 500, error=str(e))


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using a valid refresh token"""
    try:
        current_user_id = get_jwt_identity()
        response = Database.execute_query(f"SELECT id,username FROM user WHERE id = '{current_user_id}'")
        users = response.data
        
        if not users or len(users) == 0:
            return generate_response('User not found', 404)
            
        user = users[0]
        additional_claims = {
            'username': user['username'],
            'user_id': user['id']
        }
        
        access_token = create_access_token(
            identity=current_user_id,
            additional_claims=additional_claims,
            expires_delta=timedelta(hours=1)
        )
        
        return generate_response(
            'Token refreshed successfully', 
            200, 
            {'access_token': access_token}
        )
        
    except Exception as e:
        current_app.logger.error(f"Token refresh error: {e}")
        return generate_response('Error refreshing token', 500, error=str(e))

