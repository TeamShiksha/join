import BookList from "@/components/book-list"
import { Toaster } from "@/components/ui/sonner"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Book Library</h1>
      <BookList />
      <Toaster />
    </main>
  )
}

