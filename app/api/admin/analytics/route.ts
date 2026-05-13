import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Run all aggregations in parallel
    const [
      allBookings,
      thisMonthBookings,
      lastMonthBookings,
      allCustomers,
      reviewRequests,
      loyaltyProfiles,
      abandonedBookings,
      referralCodes,
      referrals,
      topServicesRaw,
      topBarbersRaw,
    ] = await Promise.all([
      prisma.booking.findMany({
        select: {
          id: true,
          status: true,
          totalPrice: true,
          source: true,
          customerEmail: true,
          createdAt: true,
        },
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: startOfThisMonth } },
        select: {
          id: true,
          totalPrice: true,
          customerEmail: true,
          createdAt: true,
          customerId: true,
        },
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        select: { id: true, totalPrice: true },
      }),
      prisma.customer.findMany({
        select: { id: true, createdAt: true, visitCount: true },
      }),
      prisma.reviewRequest.findMany({
        select: { id: true, status: true },
      }),
      prisma.loyaltyProfile.findMany({
        select: { id: true, vipStatus: true },
      }),
      prisma.abandonedBooking.findMany({
        select: { id: true, recovered: true, followUpSent: true },
      }),
      prisma.referralCode.findMany({
        select: { id: true },
      }),
      prisma.referral.findMany({
        select: { id: true, status: true },
      }),
      prisma.bookingItem.findMany({
        where: { serviceId: { not: null } },
        select: {
          serviceId: true,
          price: true,
          service: { select: { name: true } },
        },
        orderBy: { booking: { createdAt: "desc" } },
      }),
      prisma.booking.findMany({
        where: { barberId: { not: null }, status: "COMPLETED" },
        select: {
          barberId: true,
          totalPrice: true,
          barber: { select: { name: true } },
        },
      }),
    ]);

    // Overview stats
    const totalBookings = allBookings.length;
    const completedBookings = allBookings.filter((b) => b.status === "COMPLETED").length;
    const cancelledBookings = allBookings.filter((b) => b.status === "CANCELLED").length;
    const noShowBookings = allBookings.filter((b) => b.status === "NO_SHOW").length;
    const noShowRate = totalBookings > 0 ? noShowBookings / totalBookings : 0;

    // Repeat customer rate: customers with visitCount > 1
    const repeatCustomers = allCustomers.filter((c) => c.visitCount > 1).length;
    const repeatCustomerRate = allCustomers.length > 0 ? repeatCustomers / allCustomers.length : 0;

    const completedBookingsList = allBookings.filter((b) => b.status === "COMPLETED");
    const totalRevenue = completedBookingsList.reduce((sum, b) => sum + b.totalPrice, 0);
    const avgBookingValue = completedBookings > 0 ? totalRevenue / completedBookings : 0;

    // Review conversion: CLICKED or REVIEWED / REQUESTED
    const reviewSent = reviewRequests.filter((r) => r.status !== "NOT_REQUESTED").length;
    const reviewClicked = reviewRequests.filter((r) => r.status === "CLICKED" || r.status === "REVIEWED").length;
    const reviewReviewed = reviewRequests.filter((r) => r.status === "REVIEWED").length;
    const reviewRequestConversionRate = reviewSent > 0 ? reviewReviewed / reviewSent : 0;

    // This month stats
    const thisMonthRevenue = thisMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const thisMonthNewCustomers = allCustomers.filter(
      (c) => c.createdAt >= startOfThisMonth
    ).length;

    // Last month stats
    const lastMonthRevenue = lastMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // By source
    const sourceTypes = ["WEBSITE", "INSTAGRAM", "GOOGLE", "REFERRAL", "DIRECT", "ADS", "QR_CODE"] as const;
    const bySource = sourceTypes.reduce(
      (acc, src) => {
        acc[src] = allBookings.filter((b) => b.source === src).length;
        return acc;
      },
      {} as Record<string, number>
    );

    // By status
    const statusTypes = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;
    const byStatus = statusTypes.reduce(
      (acc, st) => {
        acc[st] = allBookings.filter((b) => b.status === st).length;
        return acc;
      },
      {} as Record<string, number>
    );

    // Top services
    const serviceMap = new Map<string, { name: string; count: number; revenue: number }>();
    for (const item of topServicesRaw) {
      if (!item.serviceId || !item.service) continue;
      const existing = serviceMap.get(item.serviceId);
      if (existing) {
        existing.count++;
        existing.revenue += item.price;
      } else {
        serviceMap.set(item.serviceId, { name: item.service.name, count: 1, revenue: item.price });
      }
    }
    const topServices = Array.from(serviceMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top barbers
    const barberMap = new Map<string, { name: string; count: number; revenue: number }>();
    for (const booking of topBarbersRaw) {
      if (!booking.barberId || !booking.barber) continue;
      const existing = barberMap.get(booking.barberId);
      if (existing) {
        existing.count++;
        existing.revenue += booking.totalPrice;
      } else {
        barberMap.set(booking.barberId, { name: booking.barber.name, count: 1, revenue: booking.totalPrice });
      }
    }
    const topBarbers = Array.from(barberMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Loyalty stats
    const loyaltyStats = {
      bronze: loyaltyProfiles.filter((l) => l.vipStatus === "BRONZE").length,
      silver: loyaltyProfiles.filter((l) => l.vipStatus === "SILVER").length,
      gold: loyaltyProfiles.filter((l) => l.vipStatus === "GOLD").length,
      platinum: loyaltyProfiles.filter((l) => l.vipStatus === "PLATINUM").length,
      totalVip: loyaltyProfiles.filter((l) => l.vipStatus !== "NONE").length,
    };

    // Abandoned stats
    const abandonedTotal = abandonedBookings.length;
    const abandonedRecovered = abandonedBookings.filter((a) => a.recovered).length;
    const abandonedFollowUpSent = abandonedBookings.filter((a) => a.followUpSent).length;
    const abandonedStats = {
      total: abandonedTotal,
      recovered: abandonedRecovered,
      recoveryRate: abandonedTotal > 0 ? abandonedRecovered / abandonedTotal : 0,
      followUpSent: abandonedFollowUpSent,
    };

    // Referral stats
    const convertedReferrals = referrals.filter((r) => r.status === "CONVERTED" || r.status === "REWARDED").length;
    const pendingReferrals = referrals.filter((r) => r.status === "PENDING").length;
    const referralStats = {
      totalCodes: referralCodes.length,
      totalReferrals: referrals.length,
      converted: convertedReferrals,
      pending: pendingReferrals,
    };

    return NextResponse.json({
      overview: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        noShowRate,
        repeatCustomerRate,
        totalRevenue,
        avgBookingValue,
        reviewRequestConversionRate,
      },
      thisMonth: {
        bookings: thisMonthBookings.length,
        revenue: thisMonthRevenue,
        newCustomers: thisMonthNewCustomers,
      },
      lastMonth: {
        bookings: lastMonthBookings.length,
        revenue: lastMonthRevenue,
      },
      bySource,
      topServices,
      topBarbers,
      byStatus,
      reviewStats: {
        sent: reviewSent,
        clicked: reviewClicked,
        reviewed: reviewReviewed,
        conversionRate: reviewRequestConversionRate,
      },
      loyaltyStats,
      abandonedStats,
      referralStats,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
