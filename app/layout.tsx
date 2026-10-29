import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getUser } from "@/lib/auth";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "AgriMétéo",
  description: "La météo de vos parcelles et des conseils adaptés à vos cultures.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="fr" className="h-full">
      <body className={`${figtree.variable} min-h-full antialiased`}>
        {user ? (
          <div className="flex min-h-screen">
            <Sidebar nom={user.nom} />
            <main className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>
          </div>
        ) : (
          children
        )}
        <Analytics />
      </body>
    </html>
  );
}