document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");
    const genreSelect = document.getElementById("genre");
    const minRatingInput = document.getElementById("min-rating");
    const sortSelect = document.getElementById("sort");

    let books = [];

    // Fetch books from JSON file
    fetch("../books.json")
        .then(response => response.json())
        .then(data => {
            books = data;
            populateGenreFilter(books);
            displayBooks(books);
        });

    // Function to display books
    function displayBooks(filteredBooks) {
        bookList.innerHTML = "";
        filteredBooks.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book");
            bookDiv.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.publicationYear}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Rating:</strong> ${book.rating}</p>
            `;
            bookList.appendChild(bookDiv);
        });
    }

    // Populate genre filter dropdown
    function populateGenreFilter(books) {
        const genres = ["All", ...new Set(books.map(book => book.genre))];
        genreSelect.innerHTML = genres.map(genre => `<option value="${genre}">${genre}</option>`).join("");
    }

    // Apply Filters
    document.getElementById("apply-filters").addEventListener("click", () => {
        const selectedGenre = genreSelect.value;
        const minRating = parseFloat(minRatingInput.value) || 0;

        const filteredBooks = books.filter(book => 
            (selectedGenre === "All" || book.genre === selectedGenre) &&
            book.rating >= minRating
        );
        
        displayBooks(filteredBooks);
    });

    // Sorting Functionality
    document.getElementById("apply-sort").addEventListener("click", () => {
        const sortBy = sortSelect.value;
        const sortedBooks = [...books].sort((a, b) => {
            if (sortBy === "title" || sortBy === "author") {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return a[sortBy] - b[sortBy];
            }
        });
        displayBooks(sortedBooks);
    });

    // Add New Book
    document.getElementById("add-book").addEventListener("click", () => {
        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const year = parseInt(document.getElementById("book-year").value);
        const genre = document.getElementById("book-genre").value;
        const rating = parseFloat(document.getElementById("book-rating").value);

        if (title && author && year && genre && !isNaN(rating)) {
            const newBook = { title, author, publicationYear: year, genre, rating };
            books.push(newBook);
            displayBooks(books);
        }
    });

    // Dark/Light Mode Toggle
    document.getElementById("theme-toggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});
