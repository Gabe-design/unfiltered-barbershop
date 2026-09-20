/**
 * One-off: remove the test bookings made on 2026-05-14 (all for the same slot, tester
 * emails) and hide the "BigG" test barber from the public site before launch.
 *
 *   npx ts-node --compiler-options {"module":"CommonJS"} prisma/remove-test-data.ts
 *
 * Add --dry-run to print what would change without writing anything.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEST_BOOKINGS_CREATED_FROM = new Date("2026-05-14T00:00:00Z");
const TEST_BOOKINGS_CREATED_TO = new Date("2026-05-15T00:00:00Z");
const TEST_BARBER_NAME = "BigG";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const verb = dryRun ? "would " : "";

  // Test bookings
  const bookings = await prisma.booking.findMany({
    where: { createdAt: { gte: TEST_BOOKINGS_CREATED_FROM, lt: TEST_BOOKINGS_CREATED_TO } },
    select: { id: true, createdAt: true, customerEmail: true, status: true },
    orderBy: { createdAt: "asc" },
  });

  if (bookings.length === 0) {
    console.log("ok     no test bookings left");
  } else {
    for (const b of bookings) {
      console.log(`${verb}delete booking ${b.id} (${b.createdAt.toISOString()}, ${b.status}, ${b.customerEmail})`);
    }
    if (!dryRun) {
      const ids = bookings.map((b) => b.id);
      // Referral.bookingId is optional and does not cascade — detach first.
      await prisma.referral.updateMany({ where: { bookingId: { in: ids } }, data: { bookingId: null } });
      // BookingItem, ReviewRequest and RebookingReminder cascade on delete.
      const { count } = await prisma.booking.deleteMany({ where: { id: { in: ids } } });
      console.log(`deleted ${count} booking(s)`);
    }
  }

  // Test barber
  const barber = await prisma.barber.findFirst({
    where: { name: { equals: TEST_BARBER_NAME, mode: "insensitive" } },
    select: { id: true, name: true, slug: true, isActive: true },
  });

  if (!barber) {
    console.log(`skip   barber "${TEST_BARBER_NAME}": not in database`);
  } else if (!barber.isActive) {
    console.log(`ok     barber ${barber.name} (${barber.slug}) is already inactive`);
  } else {
    console.log(`${verb}deactivate barber ${barber.name} (${barber.slug})`);
    if (!dryRun) {
      await prisma.barber.update({ where: { id: barber.id }, data: { isActive: false } });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
