"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  Scissors,
  Star,
  Home,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Service {
  name: string;
  price: number;
  duration: string;
  description: string;
  afterHoursNote?: string;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

interface Addon {
  name: string;
  price: number;
  description: string;
  icon: ReactNode;
}

const services: Service[] = [
  {
    name: "Haircut",
    price: 45,
    duration: "60 min",
    description:
      "Our signature precision haircut, tailored to your face shape and personal style. Includes a consultation, shampoo, and a detailed finish with clippers and shears for a clean, polished look every time.",
    afterHoursNote: "+$20 after-hours fee applies outside regular business hours.",
  },
  {
    name: "Haircut w/ Enhancement",
    price: 50,
    duration: "60 min",
    description:
      "Elevate your look with our signature cut combined with a professional hair enhancement treatment. Get a richer, more defined texture and finish that turns heads from the moment you leave the chair.",
  },
  {
    name: "Haircut & Design",
    price: 55,
    duration: "75 min",
    description:
      "Express yourself with a precision cut topped with custom artistic line designs. Our barbers work with you to create a unique design that reflects your personality — geometric, freehand, or logo-inspired.",
  },
  {
    name: "Haircut & Beard",
    price: 60,
    duration: "60 min",
    description:
      "The complete grooming experience. A full precision haircut paired with a detailed beard trim, shaping, and lineup — sculpted to perfection and finished with a hot towel treatment.",
    afterHoursNote: "+$20 after-hours fee applies outside regular business hours.",
    highlight: true,
  },
  {
    name: "Beard Trim & Line Up w/ Hot Towel",
    price: 30,
    duration: "45 min",
    description:
      "A luxurious standalone beard service. We shape, trim, and line up your beard to perfection, then finish with a relaxing hot towel treatment that soothes the skin and sharpens your lines.",
  },
  {
    name: "Shape Up (No Beard)",
    price: 20,
    duration: "15 min",
    description:
      "Keep your edges crisp and your look fresh between cuts. A quick, precise lineup of your hairline — perfect for maintaining your style without a full service.",
  },
  {
    name: "House Call",
    price: 300,
    duration: "3 hrs",
    description:
      "We come to you. Our barber brings the full shop experience to your location — home, office, event, or photoshoot. Price includes travel within a 40-mile radius of Simi Valley, CA.",
    badge: "Premium",
    badgeColor: "blue",
  },
];

const addons: Addon[] = [
  {
    name: "Eyebrows",
    price: 5,
    description: "Clean, shaped eyebrow lineup for a polished finish.",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    name: "Hot Towel",
    price: 5,
    description: "A warm, relaxing hot towel treatment to open pores and refresh your skin.",
    icon: <Star className="w-4 h-4" />,
  },
  {
    name: "Hair Wash",
    price: 10,
    description: "Deep shampoo and conditioning rinse for a clean, fresh base.",
    icon: <Scissors className="w-4 h-4" />,
  },
  {
    name: "Enhancement Upgrade",
    price: 10,
    description: "Add our signature enhancement treatment to any existing service.",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  },
};

function ServiceCard({ service }: { service: Service }) {
  const isHouseCall = service.name === "House Call";

  return (
    <motion.div
      variants={cardVariants}
      className={`group relative flex flex-col bg-[#111111] border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(59,130,246,0.1)] ${
        service.highlight
          ? "border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.08)]"
          : "border-[#262626] hover:border-blue-500/30"
      }`}
    >
      {/* Badges */}
      {service.badge && (
        <div className="absolute -top-3.5 left-6">
          <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/30">
            <Home className="w-3 h-3" />
            {service.badge}
          </span>
        </div>
      )}
      {service.highlight && !service.badge && (
        <div className="absolute -top-3.5 left-6">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/30">
            <Star className="w-3 h-3 fill-white" />
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3 mt-2">
        <h3 className="text-white font-bold text-lg leading-tight">{service.name}</h3>
        <div className="text-right shrink-0">
          <span className="text-blue-400 font-black text-2xl">${service.price}</span>
        </div>
      </div>

      {/* Duration */}
      <div className="inline-flex items-center gap-1.5 mb-5 self-start">
        <Clock className="w-3.5 h-3.5 text-white/35" />
        <span className="text-white/35 text-xs font-medium tracking-wide">
          {service.duration}
        </span>
      </div>

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed flex-1 mb-5">
        {service.description}
      </p>

      {/* After Hours Note */}
      {service.afterHoursNote && (
        <div className="flex items-start gap-2 mb-5 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-400/80 text-xs leading-relaxed">
            {service.afterHoursNote}
          </p>
        </div>
      )}

      {/* House Call radius note */}
      {isHouseCall && (
        <div className="flex items-start gap-2 mb-5 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
          <Home className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-blue-400/80 text-xs leading-relaxed">
            Includes travel within 40-mile radius of Simi Valley, CA.
          </p>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/booking"
        className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-600 text-white/70 hover:text-white text-sm font-semibold transition-all duration-300 group/btn"
      >
        Book This Service
        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

function AddonCard({ addon }: { addon: Addon }) {
  return (
    <motion.div
      variants={cardVariants}
      className="flex items-start gap-4 bg-[#111111] border border-[#262626] hover:border-blue-500/25 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(59,130,246,0.07)] group"
    >
      <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600/25 transition-colors">
        {addon.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h4 className="text-white font-semibold text-sm">{addon.name}</h4>
          <span className="text-blue-400 font-bold text-base shrink-0">+${addon.price}</span>
        </div>
        <p className="text-white/45 text-xs leading-relaxed">{addon.description}</p>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#0A0A0A] min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-500 uppercase mb-5">
                Pricing & Services
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                Our{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Services
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
                From precision fades to luxury house calls — every service is executed by
                skilled barbers who take pride in their craft.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => (
                <ServiceCard key={service.name} service={service} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-500 uppercase mb-4">
                Enhancements
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                Add-On Services
              </h2>
              <p className="text-white/45 text-base max-w-lg mx-auto">
                Upgrade any service with these finishing touches. Ask your barber to add
                these to your booking at checkout.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {addons.map((addon) => (
                <AddonCard key={addon.name} addon={addon} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Notes */}
        <section className="pb-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#111111] border border-[#262626] rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                Pricing Notes
              </h3>
              <ul className="space-y-2.5 text-sm text-white/50 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  After-hours appointments (outside 9 AM – 7 PM) incur a $20 additional fee for select services.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Add-ons can be requested at the time of booking or discussed with your barber.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  House Call pricing includes a 40-mile radius from Simi Valley, CA. Additional mileage may apply.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  All prices are subject to change. Confirmed booking prices are honored at the time of appointment.
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-blue-600/15 to-blue-800/5 border border-blue-500/20 rounded-3xl p-10 sm:p-14 text-center overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/15 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <Scissors className="w-10 h-10 text-blue-400 mx-auto mb-5" />
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                  Ready to Book Your Appointment?
                </h2>
                <p className="text-white/50 text-base mb-8 max-w-md mx-auto leading-relaxed">
                  Select your service, choose your barber, and lock in your slot. It takes
                  less than 2 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
                  >
                    <Scissors className="w-5 h-5" />
                    Book Now
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200"
                  >
                    Contact Us
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

