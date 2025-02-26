export interface Book {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  rating: number;
  description: string;
  metadata: Metadata;
}

export interface BookStats {
  averageRatingByGenre: Record<string, number>;
  oldestBook: Book;
  newestBook: Book;
}

export type Metadata = Record<string, number>;