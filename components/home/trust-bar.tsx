"use client";

import { motion } from "framer-motion";

const trustItems = [
  "585+ 5-Star Reviews",
  "Trusted in Simi Valley",
  "Precision Fades",
  "Same Day Appointments",
  "Luxury Experience",
  "Professional Barbers",
  "5.0 ⭐ Rating",
  "House Calls Available",
];

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-5 shrink-0">
      <span className="text-white/80 text-sm font-semibold tracking-wide whitespace-nowrap">
        {text}
      </span>
      <span className="text-blue-500 text-xs select-none">◆</span>
    </div>
  );
}

export default function TrustBar() {
  // Duplicate items so the loop is seamless
  const items = [...trustItems, ...trustItems, ...trustItems];

  return (
    <div className="relative bg-[#0D0D0D] border-t border-b border-white/[0.06] overflow-hidden py-4">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0D0D0D] to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0D0D0D] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-5 items-center"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: [0, 0, 1, 1] as [number,number,number,number],
          repeatType: "loop",
        }}
      >
        {items.map((item, index) => (
          <TrustItem key={`${item}-${index}`} text={item} />
        ))}
      </motion.div>
    </div>
  );
}

