import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";
import { generateConfirmationId, minutesToTime, timeToMinutes } from "@/lib/utils";
import { z } from "zod";

// Accepts either a DB cuid or a slug string for service/barber lookups
const bookingSchema = z.object({
  // Accept serviceId (cuid) OR serviceSlug (slug from booking store)
  serviceId: z.string().optional(),
  serviceSlug: z.string().optional(),
  // Add-ons: either DB id or slug-based name
  addOnIds: z.array(z.object({ id: z.string(), quantity: z.number().min(1) })).default([]),
  addOnSlugs: z
    .record(z.string(), z.number())
    .optional()
    .default({}),
  // Barber: DB id or slug
  barberId: z.string().optional().nullable(),
  barberSlug: z.string().optional().nullable(),
  date: z.string().min(1),
  startTime: z.string().min(1),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  notes: z.string().optional(),
  smsReminder: z.boolean().default(false),
  isHouseCall: z.boolean().default(false),
  houseCallAddress: z.string().optional(),
  houseCallUnit: z.string().optional(),
  houseCallCity: z.string().optional(),
  houseCallZip: z.string().optional(),
}).refine((d) => d.serviceId || d.serviceSlug, {
  message: "Either serviceId or serviceSlug is required",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    // Resolve service: prefer DB id, fall back to slug lookup
    let service = data.serviceId
      ? await prisma.service.findUnique({ where: { id: data.serviceId } })
      : null;

    if (!service && data.serviceSlug) {
      service = await prisma.service.findUnique({ where: { slug: data.serviceSlug } });
    }

    if (!service) {
      // Last resort: match by name similarity using the slug pattern
      const slug = data.serviceSlug ?? data.serviceId ?? "";
      service = await prisma.service.findFirst({
        where: { isActive: true, name: { contains: slug.replace(/-/g, " "), mode: "insensitive" } },
      });
    }

    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    // Resolve barber: prefer DB id, fall back to slug
    let resolvedBarberId: string | null = null;
    if (data.barberId && data.barberId !== "no-preference") {
      const b = await prisma.barber.findUnique({ where: { id: data.barberId } });
      resolvedBarberId = b?.id ?? null;
    }
    if (!resolvedBarberId && data.barberSlug && data.barberSlug !== "no-preference") {
      const b = await prisma.barber.findUnique({ where: { slug: data.barberSlug } });
      resolvedBarberId = b?.id ?? null;
    }

    // Resolve add-ons: support both DB ids and slug-based record from booking store
    type AddOnWithQty = { addOn: { id: string; name: string; price: number; duration: number }; quantity: number };
    const addOnEntries: AddOnWithQty[] = [];

    if (data.addOnIds.length > 0) {
      const found = await prisma.addOn.findMany({
        where: { id: { in: data.addOnIds.map((a) => a.id) } },
      });
      for (const a of found) {
        const qty = data.addOnIds.find((x) => x.id === a.id)?.quantity ?? 1;
        addOnEntries.push({ addOn: a, quantity: qty });
      }
    }

    // Slug-based add-ons from booking store (e.g. { "eyebrows": 1, "hot-towel": 2 })
    const slugMap: Record<string, number> = data.addOnSlugs ?? {};
    const activeSlugAddOns = Object.entries(slugMap).filter(([, qty]) => qty > 0);
    if (activeSlugAddOns.length > 0) {
      const slugNames = activeSlugAddOns.map(([slug]) => slug.replace(/-/g, " "));
      const found = await prisma.addOn.findMany({
        where: { isActive: true, name: { in: slugNames } },
      });
      // Also try case-insensitive
      for (const [slug, qty] of activeSlugAddOns) {
        const name = slug.replace(/-/g, " ");
        let addOn = found.find(
          (f) => f.name.toLowerCase() === name.toLowerCase()
        );
        if (!addOn) {
          // Try contains
          const fallback = await prisma.addOn.findFirst({
            where: { isActive: true, name: { contains: name, mode: "insensitive" } },
          });
          if (fallback) addOn = fallback;
        }
        if (addOn) {
          addOnEntries.push({ addOn, quantity: qty });
        }
      }
    }

    const addOns = addOnEntries.map((e) => e.addOn);

    // Calculate total duration and price
    const addOnTotalDuration = addOnEntries.reduce(
      (sum, { addOn, quantity }) => sum + addOn.duration * quantity,
      0
    );
    const addOnTotalPrice = addOnEntries.reduce(
      (sum, { addOn, quantity }) => sum + addOn.price * quantity,
      0
    );

    const totalDuration = service.duration + addOnTotalDuration;
    const totalPrice = service.price + addOnTotalPrice;

    // Calculate end time
    const [h, m] = data.startTime.split(":").map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + totalDuration;
    const endTime = minutesToTime(endMinutes);

    const bookingDate = new Date(data.date);

    // Check for conflicts with same barber
    if (resolvedBarberId) {
      const conflicts = await prisma.booking.findMany({
        where: {
          barberId: resolvedBarberId,
          date: bookingDate,
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
      });

      const reqStart = timeToMinutes(data.startTime);
      const reqEnd = timeToMinutes(endTime);

      for (const existing of conflicts) {
        const existStart = timeToMinutes(existing.startTime);
        const existEnd = timeToMinutes(existing.endTime);
        if (reqStart < existEnd && reqEnd > existStart) {
          return NextResponse.json(
            { error: "This time slot is no longer available. Please choose another time." },
            { status: 409 }
          );
        }
      }
    }

    const confirmationId = generateConfirmationId();

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        confirmationId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        notes: data.notes,
        date: bookingDate,
        startTime: data.startTime,
        endTime,
        totalPrice,
        totalDuration,
        isHouseCall: data.isHouseCall,
        houseCallAddress: data.houseCallAddress,
        houseCallUnit: data.houseCallUnit,
        houseCallCity: data.houseCallCity,
        houseCallZip: data.houseCallZip,
        smsReminder: data.smsReminder,
        barberId: resolvedBarberId,
        items: {
          create: [
            {
              serviceId: service.id,
              price: service.price,
              duration: service.duration,
            },
            ...addOnEntries.map(({ addOn, quantity }) => ({
              addOnId: addOn.id,
              quantity,
              price: addOn.price * quantity,
              duration: addOn.duration,
            })),
          ],
        },
      },
    });

    // Fetch barber name if applicable
    const barber = resolvedBarberId
      ? await prisma.barber.findUnique({ where: { id: resolvedBarberId }, select: { name: true, phone: true } })
      : null;

    const emailData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      confirmationId,
      date: bookingDate,
      startTime: data.startTime,
      barberName: barber?.name,
      services: [{ name: service.name, price: service.price, duration: service.duration }],
      addOns: addOns.map((a) => ({ name: a.name, price: a.price })),
      totalPrice,
      totalDuration,
      isHouseCall: data.isHouseCall,
      houseCallAddress: data.houseCallAddress
        ? `${data.houseCallAddress}${data.houseCallUnit ? ` ${data.houseCallUnit}` : ""}, ${data.houseCallCity}, ${data.houseCallZip}`
        : undefined,
    };

    // Send confirmation emails
    await Promise.all([
      sendBookingConfirmation(emailData).catch(console.error),
      sendAdminNotification(emailData).catch(console.error),
    ]);

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      confirmationId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid booking data", details: error.issues }, { status: 400 });
    }
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const confirmationId = searchParams.get("confirmationId");

  if (!confirmationId) {
    return NextResponse.json({ error: "confirmationId required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { confirmationId },
    include: {
      barber: { select: { name: true } },
      items: {
        include: {
          service: { select: { name: true } },
          addOn: { select: { name: true } },
        },
      },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}
