import { http, HttpResponse } from "msw";

export const handlers = [
    http.post("/api/login", () => {
        return HttpResponse.json({
            token: "fake-token",
        });
    }),
];