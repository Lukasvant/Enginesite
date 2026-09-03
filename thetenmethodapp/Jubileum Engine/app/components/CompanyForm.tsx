"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompany, updateCompany, importCompaniesCsv } from "@/app/actions/companies";

const EMPLOYEE_SIZES = ["", "1-10", "10-50", "50-250", "250-500", "500+"];
const STATUSES = ["ACTIVE", "INACTIVE", "BANKRUPT", "ACQUIRED", "MERGED"];

export function CompanyForm({ company }: { company?: any }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const data = Object.fromEntries(formData.entries()) as any;
    const payload = {
      name: data.name,
      domain: data.domain,
      website: data.website,
      city: data.city,
      province: data.province,
      industry: data.industry,
      employeeSize: data.employeeSize,
      foundationYear: data.foundationYear ? parseInt(data.foundationYear) : undefined,
      foundationDate: data.foundationDate,
      foundationConfidence: data.foundationConfidence ? parseFloat(data.foundationConfidence) : undefined,
      foundationEvidence: data.foundationEvidence,
      status: data.status,
      notes: data.notes,
    };

    if (company?.id) {
      await updateCompany(company.id, payload);
    } else {
      await createCompany(payload);
    }
    setPending(false);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Naam *" name="name" defaultValue={company?.name} required />
        <Field label="Website" name="website" defaultValue={company?.website} />
        <Field label="Domein" name="domain" defaultValue={company?.domain} />
        <Field label="Plaats" name="city" defaultValue={company?.city} />
        <Field label="Provincie" name="province" defaultValue={company?.province} />
        <Field label="Branche" name="industry" defaultValue={company?.industry} />
        <Select label="Medewerkers" name="employeeSize" options={EMPLOYEE_SIZES} defaultValue={company?.employeeSize} />
        <Select label="Status" name="status" options={STATUSES} defaultValue={company?.status ?? "ACTIVE"} />
        <Field label="Oprichtingsjaar" name="foundationYear" type="number" defaultValue={company?.foundationYear} />
        <Field label="Oprichtingsdatum" name="foundationDate" type="date" defaultValue={company?.foundationDate} />
        <Field label="Betrouwbaarheid (0-1)" name="foundationConfidence" type="number" step="0.1" defaultValue={company?.foundationConfidence ?? 0.5} />
        <Field label="Bronvermelding" name="foundationEvidence" defaultValue={company?.foundationEvidence} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notities</label>
        <textarea name="notes" defaultValue={company?.notes} rows={3} className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-stone-900 text-white px-4 py-2 rounded hover:bg-stone-800 disabled:opacity-50"
      >
        {pending ? "Opslaan..." : company ? "Bijwerken" : "Toevoegen"}
      </button>
    </form>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full border border-stone-300 rounded px-3 py-2" />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select {...props} className="w-full border border-stone-300 rounded px-3 py-2">
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o || "—"}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CsvImport() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const file = formData.get("csv") as File;
    const text = await file.text();
    await importCompaniesCsv(text);
    setPending(false);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="file" name="csv" accept=".csv" required className="w-full" />
      <p className="text-xs text-stone-500">
        Verwachte kolommen: name, website, city, province, industry, employeeSize, foundationYear
      </p>
      <button
        type="submit"
        disabled={pending}
        className="bg-stone-900 text-white px-4 py-2 rounded hover:bg-stone-800 disabled:opacity-50"
      >
        {pending ? "Importeren..." : "Importeer CSV"}
      </button>
    </form>
  );
}
