import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const genres = [
    "Classic",
    "Fiction",
    "Dystopian",
    "Fantasy",
    "Historical Fiction",
    "Post-Apocalyptic",
    "Thriller",
    "Science Fiction",
    "Non-fiction",
    "Memoir"
]

const AddBook = () => {
    const navigate = useNavigate()
    const [book, setBook] = useState({
        title: "",
        author: "",
        publicationYear: "",
        genre: "Classic",
        rating: "",
        description: "",
        metadata: {
            pages: "",
            stockLeft: "",
            price: "",
            discount: "",
            edition: "",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in book.metadata) {
            setBook((prev) => ({
                ...prev,
                metadata: { ...prev.metadata, [name]: value },
            }));
        } else {
            setBook((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/",{
            state: book
        })
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add a New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="border p-2 rounded w-full" name="title" placeholder="Title" value={book.title} onChange={handleChange} required />
                <input className="border p-2 rounded w-full" name="author" placeholder="Author" value={book.author} onChange={handleChange} required />
                <input className="border p-2 rounded w-full" type="number" name="publicationYear" placeholder="Publication Year" value={book.publicationYear} onChange={handleChange} required />
                <select className="border p-2 rounded w-full" name="genre" value={book.genre} onChange={handleChange}>
                    {genres.map((genre, index) => (
                        <option key={index} value={genre}>{genre}</option>
                    ))}
                </select>
                <input className="border p-2 rounded w-full" type="number" step="0.1" name="rating" placeholder="Rating (1-5)" value={book.rating} onChange={handleChange} required />
                <textarea className="border p-2 rounded w-full" name="description" placeholder="Description" value={book.description} onChange={handleChange} required />
                <input className="border p-2 rounded w-full" type="number" name="pages" placeholder="Pages" value={book.metadata.pages} onChange={handleChange} required />
                <input className="border p-2 rounded w-full" type="number" name="stockLeft" placeholder="Stock Left" value={book.metadata.stockLeft} onChange={handleChange} required />
                <input className="border p-2 rounded w-full" type="number" step="0.01" name="price" placeholder="Price ($)" value={book.metadata.price} onChange={handleChange} required />
                <input className="border p-2 rounded w-full" type="number" name="discount" placeholder="Discount (%)" value={book.metadata.discount} onChange={handleChange} required />
                <input className="border p-2 rounded w-full" type="number" name="edition" placeholder="Edition" value={book.metadata.edition} onChange={handleChange} required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Add Book</button>
            </form>
        </div>
    )
}

export default AddBook