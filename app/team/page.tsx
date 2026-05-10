"use client";
import { InstagramIcon } from '@/components/ui/instagram-icon';

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ArrowRight, Scissors, Mail, Award } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Barber {
  name: string;
  role: string;
  experience: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  instagram: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
  skills: string[];
  image?: string;
}

const barbers: Barber[] = [
  {
    name: "Roman Morales",
    role: "Master Barber",
    experience: "8+ Years",
    specialty: "Precision Fades & Designs",
    bio: "Roman has been behind the chair for over 8 years, honing his craft from the streets of LA to the luxury shops of the Valley. Known for his unmatched precision in skin fades and razor-sharp design work, Roman approaches every cut as a blank canvas. His technical mastery and attention to detail have earned him a loyal following of clients who won't sit in anyone else's chair.",
    rating: 5.0,
    reviewCount: 234,
    instagram: "@rmblends",
    initials: "RM",
    gradientFrom: "#1e3a5f",
    gradientTo: "#0f2040",
    skills: ["Skin Fades", "Hair Designs", "Texturizing", "Classic Cuts", "Enhancements"],
    image: "/barbers/roman-morales.jpeg",
  },
  {
    name: "Erick Mendoza",
    role: "Senior Barber",
    experience: "6+ Years",
    specialty: "Beard Grooming & Styling",
    bio: "Erick is the go-to barber for clients who take their beard as seriously as their cut. With 6 years of experience and a meticulous eye for symmetry, he transforms every beard into a statement. His hot towel treatments and razor-sharp line-ups have built him a reputation as one of the most trusted names in the Valley.",
    rating: 5.0,
    reviewCount: 198,
    instagram: "@erickm_barber",
    initials: "EM",
    gradientFrom: "#1a2f4a",
    gradientTo: "#0d1f35",
    skills: ["Beard Sculpting", "Skin Fades", "Line Ups", "Hot Towel", "Classic Cuts"],
  },
  {
    name: "Fitted",
    role: "Barber & Artist",
    experience: "5+ Years",
    specialty: "Hair Enhancements & Line Art",
    bio: "Fitted brings a creative edge to every appointment. Known for his bold hair designs and seamless enhancement work, he turns heads and starts conversations. Five years deep in the craft, Fitted operates at the intersection of precision and artistry — every line intentional, every cut a reflection of the client's identity.",
    rating: 5.0,
    reviewCount: 153,
    instagram: "@fitted_cuts",
    initials: "FT",
    gradientFrom: "#1c2f4a",
    gradientTo: "#0e1e35",
    skills: ["Line Art", "Enhancements", "Creative Designs", "Fades", "Shape Ups"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  },
};

function BarberCard({ barber }: { barber: Barber }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#111111] border border-[#262626] hover:border-blue-500/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_16px_60px_rgba(59,130,246,0.09)] group"
    >
      {/* Top visual: avatar + gradient header */}
      <div
        className="relative h-52 flex items-end px-8 pb-0"
        style={{
          background: `linear-gradient(135deg, ${barber.gradientFrom} 0%, ${barber.gradientTo} 100%)`,
        }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(59,130,246,0.4) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Avatar */}
        <div className="relative -mb-10 z-10">
          <div className="w-20 h-20 rounded-2xl border-4 border-[#111111] shadow-2xl overflow-hidden">
            {barber.image ? (
              <Image
                src={barber.image}
                alt={barber.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white font-black text-xl tracking-wider">{barber.initials}</span>
              </div>
            )}
          </div>
        </div>

        {/* Experience badge */}
        <div className="absolute top-5 right-6 bg-black/40 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-1.5">
          <span className="text-white/80 text-xs font-bold tracking-wide">{barber.experience}</span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-8 pb-8">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-white font-black text-2xl leading-none mb-1">
              {barber.name}
            </h3>
            <p className="text-blue-400 text-sm font-semibold">{barber.role}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
              ))}
            </div>
            <p className="text-white/40 text-xs font-medium">
              {barber.rating} ({barber.reviewCount} reviews)
            </p>
          </div>
        </div>

        {/* Specialty badge */}
        <div className="inline-flex items-center gap-1.5 bg-blue-600/12 border border-blue-500/20 rounded-full px-3.5 py-1.5 mb-5 mt-3">
          <Award className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-400 text-xs font-semibold">{barber.specialty}</span>
        </div>

        {/* Bio */}
        <p className="text-white/55 text-sm leading-relaxed mb-6">{barber.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-7">
          {barber.skills.map((skill) => (
            <span
              key={skill}
              className="bg-white/5 border border-white/10 text-white/50 text-xs font-medium px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/booking"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3.5 px-5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 group/btn"
          >
            <Scissors className="w-4 h-4" />
            Book With {barber.name.split(" ")[0]}
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href={`https://instagram.com/${barber.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-semibold py-3.5 px-5 rounded-xl transition-all duration-200"
          >
            <InstagramIcon className="w-4 h-4" />
            {barber.instagram}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#0A0A0A] min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/7 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-500 uppercase mb-5">
                The Crew
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                Meet Our{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Team
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
                Three barbers. One standard: excellence. Every cut is a commitment to
                the craft and to you.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-8 mt-10"
            >
              {[
                { value: "585+", label: "5-Star Reviews" },
                { value: "3", label: "Expert Barbers" },
                { value: "5.0", label: "Avg Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-blue-400">{stat.value}</p>
                  <p className="text-white/40 text-xs font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Cards */}
        <section className="py-8 pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-7"
            >
              {barbers.map((barber) => (
                <BarberCard key={barber.name} barber={barber} />
              ))}
            </motion.div>
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
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-600/8 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                  <Scissors className="w-6 h-6 text-blue-400" />
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
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
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


