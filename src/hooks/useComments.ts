import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '@/api/posts';
import type { CommentsResponse } from '@/types/api';

export const commentsQueryKey = (postId: string) => ['comments', postId] as const;

export function useComments(postId: string) {
  return useInfiniteQuery<CommentsResponse, Error>({
    queryKey: commentsQueryKey(postId),
    queryFn: ({ pageParam }) =>
      getComments(postId, { cursor: (pageParam as string | undefined) ?? null, limit: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? (lastPage.data.nextCursor ?? undefined) : undefined,
    initialPageParam: undefined,
    staleTime: 30_000,
    retry: 2,
  });
}

export function flattenCommentPages(pages: CommentsResponse[] | undefined) {
  return pages?.flatMap((p) => p.data.comments) ?? [];
}
