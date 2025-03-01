from fastapi import FastAPI, HTTPException, status
import json
import schemas
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from random import randrange


app = FastAPI()

with open('books.json', 'r') as book_file:
    book_file_data = json.load(book_file)

books = book_file_data


@app.get('/')
def root():
    return {
        'message': 'Assignment 26 Feb Twitter live - dhaniesh'
    }


@app.get('/books')
def get_books():
    return {'data': books}


@app.get('/books/{book_id}')
def get_books_by_id(book_id: int):
    for book in books:
        if int(book.get('id')) == book_id:
            return book
    return {}


@app.post('/books', response_model=schemas.NewBookOut)
def post_books(new_book: schemas.NewBookIn):
    new_book_dict = jsonable_encoder(new_book)
    new_book_dict['id'] = randrange(21, 100)
    books.append(new_book_dict)
    return new_book_dict


@app.put('/books/{book_id}/rating', response_model=schemas.NewBookOut)
def update_rating(book_id: int, obj: dict):
    for book in books:
        if int(book.get('id')) == book_id:
            book['rating'] = round(obj['rating'], 1)
            return JSONResponse(book, status.HTTP_200_OK)
    raise HTTPException(status.HTTP_204_NO_CONTENT)


@app.get('/stats/{genre}')
def get_stats(genre: str):
    rating = []
    for book in books:
        if book['genre'] == genre:
            rating.append(book.get('rating', 0))
    if rating:
        average_rating = sum(rating) / len(rating)
        return {
            'average_rating': round(average_rating, 1)
        }
    raise HTTPException(status.HTTP_404_NOT_FOUND, "Genre {genre} not found")
