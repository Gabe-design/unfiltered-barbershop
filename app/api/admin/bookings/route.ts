import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendReviewRequest } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";


async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (dateFrom) where.date = { ...(where.date as object), gte: new Date(dateFrom) };
  if (dateTo) where.date = { ...(where.date as object), lte: new Date(dateTo) };
  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: "insensitive" } },
      { customerEmail: { contains: search, mode: "insensitive" } },
      { confirmationId: { contains: search, mode: "insensitive" } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        barber: { select: { name: true } },
        items: {
          include: {
            service: { select: { name: true } },
            addOn: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, totalPages: Math.ceil(total / limit) });
}

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "CONTACTED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
});

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = updateSchema.parse(body);

  const prevBooking = await prisma.booking.findUnique({ where: { id: data.id } });

  const booking = await prisma.booking.update({
    where: { id: data.id },
    data: { status: data.status },
  });

  // Auto-trigger review request when marking a booking as COMPLETED
  if (data.status === "COMPLETED" && prevBooking?.status !== "COMPLETED") {
    const settings = await prisma.appSettings.findUnique({ where: { id: "global" } });

    if (settings?.reviewRequestEnabled && booking.reviewStatus === "NOT_REQUESTED") {
      const existing = await prisma.reviewRequest.findUnique({ where: { bookingId: booking.id } });
      if (!existing) {
        const reviewRequest = await prisma.reviewRequest.create({
          data: {
            bookingId: booking.id,
            customerId: booking.customerId ?? undefined,
            email: booking.customerEmail,
            status: "REQUESTED",
            sentAt: new Date(),
          },
        });

        await prisma.booking.update({
          where: { id: booking.id },
          data: { reviewStatus: "REQUESTED" },
        });

        // Awaited on purpose: on Vercel the function can be frozen as soon as the
        // response is sent, which would drop an un-awaited send.
        await sendReviewRequest({
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          confirmationId: booking.confirmationId,
          googleReviewUrl: settings.googleReviewUrl ?? "",
          reviewRequestId: reviewRequest.id,
        }).catch(console.error);
      }
    }
  }

  return NextResponse.json(booking);
}
