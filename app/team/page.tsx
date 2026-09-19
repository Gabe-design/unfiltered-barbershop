"use client";

import { useEffect, useState } from "react";
import { InstagramIcon } from '@/components/ui/instagram-icon';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ArrowRight, Scissors, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SHOP_STATS } from "@/lib/utils";

interface BarberData {
  slug: string;
  name: string;
  specialty: string | null;
  bio: string | null;
  instagram: string | null;
  image: string | null;
  rating: number;
  reviewCount: number;
}

function instagramHandle(raw: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
    .replace(/\/$/, "")
    .replace(/^@/, "");
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

function BarberCard({ barber }: { barber: BarberData }) {
  const handle = instagramHandle(barber.instagram);

  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#111111] border border-[#262626] hover:border-red-500/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_16px_60px_rgba(220,38,38,0.09)] group"
    >
      {/* Card header with avatar */}
      <div
        className="relative h-52 flex items-end px-8 pb-0"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(220,38,38,0.4) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative -mb-10 z-10">
          <div className="w-20 h-20 rounded-2xl border-4 border-[#111111] shadow-2xl overflow-hidden bg-zinc-700 flex items-center justify-center">
            {barber.image ? (
              <Image
                src={barber.image}
                alt={barber.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                <span className="text-white font-black text-xl tracking-wider">
                  {barber.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-8 pb-8">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-white font-black text-2xl leading-none mb-1">
              {barber.name}
            </h3>
            {barber.specialty && (
              <p className="text-sm font-semibold text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
                {barber.specialty}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-amber-400" />
              ))}
            </div>
            <p className="text-white/40 text-xs font-medium">
              {barber.rating} ({barber.reviewCount} reviews)
            </p>
          </div>
        </div>

        {barber.bio && (
          <p className="text-white/55 text-sm leading-relaxed mt-4 mb-6">{barber.bio}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/booking"
            className="flex-1 inline-flex items-center justify-center gap-2 text-white font-semibold text-sm py-3.5 px-5 rounded-xl transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-red-600/20 active:scale-95 group/btn"
            style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
          >
            <Scissors className="w-4 h-4" />
            Book With {barber.name.split(" ")[0]}
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
          {handle && (
            <a
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-semibold py-3.5 px-5 rounded-xl transition-all duration-200"
            >
              <InstagramIcon className="w-4 h-4" />
              @{handle}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const [barbers, setBarbers] = useState<BarberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/barbers")
      .then((r) => r.json())
      .then((data) => setBarbers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#0A0A0A] min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-700/7 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-5 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
                The Crew
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                Meet Our{" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
                  Team
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
                Three barbers. One standard: excellence. Every cut is a commitment to
                the craft and to you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-8 mt-10"
            >
              {[
                { value: SHOP_STATS.reviewCountLabel, label: "5-Star Reviews" },
                { value: String(barbers.length || "3"), label: "Expert Barbers" },
                { value: SHOP_STATS.rating, label: "Avg Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>{stat.value}</p>
                  <p className="text-white/40 text-xs font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Cards */}
        <section className="py-8 pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-7"
              >
                {barbers.map((barber) => (
                  <BarberCard key={barber.slug} barber={barber} />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Join Our Team */}
        <section className="py-16 px-4 sm:px-6 border-t border-[#1a1a1a]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-[#111111] border border-[#262626] rounded-3xl p-10 sm:p-14 text-center overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-700/8 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                  Join Our Team
                </h2>
                <p className="text-white/50 text-base mb-8 max-w-md mx-auto leading-relaxed">
                  Are you a skilled barber who takes pride in their craft? We&apos;re always
                  looking for talent that fits the Unfiltered standard. Reach out and
                  let&apos;s talk.
                </p>
                <a
                  href="mailto:careers@unfilteredbarbershop.com"
                  className="inline-flex items-center gap-2.5 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-red-600/25 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
                >
                  <Mail className="w-5 h-5" />
                  careers@unfilteredbarbershop.com
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
