const BookList = ({ books }) => {
    return (
      <div>
        {books.map((book) => (
          <div key={book.id} >
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Year:</strong> {book.publicationYear}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Rating:</strong> {book.rating}</p>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default BookList;
  