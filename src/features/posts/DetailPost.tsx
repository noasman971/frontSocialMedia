import { useState, type FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { postComment, useDetailsPosts} from "./usePosts";
import { formatDate } from "../shared/date";
import type { z } from "zod";
import { createComment, type CommentSchema } from "./posts.api";
import { LikeButton } from "./LikeButton";

type Comment = z.infer<typeof CommentSchema>;

export default function DetailPost() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const state = useDetailsPosts(id);

    // local state for input and comments list in front
    const [newCommentText, setNewCommentText] = useState("");
    const [localComments, setLocalComments] = useState<Comment[] | null>(null);

    switch (state.status) {
        case "loading":
            return (
                <div className="flex flex-col items-center justify-center p-12 space-y-3">
                    <div className="w-8 h-8 border-2 border-border border-t-btn-primary rounded-full animate-spin" />
                    <p className="text-xs text-text-secondary">Chargement de la publication...</p>
                </div>
            );

        case "error":
            return (
                <div className="max-w-2xl mx-auto my-6 px-4">
                    <div
                        role="alert"
                        className="p-4 bg-elevated rounded-lg border border-border text-error text-center"
                    >
                        <p className="font-semibold text-sm">Erreur</p>
                        <p className="text-xs text-text-secondary mt-1">{state.message}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-3 text-xs text-text-primary underline hover:text-text-secondary"
                        >
                            Retourner en arrière
                        </button>
                    </div>
                </div>
            );

        case "empty":
            return (
                <div className="text-center py-16 text-text-secondary">
                    <p className="font-semibold text-base text-text-primary">Publication introuvable</p>
                    <p className="text-xs mt-1">Ce post n'existe pas ou a été supprimé.</p>
                    <Link
                        to="/posts"
                        className="inline-block mt-4 text-xs font-semibold text-text-primary underline hover:text-text-secondary"
                    >
                        Retour au fil d'actualité
                    </Link>
                </div>
            );

        case "success": {
            const post = state.data;
            const authorName = post.author?.username ?? "Utilisateur inconnu";
            const authorInitials = authorName.slice(0, 2).toUpperCase();

            const comments = localComments ?? post.comments;

            const handleAddComment = async (e: FormEvent) => {
                e.preventDefault();
                const trimmed = newCommentText.trim();
                if (!trimmed || !id) return;

                const optimisticComment: Comment = {
                    id: `temp-${Date.now()}`,
                    content: trimmed,
                    createdAt: new Date().toISOString(),
                    author: {
                        id: "current-user",
                        username: "Moi",
                        avatarUrl: null,
                    },
                };

                const res = await createComment(id, trimmed);
                if (!res.ok) {
                    setLocalComments(comments);
                    alert("Impossible d'ajouter le commentaire");
                }

                setLocalComments([optimisticComment, ...comments]);
                setNewCommentText("");

                try {
                    const result = await postComment(id, { content: trimmed });

                    if (!result.ok) {
                        console.error("Erreur lors de l'ajout du commentaire :", result.error);
                    } else {
                        // ...
                    }
                } catch (err) {
                    console.error("Erreur réseau", err);
                }
            };

            return (
                <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
                    {/* Bouton retour */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center space-x-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Retour</span>
                    </button>

                    {/* Corps principal du post */}
                    <article className="space-y-4 pb-6 border-b border-border">
                        {/* Header: Auteur & Date */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-story-gradient p-[2px] flex items-center justify-center shrink-0">
                                <div className="w-full h-full rounded-full bg-bg border border-bg flex items-center justify-center text-xs font-semibold uppercase text-text-primary">
                                    {authorInitials}
                                </div>
                            </div>
                            <div>
                                <h1 className="font-semibold text-sm text-text-primary">{authorName}</h1>
                                <time className="text-[11px] text-text-tertiary block">
                                    {formatDate(post.createdAt)}
                                </time>
                            </div>
                        </div>

                        {/* Image (optionnelle) */}
                        {post.imageUrl && (
                            <div className="rounded-lg overflow-hidden border border-border bg-elevated">
                                <img
                                    src={post.imageUrl}
                                    alt={`Publication de ${authorName}`}
                                    className="w-full max-h-[550px] object-cover"
                                />
                            </div>
                        )}

                        {/* Contenu textuel (seulement s'il n'est pas vide) */}
                        {post.content && post.content.trim() !== "" && (
                            <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                                <span className="font-semibold text-xs mr-2">{authorName}</span>
                                {post.content}
                            </div>
                        )}

                        {/* Likes */}
                        <div className="pt-1">
                            <LikeButton
                                postId={post.id}
                                initialLikeCount={post.likeCount}
                            />
                        </div>
                    </article>

                    {/* Section Commentaires */}
                    <section className="space-y-4">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Commentaires ({comments.length})
                        </h2>

                        {/* Formulaire d'ajout de commentaire */}
                        <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center text-[10px] font-semibold uppercase text-text-primary shrink-0">
                                MO
                            </div>
                            <div className="flex-1 relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Ajouter un commentaire..."
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    className="w-full bg-elevated border border-border rounded-lg pl-3 pr-20 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-secondary transition"
                                />
                                <button
                                    type="submit"
                                    disabled={!newCommentText.trim()}
                                    className="absolute right-2 text-xs font-semibold text-text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:text-text-secondary transition"
                                >
                                    Publier
                                </button>
                            </div>
                        </form>

                        {comments.length === 0 ? (
                            <p className="text-xs text-text-secondary py-4 italic">
                                Aucun commentaire pour le moment.
                            </p>
                        ) : (
                            <div className="divide-y divide-border">
                                {comments.map((comment) => {
                                    const commentAuthor = comment.author?.username ?? "Utilisateur inconnu";
                                    const commentInitials = commentAuthor.slice(0, 2).toUpperCase();

                                    return (
                                        <div key={comment.id} className="py-3 flex items-start space-x-3">
                                            {/* Avatar commentaire */}
                                            <div className="w-7 h-7 rounded-full bg-elevated border border-border flex items-center justify-center text-[10px] font-semibold uppercase text-text-primary shrink-0">
                                                {commentInitials}
                                            </div>

                                            {/* Contenu commentaire */}
                                            <div className="flex-1 text-xs leading-relaxed">
                                                <div>
                          <span className="font-semibold text-text-primary mr-2">
                            {commentAuthor}
                          </span>
                                                    <span className="text-text-primary">{comment.content}</span>
                                                </div>
                                                <time className="text-[10px] text-text-tertiary block mt-1">
                                                    {formatDate(comment.createdAt)}
                                                </time>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            );
        }

        default: {
            const _exhaustive: never = state;
            return _exhaustive;
        }
    }
}