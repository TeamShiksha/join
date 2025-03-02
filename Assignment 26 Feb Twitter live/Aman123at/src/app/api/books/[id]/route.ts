import { NextResponse } from 'next/server';
import books from '@/database/books.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const p = await Promise.resolve(params);
  const book = books.find((b) => b.id === p.id);
  
  if (!book) {
    return NextResponse.json(
      { error: 'Book not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(book);
} 