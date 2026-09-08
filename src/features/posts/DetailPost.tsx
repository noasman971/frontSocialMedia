import { useDetailsPosts } from "./usePosts";
import { useParams } from "react-router-dom";

export default function DetailPost() {
    const { id } = useParams();
    const state = useDetailsPosts(id);

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
                    <p>{state.data.author?.username ?? "Utilisateur inconnu"}</p>
                </ul>
            );

        default: {
            const _exhaustive: never = state;
            return _exhaustive;
        }
    }
}