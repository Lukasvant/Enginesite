require("dotenv").config();
const { execSync } = require("child_process");

function run(command) {
  execSync(command, { stdio: "inherit" });
}

console.log("Running prisma generate...");
run("npx prisma generate");

// Only production Vercel builds may migrate; previews can share the production database.
// Locally we skip migrate deploy so `npm run build` works without a local Postgres.
const isVercel = process.env.VERCEL === "1";
const isCi = process.env.CI === "true" || process.env.CI === "1";
const dbUrl = process.env.DATABASE_URL || "";
const isPostgres = dbUrl.startsWith("postgresql") || dbUrl.startsWith("postgres");

const mayMigrate = (isVercel && process.env.VERCEL_ENV === "production") || (!isVercel && isCi);
if (mayMigrate && isPostgres) {
  console.log("Running prisma migrate deploy...");
  run("npx prisma migrate deploy");
} else {
  console.log("Skipping prisma migrate deploy (only runs automatically on Vercel/CI).");
}

console.log("Running next build...");
run("next build");
