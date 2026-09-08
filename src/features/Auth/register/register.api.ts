export interface RegisterPayload {
    email: string;
    password: string;
    username: string;
}
export interface RegisterResponse {
    id: number;
    email: string;
    username: string;
}
export interface RegisterApiErrors {
    email?: string;
    password?: string;
    username?: string;
    general?: string;
}
export class RegisterApiError extends Error {
    errors: RegisterApiErrors;

    constructor(errors: RegisterApiErrors) {
        super("Erreur lors de l'inscription");
        this.errors = errors;
    }
}
export async function registerUser(
    data: RegisterPayload
): Promise<RegisterResponse> {

    // Simulation du délai d'une API
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (data.email === "test@test.fr") {
        throw new RegisterApiError({
            email: "Cette adresse email est déjà utilisée.",
        });
    }
    if (data.username.toLowerCase() === "admin") {
        throw new RegisterApiError({
            username: "Ce nom d'utilisateur est déjà utilisé.",
        });
    }


    return {
        id: Date.now(),
        email: data.email,
        username: data.username,
    };
}