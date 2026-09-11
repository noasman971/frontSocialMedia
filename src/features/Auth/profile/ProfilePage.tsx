import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchUserPosts,
    fetchUserProfile,
    type Post,
    type UserProfile,
} from "./profile.api";
import { getCurrentUserId } from "../../shared/api.ts";
import { ProfileHeader, ProfileError } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { UserPosts } from "./UserPosts";

// re-export components so imports from ProfilePage keep working
export { ProfileHeader, ProfileError } from "./ProfileHeader";
export { ProfileTabs } from "./ProfileTabs";
export { UserPosts } from "./UserPosts";

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState(false);
    // tab state: photos or texts
    const [activeTab, setActiveTab] = useState<"photos" | "texts">("photos");

    // get current logged user id directly from token
    const currentUserId = getCurrentUserId();
    const navigate = useNavigate();

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

            {/* Profile top section */}
            <ProfileHeader
                user={user}
                isOwner={currentUserId === user.id}
                postsCount={posts.length}
            />

            {/* Profile tabs (photos vs text posts with react icons) */}
            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Publications list / grid */}
            <div className="mt-4">
                <UserPosts userId={user.id} posts={posts} activeTab={activeTab} />
            </div>
        </div>
    );
}
