export interface BookMetadata {
  pages: number;
  stockLeft: number;
  price: number;
  discount: number;
  edition: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  rating: number;
  description: string;
  metadata: BookMetadata;
}

export interface Statistics {
  averageRatingByGenre: Record<string, number>;
  oldestBook: Book;
  newestBook: Book;
} 