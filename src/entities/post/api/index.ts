import { apiClient } from '@shared/api';
import type {
  GetPostsParams,
  PostsResponse,
  PostDetailResponse,
  LikeResponse,
} from '@shared/types';

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
