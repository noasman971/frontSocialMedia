import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./features/Auth/register/RegisterForm";
import LoginForm from "./features/Auth/login/LoginForm";
import DetailPost from "./features/posts/DetailPost";
import HomePage from "./HomePage.tsx";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/register" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/posts/:id" element={<ProtectedRoute><DetailPost /></ProtectedRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterForm /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
          <Route path="/profile" element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;