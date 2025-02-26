"use client"
import React, { useEffect, useState } from 'react'
import { data } from '../db'
function Item({book_id}) {
    const [currentBook, setCurrentBook] = useState(null);
    console.log(book_id)
    useEffect(() => {
        console.log(book_id)
        const book = data.find((book) => book.id === book_id);
        setCurrentBook(book);
    }, [book_id]);
return (
    <div className='flex justify-center h-auto w-[calc(360px)] items-center  text-white'>
        {
            currentBook ? (
                <div className='w-full flex justify-between flex-col h-full bg-gray-800 rounded-lg shadow-md p-6'>
                    <div>

                    <h1 className='font-bold text-3xl mb-2'>{currentBook.title}</h1>
                    <h2 className='text-xl text-gray-400 mb-4'>- {currentBook.author}</h2>
                    <p className='italic text-gray-300 mb-4'>{currentBook.description}</p>
                    
                    <div className='space-y-2'>
                        <p className='text-gray-300'><span className='font-semibold'>Rating:</span> {currentBook.rating}</p>
                        <p className='text-gray-300'><span className='font-semibold'>Publication Year:</span> {currentBook.publicationYear}</p>
                        <p className='text-gray-300'><span className='font-semibold'>Genre:</span> {currentBook.genre}</p>
                        <p className='text-gray-300'><span className='font-semibold'>Pages:</span> {currentBook.metadata.pages}</p>
                        <p className='text-gray-300'><span className='font-semibold'>Stock Left:</span> {currentBook.metadata.stockLeft}</p>
                        <p className='text-gray-300'><span className='font-semibold'>Discount:</span> {currentBook.metadata.discount}</p>
                        <p className='text-gray-300'><span className='font-semibold'>Edition:</span> {currentBook.metadata.edition}</p>
                    </div>
                    </div>
                    <div className=' relative bottom-0 pt-3'>
                        <p className='text-gray-800 p-2 bg-white w-full text-center rounded-xl '><span className='font-semibold'>Price:</span> ${currentBook.metadata.price}</p>
                    </div>
                </div>
            ) : (
                <p className='text-gray-500'>Loading...</p>
            )
        }
    </div>
)
}

export default Item