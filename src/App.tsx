import { PostList } from "./features/posts/PostList";

function App() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Liste des posts</h1>
      <PostList />

        <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </main>
  );
}

export default App;
