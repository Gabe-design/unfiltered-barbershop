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

const templateSchema = z.object({
  type: z.enum([
    "BOOKING_CONFIRMATION",
    "BOOKING_REMINDER",
    "REVIEW_REQUEST",
    "REBOOKING_REMINDER",
    "ABANDONED_BOOKING",
    "REFERRAL_INVITE",
    "PROMO_CAMPAIGN",
  ]),
  name: z.string().min(1),
  subject: z.string().min(1),
  htmlBody: z.string().min(1),
  isActive: z.boolean().default(true),
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const templates = await prisma.emailTemplate.findMany({
    orderBy: { type: "asc" },
  });

  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = templateSchema.parse(body);

    const template = await prisma.emailTemplate.create({ data });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Template ID required" }, { status: 400 });

  try {
    const body = await req.json();
    const data = templateSchema.partial().parse(body);
    const template = await prisma.emailTemplate.update({ where: { id }, data });
    return NextResponse.json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Template ID required" }, { status: 400 });

  await prisma.emailTemplate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
