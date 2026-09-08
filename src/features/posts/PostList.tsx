import { usePosts } from "./usePosts";
import { useNavigate } from "react-router-dom";

export function PostList() {
    const navigate = useNavigate();
    const gotoDetail = (id: string) => {
        navigate(`/posts/${id}`);
    };

    const state = usePosts();

    switch (state.status) {
        case "loading":
            return <p>Chargement...</p>;

        case "error":
            return <p role="alert">Erreur : {state.message}</p>;

        case "empty":
            return <p>Aucun post pour le moment.</p>;

        case "success":
            return (
                <ul>
                    {state.data.map((post) => (
                        <>
                            <li key={post.id}>
                                <strong>@{post.author.username}</strong>: {post.content}
                            </li>
                            <button onClick={() => gotoDetail(post.id)}>
                                Voir les détails
                            </button>
                        </>
                    ))}
                </ul>
            );

        default: {
            const _exhaustive: never = state;
            return _exhaustive;
        }
    }
}
