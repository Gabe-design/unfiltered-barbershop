import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SHOP_ADDRESS } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";


const settingsSchema = z.object({
  googleReviewUrl: z.string().url().optional().or(z.literal("")),
  reviewRequestEnabled: z.boolean().optional(),
  reviewRequestDelayHours: z.number().min(0).max(168).optional(),
  rebookingReminderEnabled: z.boolean().optional(),
  defaultReminderWeeks: z.number().min(1).max(12).optional(),
  loyaltyEnabled: z.boolean().optional(),
  referralEnabled: z.boolean().optional(),
  referralRewardDescription: z.string().optional(),
  smsEnabled: z.boolean().optional(),
  shopPhone: z.string().optional(),
  instagramUrl: z.string().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user?.role as string)) {
    return null;
  }
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let settings = await prisma.appSettings.findUnique({ where: { id: "global" } });

  if (!settings) {
    settings = await prisma.appSettings.create({
      data: {
        id: "global",
        googleReviewUrl: "",
        reviewRequestEnabled: true,
        reviewRequestDelayHours: 2,
        rebookingReminderEnabled: true,
        defaultReminderWeeks: 3,
        loyaltyEnabled: true,
        referralEnabled: true,
        referralRewardDescription: "Get a free upgrade on your next visit",
        smsEnabled: false,
        shopPhone: SHOP_ADDRESS.phoneHref,
        instagramUrl: "https://instagram.com/unfilteredbarbershop",
      },
    });
  }

  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = settingsSchema.parse(body);

    const settings = await prisma.appSettings.upsert({
      where: { id: "global" },
      update: { ...data, updatedAt: new Date() },
      create: {
        id: "global",
        googleReviewUrl: data.googleReviewUrl ?? "",
        reviewRequestEnabled: data.reviewRequestEnabled ?? true,
        reviewRequestDelayHours: data.reviewRequestDelayHours ?? 2,
        rebookingReminderEnabled: data.rebookingReminderEnabled ?? true,
        defaultReminderWeeks: data.defaultReminderWeeks ?? 3,
        loyaltyEnabled: data.loyaltyEnabled ?? true,
        referralEnabled: data.referralEnabled ?? true,
        referralRewardDescription: data.referralRewardDescription ?? "",
        smsEnabled: data.smsEnabled ?? false,
        shopPhone: data.shopPhone ?? "",
        instagramUrl: data.instagramUrl ?? "",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
