import { z } from "zod";
import { apiGet, type ApiResult } from "../shared/api";

// export type { ApiResult };

/**
 * Zod Schema for Author
 */
export const AuthorSchema = z.object({
  id: z.string(),
  username: z.string(),
});

/**
 * Zod Schema for Post
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
 * Our PostList is an array of Post
 */
export const PostsListSchema = z.array(PostSchema);

// TypeScript type is now Zod Type
export type Post = z.infer<typeof PostSchema>;

/**
 * Specific call for fetching all posts from the feed
 */
export async function fetchPosts(signal?: AbortSignal): Promise<ApiResult<Post[]>> {
  return apiGet("/api/posts", PostsListSchema, signal);
}
