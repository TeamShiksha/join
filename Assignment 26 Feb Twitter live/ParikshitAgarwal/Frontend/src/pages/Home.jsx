import React, { useEffect, useMemo, useState } from 'react'
import books from "../assets/books.json"
import BookCard from '../components/BookCard'
import { useLocation, useNavigate } from "react-router-dom"


const Home = () => {
    const [bookList, setBookList] = useState(books)
    const [sortKey, setSortKey] = useState("title")
    const [selectedGenre, setSelectedGenre] = useState("all")
    const [minRating, setMinRating] = useState(0)
    const genres = ["all", ...new Set(books.map(book => book.genre))];
    const location = useLocation()

    const navigate = useNavigate()
    const filteredAndSortedBooks = useMemo(() => {
        return bookList
            .filter((book) =>
                (selectedGenre === "all" || book.genre.toLowerCase() === selectedGenre.toLowerCase()) && book.rating >= minRating,
            )
            .sort((a, b) => {
                if (sortKey === "publicationYear") {
                    return a.publicationYear - b.publicationYear
                }
                return a[sortKey].localeCompare(b[sortKey])
            })
    }, [bookList, selectedGenre, minRating, sortKey])


    useEffect(() => {
        if (location?.state) {
            setBookList([
                ...bookList,
                location.state
            ])
        }
    }, [location.state])


    return (
        <div className=''>
            <div className='text-xl md:text-6xl'>
                Book Dashboard
            </div>
            <div className='flex justify-between my-2'>
                <h1 className='text-lg md:text-2xl'>
                    Books
                </h1>
                <button onClick={() => navigate("/add-book")} className='bg-black text-white px-4 py-2 rounded cursor-pointer'>Add Book</button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Filter by Genre:</label>
                    <select
                        className="border p-2 rounded-md w-full md:w-full cursor-pointer"
                        value={selectedGenre}
                        onChange={e => setSelectedGenre(e.target.value)}
                    >
                        {genres.map((genre, index) => (
                            <option key={index} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label className="block text-gray-700 font-semibold mb-2">Min Rating</label>
                    <input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        className='border p-2 rounded-lg'
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Sort by:</label>
                    <select
                        className="border p-2 rounded-md w-full md:w-full cursor-pointer"
                        value={sortKey}
                        onChange={e => setSortKey(e.target.value)}
                    >
                        <option key="title" value="title">Title</option>
                        <option key="author" value="author">Author</option>
                        <option key="publicationYear" value="publicationYear">Publication Year</option>

                    </select>
                </div>

            </div>

            <div className='grid md:grid-cols-3 gap-6 my-2'>
                {filteredAndSortedBooks.map((book) => {
                    return <BookCard book={book} />
                })}
            </div>
        </div>
    )
}

export default Home