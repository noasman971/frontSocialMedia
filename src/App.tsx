import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PostList } from "./features/posts/PostList";
import RegisterForm from "./features/Auth/register/RegisterForm";
import "./App.css";

function HomePage() {
    return (
        <main className="home-page">
            <header className="home-header">
                <h1>Social Media</h1>

                <Link to="/register" className="register-link-button">
                    S'inscrire
                </Link>
            </header>

            <section className="posts-section">
                <h2>Liste des posts</h2>

                <PostList />
            </section>
        </main>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Page principale */}
                <Route path="/" element={<HomePage />} />

                {/* Page inscription */}
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;