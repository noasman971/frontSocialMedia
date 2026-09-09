import { type Post, type PostDetails, fetchPosts, fetchPostById } from "./posts.api";
import { useEffect, useState, useCallback } from "react";
import {apiPost, type ApiResult} from "../shared/api.ts";
import { z } from "zod";

// the number of post to charge
const PAGE_SIZE = 10;

// TODO: j'ai du faire un deuxieme type State pour useDetailPosts
//comment j'unifie tout ça ? pour mon lazyloading j'en ai besoin

type StateBase =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "empty" };

// if sucess, we also need 2 flag for the lazy loading
export type State<T> =
    | StateBase
    | {
  status: "success";
  data: T;
  hasMore: boolean;
  isLoadingMore: boolean;
};



// Hook for fetching feed posts with lazy loading
export function usePosts() {
  const [state, setState] = useState<State<Post[]>>({ status: "loading" });

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Charge data
  useEffect(() => {
    const controller = new AbortController();

    fetchPosts(controller.signal).then((res) => {
      if (!res.ok) {
        // If the call is not okay by the abort, return, otherwise set state with the error
        if (res.isAborted) return;
        setState({ status: "error", message: res.error });
        return;
      }

      if (res.data.length === 0) {
        setState({ status: "empty" });
      } else {
        setAllPosts(res.data);
        setState({
          status: "success",
          data: res.data.slice(0, PAGE_SIZE),
          hasMore: res.data.length > PAGE_SIZE,
          isLoadingMore: false,
        });
      }
    });

    return () => controller.abort();
  }, []);

  // Function called if we scroll fo load more (only if we really can ! (status success))
  const loadMore = useCallback(() => {
    if (state.status !== "success" || !state.hasMore || state.isLoadingMore) {
      return;
    }

    // if we was displaying 10 post, now we display 20 !
    const nextCount = visibleCount + PAGE_SIZE;
    // we extract posts
    const nextPosts = allPosts.slice(0, nextCount);

    // memorise it
    setVisibleCount(nextCount);

    // new table of post, so ReRender !
    setState({
      status: "success",
      data: nextPosts,
      hasMore: nextPosts.length < allPosts.length, //(ensure we'll dont try to load more)
      isLoadingMore: false,
    });
  }, [state, allPosts, visibleCount]);

  return { state, loadMore };
}

// Hook for fetching a single post by id with real backend and Zod validation
// Before it was using /posts${id}.json without shared api, now it uses fetchPostById with AbortController
export type SimpleState<T> =
  | StateBase
  | { status: "success"; data: T };

export function useDetailsPosts(id: string | undefined): SimpleState<PostDetails> {
  const [state, setState] = useState<SimpleState<PostDetails>>({
    status: "loading",
  });

  useEffect(() => {
    // If no ID in url, there is something wrong
    if (!id) {
      setState({ status: "error", message: "ou est l'dentifiant du post ?" });
      return;
    }

    const controller = new AbortController();

    setState({ status: "loading" });

    // Call real backend route with shared api and Zod safeParse
    fetchPostById(id, controller.signal).then((res) => {
      if (!res.ok) {
        if (res.isAborted) return;
        setState({ status: "error", message: res.error });
        return;
      }

      if (!res.data) {
        setState({ status: "empty" });
      } else {
        setState({ status: "success", data: res.data });
      }
    });

    return () => controller.abort();
  }, [id]);

  return state;
}

export interface CommentPayload {
  id: string;
  content: string;
  createdAt: string;
  author?: {
    id: string;
    username: string;
    email?: string | undefined;
    avatarUrl?: string | null | undefined;
  } | null | undefined;
}

export const CommentResponseSchema = z.object({
  token: z.string().optional(),
  comment: z
      .object({
        content: z.string(),
        id: z.string(),
        authorId: z.string(),
      })
      .optional(),
  error: z.string().optional(),
});

export type CommentResponse = z.infer<typeof CommentResponseSchema>;

export async function useComment(data: CommentPayload): Promise<ApiResult<CommentResponse>> {

  const res = await apiPost<CommentResponse, CommentPayload>(
      "/api/posts/:id/comments",
      data,
      CommentResponseSchema
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