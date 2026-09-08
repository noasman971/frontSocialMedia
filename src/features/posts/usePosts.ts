import { useEffect, useState, useCallback } from "react";
import { fetchPosts, type Post } from "./posts.api";

// the number of post to charge
const PAGE_SIZE = 10;

// if sucess, we also need 2 flag for the lazy loading
export type State<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; data: T; hasMore: boolean; isLoadingMore: boolean };

export function usePosts() {
  const [state, setState] = useState<State<Post[]>>({ status: "loading" });

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);


  // Charge data
  useEffect(() => {
    const controller = new AbortController();

    setState({ status: "loading" });

    fetchPosts(controller.signal).then((res) => {
      if (!res.ok) {
        // If the call is not okay by the abort, return, otherwise set state with the error
        if (res.error === "Requete annulee") return;
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