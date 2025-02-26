import type React from "react"
import { useState } from "react"
import type { Book } from "@/types/book"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

interface BookFormProps {
  onSubmit: (book: Omit<Book, "id">) => void
}

export default function BookForm({ onSubmit }: BookFormProps) {
  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    publicationYear: new Date().getFullYear(),
    genre: "",
    rating: 0,
    description: "",
    metadata: {
      pages: 0,
      stockLeft: 0,
      price: 0,
      discount: 0,
      edition: 1,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(newBook)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewBook((prev) => {
      if (name in prev.metadata) {
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            [name]: Number(value),
          },
        }
      }
      return { ...prev, [name]: name === "publicationYear" || name === "rating" ? Number(value) : value }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-1 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Main book information */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={newBook.title} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" value={newBook.author} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publicationYear">Publication Year</Label>
          <Input
            id="publicationYear"
            name="publicationYear"
            type="number"
            value={newBook.publicationYear}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input id="genre" name="genre" value={newBook.genre} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={newBook.rating}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      {/* Description - full width */}
      <div className="space-y-2 mb-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={newBook.description}
          onChange={handleInputChange}
          required
          className="min-h-24"
        />
      </div>

      {/* Book metadata - organized in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="pages">Pages</Label>
          <Input
            id="pages"
            name="pages"
            type="number"
            value={newBook.metadata.pages}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockLeft">Stock Left</Label>
          <Input
            id="stockLeft"
            name="stockLeft"
            type="number"
            value={newBook.metadata.stockLeft}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={newBook.metadata.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            min="0"
            max="100"
            value={newBook.metadata.discount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edition">Edition</Label>
          <Input
            id="edition"
            name="edition"
            type="number"
            min="1"
            value={newBook.metadata.edition}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">Add Book</Button>
    </form>
  )
}