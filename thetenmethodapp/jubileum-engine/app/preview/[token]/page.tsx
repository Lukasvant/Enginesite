export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { AnniversaryPreview } from "./AnniversaryPreview";

export const metadata = {
  title: "Een geschiedenis om door te geven · Ambachtio",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({ params }: { params: { token: string } }) {
  const preview = await prisma.preview.findUnique({
    where: { token: params.token },
    include: { company: true },
  });
  if (!preview || !preview.isPublished) notFound();
  const milestones = JSON.parse(preview.milestones || "[]") as { year: number; title: string; description?: string }[];
  return <AnniversaryPreview name={preview.company.name} foundationYear={preview.company.foundationYear} intro={preview.intro ?? "Een eerste verkenning van jullie bedrijfsgeschiedenis, op basis van publieke bronnen."} milestones={milestones} />;
}
