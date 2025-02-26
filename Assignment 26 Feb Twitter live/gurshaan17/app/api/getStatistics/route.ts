import { NextResponse } from 'next/server';
import books from '../../../books.json';

export async function GET() {
    const averageRating = books.reduce((acc, book) => acc + book.rating, 0) / books.length;
    return NextResponse.json({ averageRating });
}