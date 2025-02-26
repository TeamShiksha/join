import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataFilePath = path.join(process.cwd(), "src/lib/data.json")

function readData() {
  const data = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(data)
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const books = readData()
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error in GET /api/books:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const newBook = await request.json()
    if (!newBook.title || !newBook.author || !newBook.genre) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const books = readData()
    const id = (Number.parseInt(books[books.length - 1].id) + 1).toString()
    const bookToAdd = { id, ...newBook }
    books.push(bookToAdd)
    writeData(books)
    return NextResponse.json(bookToAdd, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/books:", error)
    return NextResponse.json(
      { error: "Invalid request data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, rating } = await request.json()
    const books = readData()
    const bookIndex = books.findIndex((book: any) => book.id === id)
    if (bookIndex === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    books[bookIndex].rating = rating
    writeData(books)
    return NextResponse.json(books[bookIndex])
  } catch (error) {
    console.error("Error in PATCH /api/books:", error)
    return NextResponse.json(
      { error: "Invalid request data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}