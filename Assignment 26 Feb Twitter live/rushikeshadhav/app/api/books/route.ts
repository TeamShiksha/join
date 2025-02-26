import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


// Get all books (with optional filtering by genre, rating, and sorting)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const minRating = parseFloat(searchParams.get('minRating'));
    const sortBy = searchParams.get('sortBy');
    
    let whereClause = {};
    if (genre) whereClause.genre = genre;
    if (!isNaN(minRating)) whereClause.rating = { gte: minRating };

    let orderBy = {};
    if (sortBy) {
        orderBy[sortBy] = 'asc';
    }

    const books = await prisma.book.findMany({ where: whereClause, orderBy });
    return NextResponse.json(books);
}



// Add a new book
export async function POST(request: Request) {
    const data = await request.json();
    const book = await prisma.book.create({ data });
    return NextResponse.json(book, { status: 201 });
}



