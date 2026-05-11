"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Phone, Scissors } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number,number,number,number], delay },
  }),
};

const stats = [
  { value: "585+", label: "Reviews" },
  { value: "5.0", label: "Stars" },
  { value: "7+", label: "Years" },
  { value: "Same Day", label: "Booking" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/landing-page.png"
          alt="Unfiltered Barbershop interior"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
          style={{ background: "linear-gradient(to right, rgba(185,28,28,0.5), rgba(255,255,255,0.15), rgba(29,78,216,0.5))" }}
        >
          <Scissors className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          <span className="text-white text-xs font-semibold tracking-widest uppercase">
            Simi Valley&apos;s Premier Barbershop
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          custom={0.15}
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <Image
            src="/un.PNG"
            alt="Unfiltered Barbershop"
            width={500}
            height={200}
            className="w-auto mx-auto"
            style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(255,255,255,0.25))" }}
            priority
          />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          custom={0.3}
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl text-white/60 max-w-xl mb-10 leading-relaxed"
        >
          Simi Valley&apos;s trusted barbershop with{" "}
          <span className="text-white font-semibold">585+ 5-star reviews.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={0.45}
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <Link
            href="/booking"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base tracking-wide transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)", boxShadow: "0 0 30px rgba(185,28,28,0.3), 0 0 30px rgba(29,78,216,0.2)" }}
          >
            Book Appointment
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <Link
            href="tel:+18054380050"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold text-base tracking-wide transition-all duration-300 hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </Link>
        </motion.div>

        {/* Floating Review Card */}
        <motion.div
          custom={0.6}
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="relative mb-16 max-w-sm w-full"
        >
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
            {/* Barber pole glow on card */}
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(185,28,28,0.15) 0%, transparent 50%, rgba(29,78,216,0.15) 100%)" }} />
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/90 text-sm leading-relaxed italic mb-3">
              &ldquo;Fantastic cut, as always. My boy loved the cut RM Blends gave him.&rdquo;
            </p>
            <p className="text-white/70 text-sm font-semibold">- Jeff</p>
            {/* Verified badge */}
            <div className="absolute -top-3 -right-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white tracking-wide shadow-lg" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
              VERIFIED
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={0.7 + index * 0.1}
                variants={slideUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center py-5 px-4 bg-[#0A0A0A] hover:bg-[#111111] transition-colors duration-300"
              >
                <span className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {stat.value}
                </span>
                <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: [0.4, 0, 0.6, 1] as [number,number,number,number] }}
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

