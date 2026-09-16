import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAbandonedBookingFollowUp } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";


async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const recovered = searchParams.get("recovered");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");
  const skip = (page - 1) * limit;

  const where =
    recovered === "true"
      ? { recovered: true }
      : recovered === "false"
      ? { recovered: false }
      : {};

  const [abandoned, total] = await Promise.all([
    prisma.abandonedBooking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.abandonedBooking.count({ where }),
  ]);

  return NextResponse.json({ abandoned, total, page, limit });
}

// POST: send follow-up email to an abandoned booking
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Abandoned booking ID required" }, { status: 400 });

  const abandoned = await prisma.abandonedBooking.findUnique({ where: { id } });
  if (!abandoned) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!abandoned.email) return NextResponse.json({ error: "No email on record" }, { status: 400 });

  await sendAbandonedBookingFollowUp({
    name: abandoned.name ?? "there",
    email: abandoned.email,
    serviceSlug: abandoned.serviceSlug ?? undefined,
    bookingUrl: `${SITE_URL}/booking`,
  }).catch(console.error);

  await prisma.abandonedBooking.update({
    where: { id },
    data: { followUpSent: true, followUpSentAt: new Date() },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, recovered, recoveredBookingId } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const updated = await prisma.abandonedBooking.update({
    where: { id },
    data: {
      ...(recovered !== undefined && { recovered }),
      ...(recoveredBookingId && { recoveredBookingId }),
    },
  });

  return NextResponse.json(updated);
}
