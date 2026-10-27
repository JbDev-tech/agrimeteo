import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function Home() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold text-green-700">🌾 AgriMétéo</h1>
      <p className="max-w-md text-gray-600">
        Suivez vos parcelles et vos cultures, consultez la météo et recevez des conseils adaptés chaque jour.
      </p>
      <div className="flex gap-3">
        <Link href="/register" className="rounded-lg bg-green-600 px-5 py-2 text-white">
          Créer un compte
        </Link>
        <Link href="/login" className="rounded-lg border border-green-600 px-5 py-2 text-green-700">
          Connexion
        </Link>
      </div>
    </div>
  );
}