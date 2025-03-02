import {data} from "@/books"

export async function GET({req}:{req:Request}) {

  // Handle GET requests
  const d = await req.json();
    const id = d.id;

    // Handle the request
    console.log(`Received ID: ${id}`);

    return new Response(JSON.stringify({ message: data.filter(item=> item.id==id)  }), {
      headers: {
        'Content-Type': 'application/json',
      },
    
    })
}
