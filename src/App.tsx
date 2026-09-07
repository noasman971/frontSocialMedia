import { PostList } from "./features/posts/PostList";

function App() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Liste des posts</h1>
      <PostList />
    </main>
  );
}

export default App;
