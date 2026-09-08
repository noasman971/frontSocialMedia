import { useState } from "react";
import type { FormEvent } from "react";
import "./RegisterForm.css";
import { Link } from "react-router-dom";
import {
    registerUser,
    RegisterApiError,
    type RegisterApiErrors,
} from "./register.api";

interface FormErrors {
    email?: string;
    password?: string;
    username?: string;
    general?: string;
}

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        // EMAIL
        if (!email.trim()) {
            newErrors.email = "L'adresse email est obligatoire.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                newErrors.email = "L'adresse email n'est pas valide.";
            }
        }

        // NOM D'UTILISATEUR
        if (!username.trim()) {
            newErrors.username = "Le nom d'utilisateur est obligatoire.";
        } else if (username.trim().length < 3) {
            newErrors.username =
                "Le nom d'utilisateur doit contenir au moins 3 caractères.";
        } else if (username.trim().length > 30) {
            newErrors.username =
                "Le nom d'utilisateur ne peut pas dépasser 30 caractères.";
        }

        // MOT DE PASSE
        if (!password) {
            newErrors.password = "Le mot de passe est obligatoire.";
        } else if (password.length < 8) {
            newErrors.password =
                "Le mot de passe doit contenir au moins 8 caractères.";
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password =
                "Le mot de passe doit contenir au moins une majuscule.";
        } else if (!/[0-9]/.test(password)) {
            newErrors.password =
                "Le mot de passe doit contenir au moins un chiffre.";
        }

        return newErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrors({});
        setSuccess("");

        // Validation FRONT
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsLoading(true);

            const user = await registerUser({
                email: email.trim(),
                password,
                username: username.trim(),
            });

            console.log("Utilisateur créé :", user);

            setSuccess("Ton compte a bien été créé.");

            /*
             * On vide immédiatement le mot de passe.
             * Il n'est pas conservé dans l'interface.
             */
            setPassword("");
        } catch (error) {
            if (error instanceof RegisterApiError) {
                const apiErrors: RegisterApiErrors = error.errors;

                setErrors(apiErrors);
            } else {
                setErrors({
                    general:
                        "Une erreur inattendue est survenue. Réessaie plus tard.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="register-page">
            <Link to="/" className="back-home">
                ← Retour à l'accueil
            </Link>
            <section className="register-card">
                <div className="register-header">
                    <h1>Créer un compte</h1>

                    <p>
                        Inscris-toi pour rejoindre la plateforme.
                    </p>
                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {errors.general && (
                        <div className="message error-message">
                            {errors.general}
                        </div>
                    )}

                    {success && (
                        <div className="message success-message">
                            {success}
                        </div>
                    )}

                    {/* EMAIL */}
                    <div className="form-group">
                        <label htmlFor="email">
                            Adresse email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="exemple@email.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            aria-invalid={Boolean(errors.email)}
                        />

                        {errors.email && (
                            <span className="field-error">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* USERNAME */}
                    <div className="form-group">
                        <label htmlFor="username">
                            Nom d'utilisateur
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Ton pseudo"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            aria-invalid={Boolean(errors.username)}
                        />

                        {errors.username && (
                            <span className="field-error">
                                {errors.username}
                            </span>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">
                        <label htmlFor="password">
                            Mot de passe
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Minimum 8 caractères"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            aria-invalid={Boolean(errors.password)}
                            autoComplete="new-password"
                        />

                        {errors.password && (
                            <span className="field-error">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Création du compte..."
                            : "S'inscrire"}
                    </button>
                </form>

                <p className="login-link">
                    Tu as déjà un compte ?{" "}
                    <a href="/login">
                        Se connecter
                    </a>
                </p>
            </section>
        </main>
    );
}

export default RegisterForm;