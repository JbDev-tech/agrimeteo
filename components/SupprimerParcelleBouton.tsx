"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupprimerParcelleBouton({ id, nom }: { id: number; nom: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  async function supprimer() {
    const ok = window.confirm(
      `Supprimer « ${nom} » ? Ses cycles, relevés et conseils seront aussi supprimés.`,
    );
    if (!ok) return;

    setChargement(true);
    setErreur("");

    try {
      const res = await fetch(`/api/parcelles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setErreur("La suppression a échoué. Réessayez.");
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
      {erreur && <p className="text-xs text-alerte">{erreur}</p>}
    </div>
  );
}