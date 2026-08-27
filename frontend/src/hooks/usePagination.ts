import { useState, useCallback } from 'react';

export function usePagination(defaultLimit = 9) {
  const [page, setPage]   = useState(1);
  const [limit]           = useState(defaultLimit);

  const nextPage     = useCallback(() => setPage((p) => p + 1), []);
  const prevPage     = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goToPage     = useCallback((p: number) => setPage(p), []);
  const resetPage    = useCallback(() => setPage(1), []);

  return { page, limit, nextPage, prevPage, goToPage, resetPage };
}
