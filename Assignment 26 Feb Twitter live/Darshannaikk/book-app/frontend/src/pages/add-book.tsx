import { useRouter } from 'next/router';
import BookForm from '../components/BookForm';

export default function AddBookPage() {
  const router = useRouter();

  const handleSubmit = async (bookData: any) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/books`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bookData)
            }
          );
      if (response.ok) router.push('/');
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <BookForm onSubmit={handleSubmit} />
    </div>
  );
}