import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEO_PAGES = [
  {
    slug: "best-barber-simi-valley",
    title: "Best Barber in Simi Valley",
    metaTitle: "Best Barber in Simi Valley CA | Unfiltered Barbershop",
    metaDescription: "Looking for the best barber in Simi Valley? Unfiltered Barbershop offers precision fades, beard trims, and luxury grooming with 585+ 5-star reviews. Book online today.",
    h1: "The Best Barber in Simi Valley",
    content: "<p>Unfiltered Barbershop is Simi Valley's top-rated barbershop, delivering premium cuts and a luxury grooming experience for every client. With over 585 five-star Google reviews, we've built a reputation for precision, professionalism, and making every client feel like a VIP.</p><p>Our master barbers specialize in precision fades, beard grooming, hair designs, and luxury enhancements — all tailored to your unique style. Whether you're after a classic taper or a creative design cut, we've got you covered.</p>",
  },
  {
    slug: "fade-haircut-simi-valley",
    title: "Fade Haircut in Simi Valley",
    metaTitle: "Fade Haircut Simi Valley CA | Unfiltered Barbershop",
    metaDescription: "Get the cleanest fade haircut in Simi Valley at Unfiltered Barbershop. Expert fade specialists, 585+ reviews, online booking available. Starting at $45.",
    h1: "Precision Fade Haircuts in Simi Valley",
    content: "<p>Unfiltered Barbershop is Simi Valley's go-to destination for precision fade haircuts. Our barbers have mastered skin fades, mid fades, high fades, and tapers — delivering clean, sharp results every single time.</p><p>We use premium tools and techniques to ensure your fade blends seamlessly. From classic to contemporary, our team brings your vision to life with expert craftsmanship and attention to detail.</p>",
  },
  {
    slug: "beard-trim-simi-valley",
    title: "Beard Trim in Simi Valley",
    metaTitle: "Beard Trim Simi Valley CA | Unfiltered Barbershop",
    metaDescription: "Professional beard trim and line up services in Simi Valley. Hot towel treatment, precision shaping, and expert beard grooming starting at $30. Book online.",
    h1: "Expert Beard Trim & Grooming in Simi Valley",
    content: "<p>At Unfiltered Barbershop, beard grooming is an art form. Our beard specialists deliver sharp line-ups, precision shaping, and hot towel treatments that leave your beard looking immaculate. Whether you want a neat trim or a bold, styled beard, we have the expertise to make it happen.</p><p>Our beard services include hot towel application, precision trimming, edge definition, and styling — all delivered in a premium, relaxed environment.</p>",
  },
  {
    slug: "mens-haircut-simi-valley",
    title: "Men's Haircut in Simi Valley",
    metaTitle: "Men's Haircut Simi Valley CA | Unfiltered Barbershop",
    metaDescription: "Premium men's haircuts in Simi Valley starting at $45. Expert barbers, luxury experience, 585+ 5-star reviews. Online booking available at Unfiltered Barbershop.",
    h1: "Premium Men's Haircuts in Simi Valley",
    content: "<p>Unfiltered Barbershop offers the ultimate men's haircut experience in Simi Valley. Our team of skilled barbers delivers precision cuts with an elevated, luxury feel — whether you're in for a quick shape-up or a full transformation.</p><p>Every haircut includes a thorough consultation to understand your style goals, followed by expert craftsmanship that ensures you leave looking and feeling your best.</p>",
  },
  {
    slug: "barbershop-near-me-simi-valley",
    title: "Barbershop Near Me in Simi Valley",
    metaTitle: "Barbershop Near Me Simi Valley | Unfiltered Barbershop",
    metaDescription: "Searching for a barbershop near you in Simi Valley? Unfiltered Barbershop is located at 1706 Erringer Rd Suite #4. Walk-ins welcome, online booking available.",
    h1: "Your Local Barbershop in Simi Valley",
    content: "<p>Searching for a premium barbershop in Simi Valley? Unfiltered Barbershop is conveniently located at 1706 Erringer Rd Suite #4 in Simi Valley, CA — serving the entire Simi Valley area including Moorpark, Thousand Oaks, and surrounding communities.</p><p>We offer flexible hours including evenings and weekends, with online booking available so you can secure your slot from your phone. Walk-ins are also welcome based on availability.</p>",
  },
];

async function main() {
  console.log("🌱 Seeding SEO pages...");

  for (const page of SEO_PAGES) {
    await prisma.seoPage.upsert({
      where: { slug: page.slug },
      update: { ...page, updatedAt: new Date() },
      create: { ...page, isActive: true },
    });
    console.log(`✓ ${page.slug}`);
  }

  // Also seed default AppSettings if not exist
  await prisma.appSettings.upsert({
    where: { id: "global" },
    update: {},
    create: {
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
      shopPhone: "+18059999999",
      instagramUrl: "https://instagram.com/unfilteredbarbershop",
    },
  });
  console.log("✓ AppSettings");

  console.log("✅ SEO seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
