import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      addOns: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  return NextResponse.json(services);
}
