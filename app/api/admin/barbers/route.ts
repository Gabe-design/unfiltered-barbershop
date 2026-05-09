import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const barbers = await prisma.barber.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      availability: true,
      _count: { select: { bookings: true } },
    },
  });

  return NextResponse.json(barbers);
}

const barberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  bio: z.string().optional(),
  specialty: z.string().optional(),
  instagram: z.string().optional(),
  isActive: z.boolean().default(true),
  offersHouseCall: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = barberSchema.parse(body);

  const barber = await prisma.barber.create({
    data: {
      name: data.name,
      slug: data.slug,
      bio: data.bio,
      specialty: data.specialty,
      instagram: data.instagram,
      isActive: data.isActive,
      offersHouseCall: data.offersHouseCall,
      displayOrder: data.displayOrder,
    },
  });

  return NextResponse.json(barber);
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = barberSchema.parse(body);

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const barber = await prisma.barber.update({
    where: { id },
    data,
  });

  return NextResponse.json(barber);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.barber.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
