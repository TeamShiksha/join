import BookCatalog from "@/components/BookCatalog"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book Catalog</h1>
      <BookCatalog />
    </main>
  )
}

