import React from 'react'
import { books } from '../books'
import { BookCard } from '../components/BookCard'

export const HomePage = () => {
  return (

    <div> 
      <h1 className='text-2xl text-center'>Display Books</h1>
      <div className='flex flex-wrap gap-[1rem] text-center justify-center p-[2rem]'>
      {books.map((book) => (
      <BookCard key={book.id} book={book} />
     
    ))}
      </div>
    
     </div>
  )}

  