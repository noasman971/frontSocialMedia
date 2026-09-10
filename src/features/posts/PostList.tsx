import { useEffect, useRef } from "react";
import { PostCard } from "./PostCard";
import { usePosts } from "./usePosts";

export function PostList() {
  const { state, loadMore, removePost } = usePosts();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = state.status === "success" ? state.hasMore : false;

  useEffect(() => {
    if (state.status !== "success" || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    const currentSentinel = sentinelRef.current;
    observer.observe(currentSentinel);

    return () => {
      observer.unobserve(currentSentinel);
    };
  }, [state.status, hasMore, loadMore]);

  switch (state.status) {
    case "loading":
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
          <div className="w-8 h-8 border-2 border-border border-t-btn-primary rounded-full animate-spin"></div>
          <p className="text-xs text-text-secondary">Chargement des publications...</p>
        </div>
      );

    case "error":
      return (
        <div
          role="alert"
          className="p-4 bg-elevated rounded-lg border border-border text-error text-center my-4"
        >
          <p className="font-semibold text-sm">Erreur</p>
          <p className="text-xs text-text-secondary mt-1">{state.message}</p>
        </div>
      );

    case "empty":
      return (
        <div className="text-center py-12 text-text-secondary">
          <p className="font-semibold text-base text-text-primary">
            Aucun post pour le moment
          </p>
          <p className="text-xs mt-1">
            Partagez votre première photo ou suivez des personnes.
          </p>
        </div>
      );

    case "success":
      return (
        <div className="divide-y divide-border w-full">
          {state.data.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={removePost}
            />
          ))}

          {state.hasMore && (
            <div
              ref={sentinelRef}
              className="h-1 w-full"
              aria-hidden="true"
            />
          )}
        </div>
      );

    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}