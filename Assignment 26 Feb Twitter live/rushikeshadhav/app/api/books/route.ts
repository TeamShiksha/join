import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

// Get all books (with optional filtering by genre, rating, and sorting)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const minRatingParam = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') as keyof Prisma.BookOrderByWithRelationInput;

    const minRating = minRatingParam ? parseFloat(minRatingParam) : undefined;

    const whereClause: Prisma.BookWhereInput = {};
    if (genre) whereClause.genre = genre;
    if (minRating !== undefined && !isNaN(minRating)) {
        whereClause.rating = { gte: minRating };
    }

    const orderBy: Prisma.BookOrderByWithRelationInput | undefined = sortBy ? { [sortBy]: 'asc' } : undefined;

    const books = await prisma.book.findMany({
        where: whereClause,
        orderBy,
    });

    return NextResponse.json(books);
}

// Add a new book
export async function POST(request: Request) {
    try {
        const data: Prisma.BookCreateInput = await request.json();
        const book = await prisma.book.create({ data });
        return NextResponse.json(book, { status: 201 });
    } catch (error) {
        console.error("Error creating book:", error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}
