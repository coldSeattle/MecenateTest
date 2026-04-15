import { apiClient } from './client';
import type {
  GetPostsParams,
  PostsResponse,
  PostDetailResponse,
  LikeResponse,
  CommentsResponse,
  CommentCreatedResponse,
} from '@/types/api';

export async function getPosts(params: GetPostsParams = {}): Promise<PostsResponse> {
  const { cursor, limit = 10, tier, simulate_error } = params;

  const response = await apiClient.get<PostsResponse>('/posts', {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
      ...(tier ? { tier } : {}),
      ...(simulate_error ? { simulate_error: true } : {}),
    },
  });

  return response.data;
}

export async function getPost(id: string): Promise<PostDetailResponse> {
  const response = await apiClient.get<PostDetailResponse>(`/posts/${id}`);
  return response.data;
}

export async function toggleLike(postId: string): Promise<LikeResponse> {
  const response = await apiClient.post<LikeResponse>(`/posts/${postId}/like`);
  return response.data;
}

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
  const response = await apiClient.post<CommentCreatedResponse>(`/posts/${postId}/comments`, {
    text,
  });
  return response.data;
}
