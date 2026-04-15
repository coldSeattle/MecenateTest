import { apiClient } from '@shared/api';
import type { CommentsResponse, CommentCreatedResponse } from '@shared/types';

export async function getComments(
  postId: string,
  params: { limit?: number; cursor?: string | null } = {}
): Promise<CommentsResponse> {
  const { cursor, limit = 20 } = params;
  const response = await apiClient.get<CommentsResponse>(`/posts/${postId}/comments`, {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  });
  return response.data;
}

export async function addComment(postId: string, text: string): Promise<CommentCreatedResponse> {
  const response = await apiClient.post<CommentCreatedResponse>(`/posts/${postId}/comments`, { text });
  return response.data;
}
