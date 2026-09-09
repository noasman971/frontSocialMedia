import { z } from "zod";
import { apiPost, type ApiResult } from "../../shared/api";

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export const RegisterResponseSchema = z.object({
  token: z.string().optional(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      username: z.string(),
    })
    .optional(),
  error: z.string().optional(),
});

export type CommentResponse = z.infer<typeof RegisterResponseSchema>;

// send register request to backend (/api/auth/register)
export async function registerUser(data: RegisterPayload): Promise<ApiResult<CommentResponse>> {

  const res = await apiPost<CommentResponse, RegisterPayload>(
    "/api/auth/register",
    data,
    RegisterResponseSchema
  );

  if (res.ok) {
    // If backend returns error (like email already used)
    if (res.data.error) {
      return { ok: false, error: res.data.error };
    }
    // save JWT token in localStorage
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
  }

  return res;
}