import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingReminderSms } from "@/lib/sms";
import { parseDateOnly, shopDateTimeToInstant, shopNow } from "@/lib/utils";

// Vercel sends Authorization: Bearer <CRON_SECRET> with every cron invocation.
// Set CRON_SECRET in your Vercel env vars to protect this endpoint.
function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // not configured — allow (dev only)
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Find bookings whose appointment falls 11–13 hours from now (2h window, runs hourly)
  const windowStart = new Date(now.getTime() + 11 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 13 * 60 * 60 * 1000);

  // Broad date filter (the shop-local calendar days the window touches), then refine in JS
  const candidates = await prisma.booking.findMany({
    where: {
      smsReminder: true,
      smsReminderSent: false,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      date: {
        gte: parseDateOnly(shopNow(windowStart).dateStr)!,
        lte: parseDateOnly(shopNow(windowEnd).dateStr)!,
      },
    },
    include: { barber: { select: { name: true } } },
  });

  const toRemind = candidates.filter((b) => {
    const apptTime = shopDateTimeToInstant(b.date, b.startTime);
    return apptTime >= windowStart && apptTime <= windowEnd;
  });

  const results = await Promise.allSettled(
    toRemind.map(async (booking) => {
      await sendBookingReminderSms({
        customerPhone: booking.customerPhone,
        customerName: booking.customerName,
        date: booking.date,
        startTime: booking.startTime,
        barberName: booking.barber?.name,
      });
      await prisma.booking.update({
        where: { id: booking.id },
        data: { smsReminderSent: true },
      });
      return booking.id;
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`[SMS Reminders] sent=${sent} failed=${failed}`);
  return NextResponse.json({ sent, failed, checked: toRemind.length });
}
