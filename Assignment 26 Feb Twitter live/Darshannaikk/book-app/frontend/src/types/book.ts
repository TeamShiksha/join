export interface Book {
    id: string;
    title: string;
    author: string;
    publicationYear: number;
    genre: string;
    rating: number;
    description: string;
    metadata: {
      pages: number;
      stockLeft: number;
      price: number;
      discount: number;
      edition: number;
    };
  }
  
  export interface BookInput extends Omit<Book, 'id'> {}