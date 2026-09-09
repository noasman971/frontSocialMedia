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





export  function RightSidebar() {
    const suggestions = [
        { id: 1, user: "coolerhand_luke", desc: "Suggestions" },
        { id: 2, user: "Gabrimi", desc: "Suivi(e) par a_rnx + 3 autres" },
        { id: 3, user: "Le Grenier Café B...", desc: "Suivi(e) par eliaducrocq + 1 a..." },
        { id: 4, user: "By", desc: "Suivi(e) par a_rnx + 2 autres" },
        { id: 5, user: "yoshhh", desc: "Suggestions" },
    ];

    return (
        <div className="hidden lg:flex flex-col w-[320px] pt-8 pl-8">
            {/* Ton Profil actuel */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700" />
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold text-white">xhuriken</span>
                    </div>
                </div>
                <button className="text-xs font-semibold text-blue-500 hover:text-white transition">
                    Basculer
                </button>
            </div>

            {/* En-tête Suggestions */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-zinc-400">Suggestions pour vous</span>
                <button className="text-xs font-semibold text-white hover:text-zinc-300 transition">
                    Voir tout
                </button>
            </div>

            {/* Liste des Suggestions */}
            <div className="flex flex-col gap-4 mb-8">
                {suggestions.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700" />
                            <div className="flex flex-col">
                <span className="text-sm font-semibold text-white hover:text-zinc-300">
                  {item.user}
                </span>
                                <span className="text-xs text-zinc-400 truncate w-[140px]">
                  {item.desc}
                </span>
                            </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-500 hover:text-white transition">
                            Suivre
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer liens */}
            <div className="text-[11px] text-zinc-500 flex flex-col gap-4 mt-2">
                <p className="leading-relaxed cursor-pointer">
                    À propos · Aide · Presse · API · Emplois · Confidentialité · Conditions · Lieux · Langue · Meta Verified
                </p>
                <p className="uppercase">© 2026 INSTAGRAM FROM META</p>
            </div>
        </div>
    );
}




export function LeftSidebar() {
    const menuItems = [
        { name: "Accueil", icon: "🏠" },
        { name: "Recherche", icon: "🔍" },
        { name: "Reels", icon: "🎬" },
        { name: "Messages", icon: "💬" },
        { name: "Notifications", icon: "❤️" },
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
        <div className="min-h-screen bg-bg text-text-primary flex justify-center">

            {/* Conteneur principal élargi pour 3 colonnes */}
            <div className="flex w-full max-w-300 justify-between gap-8">

                {/* 1. Colonne de gauche (Menu) */}
                <LeftSidebar />

                {/* 2. Colonne centrale (Feed) */}
                <main className="w-full max-w-157.5 pt-8 px-4 flex flex-col">
                    <Header />

                    <section className="py-4 border-b border-border">
                        <div className="text-xs text-text-secondary"></div>
                    </section>

                    <section className="pt-4">
                        <PostList />
                    </section>
                </main>

                {/* 3. Colonne de droite (Suggestions) */}
                <RightSidebar />

            </div>

        </div>
    );
}








