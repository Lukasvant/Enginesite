export const dynamic = "force-dynamic";

import { seedDemoData } from "@/app/actions/seed";
import Link from "next/link";

export default async function SetupPage() {
  const result = await seedDemoData();

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100 p-6">
      <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Setup</h1>
        <p className="text-stone-600 mb-6">{result.message}</p>
        {result.created > 0 && (
          <p className="text-sm text-stone-500 mb-6">
            Demo company: {result.companyId} · Lead: {result.leadId}
          </p>
        )}
        <Link href="/login" className="block bg-stone-900 text-white text-center py-2 rounded hover:bg-stone-800">
          Ga naar login
        </Link>
      </div>
    </main>
  );
}
