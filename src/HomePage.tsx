import { Link } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiPlusSquare,
  FiUser,
  FiZap,
  FiMenu,
} from "react-icons/fi";

import { PostList } from "./features/posts/PostList";
import { getCurrentUserId } from "./features/shared/api";

import { useState } from "react";
import CreatePostForm from "./features/posts/CreatePostForm";

// Header Component
function Header() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/register";
  };

  return (
    <header className="flex items-center justify-between pb-6 border-b border-border">
      <div className="flex items-center gap-6">
        <button
          className="text-base font-bold text-text-primary cursor-pointer border-b-2 border-text-primary pb-1"
        >
          Pour vous
        </button>

        <button
          className="text-base font-medium text-text-secondary hover:text-text-primary cursor-pointer pb-1"
        >
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
  const currentUserId = getCurrentUserId();

  const menuItems = [
    {
      name: "Accueil",
      icon: FiHome,
      path: "/",
    },
    {
      name: "Recherche",
      icon: FiSearch,
      path: "#",
    },
    {
      name: "Créer",
      icon: FiPlusSquare,
      path: "#",
    },
    {
      name: "Profil",
      icon: FiUser,
      path: currentUserId
        ? `/profile/${currentUserId}`
        : "#",
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-[244px] h-screen sticky top-0 pt-8 pb-4 px-3 border-r border-border">
      {/* Logo */}
      <div className="px-3 mb-8 cursor-pointer">
        <span className="text-xl font-bold italic">
          Instagram
        </span>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              to={item.path}
              key={item.name}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-elevated transition cursor-pointer text-left text-inherit"
            >
              <Icon className="w-6 h-6" />

              <span className="text-base font-normal">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Menu inférieur */}
      <div className="flex flex-col gap-2 mt-auto">
        {/* Autres applications */}
        <button
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-elevated transition cursor-pointer"
        >
          <FiZap className="w-6 h-6" />

          <span className="text-base">
            Autres apps...
          </span>
        </button>

        {/* Plus */}
        <button
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-elevated transition cursor-pointer"
        >
          <FiMenu className="w-6 h-6" />

          <span className="text-base">
            Plus
          </span>
        </button>
      </div>
    </div>
  );
}

// Main HomePage with CreatePostForm and Feed
export default function HomePage() {
  const [feedKey, setFeedKey] = useState(0);

  const handlePostCreated = () => {
    setFeedKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex justify-between w-full">
      {/* Sidebar */}
      <LeftSidebar />

      {/* Contenu principal */}
      <main className="w-full max-w-[800px] pt-8 px-4 flex flex-col mx-auto">
        {/* Header */}
        <Header />

        {/* Create post form */}
        <section className="pt-6">
          <CreatePostForm onPostCreated={handlePostCreated} />
        </section>

        {/* Feed posts */}
        <section className="pt-2">
          <PostList key={feedKey} />
        </section>
      </main>
    </div>
  );
}