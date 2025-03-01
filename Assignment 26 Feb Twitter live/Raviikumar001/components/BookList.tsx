import type { Book } from "@/types/book"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

interface BookListProps {
  books: Book[]
  viewMode: "table" | "card"
}

export default function BookList({ books, viewMode }: BookListProps) {
  if (viewMode === "table") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publicationYear}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.rating}</TableCell>
                <TableCell>{book.metadata.pages}</TableCell>
                <TableCell>{book.metadata.stockLeft}</TableCell>
                <TableCell>${book.metadata.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id}>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.author}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{book.description}</p>
            <div className="flex justify-between items-center mb-2">
              <Badge>{book.genre}</Badge>
              <span className="text-sm font-semibold">Rating: {book.rating}</span>
            </div>
            <div className="text-sm">
              <p>Year: {book.publicationYear}</p>
              <p>Pages: {book.metadata.pages}</p>
              <p>Stock: {book.metadata.stockLeft}</p>
              <p>Price: ${book.metadata.price.toFixed(2)}</p>
              {book.metadata.discount > 0 && <p className="text-green-600">Discount: {book.metadata.discount}%</p>}
              <p>Edition: {book.metadata.edition}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

