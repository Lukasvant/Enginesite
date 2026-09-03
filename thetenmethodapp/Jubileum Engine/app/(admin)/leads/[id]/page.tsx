export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getLead } from "@/app/actions/leads";
import LeadDetailPage from "@/app/components/LeadDetail";

export default async function LeadPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id);
  if (!lead) notFound();
  return <LeadDetailPage lead={lead} />;
}
