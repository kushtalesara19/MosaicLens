const TOTAL_PAGES = 50;
const BATCH_SIZE = 10;

async function fetchPage(page) {
  const res = await fetch(`/api/reviews?page=${page}&limit=100`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchAllReviews(onBatchComplete, onComplete) {
  let allReviews = [];

  const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  for (let i = 0; i < pageNumbers.length; i += BATCH_SIZE) {
    const batch = pageNumbers.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(batch.map((page) => fetchPage(page)));

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allReviews = [...allReviews, ...result.value];
      }
    });

    if (onBatchComplete) {
      onBatchComplete([...allReviews], allReviews.length);
    }
  }

  if (onComplete) {
    onComplete(allReviews);
  }

  return allReviews;
}
