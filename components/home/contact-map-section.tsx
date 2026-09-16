"use client";
import { InstagramIcon } from '@/components/ui/instagram-icon';

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { BUSINESS_HOURS, SHOP_ADDRESS } from "@/lib/utils";

export function ContactMapSection() {
  return (
    <section className="py-24 px-4 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
            Find Us
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Visit Us in Simi Valley
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-[#1a1a1a] h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3293.7!2d-118.7609303!3d34.2687571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e829779b44ec43:0x80169315315984ae!2sUnfiltered+Barbershop!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Unfiltered Barbershop Location"
            />
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Address */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Our Location</p>
                <p className="text-gray-400 text-sm">1706 Erringer Rd Suite #4</p>
                <p className="text-gray-400 text-sm">Simi Valley, CA 93065</p>
                <a
                  href="https://maps.google.com/?q=1706+Erringer+Rd+Suite+4+Simi+Valley+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-opacity mt-1 inline-block text-transparent bg-clip-text hover:opacity-75"
                  style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}
                >
                  Get Directions →
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Phone</p>
                <a
                  href={`tel:${SHOP_ADDRESS.phoneHref}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {SHOP_ADDRESS.phone}
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                <InstagramIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Instagram</p>
                <a
                  href={`https://instagram.com/${SHOP_ADDRESS.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  @{SHOP_ADDRESS.instagram}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-white font-semibold">Business Hours</p>
              </div>
              <div className="space-y-2">
                {BUSINESS_HOURS.map((day) => (
                  <div key={day.day} className="flex justify-between text-sm">
                    <span className="text-gray-500">{day.day}</span>
                    <span className="text-gray-300">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


