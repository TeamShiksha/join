"use client"

import { useState, useMemo } from "react"
import type { Book } from "@/types/book"
import BookList from "./BookList"
import BookFilters from "./BookFilters"
import BookForm from "./BookForm"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import booksData from "@/data/books.json"

export default function BookCatalog() {
  const [books, setBooks] = useState<Book[]>(booksData)
  const [filters, setFilters] = useState({ genre: "", minRating: 0 })
  const [sortBy, setSortBy] = useState<keyof Book>("title")
  const [viewMode, setViewMode] = useState<"table" | "card">("card")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((book) => (filters.genre === "" || book.genre === filters.genre) && book.rating >= filters.minRating)
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1
        if (a[sortBy] > b[sortBy]) return 1
        return 0
      })
  }, [books, filters, sortBy])

  const addBook = (newBook: Omit<Book, "id">) => {
    const newId = (Math.max(...books.map((book) => Number.parseInt(book.id))) + 1).toString()
    setBooks([...books, { ...newBook, id: newId }])
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <BookFilters
        genres={Array.from(new Set(books.map((book) => book.genre)))}
        onFilterChange={setFilters}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <BookList books={filteredAndSortedBooks} viewMode={viewMode} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">Add New Book</Button>
        </DialogTrigger>
        <DialogContent>
          <BookForm onSubmit={addBook} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

