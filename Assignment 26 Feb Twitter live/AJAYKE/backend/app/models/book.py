class Book:
    def __init__(self, id, title, author, publication_year, genre, rating):
        self.id = id
        self.title = title
        self.author = author
        self.publication_year = publication_year
        self.genre = genre
        self.rating = rating

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "publication_year": self.publication_year,
            "genre": self.genre,
            "rating": self.rating
        }