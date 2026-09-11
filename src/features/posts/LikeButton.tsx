import { useState, useRef, useEffect } from "react";
import { likePost, unlikePost } from "./posts.api";

/*
  [1] Init states:
      - isLiked, likeCount (state shown to user).
      - serverLiked (source of truth to compare after spamming).
      - isAnimating (prevent clicking during pop animation).

  [2] When user clicks toggleLike:
      [a] if isAnimating -> return
      
      [b] trigger animation (isAnimating = true for 250ms).
      [c] manage our next states(flip isLiked, +1 or -1 on likeCount).
      [d] clear existing debounce timer otherwise it will send multiple requests
      [e] set new debounce timer (400ms after last click):
            -> if target state == server state -> do nothing (user clicked back to original).
            -> if target state != server state -> send api request (POST or DELETE).

            -> if api error -> rollback optimistic state to server state + show alert.
            -> if api success -> update server state reference.
*/

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
  initialIsLiked?: boolean;
}

export function LikeButton({ postId, initialLikeCount, initialIsLiked = false }: LikeButtonProps) {
  // [1] 
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References to keep track of actual server state and active timer
  const serverLikedRef = useRef(initialIsLiked);
  const targetLikedRef = useRef(initialIsLiked);
  const debounceTimerRef = useRef<number | null>(null);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleToggleLike = () => {
    // [a] Ignore clicks during bounce animation
    if (isAnimating) return;

    // [b] Pop animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 250);

    // [c] Immediate UI update
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikeCount((prev) => (nextIsLiked ? prev + 1 : Math.max(0, prev - 1)));
    targetLikedRef.current = nextIsLiked;
    setErrorMessage(null);

    // [d] Clear pending timer
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    // [e] Debounce: send request 400ms after last click
    debounceTimerRef.current = window.setTimeout(async () => {
      const finalTarget = targetLikedRef.current;
      const currentServer = serverLikedRef.current;

      // If final state equals current server state, no request needed!
      if (finalTarget === currentServer) {
        return;
      }

      // Send appropriate API call
      const res = finalTarget ? await likePost(postId) : await unlikePost(postId);

      if (!res.ok) {
        // Rollback on failure
        setIsLiked(currentServer);

        // rollback like count to original server value (and never go below 0)
        // : Si le serveur était liké, +1 sinon -1
        //  FIX : (Math.max(0, ...) pour jamais descendre a -1)
        setLikeCount((prev) =>
          (currentServer ? prev + 1 : Math.max(0, prev - 1))
        );

        targetLikedRef.current = currentServer;
        setErrorMessage("Erreur lors de la mise à jour du like");

      } else {
        // Update server reference on success
        serverLikedRef.current = finalTarget;
      }
    }, 400);
  };

  return (
    <div className="flex items-center space-x-1.5">
      <button
        type="button"
        onClick={handleToggleLike}
        className={`flex items-center space-x-1.5 text-xs transition cursor-pointer p-1 rounded-md hover:bg-elevated ${isLiked ? "text-error font-semibold" : "text-text-secondary hover:text-text-primary"
          } ${isAnimating ? "scale-125 transition-transform duration-150" : "scale-100 transition-transform duration-150"}`}
        title={isLiked ? "Je n'aime plus" : "J'aime"}
      >
        {/* Heart SVG */}
        <svg
          className={`w-4 h-4 transition-colors ${isLiked ? "fill-error stroke-error" : "fill-none stroke-current"}`}
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>

        {/* Like count text */}
        <span>{likeCount}</span>
        <span>{likeCount > 1 ? "J'aimes" : "J'aime"}</span>
      </button>

      {errorMessage && (
        <span className="text-[10px] text-error font-medium">{errorMessage}</span>
      )}
    </div>
  );
}
