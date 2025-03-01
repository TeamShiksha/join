from flask import Flask
from flask_cors import CORS
from app.routes.book_routes import book_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(book_bp)
    return app