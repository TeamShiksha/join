import React from 'react'
import { useParams } from 'react-router-dom'

const Book: React.FC = () => {

    const { bookId } = useParams()

    console.log(bookId)
  return (
    <div>
      
    </div>
  )
}

export default Book
