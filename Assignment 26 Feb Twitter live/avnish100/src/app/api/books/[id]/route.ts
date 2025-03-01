import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Book } from "@/lib/types"

const dataFilePath = path.join(process.cwd(), "src/lib/data.json")

function readData(): Book[] {
  const data = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(data)
}

export async function GET(request: Request, params:any) {
  try {
    const id = params.id
    const books = readData()
    const book = books.find((book) => book.id === id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error in GET /api/books/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}