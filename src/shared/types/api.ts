export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export type PostTier = 'free' | 'paid';

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
}

// ─── Response wrappers ───────────────────────────────────────────────────────

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PostsData {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PostsResponse {
  ok: true;
  data: PostsData;
}

export interface PostDetailResponse {
  ok: true;
  data: { post: Post };
}

export interface LikeData {
  isLiked: boolean;
  likesCount: number;
}

export interface LikeResponse {
  ok: true;
  data: LikeData;
}

export interface CommentsData {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommentsResponse {
  ok: true;
  data: CommentsData;
}

export interface CommentCreatedResponse {
  ok: true;
  data: { comment: Comment };
}

export type GetPostsParams = {
  limit?: number;
  cursor?: string | null;
  tier?: PostTier;
  simulate_error?: boolean;
};
