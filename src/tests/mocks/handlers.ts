import { delay, http, HttpResponse } from "msw";

export const loadingPostsHandler = http.get("/api/posts", async () => {
    await delay("infinite");

    return HttpResponse.json([]);
});

export const errorPostsHandler = http.get("/api/posts", () => {
    return HttpResponse.json(
        { error: "Erreur serveur" },
        { status: 500 }
    );
});

export const emptyPostsHandler = http.get("/api/posts", () => {
    return HttpResponse.json([]);
});

export const successPostsHandler = http.get("/api/posts", () => {
    return HttpResponse.json([
        {
            id: "post-1",
            content: "Mon premier post de test",
            imageUrl: null,
            created_at: "2026-09-11T08:00:00.000Z",
            author: {
                id: "user-1",
                username: "badis"
            },
            likeCount: 2,
            commentCount: 1
        }
    ]);
});

export const invalidPostsHandler = http.get("/api/posts", () => {
    return HttpResponse.json([
        {
            id: 123,
            content: null
        }
    ]);
});

export const handlers = [
    emptyPostsHandler,

    http.post("/api/login", () => {
        return HttpResponse.json({
            token: "fake-token",
        });
    }),
];