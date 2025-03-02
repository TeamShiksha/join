const express = require('express');
const api = express.Router();
const bookData = require('../books.json');
const fs = require('fs');
const path = require('path');

api.get('/books', (request, response) => {
    if (request.query.genre) {
        return response.json(bookData.filter(book => book.genre === request.query.genre));
    }
    response.json(bookData);
});

api.get('/books/:id', (request, response) => {
    const targetBook = bookData.find(book => book.id === request.params.id);
    if (!targetBook) {
        return response.status(404).json({ message: 'book not found' });
    }
    response.json(targetBook);
});

api.post('/books', (request, response) => {
    const bookToAdd = {
        id: (bookData.length + 1).toString(),
        ...request.body
    };
    
    bookData.push(bookToAdd);
    
    try {
        fs.writeFileSync(
            path.join(__dirname, '../books.json'),
            JSON.stringify(bookData, null, 2)
        );
        response.status(201).json(bookToAdd);
    } catch (e) {
        response.status(500).json({ message: 'book not saved' });
    }
});

api.patch('/books/:id/rating', (req, resp) => {
    const { rating } = req.body;
    const book_to_update = bookData.find(b => b.id === req.params.id);
    
    if (!book_to_update) {
        return resp.status(404).json({ message: 'book not found' });
    }
    
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        return resp.status(400).json({ message: 'rating should be <5' });
    }
    book_to_update.rating = rating;
    
    try {
        fs.writeFileSync(
            path.join(__dirname, '../books.json'),
            JSON.stringify(bookData, null, 2)
        );
        resp.json(book_to_update);
    } catch (err) {
        resp.status(500).json({ message: 'not updated' });
    }
});

api.get('/statistics', (req, resp) => {
    let genre_stats = {};
    
    for(var i = 0; i < bookData.length; i++) {
        var currentBook = bookData[i];
        var bookGenre = currentBook.genre;
        var bookRating = currentBook.rating;

        if(genre_stats[bookGenre] == undefined) {
            genre_stats[bookGenre] = { 
                total: 0, 
                count: 0,
                books: [] 
            };
        }
        genre_stats[bookGenre].total = genre_stats[bookGenre].total + bookRating;
        genre_stats[bookGenre].count = genre_stats[bookGenre].count + 1;
        genre_stats[bookGenre].books.push(currentBook.title);
    }

    var averageRatings = {};
    var genreNames = Object.keys(genre_stats);
    for(var j = 0; j < genreNames.length; j++) {
        var g = genreNames[j];
        averageRatings[g] = genre_stats[g].total / genre_stats[g].count;
        console.log("Average for " + g + " is " + averageRatings[g]);
    }

    var oldBook = bookData[0];
    var newBook = bookData[0];
    
    for (let i = 0; i < bookData.length; i++) {
        var book = bookData[i]
        if (book.publicationYear < oldBook.publicationYear) {
            oldBook = book;
        }
        if (book.publicationYear > newBook.publicationYear) {
            newBook = book;
        }
    }

    resp.json({
        avgRatingByGenre: averageRatings,
        oldestBook: oldBook,
        newestBook: newBook,
    });
});

api.get('/search', (req, res) => {
    var filter = req.query.filter;
    var type = req.query.type;
    
    if(!type) {
        type = 'AND';
    }
    
    if (!filter) {
        return res.status(400).json({ message: 'please give a filer' });
    }

    try {
        var separator = ' AND ';
        if(type === 'OR') {
            separator = ' OR ';
        }
        var parts = filter.split(separator);
        console.log("Filter parts:", parts);
        var results = [];
        
        for(var i = 0; i < bookData.length; i++) {
            var currentBook = bookData[i];
            var matchesArray = [];
            for(var j = 0; j < parts.length; j++) {
                var currentPart = parts[j];
                var splitPart = currentPart.split(' ');
                var fieldName = splitPart[0];
                var operator = splitPart[1];
                var value = splitPart[2];
                var bookValue;
                
                if(fieldName.indexOf('metadata') !== -1) {
                    var meta = fieldName.split('.');
                    bookValue = currentBook.metadata[meta[1]];
                } else {
                    bookValue = currentBook[fieldName];
                }
                
                var isMatch = false;
                if(operator == '>') {
                    isMatch = bookValue > Number(value);
                }
                else if(operator == '<') {
                    isMatch = bookValue < Number(value);
                }
                else if(operator == '>=') {
                    isMatch = bookValue >= Number(value);
                }
                else if(operator == '<=') {
                    isMatch = bookValue <= Number(value);
                }
                else if(operator == '=') {
                    isMatch = bookValue == value;
                }
                matchesArray.push(isMatch);
            }
            
            var shouldInclude = false;
            if(type === 'AND') {
                shouldInclude = true;
                for(var k = 0; k < matchesArray.length; k++) {
                    if(matchesArray[k] === false) {
                        shouldInclude = false;
                        break;
                    }
                }
            } else {
                for(var k = 0; k < matchesArray.length; k++) {
                    if(matchesArray[k] === true) {
                        shouldInclude = true;
                        break;
                    }
                }
            }
            
            if(shouldInclude) {
                results.push(currentBook);
            }
        }

        res.json(results);
    } catch (err) {
        res.status(400).json({ message: 'invalid filter' });
    }
});

module.exports = api;