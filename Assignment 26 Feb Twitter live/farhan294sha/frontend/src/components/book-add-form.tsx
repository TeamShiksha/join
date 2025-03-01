
import { Book } from "../types";

type BookFormProps = {
  onAddBook: (book: Omit<Book, "id">) => void;
};

export default function BookForm({ onAddBook }: BookFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const book: Omit<Book, "id"> = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      publicationYear: Number(formData.get("year") as string),
      genre: formData.get("genre") as string,
      rating: Number(formData.get("rating") as string),
      description: formData.get("description") as string,
      metadata: {
        pages: Number(formData.get("pages") as string),
        stockLeft: Number(formData.get("stockLeft") as string),
        price: Number(formData.get("price") as string),
        discount: Number(formData.get("discount") as string),
        edition: Number(formData.get("edition") as string),
      },
    };

    onAddBook(book);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="author" className="block text-gray-700 font-bold mb-2">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="year" className="block text-gray-700 font-bold mb-2">
          Year
        </label>
        <input
          type="number"
          id="year"
          name="year"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="genre" className="block text-gray-700 font-bold mb-2">
          Genre
        </label>
        <input
          type="text"
          id="genre"
          name="genre"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="rating" className="block text-gray-700 font-bold mb-2">
          Rating
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          className="w-full px-3 py-2 border rounded-lg"
          min="0"
          max="5"
          step="0.1"
          required
        />
      </div>

      <h3 className="text-lg font-semibold mb-2">Metadata</h3>

      <div className="mb-4">
        <label htmlFor="pages" className="block text-gray-700 font-bold mb-2">
          Pages
        </label>
        <input
          type="number"
          id="pages"
          name="pages"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="stockLeft"
          className="block text-gray-700 font-bold mb-2"
        >
          Stock Left
        </label>
        <input
          type="number"
          id="stockLeft"
          name="stockLeft"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="discount"
          className="block text-gray-700 font-bold mb-2"
        >
          Discount
        </label>
        <input
          type="number"
          id="discount"
          name="discount"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="edition" className="block text-gray-700 font-bold mb-2">
          Edition
        </label>
        <input
          type="number"
          id="edition"
          name="edition"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Add Book
      </button>
    </form>
  );
}
