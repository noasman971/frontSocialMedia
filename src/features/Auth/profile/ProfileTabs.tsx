import { FiGrid, FiFileText } from "react-icons/fi";

interface ProfileTabsProps {
    activeTab: "photos" | "texts";
    onTabChange: (tab: "photos" | "texts") => void;
}

// tabs to switch between photo grid and text posts with react-icons
export function ProfileTabs({
    activeTab,
    onTabChange,
}: ProfileTabsProps) {
    return (
        <div className="border-t border-zinc-800 flex justify-center gap-12 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            <button
                type="button"
                onClick={() => onTabChange("photos")}
                className={`pt-4 -mt-px flex items-center gap-2 cursor-pointer transition ${
                    activeTab === "photos"
                        ? "text-white border-t border-white"
                        : "hover:text-zinc-300 border-t border-transparent"
                }`}
            >
                <FiGrid className="w-4 h-4" />
                <span>Publications</span>
            </button>

            <button
                type="button"
                onClick={() => onTabChange("texts")}
                className={`pt-4 -mt-px flex items-center gap-2 cursor-pointer transition ${
                    activeTab === "texts"
                        ? "text-white border-t border-white"
                        : "hover:text-zinc-300 border-t border-transparent"
                }`}
            >
                <FiFileText className="w-4 h-4" />
                <span>Textes</span>
            </button>
        </div>
    );
}

export default ProfileTabs;
