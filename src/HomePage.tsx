import { PostList } from "./features/posts/PostList";
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

export { LeftSidebar } from "./features/shared/LeftSidebar";

// Main HomePage with CreatePostForm and Feed
export default function HomePage() {
  const [feedKey, setFeedKey] = useState(0);

  const handlePostCreated = () => {
    setFeedKey((prev) => prev + 1);
  };

  return (
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
  );
}