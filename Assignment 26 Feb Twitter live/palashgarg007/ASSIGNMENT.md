# Assignment 26th Feb Twitter live

Dead line 2 hours by 11:15 PM.

- Submit the PR after 11 PM to prevent others from copying your assignment.
- If you have completed both frontend and backend, please go ahead and integrate the APIs.

## Frontend Development

Create a user interface for the book data available [here](./books.json). Your interface should:

- `Display Books`: Show all books with their title, author, publication year, genre, and rating
- `Responsive Design`: Ensure the UI works well on desktop and mobile devices
- `Filtering`: Allow users to filter books by genre and minimum rating
- `Sorting`: Implement sorting by title, author, or publication year
- `Book Form`: Create a form to add new books to the collection

## Backend Development

Create API endpoints based on the book data available [here](./books.json). Implement the following endpoints:

- `Get All Books`: Retrieve all books with optional filtering by genre
- `Get Book by ID`: Retrieve a specific book by its ID
- `Add Book`: Add a new book to the collection
- `Update Rating`: Update the rating of a book by its ID
- `Get Statistics`: Return statistics like average rating by genre, oldest/newest books

## Additional if time permits

- Write test for whatever you have developed.
- Deploy on free platforms like vercel or netlify.
- Add a dark/light theme toggle (Fronend only)
- Implement a search function based on metadata allowing optional `OR or AND search filter`. (Backend only)
    - Example: OR - price > 10 OR pages > 100
    - Example: AND - price > 10 AND pages > 100
