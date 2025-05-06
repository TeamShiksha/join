import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import logging
from datetime import timedelta

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    
    app.config['JWT_SECRET_KEY'] = app.config.get('SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(hours=1))
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = app.config.get('JWT_REFRESH_TOKEN_EXPIRES', timedelta(days=30))
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['UPLOAD_FOLDER'] = app.config.get('UPLOAD_FOLDER', 'uploads')
    app.config['COMPRESS_IMAGE_FOLDER'] = app.config.get('COMPRESS_IMAGE_FOLDER', 'compressed_images')
    app.config['MAX_CONTENT_LENGTH'] = app.config.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)
    app.config['ALLOWED_EXTENSIONS'] = app.config.get('ALLOWED_EXTENSIONS', {'jpg', 'jpeg'})
    
    jwt = JWTManager(app)

    logging.basicConfig(level=logging.INFO, filename='app.log',
                        format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)
    logger.info('Flask app initialized')

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    from web_app.auth import bp as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/api')
    
    from web_app.image_service import bp as image_service_blueprint
    app.register_blueprint(image_service_blueprint, url_prefix='/api')
   
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return {
            'message': 'Unauthorized access',
            'success': False,
            'error': 'Missing or invalid JWT token'
        }, 401
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {
            'message': 'Token has expired',
            'success': False,
            'error': 'Token expired'
        }, 401

    @app.route('/')
    def index():
        return 'Hello, World!'
    
    return app