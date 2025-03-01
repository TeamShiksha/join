import json
from app.models.book import Book

class BookService:
    def __init__(self):
        data = []
        with open('books.json', 'r') as file:
            data = json.load(file)
        self.books = data
        self.books = [Book(book['id'], book['title'], book['author'], 
                           book['publicationYear'], book['genre'], book['rating']) 
                      for book in self.books]
        self.next_id = 3

    def get_all_books(self, genre=None, min_rating=0):
        filtered = [book for book in self.books]
        if genre:
            filtered = [book for book in filtered if book.genre.lower() == genre.lower()]
        if min_rating:
            filtered = [book for book in filtered if book.rating >= min_rating]
        return [book.to_dict() for book in filtered]

    def get_book_by_id(self, book_id):
        return next((book.to_dict() for book in self.books if book.id == book_id), None)

    def add_book(self, data):
        book = Book(self.next_id, data['title'], data['author'], 
                   data['publicationYear'], data['genre'], data['rating'])
        self.books.append(book)
        self.next_id += 1
        return book.to_dict()

    def update_rating(self, book_id, rating):
        book = next((book for book in self.books if book.id == book_id), None)
        if book:
            book.rating = rating
            return book.to_dict()
        return None

    def get_statistics(self):
        if not self.books:
            return {}
        
        stats = {
            "total_books": len(self.books),
            "avg_rating_by_genre": {},
            "oldest_book": min(self.books, key=lambda x: x.publication_year).to_dict(),
            "newest_book": max(self.books, key=lambda x: x.publication_year).to_dict()
        }
        
        genres = set(book.genre for book in self.books)
        for genre in genres:
            genre_books = [b.rating for b in self.books if b.genre == genre]
            stats["avg_rating_by_genre"][genre] = sum(genre_books) / len(genre_books)
            
        return stats