export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '100';

  const res = await fetch(
    `https://mosaicfellowship.in/api/data/cx/reviews?page=${page}&limit=${limit}`,
    { next: { revalidate: 0 } }
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
