CREATE TABLE "DailyOutreachBatch" (
  "id" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DailyOutreachBatch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyOutreachItem" (
  "id" TEXT NOT NULL,
  "batchId" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DailyOutreachItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DailyOutreachBatch_date_key" ON "DailyOutreachBatch"("date");
CREATE UNIQUE INDEX "DailyOutreachItem_batchId_leadId_key" ON "DailyOutreachItem"("batchId", "leadId");
CREATE INDEX "DailyOutreachItem_companyId_idx" ON "DailyOutreachItem"("companyId");

ALTER TABLE "DailyOutreachItem" ADD CONSTRAINT "DailyOutreachItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "DailyOutreachBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DailyOutreachItem" ADD CONSTRAINT "DailyOutreachItem_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DailyOutreachItem" ADD CONSTRAINT "DailyOutreachItem_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
