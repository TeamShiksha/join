import { NextResponse } from 'next/server';
import books from '../../../../books.json';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const book = books.find(b => b.id === id);
    if (book) {
        return NextResponse.json(book);
    } else {
        return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }
}