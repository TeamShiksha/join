import { books } from "../constants.js";
import { writeFileSync } from 'fs';

export const getAllBooks = async (req, res) => {
    try {
        const { genre } = req.query;

        if (genre) {
            const filteredBooks = books.filter(book => book.genre === genre);
            return res.status(200).json(filteredBooks);
        }
        return res.status(200).json(books);

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = books.find(book => book.id === id);

        if (!book) {
            return res.status(404).json({ message: `Book with id ${id} not found` });
        }

        return res.status(200).json({ data: book });

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

export const addBook = async (req, res) => {
    try {
        const data = req.body;

        // check if book with same id if already exists
        const existingBook = books.find(book => book.id === data.id);

        if (existingBook) {
            return res.status(400).json({ message: `Book with id ${data.id} already exists` });
        }


        const newData = [...books, data];
        console.log(books);
        const fileContent = `export const books = ${JSON.stringify(newData, null, 2)};`;
        writeFileSync('./constant.js', fileContent, 'utf8');

        return res.status(201).json({
            message: "Book added successfully",
            book: data
        });

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}



export const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const book = books.find(book => book.id === id);

        if (!book) {
            return res.status(404).json({ message: `Book with id ${id} not found` });
        }

        book.rating = rating;

        const fileContent = `export const books = ${JSON.stringify(books, null, 2)};`;
        writeFileSync('./constant.js', fileContent, 'utf8');

        return res.status(200).json({
            message: "Rating updated successfully",
            book
        });

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}


export const getStatistics = async (req, res) => {
    try {
        let genres = {};
        let oldestBook = books[0];
        let newestBook = books[0];


        books.forEach(book => {
            // check if genre exist
            if (!genres[book.genre]) {
                genres[book.genre] = { totalRating: 0, count: 0 };
            }

            // calculate genre
            genres[book.genre].totalRating += book.rating;
            genres[book.genre].count += 1;

            // oldest book
            if (book.publishedYear < oldestBook.publishedYear) {
                oldestBook = book;
            }

            // newest book
            if (book.publishedYear > newestBook.publishedYear) {
                newestBook = book;
            }
        })

        // avegare genre rating
        let averageRatingsByGenre = {};
        for (const genre in genres) {
            averageRatingsByGenre[genre] = (genres[genre].totalRating / genres[genre].count).toFixed(2);
        }


        return res.status(200).json({
            message: "Statistics",
            oldestBook,
            newestBook,
            averageRatingsByGenre
        });

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}