import { z } from "zod";

/**
 * Api Generic Response
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; isAborted?: boolean };

// get token from localStorage if exist
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Generic Fetch Helper with Zod, auth header and AbortController
 * @param url URL of the API endpoint
 * @param schema Zod schema to validate the data
 * @param signal AbortSignal to cancel the request if needed
 */
export async function apiGet<T>(url: string, schema: z.ZodType<T>, signal?: AbortSignal): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
      },
      signal,
    });

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
        return { ok: false, error: "Aborted", isAborted: true };
      }
      return { ok: false, error: e.message };
    }
    return { ok: false, error: "Erreur inconnue" };
  }
}

/**
 * Generic Post Helper with Zod and Auth header, and Abort
 * @param url URL of the API endpoint
 * @param body Data to send
 * @param schema Zod schema to validate the data
 * @param signal AbortSignal to cancel the request if needed
 */
export async function apiPost<T, B>(url: string, body: B, schema: z.ZodType<T>, signal?: AbortSignal): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
      signal,
    });

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
        return { ok: false, error: "Aborted", isAborted: true };
      }
      return { ok: false, error: e.message };
    }
    return { ok: false, error: "Erreur inconnue" };
  }
}
