import { useState, useEffect } from "react";
import baseApi from "./baseApi";
import BookList from "./components/BookList";
import Controls from "./components/Controls";
import BookForm from "./components/BookForm";

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [addBooks, setAddBooks] = useState(false)

  useEffect(() => {
    baseApi.get("/")
      .then(response => {
        setBooks(response.data);
        setFilteredBooks(response.data);
      })
      .catch(error => console.error("Error fetching books:", error));
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [genreFilter, ratingFilter, sortBy, books]);

  const applyFiltersAndSort = () => {
    let result = [...books];

    if (genreFilter) {
      result = result.filter(book => book.genre === genreFilter);
    }

    if (ratingFilter) {
      result = result.filter(book => book.rating >= parseFloat(ratingFilter));
    }

    result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "author") {
        return a.author.localeCompare(b.author);
      } else if (sortBy === "publicationYear") {
        return a.publicationYear - b.publicationYear;
      }
      return 0;
    });

    setFilteredBooks(result);
  };

  const addBook = (newBook) => {
    setBooks([newBook, ...books]);
    applyFiltersAndSort();
  };

  return (
    <div >
      <header>
        <h1>Book Collection</h1>
      </header>

      <Controls
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <BookList books={filteredBooks} />
      <button onClick={()=>{setAddBooks(!addBooks)}}>Add a Book</button>
      {addBooks && <BookForm addBook={addBook} />}
    </div>
  );
}

export default App;
