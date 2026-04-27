// 50 pages, 100 reviews per page
const TOTAL_PAGES = 50;
const BATCH_SIZE = 10;

export async function fetchAllReviews(onBatchComplete, onComplete) {
  let allFetchedReviews = [];
  
  // We'll process pages in batches (e.g. 1-10, 11-20, etc.)
  for (let i = 0; i < TOTAL_PAGES; i += BATCH_SIZE) {
    const batchPromises = [];
    
    for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_PAGES; j++) {
      const pageNum = i + j + 1;
      batchPromises.push(
        fetch(`/api/reviews?page=${pageNum}&limit=100`)
          .then(res => {
             if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
             return res.json();
          })
          .catch(err => {
             console.error(`Failed to fetch page ${pageNum}:`, err);
             return []; // return empty array on failure so Promise.all resolves
          })
      );
    }

    // Wait for the current batch of 10 pages to resolve
    const batchResults = await Promise.all(batchPromises);
    
    // Flatten the results
    const newReviews = batchResults.flat();
    allFetchedReviews = [...allFetchedReviews, ...newReviews];
    
    // Update dashboard state after each batch
    onBatchComplete(allFetchedReviews, allFetchedReviews.length);
  }

  // Once all batches are done
  onComplete(allFetchedReviews);
}
