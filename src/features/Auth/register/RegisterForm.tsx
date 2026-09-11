import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./register.api";


interface FormErrors {
  email?: string;
  password?: string;
  username?: string;
  general?: string;
}

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success" };

function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<State>({ status: "empty" });

  // CHeck if all data is valid
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

    // username
    if (!username.trim()) {
      newErrors.username = "Le nom d'utilisateur est obligatoire.";
    } else if (username.trim().length < 3) {
      newErrors.username =
        "Le nom d'utilisateur doit contenir au moins 3 caractères.";
    } else if (username.trim().length > 30) {
      newErrors.username =
        "Le nom d'utilisateur ne peut pas dépasser 30 caractères.";
    }

    // password
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
    setState({ status: "empty" });

    // Validation FRONT
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setState({ status: "loading" });

      const res = await registerUser({
        email: email.trim(),
        password,
        username: username.trim(),
      });

      if (!res.ok) {
        if (res.error.toLowerCase().includes("email")) {
          const message = "Cette adresse email est déjà utilisée.";

          setState({ status: "error", message });
          setErrors({ email: message });
        } else {
          setState({ status: "error", message: res.error });
          setErrors({ general: res.error });
        }
        return;
      }

      setState({
        status: "success",
        data: null,
      });

      setPassword("");

      // redirect to home page after registration
      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch {
      const message = "Une erreur inattendue est survenue. Réessaie plus tard.";

      setState({ status: "error", message });

      setErrors({
        general: message,
      });
    }
  };


  return (
    <main className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[380px] space-y-4">
        {/* Card Formulaire */}
        <section className="bg-surface border border-border rounded-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Instagram
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              Inscris-toi pour voir les photos et vidéos de tes amis.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div
                role="alert"
                className="p-3 bg-red-950/40 border border-error/40 text-error rounded-lg text-xs text-center"
              >
                {errors.general}
              </div>
            )}

            {(() => {
              switch (state.status) {
                case "success":
                  return (
                    <div
                      role="status"
                      className="p-3 bg-green-950/40 border border-green-500/40 text-green-400 rounded-lg text-xs text-center"
                    >
                      Ton compte a bien été créé ! Redirection...
                    </div>
                  );
                case "loading":
                  return null;
                case "error":
                  return null;
                case "empty":
                  return null;
                default: {
                  const _exhaustive: never = state;
                  return _exhaustive;
                }
              }
            })()}

            {/* EMAIL */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs text-text-secondary">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={`w-full px-3 py-2 bg-elevated border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary transition ${errors.email ? "border-error" : "border-border"
}`}
              />
              {errors.email && (
                <p className="text-[11px] text-error">{errors.email}</p>
              )}
            </div>

            {/* USERNAME */}
            <div className="space-y-1">
              <label htmlFor="username" className="text-xs text-text-secondary">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                placeholder="Ton pseudo"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                aria-invalid={Boolean(errors.username)}
                className={`w-full px-3 py-2 bg-elevated border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary transition ${errors.username ? "border-error" : "border-border"
}`}
              />
              {errors.username && (
                <p className="text-[11px] text-error">{errors.username}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs text-text-secondary">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="Minimum 8 caractères"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                autoComplete="new-password"
                className={`w-full px-3 py-2 bg-elevated border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary transition ${errors.password ? "border-error" : "border-border"
}`}
              />
              {errors.password && (
                <p className="text-[11px] text-error">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={state.status === "loading"}
              className="w-full py-2.5 px-4 bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition cursor-pointer"
            >
              {(() => {
                switch (state.status) {
                  case "loading":
                    return "Création du compte...";
                  case "error":
                    return "S'inscrire";
                  case "empty":
                    return "S'inscrire";
                  case "success":
                    return "S'inscrire";
                  default: {
                    const _exhaustive: never = state;
                    return _exhaustive;
                  }
                }
              })()}
            </button>
          </form>
        </section>

        {/* Card Redirection Login */}
        <section className="bg-surface border border-border rounded-xl p-4 text-center text-xs text-text-secondary">
          Tu as déjà un compte ?{" "}
          <Link to="/login" className="text-btn-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </section>

        {/* We cannot go to "/" if we are not logged in */}
        {/* <div className="text-center">
          <Link to="/" className="text-xs text-text-tertiary hover:text-text-secondary">
            Retour à l'accueil
          </Link>
        </div> */}
      </div>
    </main>
  );
}

export default RegisterForm;
