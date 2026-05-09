import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const abandonedSchema = z.object({
  sessionId: z.string().min(1),
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  stepReached: z.number().min(1).max(7),
  serviceSlug: z.string().optional(),
  barberSlug: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  isHouseCall: z.boolean().default(false),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = abandonedSchema.parse(body);

    const existing = await prisma.abandonedBooking.findFirst({
      where: { sessionId: data.sessionId },
    });

    if (existing) {
      await prisma.abandonedBooking.update({
        where: { id: existing.id },
        data: {
          stepReached: data.stepReached,
          ...(data.email && { email: data.email }),
          ...(data.name && { name: data.name }),
          ...(data.phone && { phone: data.phone }),
          ...(data.serviceSlug && { serviceSlug: data.serviceSlug }),
          ...(data.barberSlug && { barberSlug: data.barberSlug }),
          ...(data.preferredDate && { preferredDate: data.preferredDate }),
          ...(data.preferredTime && { preferredTime: data.preferredTime }),
          isHouseCall: data.isHouseCall,
        },
      });
    } else {
      await prisma.abandonedBooking.create({ data });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
