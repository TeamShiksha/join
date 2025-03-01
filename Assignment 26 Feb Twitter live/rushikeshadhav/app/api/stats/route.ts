import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get book statistics
export async function GET() {
    const stats = await prisma.book.groupBy({
        by: ['genre'],
        _avg: { rating: true },
        _min: { publicationYear: true },
        _max: { publicationYear: true },
    });
    return NextResponse.json(stats);
}
