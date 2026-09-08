import DetailPost from "./features/posts/DetailPost";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {PostList} from "./features/posts/PostList.tsx";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<DetailPost />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
