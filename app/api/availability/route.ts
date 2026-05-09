import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots, timeToMinutes, minutesToTime } from "@/lib/utils";
import { format, parse, startOfDay, isSameDay } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const barberId = searchParams.get("barberId");
  const duration = parseInt(searchParams.get("duration") || "60");

  if (!dateStr) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  // Get availability for this day
  const availabilityWhere = barberId
    ? { barberId, dayOfWeek, isActive: true }
    : { dayOfWeek, isActive: true };

  const availabilities = await prisma.barberAvailability.findMany({
    where: availabilityWhere,
    include: { barber: { select: { id: true, name: true, isActive: true } } },
  });

  if (availabilities.length === 0) {
    return NextResponse.json({ slots: [], available: false });
  }

  // Check for blocked dates
  const startOfDate = startOfDay(date);
  const endOfDate = new Date(startOfDate);
  endOfDate.setDate(endOfDate.getDate() + 1);

  const blockedQuery = barberId
    ? { barberId, date: { gte: startOfDate, lt: endOfDate } }
    : { date: { gte: startOfDate, lt: endOfDate } };

  const blockedDates = await prisma.blockedDate.findMany({ where: blockedQuery });

  if (blockedDates.length > 0 && barberId) {
    return NextResponse.json({ slots: [], available: false, reason: "Barber unavailable" });
  }

  // Get existing bookings for this day
  const bookingsWhere: any = {
    date: { gte: startOfDate, lt: endOfDate },
    status: { notIn: ["CANCELLED", "NO_SHOW"] },
  };
  if (barberId) bookingsWhere.barberId = barberId;

  const existingBookings = await prisma.booking.findMany({ where: bookingsWhere });

  // Determine working hours (use first availability or aggregate across barbers)
  const avail = availabilities[0];
  const allSlots = generateTimeSlots(avail.startTime, avail.endTime, avail.slotInterval, duration);

  const now = new Date();
  const isToday = isSameDay(date, now);

  const slotsWithAvailability = allSlots.map((time) => {
    const slotStart = timeToMinutes(time);
    const slotEnd = slotStart + duration;

    // Don't show past times for today
    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes() + 30; // 30 min buffer
      if (slotStart < currentMinutes) {
        return { time, available: false, period: getPeriod(slotStart) };
      }
    }

    // Check against bookings
    const conflicting = existingBookings.some((booking) => {
      const bookStart = timeToMinutes(booking.startTime);
      const bookEnd = timeToMinutes(booking.endTime);
      return slotStart < bookEnd && slotEnd > bookStart;
    });

    return {
      time,
      available: !conflicting,
      period: getPeriod(slotStart),
    };
  });

  return NextResponse.json({
    slots: slotsWithAvailability,
    available: slotsWithAvailability.some((s) => s.available),
  });
}

function getPeriod(minutes: number): "morning" | "afternoon" | "evening" {
  if (minutes < 12 * 60) return "morning";
  if (minutes < 17 * 60) return "afternoon";
  return "evening";
}
