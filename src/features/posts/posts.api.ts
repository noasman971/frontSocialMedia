export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

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

export type Post = {
  id: string;
  content: string;
  author: { id: string; username: string };
};

// 1. ApiGet avec signal d'annulation (AbortSignal)
export async function apiGet<T>(url: string, signal?: AbortSignal): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      return { ok: false, error: `Erreur ${res.status}` };
    }

    const data: T = await res.json();
    return { ok: true, data };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { ok: false, error: e.message };
    }
    return { ok: false, error: "Erreur inconnue" };
  }
}
