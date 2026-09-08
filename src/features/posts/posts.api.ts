import { z } from "zod";

/**
 * Api Generic Response
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

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


export type Author = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
};

export type PostDetails = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: Author;
  comments: Comment[];
  likeCount: number;
};

/**
 * Our PostList is an array of Post
 */
export const PostsListSchema = z.array(PostSchema);

// TypeScript type is now Zod Type
export type Post = z.infer<typeof PostSchema>;

/**
 * Generic Fetch Helper with Zod and AbortController
 * @param url URL of the API endpoint
 * @param schema Zod schema to validate the data
 * @param signal AbortSignal to cancel the request if needed
 */
export async function apiGet<T>(url: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      return { ok: false, error: `Erreur HTTP ${res.status}` };
    }

    // We change to unknown type because we don't know yet if the data is valid
    const data: unknown = await res.json();

    // It's zod who'll do the runtime validation (safeParse)
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        error: `Zod thinks there's something wrong with the API response: ${parsed.error.message}`,
      };
    }

    return { ok: true, data: parsed.data };
  } catch (e: unknown) {
    if (e instanceof Error) {
      // If it's abort from AbortController, ignore it
      if (e.name === "AbortError") {
        return { ok: false, error: "Requete annulee" };
      }
      return { ok: false, error: e.message };
    }
    return { ok: false, error: "Erreur inconnue" };
  }
}

/**
 * Specific call for fetchs all posts from the feed
 */
export async function fetchPosts(signal?: AbortSignal): Promise<ApiResult<Post[]>> {
  return apiGet("/api/posts", PostsListSchema, signal);
}

