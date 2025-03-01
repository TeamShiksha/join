import {data} from "@/books"

export async function GET() {
  // Handle GET requests
  return new Response(JSON.stringify({ message: data }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}