"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const classeChamp =
  "min-h-13 w-full rounded-xl border-[1.5px] border-contour bg-white px-4 text-base text-encre focus:border-vert focus:outline-none";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const estInscription = mode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (estInscription && nom.trim().length < 2) {
      setError("Entrez votre nom (au moins 2 caractères).");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Entrez une adresse email valide.");
      return;
    }
    if (estInscription && motDePasse.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (motDePasse.length === 0) {
      setError("Entrez votre mot de passe.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), email: email.trim(), motDePasse }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Une erreur est survenue");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-100 flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {estInscription ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mt-1.5 text-[15px] text-doux">
          {estInscription ? "C'est gratuit, et ça prend une minute." : "Content de vous revoir."}
        </p>
      </div>

      {estInscription && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nom" className="text-sm font-bold">
            Votre nom
          </label>
          <input
            id="nom"
            type="text"
            autoComplete="name"
            className={classeChamp}
            placeholder="Ahli"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-bold">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={classeChamp}
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mdp" className="text-sm font-bold">
          Mot de passe
        </label>
        <div className="flex gap-2">
          <input
            id="mdp"
            type={visible ? "text" : "password"}
            autoComplete={estInscription ? "new-password" : "current-password"}
            className={`${classeChamp} min-w-0 flex-1`}
            placeholder="8 caractères minimum"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-pressed={visible}
            className="min-h-13 shrink-0 rounded-xl border-[1.5px] border-contour px-4 text-sm font-bold"
          >
            {visible ? "Masquer" : "Afficher"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-alerte-fond px-4 py-3 text-sm font-semibold text-alerte"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="min-h-13 w-full rounded-xl bg-vert text-base font-bold text-white disabled:opacity-60"
      >
        {loading ? "Patientez..." : estInscription ? "Créer mon compte" : "Se connecter"}
      </button>

      <p className="text-center text-[15px] text-doux">
        {estInscription ? (
          <>
            Déjà un compte ?{" "}
            <Link href="/login" className="font-bold text-vert-texte underline">
              Se connecter
            </Link>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-bold text-vert-texte underline">
              Créer un compte
            </Link>
          </>
        )}
      </p>
    </form>
  );
}