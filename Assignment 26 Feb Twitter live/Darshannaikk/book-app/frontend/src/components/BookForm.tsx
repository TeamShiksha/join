import { useState } from 'react';
import { BookInput } from '../types/book';

export default function BookForm({ onSubmit }: { onSubmit: (book: BookInput) => void }) {
  const [formData, setFormData] = useState<BookInput>({
    title: '',
    author: '',
    publicationYear: new Date().getFullYear(),
    genre: 'Fiction',
    rating: 0,
    description: '',
    metadata: {
      pages: 0,
      stockLeft: 0,
      price: 0,
      discount: 0,
      edition: 1
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.author}
            onChange={e => setFormData({ ...formData, author: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Publication Year</label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded"
            value={formData.publicationYear}
            onChange={e => setFormData({ ...formData, publicationYear: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.genre}
            onChange={e => setFormData({ ...formData, genre: e.target.value })}
          >
            <option value="Fiction">Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Dystopian">Dystopian</option>
            <option value="Classic">Classic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            required
            className="w-full p-2 border rounded"
            value={formData.rating}
            onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            required
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pages</label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded"
            value={formData.metadata.pages}
            onChange={e => setFormData({
              ...formData,
              metadata: { ...formData.metadata, pages: parseInt(e.target.value) }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full p-2 border rounded"
            value={formData.metadata.price}
            onChange={e => setFormData({
              ...formData,
              metadata: { ...formData.metadata, price: parseFloat(e.target.value) }
            })}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Book
      </button>
    </form>
  );
}