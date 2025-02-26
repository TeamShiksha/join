import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Book } from "@/lib/types"

const dataFilePath = path.join(process.cwd(), "src/lib/data.json")

function readData(): Book[] {
  const data = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(data)
}

function writeData(data: Book[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
}

export async function PATCH(request: Request, params:any) {
  try {
    const localparams = await params;
    const id =  localparams.id
    const { rating } = await request.json()

    // Validate rating
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      console.log("Invalid rating. Must be a number between 0 and 5")
      return NextResponse.json({ error: "Invalid rating. Must be a number between 0 and 5" }, { status: 400 })
    }

    const books = readData()
    const bookIndex = books.findIndex((book) => book.id === id)

    if (bookIndex === -1) {
      console.log("Book not found")
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Update the book's rating
    books[bookIndex].rating = rating
    writeData(books)

    return NextResponse.json(books[bookIndex])
  } catch (error) {
    console.error("Error in PATCH /api/books/[id]/rating:", error)
    return NextResponse.json(
      { error: "Invalid request data", details: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    )
  }
}