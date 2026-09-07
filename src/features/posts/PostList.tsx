import { usePosts } from "./usePosts";

export function PostList() {
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
                        <li key={post.id}>
                            <strong>@{post.author.username}</strong>: {post.content}
                        </li>
                    ))}
                </ul>
            );

        default: {
            const _exhaustive: never = state;
            return _exhaustive;
        }
    }
}
