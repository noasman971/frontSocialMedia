import { Link } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiPlusSquare,
  FiUser,
  FiZap,
  FiMenu,
} from "react-icons/fi";
import { getCurrentUserId } from "./api";

// sidebar on left for all pages so user can go everywhere
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
    <aside className="hidden md:flex flex-col w-[244px] h-screen sticky top-0 pt-8 pb-4 px-3 border-r border-border shrink-0">
      {/* Click logo go to home */}
      <Link to="/" className="px-3 mb-8 cursor-pointer block text-inherit">
        <span className="text-xl font-bold italic">
          Instagram
        </span>
      </Link>

      {/* Navigation links */}
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
    </aside>
  );
}
