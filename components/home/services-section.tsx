"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

interface Service {
  name: string;
  price: number;
  duration: string;
  description: string;
}

const services: Service[] = [
  {
    name: "Haircut",
    price: 45,
    duration: "60 min",
    description: "Our signature precision haircut tailored to your style.",
  },
  {
    name: "Haircut w/ Enhancement",
    price: 50,
    duration: "60 min",
    description: "Elevate your look with our signature enhancement treatment.",
  },
  {
    name: "Haircut & Design",
    price: 55,
    duration: "75 min",
    description: "Express yourself with custom artistic line designs.",
  },
  {
    name: "Haircut & Beard",
    price: 60,
    duration: "60 min",
    description: "The complete grooming experience.",
  },
  {
    name: "Beard Trim & Line Up w/ Hot Towel",
    price: 30,
    duration: "45 min",
    description: "A luxurious beard service with hot towel treatment.",
  },
  {
    name: "Shape Up (No Beard)",
    price: 20,
    duration: "15 min",
    description: "Keep your edges crisp and your look fresh.",
  },
  {
    name: "House Call",
    price: 300,
    duration: "3 hr",
    description: "We come to you within a 40-mile radius.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  },
};

function ServiceCard({ service }: { service: Service }) {
  const isHouseCall = service.name === "House Call";

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col bg-[#111111] border border-[#262626] rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)]"
    >
      {/* House Call premium badge */}
      {isHouseCall && (
        <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg shadow-blue-500/30">
          Premium
        </div>
      )}

      {/* Top row: name + price */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-white font-bold text-base leading-tight group-hover:text-white transition-colors">
          {service.name}
        </h3>
        <span className="text-blue-400 font-black text-xl shrink-0">
          ${service.price}
        </span>
      </div>

      {/* Duration badge */}
      <div className="inline-flex items-center gap-1.5 mb-4 self-start">
        <Clock className="w-3 h-3 text-white/40" />
        <span className="text-white/40 text-xs font-medium">{service.duration}</span>
      </div>

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed flex-1 mb-6">
        {service.description}
      </p>

      {/* Book Now */}
      <Link
        href="/booking"
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-600 text-white/80 hover:text-white text-sm font-semibold transition-all duration-300 group/btn"
      >
        Book Now
        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-blue-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Our Services
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
            Every Cut, A Masterpiece.
          </h2>
          <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
            From precision fades to luxury house calls — every service is crafted
            to perfection by our expert barbers.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
        >
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm tracking-wide transition-colors group"
          >
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

