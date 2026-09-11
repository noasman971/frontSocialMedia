import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./features/Auth/register/RegisterForm";
import LoginForm from "./features/Auth/login/LoginForm";
import DetailPost from "./features/posts/DetailPost";
import HomePage from "./HomePage.tsx";
import ProfilePage from "./features/Auth/profile/ProfilePage.tsx";
import AppLayout from "./features/shared/AppLayout.tsx";

// Noasman971 a retiré tout mes fucking commentaires wlh
// -4 point pour nono


// protect routes if user is not logged in
// This is a Route, children will be ReactNode who are inside him (like "<HomePage />")
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/register" replace />;
  return <>{children}</>;
}

// if we already have token, don't show register/login page again
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* layout with sidebar for all connected pages */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<DetailPost />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>

          {/* auth pages without sidebar */}
          <Route path="/register" element={<PublicOnlyRoute><RegisterForm /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;