"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupprimerBouton({
  url,
  confirmation,
}: {
  url: string;
  confirmation: string;
}) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  async function supprimer() {
    if (!window.confirm(confirmation)) return;

    setChargement(true);
    setErreur("");

    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const corps = await res.json().catch(() => null);
        setErreur(corps?.error ?? "La suppression a échoué. Réessayez.");
        setChargement(false);
        return;
      }
      router.refresh();
    } catch {
      setErreur("Problème de connexion. Réessayez.");
      setChargement(false);
    }
  }

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={supprimer}
        disabled={chargement}
        className="min-h-11 px-3 text-sm font-bold text-alerte underline disabled:opacity-50"
      >
        {chargement ? "Suppression..." : "Supprimer"}
      </button>
      {erreur && <p role="alert" className="max-w-56 text-xs text-alerte">{erreur}</p>}
    </div>
  );
}