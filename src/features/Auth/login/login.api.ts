import { z } from "zod";
import { apiPost, type ApiResult } from "../../shared/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export const LoginResponseSchema = z.object({
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

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Send login request to backend (/api/auth/login)
export async function loginUser(data: LoginPayload): Promise<ApiResult<LoginResponse>> {
  const res = await apiPost<LoginResponse, LoginPayload>(
    "/api/auth/login",
    data,
    LoginResponseSchema
  );

  if (res.ok) {
    // If backend returns error
    if (res.data.error) {
      return { ok: false, error: res.data.error };
    }
    // Save JWT token in localStorage
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
  }

  return res;
}
