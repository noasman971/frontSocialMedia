import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    fetchUserPosts,
    fetchUserProfile,
    type Post,
    type UserProfile,
} from "./profile.api";
import {getCurrentUserId} from "../../shared/api.ts";

// --------------------------------------------------
// ERREUR
// --------------------------------------------------

export function ProfileError() {
    return (
        <div className="p-8 text-center flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-white">
                Cette page n'est pas disponible.
            </h2>

            <p className="text-zinc-400 text-sm">
                Le lien que vous avez suivi est peut-être rompu,
                ou la page a été supprimée.
            </p>
        </div>
    );
}

// --------------------------------------------------
// HEADER PROFIL
// --------------------------------------------------

interface ProfileHeaderProps {
    user: UserProfile;
    isOwner: boolean;
    postsCount: number;
}

export function ProfileHeader({
    user,
    isOwner,
    postsCount,
}: ProfileHeaderProps) {
    return (
        <header className="flex items-start gap-12 mb-12 px-8">
            {/* Avatar */}
            <div className="w-36 h-36 rounded-full bg-zinc-800 shrink-0" />

            <div className="flex flex-col gap-5 w-full">
                {/* Username + bouton */}
                <div className="flex items-center gap-4">
                    <span className="text-xl font-medium">
                        {user.username}
                    </span>

                    {isOwner ? (
                        <button>Modifier profil</button>
                    ) : (
                        <button>Suivre</button>
                    )}
                </div>

                {/* Statistiques */}
                <div className="flex gap-10 text-base">
                    <span>
                        <span className="font-semibold">
                            {postsCount}
                        </span>{" "}
                        publications
                    </span>

                    <span>
                        <span className="font-semibold">0</span>{" "}
                        abonnés
                    </span>
                </div>

                {/* Bio */}
                <div className="text-sm text-zinc-200">
                    <p>Aucune biographie</p>
                </div>
            </div>
        </header>
    );
}

// --------------------------------------------------
// PUBLICATIONS
// --------------------------------------------------

export function UserPosts({
    userId,
}: {
    userId: string;
}) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadPosts() {
            try {
                setIsLoading(true);
                setError(false);

                const res = await fetchUserPosts(userId);

                console.log("POSTS RESPONSE :", res);

                if (!res.ok || !res.data) {
                    console.error(
                        "Erreur récupération posts :",
                        res
                    );

                    setPosts([]);
                    setError(true);
                    return;
                }

                setPosts(res.data);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des publications :",
                    error
                );

                setPosts([]);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }

        loadPosts();
    }, [userId]);

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

    if (posts.length === 0) {
        return (
            <div className="text-center text-zinc-500 py-10">
                Aucune publication pour le moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="aspect-square bg-zinc-800 hover:opacity-80 transition cursor-pointer overflow-hidden"
                >
                    {post.imageUrl ? (
                        <img
                            src={post.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                            Post {post.id.slice(0, 4)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// --------------------------------------------------
// PAGE
// --------------------------------------------------

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState(false);

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = getCurrentUserId();
        setCurrentUserId(userId);
    }, []);


    useEffect(() => {
        async function loadProfile() {
            if (!id) {
                console.error("Aucun ID utilisateur dans l'URL.");
                setError(true);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(false);

                console.log("Chargement du profil :", id);

                const profileRes = await fetchUserProfile(id);

                console.log(
                    "PROFILE RESPONSE :",
                    profileRes
                );

                if (!profileRes.ok || !profileRes.data) {
                    console.error(
                        "Erreur lors de la récupération du profil :",
                        profileRes
                    );

                    setUser(null);
                    setError(true);
                    return;
                }

                setUser(profileRes.data);

                // Charger les publications
                const postsRes = await fetchUserPosts(id);

                console.log(
                    "POSTS RESPONSE :",
                    postsRes
                );

                if (postsRes.ok && postsRes.data) {
                    setPosts(postsRes.data);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                console.error(
                    "Erreur inattendue :",
                    err
                );

                setUser(null);
                setPosts([]);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-8 text-center text-zinc-400">
                Chargement...
            </div>
        );
    }

    if (error || !user) {
        return <ProfileError />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto pt-8 px-4 text-white">
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

            <ProfileHeader
                user={user}
                isOwner={currentUserId === user.id}
                postsCount={posts.length}
            />

            {/* Onglets */}
            <div className="border-t border-zinc-800 flex justify-center gap-12 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                <span className="text-white border-t border-white pt-4 -mt-px flex items-center gap-2 cursor-pointer">
                    <span className="text-lg">▦</span>
                    Publications
                </span>
            </div>

            {/* Publications */}
            <div className="mt-4">
                <UserPosts userId={user.id} />
            </div>
        </div>
    );
}
