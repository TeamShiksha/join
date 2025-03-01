import React from 'react'

const BookCard = ({ book }) => {
    return (
        <div className='p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition'>
            <div className="flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="text-gray-500">{book.author}</p>
                    <p className="text-sm text-gray-400">{book.publicationYear}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm bg-gray-200 px-2 py-1 rounded-md">{book.genre}</span>
                    <span className="text-yellow-500 font-semibold">⭐ {book.rating}</span>
                </div>
            </div>

        </div>
    )
}

export default BookCard