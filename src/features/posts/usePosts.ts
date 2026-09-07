import { useEffect, useState } from "react";
import { apiGet, type Post } from "./posts.api";

export type State<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; data: T };

export function usePosts(): State<Post[]> {
  const [state, setState] = useState<State<Post[]>>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    setState({ status: "loading" });

    apiGet<Post[]>("/posts.json", controller.signal)
      .then((res) => {
        if (!res.ok) {
          setState({ status: "error", message: res.error });
          return;
        } else {
          if (res.data.length === 0) {
            setState({ status: "empty" });
          } else {
            setState({ status: "success", data: res.data });
          }
        }
      });

    return () => controller.abort();
  }, []);

  return state;
}
