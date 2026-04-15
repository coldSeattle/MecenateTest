import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '@entities/post/api';
import type { PostsResponse, PostTier } from '@shared/types';

export const FEED_QUERY_KEY = ['feed'] as const;

export function useFeed(tier?: PostTier) {
  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: tier ? [...FEED_QUERY_KEY, tier] : FEED_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getPosts({ cursor: (pageParam as string | undefined) ?? null, limit: 10, tier }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? (lastPage.data.nextCursor ?? undefined) : undefined,
    initialPageParam: undefined,
    staleTime: 60_000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  });
}

export function flattenFeedPages(pages: PostsResponse[] | undefined) {
  return pages?.flatMap((p) => p.data.posts) ?? [];
}
