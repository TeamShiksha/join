import { NextResponse } from "next/server"
import type { Book } from "@/lib/types"
import fs from "fs"
import path from "path"

const dataFilePath = path.join(process.cwd(), "src/lib/data.json")

function readData(): Book[] {
  const data = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(data)
}

export async function GET() {
    const books = readData()
  try {
    // Calculate average rating by genre
    const genreRatings: Record<string, { sum: number; count: number }> = {}

    books.forEach((book) => {
      if (!genreRatings[book.genre]) {
        genreRatings[book.genre] = { sum: 0, count: 0 }
      }

      genreRatings[book.genre].sum += book.rating
      genreRatings[book.genre].count += 1
    })

    const averageRatingByGenre: Record<string, number> = {}

    for (const genre in genreRatings) {
      averageRatingByGenre[genre] = genreRatings[genre].sum / genreRatings[genre].count
    }

    // Find oldest and newest books
    const sortedByYear = [...books].sort((a, b) => a.publicationYear - b.publicationYear)
    const oldestBook = sortedByYear[0]
    const newestBook = sortedByYear[sortedByYear.length - 1]

    // Calculate overall statistics
    const totalBooks = books.length
    const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / totalBooks
    const averagePrice = books.reduce((sum, book) => sum + book.metadata.price, 0) / totalBooks

    // Count books by genre
    const booksByGenre: Record<string, number> = {}
    books.forEach((book) => {
      booksByGenre[book.genre] = (booksByGenre[book.genre] || 0) + 1
    })

    return NextResponse.json({
      totalBooks,
      averageRating,
      averagePrice,
      averageRatingByGenre,
      booksByGenre,
      oldestBook: {
        title: oldestBook.title,
        author: oldestBook.author,
        year: oldestBook.publicationYear,
      },
      newestBook: {
        title: newestBook.title,
        author: newestBook.author,
        year: newestBook.publicationYear,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/statistics:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

