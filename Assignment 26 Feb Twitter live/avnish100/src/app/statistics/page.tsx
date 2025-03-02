"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Statistics {
  totalBooks: number
  averageRating: number
  averagePrice: number
  averageRatingByGenre: Record<string, number>
  booksByGenre: Record<string, number>
  oldestBook: {
    title: string
    author: string
    year: number
  }
  newestBook: {
    title: string
    author: string
    year: number
  }
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/statistics")
        const data = await response.json()
        setStatistics(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching statistics:", error)
        toast("Error",{
          description: "Failed to load statistics. Please try again later.",
        })
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [toast])

  if (isLoading) {
    return <div className="text-center py-10">Loading statistics...</div>
  }

  if (!statistics) {
    return <div className="text-center py-10">No statistics available.</div>
  }

  const ratingByGenreData = Object.entries(statistics.averageRatingByGenre).map(([genre, rating]) => ({
    genre,
    rating: Number.parseFloat(rating.toFixed(1)),
  }))

  const booksByGenreData = Object.entries(statistics.booksByGenre).map(([genre, count]) => ({
    genre,
    count,
  }))

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Book Library Statistics</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statistics.averagePrice.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Oldest Book</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {statistics.oldestBook.title} ({statistics.oldestBook.year})
            </p>
            <p className="text-muted-foreground">by {statistics.oldestBook.author}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newest Book</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {statistics.newestBook.title} ({statistics.newestBook.year})
            </p>
            <p className="text-muted-foreground">by {statistics.newestBook.author}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ratings">
        <TabsList className="mb-6">
          <TabsTrigger value="ratings">Ratings by Genre</TabsTrigger>
          <TabsTrigger value="counts">Books by Genre</TabsTrigger>
        </TabsList>

        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Average Rating by Genre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingByGenreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="genre" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counts">
          <Card>
            <CardHeader>
              <CardTitle>Books by Genre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={booksByGenreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="genre" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

