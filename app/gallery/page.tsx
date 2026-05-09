"use client";
import { InstagramIcon } from '@/components/ui/instagram-icon';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

type Category = "All" | "Fades" | "Beards" | "Designs" | "Shop";

interface GalleryItem {
  id: number;
  label: string;
  category: Exclude<Category, "All">;
  gradient: string;
  tall?: boolean;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    label: "Skin Fade — High & Tight",
    category: "Fades",
    gradient: "from-blue-900/80 via-blue-800/50 to-slate-900",
    tall: true,
  },
  {
    id: 2,
    label: "Full Beard Sculpt",
    category: "Beards",
    gradient: "from-slate-800/90 via-blue-900/40 to-slate-900",
  },
  {
    id: 3,
    label: "Geometric Line Art",
    category: "Designs",
    gradient: "from-indigo-900/80 via-blue-900/50 to-slate-900",
  },
  {
    id: 4,
    label: "Mid Fade — Textured Top",
    category: "Fades",
    gradient: "from-blue-800/70 via-slate-800/60 to-slate-900",
  },
  {
    id: 5,
    label: "Shop Interior — Chairs",
    category: "Shop",
    gradient: "from-slate-700/80 via-slate-800/70 to-slate-900",
    tall: true,
  },
  {
    id: 6,
    label: "Beard Line Up w/ Hot Towel",
    category: "Beards",
    gradient: "from-blue-900/60 via-indigo-900/50 to-slate-900",
  },
  {
    id: 7,
    label: "Creative Design — Spider",
    category: "Designs",
    gradient: "from-indigo-800/80 via-blue-800/60 to-slate-900",
    tall: true,
  },
  {
    id: 8,
    label: "Low Fade — Classic Style",
    category: "Fades",
    gradient: "from-blue-700/60 via-blue-900/50 to-slate-900",
  },
  {
    id: 9,
    label: "Shop — Waiting Area",
    category: "Shop",
    gradient: "from-slate-600/70 via-slate-800/60 to-slate-900",
  },
  {
    id: 10,
    label: "Taper Fade — Curly Top",
    category: "Fades",
    gradient: "from-blue-800/80 via-blue-700/40 to-slate-900",
  },
  {
    id: 11,
    label: "Logo Design — Custom Brand",
    category: "Designs",
    gradient: "from-indigo-900/90 via-blue-800/60 to-slate-900",
    tall: true,
  },
  {
    id: 12,
    label: "Goatee Shape Up",
    category: "Beards",
    gradient: "from-slate-800/80 via-blue-900/50 to-slate-900",
  },
];

const filterTabs: Category[] = ["All", "Fades", "Beards", "Designs", "Shop"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number,number,number,number] },
  },
};

function GalleryCard({ item }: { item: GalleryItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      variants={itemVariants}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer group",
        item.tall ? "row-span-2" : "row-span-1"
      )}
      style={{ minHeight: item.tall ? "420px" : "200px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-transform duration-500",
          item.gradient,
          hovered ? "scale-110" : "scale-100"
        )}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Barber pole decorative element */}
      <div className="absolute top-4 right-4 w-1.5 h-12 rounded-full overflow-hidden opacity-30">
        <div
          className="w-full h-full"
          style={{
            background:
              "repeating-linear-gradient(45deg, #3B82F6 0px, #3B82F6 4px, white 4px, white 8px, #ef4444 8px, #ef4444 12px, white 12px, white 16px)",
          }}
        />
      </div>

      {/* Eye icon — visible on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white"
      >
        <Eye className="w-4 h-4" />
      </motion.div>

      {/* Category chip */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <span className="bg-blue-600/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Label overlay — slides up on hover */}
      <motion.div
        animate={{ y: hovered ? 0 : "100%", opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-5 py-5"
      >
        <p className="text-white font-semibold text-sm">{item.label}</p>
        <p className="text-white/50 text-xs mt-0.5">Unfiltered Barbershop · Simi Valley</p>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const filtered =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <>
      <Navbar />
      <main className="bg-[#0A0A0A] min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/7 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-500 uppercase mb-5">
                Portfolio
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                The{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Work
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
                Every cut tells a story. Browse our portfolio of precision fades,
                sculpted beards, and custom designs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="pb-10 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center flex-wrap gap-2"
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    activeFilter === tab
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-[#111111] border border-[#262626] text-white/50 hover:text-white hover:border-blue-500/30"
                  )}
                >
                  {tab}
                  {activeFilter === tab && (
                    <span className="ml-2 text-xs bg-blue-500/30 rounded-full px-1.5 py-0.5">
                      {tab === "All" ? galleryItems.length : galleryItems.filter((i) => i.category === tab).length}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]"
              >
                {filtered.map((item) => (
                  <GalleryCard key={item.id} item={item} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-white/30 text-lg">No items in this category yet.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* InstagramIcon CTA */}
        <section className="py-16 px-4 sm:px-6 border-t border-[#1a1a1a]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-blue-600/12 to-indigo-900/8 border border-blue-500/20 rounded-3xl p-10 sm:p-14 text-center overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/12 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-500/20 flex items-center justify-center mx-auto mb-6">
                  <InstagramIcon className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                  Follow Our Work
                </h2>
                <p className="text-white/50 text-base mb-8 max-w-md mx-auto leading-relaxed">
                  We drop fresh content daily on InstagramIcon — new cuts, behind-the-scenes,
                  and exclusive specials. Don't miss out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://InstagramIcon.com/unfilteredbarbershop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-pink-500/20 active:scale-95"
                  >
                    <InstagramIcon className="w-5 h-5" />
                    @unfilteredbarbershop
                  </a>
                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200"
                  >
                    Book Your Cut
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


