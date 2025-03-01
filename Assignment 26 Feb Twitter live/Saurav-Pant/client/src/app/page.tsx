"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Book {
  id: string
  title: string
  author: string
  publicationYear: number
  genre: string
  rating: number
  description: string
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [genreFilter, setGenreFilter] = useState<string>("")
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>("")
  const [newBook, setNewBook] = useState<Partial<Book>>({})

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.data)
          setFilteredBooks(data.data)
        } else {
          setError("Failed to fetch books")
        }
      })
      .catch((err) => setError("Error fetching data"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = books

    if (genreFilter) {
      result = result.filter((book) => book.genre === genreFilter)
    }

    if (minRatingFilter > 0) {
      result = result.filter((book) => book.rating >= minRatingFilter)
    }

    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title)
        if (sortBy === "author") return a.author.localeCompare(b.author)
        if (sortBy === "year") return a.publicationYear - b.publicationYear
        if (sortBy === "rating") return b.rating - a.rating
        return 0
      })
    }

    setFilteredBooks(result)
  }, [books, genreFilter, minRatingFilter, sortBy])

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    setBooks([...books, { ...newBook, id: String(books.length + 1) } as Book])
    setNewBook({})
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  const genres = Array.from(new Set(books.map((book) => book.genre)))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book List</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select onValueChange={(value:any) => setGenreFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value:any) => setMinRatingFilter(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Minimum Rating" />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={String(rating)}>
                {rating === 0 ? "All Ratings" : `${rating} Stars & Up`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value:any) => setSortBy(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="year">Publication Year</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Year:</strong> {book.publicationYear}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Rating:</strong> {book.rating} / 5
              </p>
              <p className="mt-2">{book.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Title"
              value={newBook.title || ""}
              onChange={(e:any) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <Input
              placeholder="Author"
              value={newBook.author || ""}
              onChange={(e:any) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <Input
              placeholder="Publication Year"
              type="number"
              value={newBook.publicationYear || ""}
              onChange={(e:any) => setNewBook({ ...newBook, publicationYear: Number(e.target.value) })}
            />
            <Input
              placeholder="Genre"
              value={newBook.genre || ""}
              onChange={(e:any) => setNewBook({ ...newBook, genre: e.target.value })}
            />
            <Input
              placeholder="Rating (1-5)"
              type="number"
              min="1"
              max="5"
              value={newBook.rating || ""}
              onChange={(e:any) => setNewBook({ ...newBook, rating: Number(e.target.value) })}
            />
            <Input
              placeholder="Description"
              value={newBook.description || ""}
              onChange={(e:any) => setNewBook({ ...newBook, description: e.target.value })}
            />
            <Button type="submit" className="md:col-span-2">
              Add Book
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookList
