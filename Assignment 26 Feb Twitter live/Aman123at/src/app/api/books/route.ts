import { NextResponse } from 'next/server';
import { Book } from '@/types/book';
import books from '@/database/books.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre');

  let filteredBooks = books;
  if (genre) {
    filteredBooks = books.filter((book: Book) => 
      book.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  return NextResponse.json(filteredBooks);
}

export async function POST(request: Request) {
  try {
    const newBook: Book = await request.json();
    
    if (!newBook.title || !newBook.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }
    books.push(newBook)
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 