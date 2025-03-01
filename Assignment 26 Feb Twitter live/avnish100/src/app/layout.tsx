import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Book Library",
  description: "A comprehensive book library application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">Book Library</span>
            </Link>
            <nav>
              <Link href="/statistics">
                <Button variant="ghost" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Statistics
                </Button>
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}

