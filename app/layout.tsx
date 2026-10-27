import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriMétéo",
  description: "Suivi de cultures agricoles avec météo et conseils",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50">
        {user ? (
          <div className="flex min-h-screen">
            <Sidebar nom={user.nom} />
            <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}