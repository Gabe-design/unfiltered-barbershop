import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const barbers = await prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      bio: true,
      specialty: true,
      instagram: true,
      image: true,
      offersHouseCall: true,
      rating: true,
      reviewCount: true,
    },
  });
  return NextResponse.json(barbers);
}
