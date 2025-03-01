export interface BookMetadata {
  pages: number;
  stockLeft: number;
  price: number;
  discount: number;
  edition: number;
}

export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  rating: number;
  description: string;
  metadata: BookMetadata;
}

export interface Statistics {
  averageRatingByGenre: Array<{
    _id: string;
    averageRating: number;
  }>;
  oldestBook: Book;
  newestBook: Book;
  totalBooks: number;
  booksPerGenre: Array<{
    _id: string;
    count: number;
  }>;
  averagePrice: number;
}