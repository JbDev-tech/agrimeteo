import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { Figtree } from "next/font/google";


const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

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
  description: "La météo de vos parcelles et des conseils adaptés à vos cultures.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
<body className={`${figtree.variable} antialiased`}>
  {user ? (
    <div className="flex min-h-screen">
      <Sidebar nom={user.nom} />
      <main className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>
    </div>
  ) : (
    children
  )}
</body>
    </html>
  );
}