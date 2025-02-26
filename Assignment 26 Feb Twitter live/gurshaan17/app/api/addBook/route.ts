import { NextResponse } from 'next/server';
import books from '../../../books.json';

export async function POST(req: Request) {
    try {
        const newBook = await req.json(); 
        books.push(newBook); 
        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        return NextResponse.error();
    }
}