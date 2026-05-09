import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const trackSchema = z.object({
  eventType: z.string(),
  source: z.string().optional(),
  page: z.string().optional(),
  sessionId: z.string().optional(),
  bookingId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = trackSchema.parse(body);

    await prisma.trackingEvent.create({
      data: {
        eventType: data.eventType,
        source: data.source,
        page: data.page,
        sessionId: data.sessionId,
        bookingId: data.bookingId,
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
