import { PrismaClient, ServiceCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@unfilteredbarbershop.com" },
    update: {},
    create: {
      email: "admin@unfilteredbarbershop.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Barbers
  const barbers = [
    {
      name: "Alex Reyes",
      slug: "alex-reyes",
      bio: "Master barber with 8+ years of experience specializing in precision fades and creative designs. Alex brings a cinematic eye to every cut.",
      specialty: "Precision Fades & Designs",
      instagram: "alexreyes_cuts",
      rating: 5.0,
      reviewCount: 234,
      offersHouseCall: true,
      displayOrder: 1,
    },
    {
      name: "Marcus Williams",
      slug: "marcus-williams",
      bio: "Beard specialist and hair artisan. Marcus transforms every client with his meticulous attention to detail and passion for the craft.",
      specialty: "Beard Grooming & Styling",
      instagram: "marcuswilliams_barber",
      rating: 5.0,
      reviewCount: 198,
      offersHouseCall: true,
      displayOrder: 2,
    },
    {
      name: "Jordan Cruz",
      slug: "jordan-cruz",
      bio: "Fresh cuts with a modern twist. Jordan is known for his creative line work and his ability to bring any vision to life with a razor.",
      specialty: "Hair Enhancements & Line Art",
      instagram: "jordancruz_fresh",
      rating: 5.0,
      reviewCount: 153,
      offersHouseCall: false,
      displayOrder: 3,
    },
  ];

  for (const barber of barbers) {
    const created = await prisma.barber.upsert({
      where: { slug: barber.slug },
      update: {},
      create: barber,
    });

    // Set availability for each barber
    const schedule = [
      { dayOfWeek: 0, startTime: "10:00", endTime: "14:00" }, // Sunday
      { dayOfWeek: 1, startTime: "09:00", endTime: "19:00" }, // Monday
      { dayOfWeek: 2, startTime: "09:00", endTime: "19:00" }, // Tuesday
      { dayOfWeek: 3, startTime: "09:00", endTime: "19:00" }, // Wednesday
      { dayOfWeek: 4, startTime: "09:00", endTime: "19:00" }, // Thursday
      { dayOfWeek: 5, startTime: "09:00", endTime: "19:00" }, // Friday
      { dayOfWeek: 6, startTime: "09:00", endTime: "17:00" }, // Saturday
    ];

    for (const slot of schedule) {
      await prisma.barberAvailability.upsert({
        where: { barberId_dayOfWeek: { barberId: created.id, dayOfWeek: slot.dayOfWeek } },
        update: {},
        create: { barberId: created.id, ...slot, slotInterval: 30, bufferTime: 0 },
      });
    }
  }

  // Services
  const services: {
    name: string;
    slug: string;
    description: string;
    price: number;
    duration: number;
    category: ServiceCategory;
    afterHoursFee?: number;
    displayOrder: number;
    isHouseCall?: boolean;
  }[] = [
    {
      name: "Haircut",
      slug: "haircut",
      description: "Haircuts before opening hours (9 AM) and after hours (7 PM) have a $20 extra fee. Our signature precision haircut tailored to your style.",
      price: 45,
      duration: 60,
      category: "HAIRCUT",
      afterHoursFee: 20,
      displayOrder: 1,
    },
    {
      name: "Haircut w/ Enhancement",
      slug: "haircut-enhancement",
      description: "Elevate your look with a precision haircut plus our signature enhancement treatment for a fuller, richer finish.",
      price: 50,
      duration: 60,
      category: "ENHANCEMENT",
      displayOrder: 2,
    },
    {
      name: "Haircut & Design",
      slug: "haircut-design",
      description: "Express yourself with a precision cut plus custom artistic line designs crafted by our master barbers.",
      price: 55,
      duration: 75,
      category: "DESIGN",
      displayOrder: 3,
    },
    {
      name: "Haircut & Beard",
      slug: "haircut-beard",
      description: "The complete grooming experience. Precision haircut combined with expert beard sculpting. Services before opening hours (9 AM) and after hours (7 PM) have a $20 extra fee.",
      price: 60,
      duration: 60,
      category: "COMBO",
      afterHoursFee: 20,
      displayOrder: 4,
    },
    {
      name: "Beard Trim & Line Up w/ Hot Towel",
      slug: "beard-trim",
      description: "A luxurious beard service featuring precise trimming, clean line-ups, and a relaxing hot towel treatment for the ultimate grooming ritual.",
      price: 30,
      duration: 45,
      category: "BEARD",
      displayOrder: 5,
    },
    {
      name: "Shape Up (No Beard)",
      slug: "shape-up",
      description: "A quick, clean shape-up to keep your edges crisp and your look fresh between full appointments.",
      price: 20,
      duration: 15,
      category: "HAIRCUT",
      displayOrder: 6,
    },
    {
      name: "House Call",
      slug: "house-call",
      description: "We come to you. Price includes a 40-mile radius from our shop. The ultimate luxury grooming experience delivered to your door. Contact us for any questions.",
      price: 300,
      duration: 180,
      category: "HOUSE_CALL",
      isHouseCall: true,
      displayOrder: 7,
    },
  ];

  const createdServices: Record<string, string> = {};
  for (const service of services) {
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
    createdServices[service.slug] = created.id;
  }

  // Add-ons (not for house call)
  const addOns = [
    { name: "Eyebrows", price: 5, duration: 10, displayOrder: 1 },
    { name: "Hot Towel", price: 5, duration: 5, displayOrder: 2 },
    { name: "Hair Wash", price: 10, duration: 15, displayOrder: 3 },
    { name: "Enhancement Upgrade", price: 10, duration: 10, displayOrder: 4 },
  ];

  const standardServiceSlugs = ["haircut", "haircut-enhancement", "haircut-design", "haircut-beard", "beard-trim", "shape-up"];

  for (const addOn of addOns) {
    const existing = await prisma.addOn.findFirst({ where: { name: addOn.name } });
    if (!existing) {
      const serviceIds = standardServiceSlugs.map((s) => ({ id: createdServices[s] })).filter((s) => s.id);
      await prisma.addOn.create({
        data: { ...addOn, services: { connect: serviceIds } },
      });
    }
  }

  // Testimonials
  const testimonials = [
    { customerName: "Darius M.", rating: 5, content: "Alex gave me the cleanest fade I've ever had. The atmosphere is elite — feels like a luxury lounge, not just a barbershop. I'll never go anywhere else.", service: "Haircut", displayOrder: 1 },
    { customerName: "Kevin T.", rating: 5, content: "Walked in for a beard trim and left feeling like a new man. Marcus is an artist. The hot towel treatment alone is worth the trip.", service: "Beard Trim & Line Up w/ Hot Towel", displayOrder: 2 },
    { customerName: "Jordan P.", rating: 5, content: "Booked a house call for a special event and they absolutely delivered. Professional, on time, and my cut was perfect. 10/10.", service: "House Call", displayOrder: 3 },
    { customerName: "Marcus L.", rating: 5, content: "Best barbershop in the valley, period. The design on my fade was so crisp I got compliments all week. These guys are on another level.", service: "Haircut & Design", displayOrder: 4 },
    { customerName: "Chris V.", rating: 5, content: "I've been to shops in LA and Miami — Unfiltered matches that energy right here in Simi Valley. Booking is easy, the wait is non-existent, and the cuts are elite.", service: "Haircut", displayOrder: 5 },
    { customerName: "Anthony R.", rating: 5, content: "The haircut + beard combo is a total package. Jordan had me looking fresh for my interview and I got the job. These barbers are life changers.", service: "Haircut & Beard", displayOrder: 6 },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { customerName: t.customerName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  // FAQs
  const faqs = [
    { question: "Do you accept walk-ins?", answer: "We welcome walk-ins based on availability, but we strongly recommend booking online to guarantee your slot with your preferred barber. Our online booking system shows real-time availability so you can plan your visit perfectly.", displayOrder: 1 },
    { question: "How do I book an appointment?", answer: "Booking is easy — use our online booking system right here on our website. Select your service, choose your preferred barber and time, fill in your details, and you're all set. You'll receive an email confirmation instantly.", displayOrder: 2 },
    { question: "What haircut styles do you specialize in?", answer: "We specialize in precision fades (skin, low, mid, and high), modern textured cuts, beard sculpting, creative hair designs, and hair enhancements. Our barbers stay current on all the latest trends in men's grooming.", displayOrder: 3 },
    { question: "Do you cut kids' hair?", answer: "Yes! We cut hair for all ages. Kids' cuts are available at our standard haircut pricing. We recommend booking during our less busy mid-week morning slots for a more relaxed experience with younger clients.", displayOrder: 4 },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards, debit cards, cash, Venmo, CashApp, and Zelle. We do not require payment at the time of booking — you pay after your service.", displayOrder: 5 },
    { question: "Are beard services available as a standalone?", answer: "Absolutely. Our Beard Trim & Line Up with Hot Towel is a premium standalone service. We also offer beard grooming as an add-on to any haircut service.", displayOrder: 6 },
    { question: "Do you offer house calls?", answer: "Yes! Our House Call service brings the full Unfiltered experience to your location. The $300 service includes a 3-hour session within a 40-mile radius of our shop. Perfect for events, busy executives, or those who prefer in-home luxury. Contact us for details outside the standard radius.", displayOrder: 7 },
    { question: "What is your cancellation policy?", answer: "We ask that you cancel or reschedule at least 24 hours in advance. Late cancellations may result in a fee. No-shows may be required to prepay for future appointments. We respect your time and ask that you respect ours.", displayOrder: 8 },
  ];

  for (const faq of faqs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
