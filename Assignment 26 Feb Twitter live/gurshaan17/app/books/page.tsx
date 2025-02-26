"use client"
import { useState, useEffect } from 'react';

export default function Books() {
    const [books, setBooks] = useState<any[]>([]);
    const [genreFilter, setGenreFilter] = useState<string>('');
    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('title');

    useEffect(() => {
        fetch('/api/getAllBooks')
            .then(response => response.json())
            .then(data => setBooks(data));
    }, []);

    const filteredBooks = books
        .filter(book => (genreFilter ? book.genre === genreFilter : true))
        .filter(book => book.rating >= minRating)
        .sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'author') return a.author.localeCompare(b.author);
            if (sortBy === 'publicationYear') return a.publicationYear - b.publicationYear;
            return 0;
        });

    return (
        <div>
            <h1>Book List</h1>
            <div>
                <label>Filter by Genre:</label>
                <select onChange={(e) => setGenreFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-fiction">Non-fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Thriller">Thriller</option>
                    {/* Add more genres as needed */}
                </select>

                <label>Minimum Rating:</label>
                <input
                    type="number"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    min="0"
                    max="5"
                />

                <label>Sort by:</label>
                <select onChange={(e) => setSortBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="publicationYear">Publication Year</option>
                </select>
            </div>

            <ul>
                {filteredBooks.map(book => (
                    <li key={book.id}>
                        <h2>{book.title}</h2>
                        <p>Author: {book.author}</p>
                        <p>Publication Year: {book.publicationYear}</p>
                        <p>Genre: {book.genre}</p>
                        <p>Rating: {book.rating}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}