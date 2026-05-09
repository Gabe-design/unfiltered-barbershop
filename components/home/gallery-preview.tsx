"use client";
import { InstagramIcon } from '@/components/ui/instagram-icon';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const galleryItems = [
  { id: 1, label: "Skin Fade", col: "col-span-1", row: "row-span-2" },
  { id: 2, label: "Beard Sculpt", col: "col-span-1", row: "row-span-1" },
  { id: 3, label: "Design Work", col: "col-span-1", row: "row-span-1" },
  { id: 4, label: "Shop Vibes", col: "col-span-1", row: "row-span-1" },
  { id: 5, label: "Mid Fade", col: "col-span-1", row: "row-span-1" },
  { id: 6, label: "Lineup", col: "col-span-1", row: "row-span-2" },
];

const gradients = [
  "from-blue-900/80 to-black",
  "from-slate-800/80 to-black",
  "from-blue-800/60 to-slate-900",
  "from-gray-800/80 to-black",
  "from-slate-700/80 to-black",
  "from-blue-950/80 to-black",
];

export function GalleryPreview() {
  return (
    <section className="py-24 px-4 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              The Work
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Our Craft Speaks<br />for Itself.
            </h2>
          </div>
          <Link
            href="/gallery"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors group"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[200px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                i === 0 ? "row-span-2" : i === 5 ? "row-span-2" : "row-span-1"
              }`}
            >
              {/* Simulated photo with gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradients[i]} transition-transform duration-500 group-hover:scale-105`}
              />
              {/* Grid texture overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)",
                }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-semibold">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* InstagramIcon CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/unfilteredbarbershop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#111111] border border-[#262626] hover:border-pink-500/40 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
          >
            <InstagramIcon className="w-5 h-5 text-pink-400" />
            Follow @unfilteredbarbershop
          </a>
        </motion.div>
      </div>
    </section>
  );
}


