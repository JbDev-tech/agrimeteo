import { exigerUser } from "@/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await exigerUser();
  return <>{children}</>;
}