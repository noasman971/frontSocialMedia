import { PostList } from "./features/posts/PostList";

// 1. Le sous-composant Header (tu peux le mettre dans un fichier à part si tu veux)
function Header() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/register";
    };

    return (
        <header className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-6">
                <button className="text-base font-bold text-text-primary cursor-pointer border-b-2 border-text-primary pb-1">
                    Pour vous
                </button>
                <button className="text-base font-medium text-text-secondary hover:text-text-primary cursor-pointer pb-1">
                    Suivi(e)
                </button>
            </div>
            <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-elevated hover:bg-stroke text-text-primary text-xs font-semibold rounded-lg transition cursor-pointer"
            >
                Se déconnecter
            </button>
        </header>
    );
}

// 2. Ta HomePage allégée
export default function HomePage() {
    return (
        <div className="min-h-screen bg-bg text-text-primary flex justify-center">
            <main className="w-full max-w-200 pt-8 px-4 flex flex-col">

                <Header />

                <section className="py-4 border-b border-border">
                    <div className="text-xs text-text-secondary"></div>
                </section>

                <section className="pt-4">
                    <PostList />
                </section>

            </main>
        </div>
    );
}