import { NextResponse } from 'next/server';
import books from '../../../../books.json';

export async function GET() {
    return NextResponse.json(books);
}