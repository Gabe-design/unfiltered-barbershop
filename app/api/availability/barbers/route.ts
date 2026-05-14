import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const startTime = searchParams.get("startTime");
  const duration = parseInt(searchParams.get("duration") ?? "60");

  if (!dateStr || !startTime) {
    return NextResponse.json({ error: "date and startTime required" }, { status: 400 });
  }

  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d); // local midnight
  const slotStart = timeToMinutes(startTime);
  const slotEnd = slotStart + duration;

  const [barbers, bookings] = await Promise.all([
    prisma.barber.findMany({ where: { isActive: true }, select: { id: true } }),
    prisma.booking.findMany({
      where: {
        date,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        barberId: { not: null },
      },
      select: { barberId: true, startTime: true, endTime: true },
    }),
  ]);

  const barberAvailability: Record<string, boolean> = {};

  for (const barber of barbers) {
    const conflict = bookings.some((b) => {
      if (b.barberId !== barber.id) return false;
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return slotStart < bEnd && slotEnd > bStart;
    });
    barberAvailability[barber.id] = !conflict;
  }

  return NextResponse.json({ barbers: barberAvailability });
}
