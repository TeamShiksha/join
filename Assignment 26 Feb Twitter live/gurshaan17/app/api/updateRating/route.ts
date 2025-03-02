// app/api/updateRating/route.ts
import { NextResponse } from 'next/server';
import books from '../../../../books.json';

export async function PUT(req: Request) {
    try {
        const { id, rating } = await req.json();
        const book = books.find(b => b.id === id);
        
        if (book) {
            book.rating = rating;
            return NextResponse.json(book);
        } else {
            return NextResponse.json({ message: 'Book not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.error();
    }
}