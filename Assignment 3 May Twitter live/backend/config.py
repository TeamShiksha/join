import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key'
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'sqlite:///site.db'
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024 # (16 MB)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = 3600 # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000 # 30 days
    COMPRESS_IMAGE_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'compressed_images')
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}
    
