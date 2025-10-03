export async function GET() {
  return new Response('SUCCESS', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}