import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUserPosts, type Post } from "./profile.api";
import { formatDate } from "../../shared/date";
import { LikeButton } from "../../posts/LikeButton";

export interface UserPostsProps {
    userId?: string;
    posts?: Post[];
    activeTab?: "photos" | "texts";
}

// displays user posts: either 3-column photo grid or stacked text posts
export function UserPosts({
    userId,
    posts: initialPosts,
    activeTab = "photos",
}: UserPostsProps) {
    const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(!initialPosts && Boolean(userId));
    const [error, setError] = useState(false);

    useEffect(() => {
        // if posts are already passed as props, no need to fetch again
        if (initialPosts || !userId) {
            return;
        }

        let isMounted = true;
        async function loadPosts() {
            try {
                setIsLoading(true);
                setError(false);

                const res = await fetchUserPosts(userId!);

                if (!isMounted) return;

                if (!res.ok || !res.data) {
                    console.error("Erreur récupération posts :", res);
                    setError(true);
                    return;
                }

                setFetchedPosts(res.data);
            } catch (err) {
                console.error("Erreur lors du chargement des publications :", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadPosts();

        return () => {
            isMounted = false;
        };
    }, [userId, initialPosts]);

    const posts = initialPosts ?? fetchedPosts;

    if (isLoading) {
        return (
            <div className="text-center text-zinc-500 py-10">
                Chargement...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-zinc-500 py-10">
                Impossible de charger les publications.
            </div>
        );
    }

    // filter posts with images and posts without images
    const imagePosts = posts.filter((post) => Boolean(post.imageUrl));
    const textPosts = posts.filter((post) => !post.imageUrl);

    // tab for posts with images (3 columns grid)
    if (activeTab === "photos") {
        if (imagePosts.length === 0) {
            return (
                <div className="text-center text-zinc-500 py-10">
                    Aucune publication avec photo pour le moment.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
                {imagePosts.map((post) => (
                    <Link
                        to={`/posts/${post.id}`}
                        key={post.id}
                        className="aspect-square bg-zinc-800 hover:opacity-80 transition cursor-pointer overflow-hidden block"
                    >
                        <img
                            src={post.imageUrl!}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </Link>
                ))}
            </div>
        );
    }

    // tab for posts without images (stacked one below other with content, like and comments)
    if (textPosts.length === 0) {
        return (
            <div className="text-center text-zinc-500 py-10">
                Aucune publication texte pour le moment.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
            {textPosts.map((post) => (
                <article
                    key={post.id}
                    className="p-4 rounded-xl bg-surface border border-border flex flex-col gap-3 hover:border-zinc-700 transition"
                >
                    {/* Click post text go to detail */}
                    <Link to={`/posts/${post.id}`} className="block group">
                        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line group-hover:text-zinc-200 transition">
                            {post.content || "(Publication sans texte)"}
                        </p>
                        <time className="text-[11px] text-text-tertiary block mt-2">
                            {formatDate(post.createdAt)}
                        </time>
                    </Link>

                    {/* Likes and comments for text post */}
                    <div className="flex items-center space-x-4 text-xs text-text-secondary pt-2 border-t border-border/50">
                        <LikeButton
                            postId={post.id}
                            initialLikeCount={post.likeCount ?? 0}
                        />
                        <Link
                            to={`/posts/${post.id}`}
                            className="flex items-center space-x-1 text-text-secondary hover:text-text-primary cursor-pointer transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-semibold text-text-primary">{post.commentCount ?? 0}</span>
                            <span>{(post.commentCount ?? 0) > 1 ? "commentaires" : "commentaire"}</span>
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default UserPosts;
