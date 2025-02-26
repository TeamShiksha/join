import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Update book rating
export async function PATCH(request: Request, { params }) {
    const { rating } = await request.json();
    const updatedBook = await prisma.book.update({ where: { id: params.id }, data: { rating } });
    return NextResponse.json(updatedBook);
}