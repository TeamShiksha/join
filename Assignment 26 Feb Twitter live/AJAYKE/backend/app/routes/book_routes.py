from flask import Blueprint, request, jsonify # type: ignore
from app.services.book_service import BookService

book_bp = Blueprint('book', __name__, url_prefix='/api/books')
service = BookService()

@book_bp.route('', methods=['GET'])
def get_books():
    genre = request.args.get('genre')
    min_rating = float(request.args.get('min_rating', 0))
    return jsonify(service.get_all_books(genre, min_rating))

@book_bp.route('/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = service.get_book_by_id(book_id)
    return jsonify(book) if book else ('Book not found', 404)

@book_bp.route('', methods=['POST'])
def add_book():
    data = request.get_json()
    return jsonify(service.add_book(data)), 201

@book_bp.route('/<int:book_id>/rating', methods=['PUT'])
def update_rating(book_id):
    data = request.get_json()
    book = service.update_rating(book_id, data['rating'])
    return jsonify(book) if book else ('Book not found', 404)

@book_bp.route('/stats', methods=['GET'])
def get_stats():
    return jsonify(service.get_statistics())