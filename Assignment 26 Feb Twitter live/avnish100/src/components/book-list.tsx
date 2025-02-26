"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import BookCard from "@/components/book-card"
import AddBookForm from "@/components/add-book-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books")

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch books: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const data = await response.json()
        setBooks(data)
        setFilteredBooks(data)

        // Extract unique genres
        const uniqueGenres = Array.from(new Set(data.map((book: Book) => book.genre)))
        setGenres(uniqueGenres as string[])

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching books:", error)
        toast("Error", {
          
          description: "Failed to load books. Please try again later.",
        })
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [toast])

  useEffect(() => {
    // Filter books based on selected genre and minimum rating
    let result = [...books]

    if (selectedGenre !== "all") {
      result = result.filter((book) => book.genre === selectedGenre)
    }

    result = result.filter((book) => book.rating >= minRating)

    // Sort books
    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === "author") {
        comparison = a.author.localeCompare(b.author)
      } else if (sortBy === "publicationYear") {
        comparison = a.publicationYear - b.publicationYear
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredBooks(result)
  }, [books, selectedGenre, minRating, sortBy, sortOrder])

  const handleAddBook = async (newBook: Omit<Book, "id">) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      })

      if (!response.ok) {
        throw new Error("Failed to add book")
      }

      const addedBook = await response.json()
      setBooks((prevBooks) => [...prevBooks, addedBook])

      toast("Success",{
        title: "Success",
      })
    } catch (error) {
      console.error("Error adding book:", error)
      toast("Error",{
        
        description: "Failed to add book. Please try again.",
        
      })
    }
  }

  const handleUpdateRating = async (id: string, rating: number) => {
    try {
      const response = await fetch(`/api/books/${id}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      })

      if (!response.ok) {
        throw new Error("Failed to update rating")
      }

      const updatedBook = await response.json()

      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? { ...book, rating: updatedBook.rating } : book)),
      )

      toast("Success",{
        title: "Success",
      })
    } catch (error) {
      console.error("Error updating rating:", error)
      toast("Error",{
        description: "Failed to update rating. Please try again.",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading books...</div>
  }

  return (
    <div>
      <Tabs defaultValue="browse">
        <TabsList className="mb-6">
          <TabsTrigger value="browse">Browse Books</TabsTrigger>
          <TabsTrigger value="add">Add New Book</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="grid gap-6 mb-6 md:grid-cols-4">
            <div>
              <Label htmlFor="genre-filter">Filter by Genre</Label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger id="genre-filter">
                  <SelectValue placeholder="Select Genre" />
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
            </div>

            <div>
              <Label htmlFor="rating-filter">Minimum Rating: {minRating.toFixed(1)}</Label>
              <Slider
                id="rating-filter"
                min={0}
                max={5}
                step={0.1}
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                className="mt-4"
              />
            </div>

            <div>
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="publicationYear">Publication Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-order">Sort Order</Label>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                <SelectTrigger id="sort-order">
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => <BookCard key={book.id} book={book} onUpdateRating={handleUpdateRating} />)
            ) : (
              <div className="col-span-full text-center py-10">No books match your current filters.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardContent className="pt-6">
              <AddBookForm onAddBook={handleAddBook} genres={genres} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

