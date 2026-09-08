import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { PostList } from "./features/posts/PostList";
import RegisterForm from "./features/Auth/register/RegisterForm";
import LoginForm from "./features/Auth/login/LoginForm";
import DetailPost from "./features/posts/DetailPost";

// protect routes if user is not logged in
// This is a Route, children will be ReactNode who are inside him (like "<HomePage />")
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  // no token means not authenticated, redirect to register/login
  if (!token) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}

// if we already have token, don't show register/login page again
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function HomePage() {
  // Logout Helper: when we log out, we remove the token and redirect to the login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/register"; // HARDCODED REDIRECTION BRRRRRRR c'était plus simple
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex justify-center">
      {/* Central Column */}
      <main className="w-full max-w-[800px] pt-8 px-4 flex flex-col">
        {/* Header & Navigation */}
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

        {/* Stories block placeholder */}
        <section className="py-4 border-b border-border">
          <div className="text-xs text-text-secondary">
            {/* Story bar placeholder */}
          </div>
        </section>

        {/* Feed Posts */}
        <section className="pt-4">
          <PostList />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Feed (only accessible if logged in) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Single post details page (Story 5) */}
        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <DetailPost />
            </ProtectedRoute>
          }
        />

        {/* Register page (only if not logged in) */}
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterForm />
            </PublicOnlyRoute>
          }
        />

        {/* Login page (only if not logged in) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginForm />
            </PublicOnlyRoute>
          }
        />

        {/* Fallback for unknown routes just in case */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

