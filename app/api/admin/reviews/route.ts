import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendReviewRequest } from "@/lib/email";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");
  const skip = (page - 1) * limit;

  const where = status ? { status: status as "NOT_REQUESTED" | "REQUESTED" | "CLICKED" | "REVIEWED" } : {};

  const [requests, total] = await Promise.all([
    prisma.reviewRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        booking: {
          select: {
            confirmationId: true,
            customerName: true,
            customerEmail: true,
            date: true,
            totalPrice: true,
            barber: { select: { name: true } },
          },
        },
        customer: { select: { name: true, email: true } },
      },
    }),
    prisma.reviewRequest.count({ where }),
  ]);

  return NextResponse.json({ requests, total, page, limit });
}

// POST: send a review request for a specific booking
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId } = await req.json();
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: true },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const settings = await prisma.appSettings.findUnique({ where: { id: "global" } });
  const googleReviewUrl = settings?.googleReviewUrl ?? "";

  // Create or update review request
  const existing = await prisma.reviewRequest.findUnique({ where: { bookingId } });

  let reviewRequest;
  if (existing) {
    reviewRequest = await prisma.reviewRequest.update({
      where: { bookingId },
      data: { status: "REQUESTED", sentAt: new Date() },
    });
  } else {
    reviewRequest = await prisma.reviewRequest.create({
      data: {
        bookingId,
        customerId: booking.customerId ?? undefined,
        email: booking.customerEmail,
        status: "REQUESTED",
        sentAt: new Date(),
      },
    });
  }

  // Also update booking review status
  await prisma.booking.update({
    where: { id: bookingId },
    data: { reviewStatus: "REQUESTED" },
  });

  // Send email
  await sendReviewRequest({
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    confirmationId: booking.confirmationId,
    googleReviewUrl,
    reviewRequestId: reviewRequest.id,
  }).catch(console.error);

  return NextResponse.json({ success: true, reviewRequestId: reviewRequest.id });
}

// PATCH: update review status manually
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

  const validStatuses = ["NOT_REQUESTED", "REQUESTED", "CLICKED", "REVIEWED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const reviewRequest = await prisma.reviewRequest.update({
    where: { id },
    data: {
      status,
      ...(status === "REVIEWED" && { reviewedAt: new Date() }),
      ...(status === "CLICKED" && { clickedAt: new Date() }),
    },
  });

  return NextResponse.json(reviewRequest);
}
