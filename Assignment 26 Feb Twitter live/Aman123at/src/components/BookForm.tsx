import { useState } from 'react';
import { Book } from '@/types/book';
import { toast } from 'react-hot-toast';

const initialFormData = {
  id:'',
  title: '',
  author: '',
  genre: '',
  publicationYear: new Date().getFullYear(),
  description: '',
  rating: 0,
  metadata: {
    pages: 0,
    stockLeft: 15,
    price: 0,
    discount: 0,
    edition: 1
  }
};

export default function BookForm({ onSubmit, onCancel }: { 
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(initialFormData);

  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.author.trim() !== '' &&
      formData.genre.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.metadata.pages > 0 &&
      formData.metadata.price > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = Math.random()*12345678
    formData.id = randomId.toString()
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add book');

      toast.success('Book added successfully!');
      onSubmit();
    } catch (error) {
      toast.error('Failed to add book');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Book</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="p-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author *</label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="p-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre *</label>
          <input
            type="text"
            required
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="p-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publication Year *</label>
          <input
            type="number"
            required
            value={formData.publicationYear}
            onChange={(e) => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
            className="p-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pages *</label>
          <input
            type="number"
            required
            value={formData.metadata.pages}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, pages: Number(e.target.value) }
            })}
            className="p-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price *</label>
          <input
            type="number"
            required
            value={formData.metadata.price}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, price: Number(e.target.value) }
            })}
            className="p-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="p-2 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid()}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Book
        </button>
      </div>
    </form>
  );
} 