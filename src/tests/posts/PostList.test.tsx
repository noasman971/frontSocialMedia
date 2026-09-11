import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

import { server } from "../mocks/server.ts";

import {
    loadingPostsHandler,
    errorPostsHandler,
    emptyPostsHandler,
    successPostsHandler,
    invalidPostsHandler,
} from "../mocks/handlers.ts";
import {PostList} from "../../features/posts/PostList.tsx";

function renderPostList() {
    return render(
        <MemoryRouter>
            <PostList />
        </MemoryRouter>
    );
}

describe("PostList", () => {
    test("affiche le chargement", () => {
        server.use(loadingPostsHandler);

        renderPostList();

        expect(
            screen.getByText(/chargement des publications/i)
        ).toBeInTheDocument();
    });

    test("affiche une erreur si l'API échoue", async () => {
        server.use(errorPostsHandler);

        renderPostList();

        expect(
            await screen.findByRole("alert")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/erreur http 500/i)
        ).toBeInTheDocument();
    });

    test("affiche un message si aucun post n'existe", async () => {
        server.use(emptyPostsHandler);

        renderPostList();

        expect(
            await screen.findByText(/aucun post pour le moment/i)
        ).toBeInTheDocument();
    });

    test("affiche les posts lorsque l'API répond correctement", async () => {
        server.use(successPostsHandler);

        renderPostList();

        expect(
            await screen.findByText("Mon premier post de test")
        ).toBeInTheDocument();

        expect(
            screen.getAllByText("badis")
        ).toHaveLength(2);
    });

    test("affiche une erreur si la réponse API ne respecte pas le schéma Zod", async () => {
        server.use(invalidPostsHandler);

        renderPostList();

        expect(
            await screen.findByRole("alert")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/zod thinks there's something wrong/i)
        ).toBeInTheDocument();
    });
});