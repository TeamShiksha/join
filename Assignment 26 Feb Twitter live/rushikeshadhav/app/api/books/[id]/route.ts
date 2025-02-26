import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get book by ID
export async function GET_BY_ID(request: Request, { params }) {
    const book = await prisma.book.findUnique({ where: { id: params.id } });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    return NextResponse.json(book);
}
