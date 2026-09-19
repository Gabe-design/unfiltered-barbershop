/**
 * One-off: align service prices in the database with the shop's live Booksy listing
 * (checked 2026-09-19). `prisma/seed.ts` only creates services that are missing, so
 * existing rows keep their old prices until this runs.
 *
 *   npx ts-node --compiler-options {"module":"CommonJS"} prisma/update-prices.ts
 *
 * Add --dry-run to print the changes without writing them.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRICES: Record<string, number> = {
  "haircut": 50,
  "haircut-enhancement": 55,
  "haircut-design": 60,
  "haircut-beard": 65,
  "beard-trim": 35,
  "shape-up": 20,
  "house-call": 300,
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const services = await prisma.service.findMany({ where: { slug: { in: Object.keys(PRICES) } } });

  for (const slug of Object.keys(PRICES)) {
    const service = services.find((s) => s.slug === slug);
    if (!service) {
      console.log(`skip   ${slug}: not in database`);
      continue;
    }
    const price = PRICES[slug];
    if (service.price === price) {
      console.log(`ok     ${service.name}: $${price}`);
      continue;
    }
    console.log(`${dryRun ? "would " : ""}update ${service.name}: $${service.price} -> $${price}`);
    if (!dryRun) {
      await prisma.service.update({ where: { id: service.id }, data: { price } });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
