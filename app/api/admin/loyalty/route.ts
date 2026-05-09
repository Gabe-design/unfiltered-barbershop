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
  const vipStatus = searchParams.get("vipStatus");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");
  const skip = (page - 1) * limit;

  const where = vipStatus ? { vipStatus: vipStatus as "NONE" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" } : {};

  const [profiles, total] = await Promise.all([
    prisma.loyaltyProfile.findMany({
      where,
      orderBy: { visitCount: "desc" },
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true, lastVisitDate: true } },
      },
    }),
    prisma.loyaltyProfile.count({ where }),
  ]);

  const stats = {
    none: await prisma.loyaltyProfile.count({ where: { vipStatus: "NONE" } }),
    bronze: await prisma.loyaltyProfile.count({ where: { vipStatus: "BRONZE" } }),
    silver: await prisma.loyaltyProfile.count({ where: { vipStatus: "SILVER" } }),
    gold: await prisma.loyaltyProfile.count({ where: { vipStatus: "GOLD" } }),
    platinum: await prisma.loyaltyProfile.count({ where: { vipStatus: "PLATINUM" } }),
  };

  return NextResponse.json({ profiles, total, stats, page, limit });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, vipStatus, rewardsEarned, rewardsUsed } = await req.json();
  if (!id) return NextResponse.json({ error: "Profile ID required" }, { status: 400 });

  const validStatuses = ["NONE", "BRONZE", "SILVER", "GOLD", "PLATINUM"];

  const profile = await prisma.loyaltyProfile.update({
    where: { id },
    data: {
      ...(vipStatus && validStatuses.includes(vipStatus) && {
        vipStatus,
        ...(vipStatus !== "NONE" && { vipSince: new Date() }),
      }),
      ...(rewardsEarned !== undefined && { rewardsEarned }),
      ...(rewardsUsed !== undefined && { rewardsUsed }),
    },
  });

  return NextResponse.json(profile);
}
