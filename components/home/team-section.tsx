"use client";

import { useEffect, useState } from "react";
import { InstagramIcon } from '@/components/ui/instagram-icon';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

interface BarberData {
  slug: string;
  name: string;
  specialty: string | null;
  bio: string | null;
  instagram: string | null;
  image: string | null;
  rating: number;
}

function instagramHandle(raw: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
    .replace(/\/$/, "")
    .replace(/^@/, "");
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export default function TeamSection() {
  const [barbers, setBarbers] = useState<BarberData[]>([]);

  useEffect(() => {
    fetch("/api/barbers")
      .then((r) => r.json())
      .then((data) => setBarbers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

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
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
            OUR TEAM
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Master Barbers.{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>Elite Results.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {barbers.map((barber) => {
            const handle = instagramHandle(barber.instagram);
            return (
              <motion.div
                key={barber.slug}
                variants={cardVariants}
                className="group relative bg-[#111111] rounded-2xl p-8 border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.08)] flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden bg-zinc-700 flex items-center justify-center">
                    {barber.image ? (
                      <Image
                        src={barber.image}
                        alt={barber.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">{barber.name.charAt(0)}</span>
                    )}
                  </div>
                  {handle && (
                    <a
                      href={`https://www.instagram.com/${handle}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-white/70 transition-colors duration-200 mt-1"
                      aria-label={`${barber.name} on Instagram`}
                    >
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {barber.name}
                  </h3>
                  {barber.specialty && (
                    <span className="inline-block text-xs font-semibold tracking-wider text-transparent bg-clip-text border border-white/10 rounded-full px-3 py-1 uppercase" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
                      {barber.specialty}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
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
                  className="flex items-center justify-center gap-2 w-full border border-white/10 text-white rounded-xl py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
                >
                  Book With Me
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            );
          })}
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
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-semibold tracking-wide transition-colors duration-200 group"
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
