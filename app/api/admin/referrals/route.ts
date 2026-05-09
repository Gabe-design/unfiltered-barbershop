import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");
  const skip = (page - 1) * limit;

  const [codes, total, referrals] = await Promise.all([
    prisma.referralCode.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        referrals: {
          select: { id: true, status: true, createdAt: true, referredEmail: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    }),
    prisma.referralCode.count(),
    prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        referralCode: {
          include: { customer: { select: { name: true } } },
        },
        booking: { select: { confirmationId: true, totalPrice: true } },
      },
    }),
  ]);

  const stats = {
    totalCodes: total,
    totalReferrals: await prisma.referral.count(),
    converted: await prisma.referral.count({ where: { status: { in: ["CONVERTED", "REWARDED"] } } }),
    pending: await prisma.referral.count({ where: { status: "PENDING" } }),
  };

  return NextResponse.json({ codes, total, referrals, stats, page, limit });
}

// PATCH: mark referral as rewarded
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { referralId, status } = await req.json();
  if (!referralId) return NextResponse.json({ error: "referralId required" }, { status: 400 });

  const referral = await prisma.referral.update({
    where: { id: referralId },
    data: {
      status,
      ...(status === "REWARDED" && { rewardGiven: true }),
    },
  });

  return NextResponse.json(referral);
}
