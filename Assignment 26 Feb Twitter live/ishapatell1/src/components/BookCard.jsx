import React from 'react'

export const BookCard = ({book}) => {
  return (
  
        <div className=" flex flex-col text-center w-[20rem] h-[12rem] border p-4 shadow-md bg-white rounded-md">
          <h2 className="text-lg font-bold"> Title : {book.title}</h2>
          <p className="text-gray-700"> Author : {book.author}</p>
          <p className="text-sm text-gray-500">Publication Year : {book.publicationYear}</p>
          <p className="text-sm text-gray-500"> Genre : {book.genre}</p>
          <p className="text-sm text-yellow-500"> Book Rating : {book.rating}</p>
        </div>
  )
}
