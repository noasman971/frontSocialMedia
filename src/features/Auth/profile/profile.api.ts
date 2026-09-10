import { z } from "zod";
import { apiGet, type ApiResult } from "../../shared/api";

// --------------------------------------------------
// USER PROFILE
// --------------------------------------------------

export const UserProfileSchema = z.object({
    id: z.string(),
    username: z.string(),
    createdAt: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// --------------------------------------------------
// POST
// --------------------------------------------------

export const PostSchema = z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.string(),

    author: z
        .object({
            id: z.string(),
            username: z.string(),
            email: z.string().optional(),
            avatarUrl: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),

    likeCount: z.number().optional(),
    commentCount: z.number().optional(),

    imageUrl: z.string().nullable().optional(),
});

export type Post = z.infer<typeof PostSchema>;

// --------------------------------------------------
// API : PROFIL
// --------------------------------------------------

export async function fetchUserProfile(
    id: string
): Promise<ApiResult<UserProfile>> {
    console.log("GET PROFILE :", `/api/users/${id}`);

    const res = await apiGet<UserProfile>(
        `/api/users/${id}`,
        UserProfileSchema
    );

    console.log("GET PROFILE RESULT :", res);

    return res;
}

// --------------------------------------------------
// API : POSTS
// --------------------------------------------------

export async function fetchUserPosts(
    id: string
): Promise<ApiResult<Post[]>> {
    console.log("GET POSTS :", `/api/users/${id}/posts`);

    const res = await apiGet<Post[]>(
        `/api/users/${id}/posts`,
        z.array(PostSchema)
    );

    console.log("GET POSTS RESULT :", res);

    return res;
}