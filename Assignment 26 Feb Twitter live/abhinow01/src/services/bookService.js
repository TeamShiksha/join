const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/books.json');

const readBooksFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/books.json'), 'utf-8');
        return JSON.parse(data); 
    } catch (error) {
        console.error("Error reading books file:", error);
        return []; 
    }
};

const writeBooksToFile = (books) => {
    fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
};

const getAllBooks = (genre) => {
    let books = readBooksFromFile();
    if (genre) {
        books = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }
    return books;
};

const getBookById = (id) => {
    const books = readBooksFromFile();
    return books.find(book => book.id === id);
};

const addBook = (book) => {
    const books = readBooksFromFile();
    books.push(book);
    writeBooksToFile(books);
    return book;
};

const updateBookRating = (id, rating) => {
    const books = readBooksFromFile();
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) return null;

    books[bookIndex].rating = rating;
    writeBooksToFile(books);
    return books[bookIndex];
};

const getStatistics = async () => {
    let books =  readBooksFromFile();
    if (!books || books.length === 0) {
        return { message: "No books available for statistics" };
    }

    const avgRatingByGenre = books.reduce((acc, book) => {
        acc[book.genre] = acc[book.genre] || { sum: 0, count: 0 };
        acc[book.genre].sum += book.rating;
        acc[book.genre].count += 1;
        return acc;
    }, {});

    for (const genre in avgRatingByGenre) {
        avgRatingByGenre[genre] = (avgRatingByGenre[genre].sum / avgRatingByGenre[genre].count).toFixed(2);
    }

    const sortedByYear = books.sort((a, b) => a.publicationYear - b.publicationYear);

    return {
        averageRatingByGenre: avgRatingByGenre,
        oldestBook: sortedByYear[0],
        newestBook: sortedByYear[sortedByYear.length - 1]
    };
};

module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBookRating,
    getStatistics
};
