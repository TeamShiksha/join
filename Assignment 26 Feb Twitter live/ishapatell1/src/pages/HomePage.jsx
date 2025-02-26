import React, { useState } from 'react'
import { books as bookData } from '../books'
import { BookCard } from '../components/BookCard'
import  Filter  from '../components/Filter'

export const HomePage = () => {
  const [books,setBooks] = useState(bookData)
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const filteredBooks = books
  .filter((book) => (genre ? book.genre === genre : true))
  .filter((book) => (rating ? book.rating >= rating : true))
  return (

    <div> 
      <h1 className='text-2xl text-center'>Display Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <Filter setGenre={setGenre} setRating={setRating} />
      </div>
      <div className='flex flex-wrap gap-[1rem] text-center justify-center p-[2rem]'>
      {filteredBooks.map((book) => (
      <BookCard key={book.id} book={book} />
     
    ))}
      </div>
    
     </div>
  )}



 

  