"use client";

import { useRouter } from "next/navigation";
import { createContact, deleteContact } from "@/app/actions/companies";

export function ContactForm({ companyId, contacts }: { companyId: string; contacts: any[] }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData.entries()) as any;
    await createContact(companyId, {
      name: data.name,
      role: data.role,
      email: data.email,
      linkedIn: data.linkedIn,
      isPrimary: data.isPrimary === "on",
    });
    router.refresh();
  }

  return (
    <div>
      <ul className="mb-4 space-y-2">
        {contacts.map((c) => (
          <li key={c.id} className="flex justify-between items-center text-sm border border-stone-100 rounded p-2">
            <div>
              <span className="font-medium">{c.name}</span>
              {c.role && <span className="text-stone-500 ml-2">{c.role}</span>}
              {c.isPrimary && <span className="ml-2 text-xs bg-stone-100 px-1 rounded">primair</span>}
              <div className="text-stone-400 text-xs">{c.email}</div>
            </div>
            <form action={() => deleteContact(c.id, companyId).then(() => router.refresh())}>
              <button type="submit" className="text-red-600 text-xs hover:underline">Verwijder</button>
            </form>
          </li>
        ))}
      </ul>
      <form action={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input name="name" placeholder="Naam" required className="border border-stone-300 rounded px-2 py-1 text-sm" />
          <input name="role" placeholder="Functie" className="border border-stone-300 rounded px-2 py-1 text-sm" />
          <input name="email" placeholder="E-mail" type="email" className="border border-stone-300 rounded px-2 py-1 text-sm" />
          <input name="linkedIn" placeholder="LinkedIn" className="border border-stone-300 rounded px-2 py-1 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input name="isPrimary" type="checkbox" /> Primair contact
        </label>
        <button type="submit" className="bg-stone-900 text-white text-sm px-3 py-1 rounded">Toevoegen</button>
      </form>
    </div>
  );
}
