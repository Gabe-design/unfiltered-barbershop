import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) return null;
  return session;
}

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
  category: z.string().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const images = await prisma.galleryImage.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = imageSchema.parse(body);
    const image = await prisma.galleryImage.create({ data });
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Image ID required" }, { status: 400 });

  const body = await req.json();
  const data = imageSchema.partial().parse(body);
  const image = await prisma.galleryImage.update({ where: { id }, data });
  return NextResponse.json(image);
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Image ID required" }, { status: 400 });

  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
