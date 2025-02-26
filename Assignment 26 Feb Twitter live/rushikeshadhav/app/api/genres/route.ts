import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request,) {
    if (req.method === "GET") {
        try {
            const genres = await prisma.book.findMany({
                select: { genre: true },
                distinct: ["genre"],
            });
            return NextResponse.json((genres.map((g) => g.genre)), { status: 200 });

        } catch (error) {
            return NextResponse.json(error, { status: 500 });
        }
    } else {
        return NextResponse.json("Method Not Allowed", { status: 405 });
    }
}
