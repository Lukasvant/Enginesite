import Link from "next/link";
import { requireAuth } from "@/app/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-lg">
            Jubileum Engine
          </Link>
          <nav className="hidden md:flex gap-4 text-sm">
            <Link href="/dashboard" className="hover:text-stone-300">Dashboard</Link>
            <Link href="/companies" className="hover:text-stone-300">Bedrijven</Link>
            <Link href="/leads" className="hover:text-stone-300">Leads</Link>
            <Link href="/previews" className="hover:text-stone-300">Previews</Link>
          </nav>
        </div>
        <form action="/api/logout" method="POST">
          <button type="submit" className="text-sm text-stone-300 hover:text-white">Uitloggen</button>
        </form>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
