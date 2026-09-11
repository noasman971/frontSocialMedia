import { z } from "zod";
import { apiGet, apiPost, apiPostForm, apiDelete, type ApiResult } from "../shared/api";

/**
 * Zod Schema for Author
 */
export const AuthorSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});

/**
 * Zod Schema for Comment on a Post
 */
export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  author: AuthorSchema.nullable().optional(),
});

/**
 * Zod Schema for Post in list (feed)
 */
export const PostSchema = z.object({
  id: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  created_at: z.string(),
  author: AuthorSchema.nullable(),
  likeCount: z.number().default(0),
  commentCount: z.number().default(0),
});

/**
 * Zod Schema for Post Details (single post page with full comments and author)
 */
export const PostDetailsSchema = z.object({
  id: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  author: AuthorSchema.nullable(),
  comments: z.array(CommentSchema).default([]),
  likeCount: z.number().default(0),
});

/**
 * List of posts schema
 */
export const PostsListSchema = z.array(PostSchema);

export const DeleteResponseSchema = z.object({
  success: z.boolean(),
});

// TypeScript types inferred from Zod schemas
export type Post = z.infer<typeof PostSchema>;
export type PostDetails = z.infer<typeof PostDetailsSchema>;
export type Comment = z.infer<typeof CommentSchema>;

/**
 * Specific call for fetching all posts from the feed
 */
export async function fetchPosts(signal?: AbortSignal): Promise<ApiResult<Post[]>> {
  return apiGet("/api/posts", PostsListSchema, signal);
}

/**
 * Fetch a single post with comments by id
 */
export async function fetchPostById(id: string, signal?: AbortSignal): Promise<ApiResult<PostDetails>> {
  return apiGet(`/api/posts/${id}`, PostDetailsSchema, signal);
}

export async function deletePost(
    id: string
): Promise<ApiResult<{ success: boolean }>> {
  return apiDelete(
      `/api/posts/${id}`,
      DeleteResponseSchema
  );
}

export async function deleteComment(
    id: string
): Promise<ApiResult<{ success: boolean }>> {
  return apiDelete(
      `/api/comments/${id}`,
      DeleteResponseSchema
  );
}

/**
 * Create a comment for a post
 */
export async function createComment(postId: string, content: string): Promise<ApiResult<Comment>> {
  console.log(postId)
  return apiPost(`/api/posts/${postId}/comments`, { content }, CommentSchema);
}

/**
 * Zod Schema for created post response from backend
 */
export const CreatedPostSchema = z.object({
  id: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  authorId: z.string(),
  createdAt: z.string().optional(),
});

export type CreatedPost = z.infer<typeof CreatedPostSchema>;

/**
 * Create a new post with content and optional image file
 */
export async function createPost(formData: FormData): Promise<ApiResult<CreatedPost>> {
  return apiPostForm("/api/posts", formData, CreatedPostSchema);
}

/**
 * Like response schema from backend
 */
export const LikeResponseSchema = z.object({
  id: z.string().optional(),
  postId: z.string().optional(),
  userId: z.string().optional(),
  error: z.string().optional(),
  success: z.boolean().optional(),
});

export type LikeResponse = z.infer<typeof LikeResponseSchema>;

/**
 * Send like to backend
 */
export async function likePost(postId: string): Promise<ApiResult<LikeResponse>> {
  return apiPost(`/api/posts/${postId}/like`, {}, LikeResponseSchema);
}

/**
 * Send unlike to backend
 */
export async function unlikePost(postId: string): Promise<ApiResult<LikeResponse>> {
  return apiDelete(`/api/posts/${postId}/like`, LikeResponseSchema);
}