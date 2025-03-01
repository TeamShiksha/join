"use client"

import { useState } from "react"
import type { Book } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"

interface BookCardProps {
  book: Book
  onUpdateRating: (id: string, rating: number) => void
}

export default function BookCard({ book, onUpdateRating }: BookCardProps) {
  const [isUpdatingRating, setIsUpdatingRating] = useState(false)

  const handleRatingChange = async (newRating: number) => {
    setIsUpdatingRating(true)
    await onUpdateRating(book.id, newRating)
    setIsUpdatingRating(false)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
          <Badge variant="outline">{book.genre}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <p className="text-sm font-medium">By {book.author}</p>
          <p className="text-sm text-muted-foreground">Published in {book.publicationYear}</p>
          <p className="text-sm line-clamp-3 mt-2">{book.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <StarRating rating={book.rating} onChange={handleRatingChange} disabled={isUpdatingRating} />
            <span className="ml-2 text-sm font-medium">{book.rating.toFixed(1)}</span>
          </div>
          <div className="text-sm font-medium">
            {book.metadata.stockLeft > 0 ? (
              <span className="text-green-600 dark:text-green-500">In Stock</span>
            ) : (
              <span className="text-red-600 dark:text-red-500">Out of Stock</span>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

