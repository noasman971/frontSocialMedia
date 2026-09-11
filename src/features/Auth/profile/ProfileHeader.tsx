import type { UserProfile } from "./profile.api";

// show error when profile is broken or user not found
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

interface ProfileHeaderProps {
    user: UserProfile;
    isOwner: boolean;
    postsCount: number;
}

// header with avatar, user stats, and action button
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

export default ProfileHeader;
