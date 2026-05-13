import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) return null;
  return session;
}

// POST /api/admin/barbers/login — create a barber login
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { barberId, email, password } = await req.json();

  if (!barberId || !email || !password) {
    return NextResponse.json({ error: "barberId, email, and password are required" }, { status: 400 });
  }

  const barber = await prisma.barber.findUnique({ where: { id: barberId } });
  if (!barber) return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  if (barber.userId) return NextResponse.json({ error: "Barber already has a login" }, { status: 409 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name: barber.name, email, password: hashed, role: "BARBER" },
  });

  await prisma.barber.update({ where: { id: barberId }, data: { userId: user.id } });

  return NextResponse.json({ success: true, userId: user.id });
}

// DELETE /api/admin/barbers/login — revoke a barber login
export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { barberId } = await req.json();
  if (!barberId) return NextResponse.json({ error: "barberId required" }, { status: 400 });

  const barber = await prisma.barber.findUnique({ where: { id: barberId } });
  if (!barber?.userId) return NextResponse.json({ error: "No login to revoke" }, { status: 404 });

  await prisma.barber.update({ where: { id: barberId }, data: { userId: null } });
  await prisma.user.delete({ where: { id: barber.userId } });

  return NextResponse.json({ success: true });
}
