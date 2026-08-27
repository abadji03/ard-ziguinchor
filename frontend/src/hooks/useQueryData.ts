import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

// Wrapper générique autour de useQuery pour simplifier l'usage
export function useQueryData<T>(
  key: unknown[],
  fetcher: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: fetcher,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}
