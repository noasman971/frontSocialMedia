import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./login.api";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

type State<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; data: T };

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<State<null>>({ status: "empty" });

  // check if all front data is valid
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est obligatoire.";
    }

    return newErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setState({ status: "loading" });

      const res = await loginUser({
        email: email.trim(),
        password,
      });

      if (!res.ok) {
        const message =
          res.error === "Invalid credentials"
            ? "Identifiants invalides."
            : res.error;

        setState({ status: "error", message });
        setErrors({ general: message });
        return;
      }

      setState({ status: "success", data: null });

      // redirect to home
      navigate("/");
    } catch {
      const message = "Une erreur wtf viens de se produire, force";

      setState({ status: "error", message });
      setErrors({
        general: message,
      });
    }
  };

  return (
    <main className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[380px] space-y-4">
        {/* Form Card */}
        <section className="bg-surface border border-border rounded-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Instagram
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              Connecte-toi pour voir les photos et vidéos de tes amis.
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
                className={`w-full px-3 py-2 bg-elevated border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary transition ${errors.email ? "border-error" : "border-border"}`}
              />
              {errors.email && (
                <p className="text-[11px] text-error">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-xs text-text-secondary"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="Ton mot de passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                className={`w-full px-3 py-2 bg-elevated border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary transition ${errors.password ? "border-error" : "border-border"}`}
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
                    return "Connexion en cours...";
                  case "error":
                    return "Se connecter";
                  case "empty":
                    return "Se connecter";
                  case "success":
                    return "Se connecter";
                  default: {
                    const _exhaustive: never = state;
                    return _exhaustive;
                  }
                }
              })()}
            </button>
          </form>
        </section>

        {/* Card Redirection Register */}
        <section className="bg-surface border border-border rounded-xl p-4 text-center text-xs text-text-secondary">
          Tu n'as pas de compte ?{" "}
          <Link
            to="/register"
            className="text-btn-primary font-semibold hover:underline"
          >
            S'inscrire
          </Link>
        </section>
      </div>
    </main>
  );
}

export default LoginForm;
