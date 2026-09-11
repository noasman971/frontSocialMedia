import {
    type Post,
    type PostDetails,
    fetchPosts,
    fetchPostById,
    deletePost,
} from "./posts.api";
import { useEffect, useState, useCallback } from "react";

const PAGE_SIZE = 10;

type StateBase =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "empty" };

export type State<T> =
    | StateBase
    | {
        status: "success";
        data: T;
        hasMore: boolean;
        isLoadingMore: boolean;
      };

export function usePosts() {
    const [state, setState] = useState<State<Post[]>>({ status: "loading" });

    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

    useEffect(() => {
        const controller = new AbortController();

        fetchPosts(controller.signal).then((res) => {
            if (!res.ok) {
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

    const loadMore = useCallback(() => {
        if (state.status !== "success" || !state.hasMore || state.isLoadingMore) {
            return;
        }

        const nextCount = visibleCount + PAGE_SIZE;
        const nextPosts = allPosts.slice(0, nextCount);

        setVisibleCount(nextCount);

        setState({
            status: "success",
            data: nextPosts,
            hasMore: nextPosts.length < allPosts.length,
            isLoadingMore: false,
        });
    }, [state, allPosts, visibleCount]);

    const removePost = useCallback(async (id: string) => {
        const result = await deletePost(id);

        if (!result.ok) {
            return result;
        }

        setAllPosts((currentPosts) =>
            currentPosts.filter((post) => post.id !== id)
        );

        setState((currentState) => {
            if (currentState.status !== "success") {
                return currentState;
            }

            const newData = currentState.data.filter(
                (post) => post.id !== id
            );

            if (newData.length === 0) {
                return { status: "empty" };
            }

            return {
                status: "success",
                data: newData,
                hasMore: newData.length < allPosts.length - 1,
                isLoadingMore: false,
            };
        });

        setVisibleCount((current) =>
            Math.max(0, current - 1)
        );

        return result;
    }, [allPosts.length]);

    return { state, loadMore, removePost };
}

export type SimpleState<T> =
    | StateBase
    | { status: "success"; data: T };

export function useDetailsPosts(id: string | undefined): SimpleState<PostDetails> {
    const [state, setState] = useState<SimpleState<PostDetails>>(() => {
        if (!id) {
            return { status: "error", message: "ou est l'dentifiant du post ?" };
        }
        return { status: "loading" };
    });

    useEffect(() => {
        if (!id) {
            return;
        }

        const controller = new AbortController();

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