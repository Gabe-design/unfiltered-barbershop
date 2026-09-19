"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, MapPin, Award, Clock } from "lucide-react";
import { SHOP_STATS } from "@/lib/utils";

const stats = [
  {
    value: SHOP_STATS.reviewCountLabel,
    label: "Five-Star Reviews",
    icon: Star,
  },
  {
    value: "5.0",
    label: "Average Rating",
    icon: Award,
  },
  {
    value: "7+",
    label: "Years of Excellence",
    icon: Clock,
  },
  {
    value: "#1",
    label: "Barbershop in Simi Valley",
    icon: MapPin,
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-5 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
              OUR STORY
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              More Than a Cut.{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>It&apos;s an Experience.</span>
            </h2>

            <div className="space-y-5 text-white/55 text-[15px] leading-relaxed">
              <p>
                Unfiltered Barbershop was built on a simple belief: every client
                deserves more than a quick haircut. We deliver a curated grooming
                experience where precision, artistry, and hospitality come
                together in one premium environment.
              </p>
              <p>
                Located in the heart of Simi Valley, we&apos;ve spent over seven
                years refining our craft and earning the trust of our community.
                Our barbers aren&apos;t just skilled - they&apos;re dedicated
                professionals who treat every appointment as an opportunity to
                deliver their best work.
              </p>
              <p>
                We stay at the forefront of modern grooming culture: from
                precision skin fades and creative line art to beard sculpting
                and hair enhancements. Whether you&apos;re walking in for a
                weekly maintenance cut or booking a house call for a major
                event, the standard never drops.
              </p>
              <p>
                Unfiltered isn&apos;t just a barbershop - it&apos;s where
                confidence is built, communities are connected, and
                craftsmanship is never compromised.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-white font-semibold text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-300 hover:brightness-110 group"
                style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
              >
                Meet The Team
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="bg-[#0A0A0A] border border-white/8 rounded-3xl p-8 lg:p-10">
              <p className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase mb-8">
                BY THE NUMBERS
              </p>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex flex-col"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <span className="text-3xl font-bold text-white tracking-tight mb-1">
                        {stat.value}
                      </span>
                      <span className="text-white/40 text-xs leading-snug">
                        {stat.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["AR", "MW", "JC"].map((initials, i) => (
                      <div
                        key={initials}
                        className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-white text-[10px] font-bold"
                        style={{
                          backgroundColor: ["#DC2626", "#6366F1", "#8B5CF6"][i],
                        }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs leading-tight">
                    One team of barbers.
                    <br />
                    One uncompromising standard.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
