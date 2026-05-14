import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots, timeToMinutes } from "@/lib/utils";
import { startOfDay, isSameDay } from "date-fns";
import { BookingStatus, type Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const barberId = searchParams.get("barberId");
  const duration = parseInt(searchParams.get("duration") || "60");

  if (!dateStr) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // local midnight — avoids UTC offset shifting the day
  const dayOfWeek = date.getDay();
  const startOfDate = startOfDay(date);
  const endOfDate = new Date(startOfDate);
  endOfDate.setDate(endOfDate.getDate() + 1);

  // Fetch existing bookings upfront so both paths can use it
  const bookingsWhere: Prisma.BookingWhereInput = {
    date: { gte: startOfDate, lt: endOfDate },
    status: { notIn: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW] },
  };
  if (barberId) bookingsWhere.barberId = barberId;
  const existingBookings = await prisma.booking.findMany({ where: bookingsWhere });

  // Get availability for this day
  const availabilityWhere = barberId
    ? { barberId, dayOfWeek, isActive: true }
    : { dayOfWeek, isActive: true };

  const availabilities = await prisma.barberAvailability.findMany({
    where: availabilityWhere,
    include: { barber: { select: { id: true, name: true, isActive: true } } },
  });

  // Fall back to standard business hours if no availability records exist
  const businessHours: Record<number, { start: string; end: string }> = {
    0: { start: "10:00", end: "14:00" }, // Sunday
    1: { start: "09:00", end: "19:00" },
    2: { start: "09:00", end: "19:00" },
    3: { start: "09:00", end: "19:00" },
    4: { start: "09:00", end: "19:00" },
    5: { start: "09:00", end: "19:00" },
    6: { start: "09:00", end: "17:00" }, // Saturday
  };

  if (availabilities.length === 0) {
    const hours = businessHours[dayOfWeek];
    if (!hours) return NextResponse.json({ slots: [], available: false });
    const allSlots = generateTimeSlots(hours.start, hours.end, 30, duration);
    const now = new Date();
    const isToday = isSameDay(date, now);
    const slots = allSlots.map((time) => {
      const slotStart = timeToMinutes(time);
      if (isToday) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes() + 30;
        if (slotStart < currentMinutes) return { time, available: false, period: getPeriod(slotStart) };
      }
      const conflict = existingBookings.some((b) => {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return slotStart < bEnd && slotStart + duration > bStart;
      });
      return { time, available: !conflict, period: getPeriod(slotStart) };
    });
    return NextResponse.json({ slots, available: slots.some((s) => s.available) });
  }

  // Check for blocked dates
  const blockedQuery = barberId
    ? { barberId, date: { gte: startOfDate, lt: endOfDate } }
    : { date: { gte: startOfDate, lt: endOfDate } };

  const blockedDates = await prisma.blockedDate.findMany({ where: blockedQuery });

  if (blockedDates.length > 0 && barberId) {
    return NextResponse.json({ slots: [], available: false, reason: "Barber unavailable" });
  }

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
