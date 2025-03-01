type BookMetadata = {
  pages: number;
  stockLeft: number;
  price: number;
  discount: number;
  edition: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  rating: number;
  description: string;
  metadata: BookMetadata;
};
