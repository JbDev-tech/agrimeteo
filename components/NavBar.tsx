import Link from "next/link";
import { getUser } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function NavBar() {
  const user = await getUser();

  return (
    <nav className="flex items-center gap-4 border-b p-4">
      <Link href="/" className="font-bold">AgriMétéo</Link>
      {user ? (
        <>
          <Link href="/parcelles">Parcelles</Link>
          <Link href="/cultures">Cultures</Link>
          <Link href="/cycles">Cycles</Link>
          <Link href="/releves">Relevés</Link>
          <span className="ml-auto text-sm">{user.nom}</span>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login" className="ml-auto">Connexion</Link>
          <Link href="/register">Inscription</Link>
        </>
      )}
    </nav>
  );
}