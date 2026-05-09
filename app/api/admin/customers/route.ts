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
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortDir = (searchParams.get("sortDir") ?? "desc") as "asc" | "desc";
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search } },
        ],
      }
    : {};

  const validSortFields = ["createdAt", "lastVisitDate", "totalSpent", "visitCount", "name"];
  const orderBy = validSortFields.includes(sortBy)
    ? { [sortBy]: sortDir }
    : { createdAt: "desc" as const };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        loyaltyProfile: { select: { vipStatus: true, visitCount: true, rewardsEarned: true } },
        referralCode: { select: { code: true, usedCount: true } },
        _count: { select: { bookings: true } },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return NextResponse.json({ customers, total, page, limit });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Customer ID required" }, { status: 400 });

  const body = await req.json();
  const { notes, tags, favoriteBarber, preferredService } = body;

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...(notes !== undefined && { notes }),
      ...(tags !== undefined && { tags }),
      ...(favoriteBarber !== undefined && { favoriteBarber }),
      ...(preferredService !== undefined && { preferredService }),
    },
  });

  return NextResponse.json(customer);
}
