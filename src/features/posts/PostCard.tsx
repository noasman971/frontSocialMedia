import type { Post } from "./posts.api";

type PostCardProps = {
  // we ensure that the post card contain a Post (id, content, author, img, etc...)
  post: Post;
};

/**
 * AI sry
 * Formats an ISO date string into a shorter date format
 * @param dateStr ISO date string from database
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

    if(diffInSeconds < 60) {
        return "À l'instant";
    }else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return minutes + " minute" + (minutes > 1 ? "s" : "");
    }else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return hours + " heure" + (hours > 1 ? "s" : "");
    }else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return days + " jour" + (days > 1 ? "s" : "");
    }else if (diffInSeconds < 2419200) {
        const weeks = Math.floor(diffInSeconds / 604800);
        return weeks + " semaine" + (weeks > 1 ? "s" : "");
    }

    // For dates older than 4 weeks, we return the date in a short format (e.g., "12 janv.")
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function PostCard({ post }: PostCardProps) {
  // Ensure unsername is not null
  const username = post.author?.username ?? "Utilisateur inconnu";
  // create avatar from first letters of the username, uppercase them (because in db they are lowercase)
  // later we'll use profile picture
  const avatarInitials = username.slice(0, 2).toUpperCase();

  return (
    <article className="py-4 space-y-3">
      {/* Header Post */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-story-gradient p-[2px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-bg border border-bg flex items-center justify-center text-xs font-semibold uppercase text-text-primary">
              {avatarInitials}
            </div>
          </div>
          <div>
            <span className="font-semibold text-xs text-text-primary hover:text-text-secondary cursor-pointer">
              {username}
            </span>
            <span className="text-[11px] text-text-tertiary ml-2">
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
        <button
          className="text-text-secondary hover:text-text-primary text-sm p-1"
        >
          •••
        </button>
      </div>

      {/* Optional Post Image */}
      {post.imageUrl && (
        <div className="rounded-lg overflow-hidden border border-border bg-elevated">
          <img
            src={post.imageUrl}
            alt={`Publication de ${username}`}
            loading="lazy"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Likes & Comments */}
      <div className="flex items-center space-x-4 text-xs text-text-secondary pt-1">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-text-primary">{post.likeCount}</span>
          <span>{post.likeCount > 1 ? "J'aimes" : "J'aime"}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-text-primary">{post.commentCount}</span>
          <span>{post.commentCount > 1 ? "commentaires" : "commentaire"}</span>
        </div>
      </div>

      {/* Post Content */}
      <div className="text-sm text-text-primary leading-relaxed">
        <span className="font-semibold text-xs mr-2">{username}</span>
        {post.content}
      </div>
    </article>
  );
}