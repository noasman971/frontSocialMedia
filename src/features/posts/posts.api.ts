import { z } from "zod";
import { apiGet, type ApiResult } from "../shared/api";

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
