class Book {
    constructor(id, title, author, publicationYear, genre, rating, description, metadata) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publicationYear = publicationYear;
        this.genre = genre;
        this.rating = rating;
        this.description = description;
        this.metadata = metadata;
    }
}

module.exports = Book;
