import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";


async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) return null;
  return session;
}

const serviceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  duration: z.number().min(1),
  category: z.enum(["HAIRCUT", "BEARD", "DESIGN", "ENHANCEMENT", "HOUSE_CALL", "COMBO"]),
  isActive: z.boolean().default(true),
  isHouseCall: z.boolean().default(false),
  afterHoursFee: z.number().optional(),
  displayOrder: z.number().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const services = await prisma.service.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      addOns: { select: { id: true, name: true, price: true } },
      _count: { select: { bookingItems: true } },
    },
  });

  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);

    const existing = await prisma.service.findUnique({ where: { slug: data.slug } });
    if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const service = await prisma.service.create({ data });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Service ID required" }, { status: 400 });

  try {
    const body = await req.json();
    const data = serviceSchema.partial().parse(body);
    const service = await prisma.service.update({ where: { id }, data });
    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
