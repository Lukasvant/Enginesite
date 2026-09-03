import { redirect } from "next/navigation";
import { createSession } from "@/app/lib/auth";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    const ok = await createSession(password);
    if (ok) redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <form action={login} className="bg-white p-8 rounded-lg shadow-sm border border-stone-200 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Jubileum Engine</h1>
        <p className="text-stone-500 mb-6">Admin login</p>
        <label className="block text-sm font-medium mb-1">Wachtwoord</label>
        <input
          type="password"
          name="password"
          required
          className="w-full border border-stone-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
        <button
          type="submit"
          className="w-full bg-stone-900 text-white py-2 rounded hover:bg-stone-800 transition"
        >
          Inloggen
        </button>
      </form>
    </main>
  );
}
