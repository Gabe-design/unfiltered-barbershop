"use client";

import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Darius M.",
    review:
      "Alex gave me the cleanest fade I've ever had. The atmosphere is elite — feels like a luxury lounge.",
    service: "Haircut",
  },
  {
    name: "Kevin T.",
    review:
      "Walked in for a beard trim and left feeling like a new man. Marcus is an artist.",
    service: "Beard Trim",
  },
  {
    name: "Jordan P.",
    review:
      "Booked a house call for a special event and they absolutely delivered. Professional, on time.",
    service: "House Call",
  },
  {
    name: "Marcus L.",
    review:
      "Best barbershop in the valley, period. The design on my fade was so crisp I got compliments all week.",
    service: "Haircut & Design",
  },
  {
    name: "Chris V.",
    review:
      "I've been to shops in LA and Miami — Unfiltered matches that energy right here in Simi Valley.",
    service: "Haircut",
  },
  {
    name: "Anthony R.",
    review:
      "The haircut + beard combo is a total package. Jordan had me looking fresh for my interview.",
    service: "Haircut & Beard",
  },
];

const autoplayOptions = Autoplay({ delay: 4000, stopOnInteraction: false });

export default function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [autoplayOptions]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 bg-[#111111] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#3B82F6] uppercase mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            585+ Five-Star{" "}
            <span className="text-[#3B82F6]">Reviews</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Thousands of clients trust us for premium grooming. Here&apos;s
            what they have to say.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-12"
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-0"
                >
                  <div className="h-full bg-white/[0.03] backdrop-blur-sm border border-white/8 rounded-2xl p-7 hover:border-[#3B82F6]/20 transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-[#3B82F6] text-[#3B82F6]"
                        />
                      ))}
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed flex-1 mb-6 italic">
                      &ldquo;{t.review}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-white font-semibold text-sm">
                        {t.name}
                      </span>
                      <span className="text-xs font-semibold tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1">
                        {t.service}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#3B82F6]/20 hover:border-[#3B82F6]/40 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#3B82F6]/20 hover:border-[#3B82F6]/40 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
