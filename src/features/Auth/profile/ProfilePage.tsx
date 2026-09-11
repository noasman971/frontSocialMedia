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

export { ProfileHeader, ProfileError } from "./ProfileHeader";
export { ProfileTabs } from "./ProfileTabs";
export { UserPosts } from "./UserPosts";

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const currentUserId = getCurrentUserId();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<"photos" | "texts">("photos");

    const [state, setState] = useState<
        State<{ user: UserProfile; posts: Post[] }>
    >({
        status: "loading",
    });

    useEffect(() => {
        if (!id) {
            return;
        }

        const userId = id;

        async function loadProfile() {
            try {
                console.log("Chargement du profil :", userId);

                const profileRes = await fetchUserProfile(userId);

                console.log(
                    "PROFILE RESPONSE :",
                    profileRes
                );

                if (!profileRes.ok || !profileRes.data) {
                    console.error(
                        "Erreur lors de la récupération du profil :",
                        profileRes
                    );

                    setState({
                        status: "error",
                        message: "Cette page n'est pas disponible.",
                    });
                    return;
                }

                const postsRes = await fetchUserPosts(userId);

                console.log(
                    "POSTS RESPONSE :",
                    postsRes
                );

                const posts =
                    postsRes.ok && postsRes.data
                        ? postsRes.data
                        : [];

                setState({
                    status: "success",
                    data: {
                        user: profileRes.data,
                        posts,
                    },
                });
            } catch (err) {
                console.error(
                    "Erreur inattendue :",
                    err
                );

                setState({
                    status: "error",
                    message: "Cette page n'est pas disponible.",
                });
            }
        }

        loadProfile();
    }, [id]);

    if (!id) {
        return <ProfileError />;
    }

    switch (state.status) {
        case "loading":
            return (
                <div className="p-8 text-center text-zinc-400">
                    Chargement...
                </div>
            );

        case "error":
            return <ProfileError />;

        case "empty":
            return <ProfileError />;

        case "success":
            return (
                <div className="w-full max-w-4xl mx-auto pt-8 px-4 text-white">
                    <button
                        type="button"
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
                        user={state.data.user}
                        isOwner={currentUserId === state.data.user.id}
                        postsCount={state.data.posts.length}
                    />

                    <ProfileTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <div className="mt-4">
                        <UserPosts userId={state.data.user.id} posts={state.data.posts} activeTab={activeTab} />
                    </div>
                </div>
            );

        default: {
            const _exhaustive: never = state;
            return _exhaustive;
        }
    }
}