ALTER TABLE "Company" ADD COLUMN "sourceKvkNumber" TEXT;

CREATE UNIQUE INDEX "Company_sourceKvkNumber_key" ON "Company"("sourceKvkNumber");
