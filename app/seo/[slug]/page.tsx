import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Star, Clock, ArrowRight } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await prisma.seoPage.findUnique({ where: { slug: params.slug } });
  if (!page) return {};

  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? undefined,
    openGraph: {
      title: page.metaTitle ?? page.title,
      description: page.metaDescription ?? undefined,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  try {
    const pages = await prisma.seoPage.findMany({ where: { isActive: true }, select: { slug: true } });
    return pages.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

const SERVICES = [
  { name: "Haircut", price: "$45", duration: "1 Hour" },
  { name: "Haircut & Design", price: "$55", duration: "1 hr 15 min" },
  { name: "Haircut & Beard", price: "$60", duration: "1 Hour" },
  { name: "Beard Trim & Line Up", price: "$30", duration: "45 min" },
  { name: "Shape Up", price: "$20", duration: "15 min" },
];

const REVIEWS = [
  { name: "Marcus T.", text: "Best fade in Simi Valley, hands down. Alex is an artist.", rating: 5 },
  { name: "Daniel R.", text: "Clean shop, great vibes, perfect cut every single time.", rating: 5 },
  { name: "Kevin L.", text: "Drove from Thousand Oaks and it was 100% worth it.", rating: 5 },
];

export default async function SeoLandingPage({ params }: Props) {
  const page = await prisma.seoPage.findUnique({ where: { slug: params.slug, isActive: true } });
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "Unfiltered Barbershop",
    description: page.metaDescription,
    url: `https://unfilteredbarbershop.com/seo/${page.slug}`,
    telephone: "+18059999999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1706 Erringer Rd Suite #4",
      addressLocality: "Simi Valley",
      addressRegion: "CA",
      postalCode: "93065",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "585" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "17:00" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Hero */}
        <section className="relative py-24 px-6 text-center bg-gradient-to-b from-[#0F0F1A] to-[#0A0A0A]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-zinc-400 text-sm">585+ Reviews</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              {page.h1 ?? page.title}
            </h1>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              {page.metaDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+18059999999"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </section>

        {/* Content from CMS */}
        {page.content && (
          <section className="max-w-3xl mx-auto px-6 py-12">
            <div
              className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </section>
        )}

        {/* Services */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Services & Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <div key={s.name} className="bg-[#111111] border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{s.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{s.duration}</p>
                </div>
                <span className="text-blue-400 font-bold text-lg">{s.price}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors text-sm">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-[#0F0F0F] py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What Clients Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {REVIEWS.map((r) => (
                <div key={r.name} className="bg-[#111111] border border-zinc-800 rounded-xl p-5">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-3">&quot;{r.text}&quot;</p>
                  <p className="text-zinc-500 text-xs font-medium">— {r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Find Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">1706 Erringer Rd Suite #4</p>
                  <p className="text-zinc-400 text-sm">Simi Valley, CA 93065</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+18059999999" className="text-white hover:text-blue-400 transition-colors">(805) 999-9999</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-zinc-400 space-y-1">
                  <p><span className="text-white">Mon–Fri</span> 9 AM – 7 PM</p>
                  <p><span className="text-white">Saturday</span> 9 AM – 5 PM</p>
                  <p><span className="text-white">Sunday</span> 10 AM – 2 PM</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3296.9!2d-118.7815!3d34.2694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDE2JzA5LjgiTiAxMTjCsDQ2JzUzLjQiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-[#0F0F1A] to-[#0A0A0A] py-16 px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready for Your Best Cut?</h2>
          <p className="text-zinc-400 mb-8">Book online in seconds. No waiting, no guessing.</p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
          >
            Book Appointment <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
