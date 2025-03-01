import { NextResponse } from 'next/server';
import books from '@/database/books.json';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rating } = await request.json();
    
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating value' },
        { status: 400 }
      );
    }

    const book = books.find((b) => b.id === params.id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    const updatedBook = { ...book, rating };
    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 