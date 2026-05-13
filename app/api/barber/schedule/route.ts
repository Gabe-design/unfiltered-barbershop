import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, addDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "BARBER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const barber = await prisma.barber.findUnique({
    where: { userId: session.user.id },
  });
  if (!barber) return NextResponse.json({ error: "Barber profile not found" }, { status: 404 });

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekEnd = endOfDay(addDays(now, 7));

  const bookings = await prisma.booking.findMany({
    where: {
      barberId: barber.id,
      date: { gte: todayStart, lte: weekEnd },
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
    select: {
      id: true,
      confirmationId: true,
      customerName: true,
      customerPhone: true,
      date: true,
      startTime: true,
      endTime: true,
      totalPrice: true,
      totalDuration: true,
      status: true,
      notes: true,
      isHouseCall: true,
      houseCallAddress: true,
      items: {
        include: {
          service: { select: { name: true } },
          addOn: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json({ barber: { name: barber.name, image: barber.image }, bookings });
}
