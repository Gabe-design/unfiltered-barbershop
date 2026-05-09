"use client";

import { motion } from "framer-motion";
import {
  Users,
  Scissors,
  Star,
  Shield,
  Calendar,
  Award,
  Sparkles,
  Eye,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Users,
    title: "Expert Barbers",
    description:
      "Our team of seasoned professionals brings years of precision craft to every appointment.",
  },
  {
    icon: Scissors,
    title: "Precision Fades",
    description:
      "Flawless skin fades and tapers executed with razor-sharp accuracy every single time.",
  },
  {
    icon: Star,
    title: "5-Star Reputation",
    description:
      "Over 585 five-star reviews from real clients across Simi Valley and beyond.",
  },
  {
    icon: Shield,
    title: "Clean Environment",
    description:
      "Immaculate tools, sanitized stations, and a shop that reflects our standard of excellence.",
  },
  {
    icon: Calendar,
    title: "Online Booking",
    description:
      "Reserve your seat in seconds — no phone tag, no waiting, just seamless scheduling.",
  },
  {
    icon: Award,
    title: "Luxury Experience",
    description:
      "From the moment you walk in, every detail is curated for a premium, high-end experience.",
  },
  {
    icon: Sparkles,
    title: "Premium Products",
    description:
      "We use only top-tier grooming products to finish every cut and style perfectly.",
  },
  {
    icon: Eye,
    title: "Attention to Detail",
    description:
      "Every line, every edge, every fade is refined until it meets our uncompromising standard.",
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

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col gap-4 p-6 bg-[#111111] border border-[#1E1E1E] rounded-2xl hover:border-blue-500/25 transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(59,130,246,0.07)]"
    >
      {/* Icon container */}
      <div className="relative self-start">
        <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md group-hover:bg-blue-500/30 transition-colors duration-400" />
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/15 transition-colors duration-400">
          <Icon className="w-5 h-5 text-blue-400" strokeWidth={1.75} />
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-white font-bold text-base mb-2 leading-tight">
          {feature.title}
        </h3>
        <p className="text-white/45 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseSection() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(59,130,246,0.04),transparent)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-blue-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Why Choose Us
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
            Why Simi Valley Chooses{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Unfiltered
            </span>
          </h2>
          <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
            We don&apos;t just cut hair — we craft experiences. Here&apos;s what
            sets us apart from every other shop in the valley.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 py-8 border-t border-white/[0.06]"
        >
          {[
            { value: "585+", label: "Verified Reviews" },
            { value: "5.0★", label: "Average Rating" },
            { value: "7+", label: "Years Serving Simi Valley" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-white/40 text-xs font-medium tracking-widest uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

