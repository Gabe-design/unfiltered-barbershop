"use client";
import { InstagramIcon } from '@/components/ui/instagram-icon';

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const barbers = [
  {
    name: "Alex Reyes",
    initials: "AR",
    color: "#3B82F6",
    specialty: "Precision Fades & Designs",
    rating: 5.0,
    bio: "Master barber with 8+ years specializing in precision fades and creative designs.",
    instagram: "https://instagram.com/alexreyes_cuts",
  },
  {
    name: "Marcus Williams",
    initials: "MW",
    color: "#6366F1",
    specialty: "Beard Grooming & Styling",
    rating: 5.0,
    bio: "Beard specialist and hair artisan with meticulous attention to detail.",
    instagram: "https://instagram.com/marcuswilliams_barber",
  },
  {
    name: "Jordan Cruz",
    initials: "JC",
    color: "#8B5CF6",
    specialty: "Hair Enhancements & Line Art",
    rating: 5.0,
    bio: "Fresh cuts with a modern twist, known for creative line work.",
    instagram: "https://instagram.com/jordancruz_fresh",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as [number,number,number,number],
    },
  },
};

export default function TeamSection() {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#3B82F6] uppercase mb-4">
            OUR TEAM
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Master Barbers.{" "}
            <span className="text-[#3B82F6]">Elite Results.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {barbers.map((barber) => (
            <motion.div
              key={barber.name}
              variants={cardVariants}
              className="group relative bg-[#111111] rounded-2xl p-8 border border-white/5 hover:border-[#3B82F6]/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)] flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: barber.color }}
                >
                  {barber.initials}
                </div>
                <a
                  href={barber.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#3B82F6] transition-colors duration-200 mt-1"
                  aria-label={`${barber.name} on Instagram`}
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>

              <div className="mb-3">
                <h3 className="text-xl font-bold text-white mb-2">
                  {barber.name}
                </h3>
                <span className="inline-block text-xs font-semibold tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 uppercase">
                  {barber.specialty}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#3B82F6] text-[#3B82F6]"
                  />
                ))}
                <span className="text-white/60 text-sm ml-1">
                  {barber.rating.toFixed(1)}
                </span>
              </div>

              <p className="text-white/50 text-sm leading-relaxed flex-1 mb-6">
                {barber.bio}
              </p>

              <Link
                href="/booking"
                className="flex items-center justify-center gap-2 w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6] border border-[#3B82F6]/30 hover:border-[#3B82F6] text-[#3B82F6] hover:text-white rounded-xl py-3 text-sm font-semibold tracking-wide transition-all duration-300"
              >
                Book With Me
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#3B82F6] text-sm font-semibold tracking-wide transition-colors duration-200 group"
          >
            Meet The Full Team
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


