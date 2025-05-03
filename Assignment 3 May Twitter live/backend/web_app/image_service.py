from flask import Blueprint, request, jsonify, current_app, send_file
import functools
from datetime import timedelta
from web_app.db import Database
from web_app.utils import generate_response
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename
from PIL import Image

bp = Blueprint('image_service', __name__, url_prefix='/image')

def allowed_file(filename):
    ALLOWED_EXTENSIONS = current_app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def compress_image(filepath):
    img = Image.open(filepath)
    img.thumbnail((512, 512))
    compress_folder = current_app.config['COMPRESS_IMAGE_FOLDER']
    os.makedirs(compress_folder, exist_ok=True)
    filename = os.path.basename(filepath)
    compress_filepath = os.path.join(compress_folder, filename)
    img.save(compress_filepath)
    
    return compress_filepath

@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    if 'file' not in request.files:
        return generate_response('No file part', 400)
    
    file = request.files['file']
    if file.filename == '':
        return generate_response('No selected file', 400)
    
    if not allowed_file(file.filename):
        return generate_response('File type not allowed. Only JPG/JPEG files are accepted', 400)
    
    try:
        if file.content_length > current_app.config['MAX_CONTENT_LENGTH']:
            return generate_response('File size exceeds the maximum limit', 413)
        
        current_user_id = get_jwt_identity()
        filename = secure_filename(file.filename)
        
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        compressed_filepath = compress_image(filepath)
        Database.execute_query(
            """
            INSERT INTO image (uploader_id, filename, filepath, compressed_filepath)
            VALUES (%s, %s, %s, %s)
            """,
            (current_user_id, filename, filepath, compressed_filepath)
        )
        
        return generate_response('Image uploaded successfully', 200, {'filename': filename})
    
    except Exception as e:
        current_app.logger.error(f"Error uploading image: {e}")
        return generate_response('Error uploading image', 500)  
    
@bp.route('/list', methods=['GET'])
@jwt_required()
def list_images():
    try:
        current_user_id = get_jwt_identity()
        images = Database.execute_query(
            """
            SELECT id, filename, filepath
            FROM image
            WHERE uploader_id = %s
            """,
            (current_user_id,)
        )

        return generate_response('Images retrieved successfully', 200, {'images': images})
    
    except Exception as e:
        current_app.logger.error(f"Error listing images: {e}")
        return generate_response('Error listing images', 500)

@bp.route('/download_original/<string:image_id>', methods=['GET'])
@jwt_required()
def download_original_image(image_id):
    try:
        current_user_id = get_jwt_identity()
        image = Database.execute_query(
            """
            SELECT filename, filepath
            FROM image
            WHERE id = %s AND uploader_id = %s
            """,
            (image_id, current_user_id)
        )
        
        if not image:
            return generate_response('Image not found', 404)
        
        filepath = image[0]['filepath']
        return send_file(filepath, as_attachment=True)
    
    except Exception as e:
        current_app.logger.error(f"Error downloading image: {e}")
        return generate_response('Error downloading image', 500)

@bp.route('/download_compressed/<string:image_id>', methods=['GET'])
@jwt_required()
def download_compressed_image(image_id):
    try:
        current_user_id = get_jwt_identity()

        image = Database.execute_query(
            """
            SELECT filename, compressed_filepath
            FROM image
            WHERE id = %s AND uploader_id = %s
            """,
            (image_id, current_user_id)
        )
        
        if not image:
            return generate_response('Image not found', 404)
        
        compressed_filepath = image[0]['compressed_filepath']
        return send_file(compressed_filepath, as_attachment=True)
    
    except Exception as e:
        current_app.logger.error(f"Error downloading compressed image: {e}")
        return generate_response('Error downloading compressed image', 500)
