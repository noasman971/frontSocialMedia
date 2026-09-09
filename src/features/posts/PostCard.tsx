import { Link, useNavigate } from "react-router-dom";
import type { Post } from "./posts.api";
import { formatDate } from "../shared/date";
import { LikeButton } from "./LikeButton";

type PostCardProps = {
  // we ensure that the post card contain a Post (id, content, author, img, etc...)
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const gotoDetail = (id: string) => {
    navigate(`/posts/${id}`);
  };

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
        <button className="text-text-secondary hover:text-text-primary text-sm p-1" onClick={() => gotoDetail(post.id)}>
          Voir les détails
        </button>
      </div>

      {/* Optional Post Image - Clickable to open details */}
      {post.imageUrl && (
        <Link to={`/posts/${post.id}`} className="block rounded-lg overflow-hidden border border-border bg-elevated">
          <img
            src={post.imageUrl}
            alt={`Publication de ${username}`}
            loading="lazy"
            className="w-full max-h-[500px] object-cover hover:opacity-95 transition"
          />
        </Link>
      )}

      {/* Post Content (only if not empty) */}
      {post.content && post.content.trim() !== "" && (
        <div className="text-sm text-text-primary leading-relaxed">
          <span className="font-semibold text-xs mr-2">{username}</span>
          {post.content}
        </div>
      )}

      {/* Likes & Comments */}
      <div className="flex items-center space-x-4 text-xs text-text-secondary pt-1">
        <LikeButton
          postId={post.id}
          initialLikeCount={post.likeCount}
        />
        <Link to={`/posts/${post.id}`} className="flex items-center space-x-1 hover:text-text-primary cursor-pointer">
          <span className="font-semibold text-text-primary">{post.commentCount}</span>
          <span>{post.commentCount > 1 ? "commentaires" : "commentaire"}</span>
        </Link>
      </div>
    </article>
  );
}
