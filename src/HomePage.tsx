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







export function LeftSidebar() {
    const menuItems = [
        { name: "Accueil", icon: "🏠" },
        { name: "Recherche", icon: "🔍" },
        { name: "Créer", icon: "➕" },
        { name: "Profil", icon: "👤" },
    ];

    return (
        <div className="hidden md:flex flex-col w-[244px] h-screen sticky top-0 pt-8 pb-4 px-3 border-r border-border">
            {/* Logo (Remplacer par ton vrai logo) */}
            <div className="px-3 mb-8 cursor-pointer">
                <span className="text-xl font-bold italic">Instagram</span>
            </div>

            {/* Menu principal */}
            <div className="flex flex-col gap-2 flex-grow">
                {menuItems.map((item, index) => (
                    <button key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-elevated transition cursor-pointer text-left">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-base font-normal">{item.name}</span>
                    </button>
                ))}
            </div>

            {/* Menu du bas */}
            <div className="flex flex-col gap-2 mt-auto">
                <button className="flex items-center gap-4 p-3 rounded-lg hover:bg-elevated transition cursor-pointer">
                    <span className="text-2xl">⚡</span>
                    <span className="text-base">Autres apps...</span>
                </button>
                <button className="flex items-center gap-4 p-3 rounded-lg hover:bg-elevated transition cursor-pointer">
                    <span className="text-2xl">≡</span>
                    <span className="text-base">Plus</span>
                </button>
            </div>
        </div>
    );
}




// 2. Ta HomePage allégée
// Ta HomePage finale avec les 3 parties
export default function HomePage() {
    return (
        <div className="min-h-screen bg-bg text-text-primary flex justify-between w-full">

            <LeftSidebar />

            <main className="w-full max-w-157.5 pt-8 px-4 flex flex-col mx-auto">
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