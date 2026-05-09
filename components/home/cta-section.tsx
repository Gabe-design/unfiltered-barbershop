"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Scissors } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.12) 0%, transparent 70%), linear-gradient(180deg, #0A0A0A 0%, #0d1117 50%, #0A0A0A 100%)",
        }}
      />

      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.03) 79px, rgba(255,255,255,0.03) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.03) 79px, rgba(255,255,255,0.03) 80px)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#3B82F6] uppercase mb-6">
            <Scissors size={14} />
            READY TO ELEVATE
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Your Next Fresh Cut{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
              }}
            >
              Starts Here.
            </span>
          </h2>

          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join 585+ satisfied clients who trust Unfiltered Barbershop for
            their premium grooming experience.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/booking"
              className="inline-flex items-center gap-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm tracking-wide px-8 py-4 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300"
            >
              <Scissors size={16} />
              Book Appointment
            </Link>

            <a
              href="tel:+18055550100"
              className="inline-flex items-center gap-2.5 bg-transparent border border-white/20 hover:border-white/50 text-white/80 hover:text-white font-semibold text-sm tracking-wide px-8 py-4 rounded-full transition-all duration-300"
            >
              <Phone size={16} />
              Call Now
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 text-white/25 text-sm"
        >
          <span>Walk-Ins Welcome</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Mon – Sat</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Simi Valley, CA</span>
        </motion.div>
      </div>
    </section>
  );
}
