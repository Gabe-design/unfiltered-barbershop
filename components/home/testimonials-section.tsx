"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Jonathan Contreras",
    review:
      "I can confidently say this is hands down the best barbershop experience I've ever had. From the moment I walked in, I was greeted with a warm welcome. Absolutely coming back.",
    service: "Haircut",
  },
  {
    name: "John Guzman",
    review:
      "Ya just don't come for a haircut. Ya come to get the best experience. Every one of these guys are amazing, professional and welcome you like you're part of a tight knit group. Money well spent.",
    service: "Haircut",
  },
  {
    name: "Deandre Wright",
    review:
      "If you want an amazing, clean, high end location — incredible work, attention to detail, a friendly and knowledgeable barber. One of the best barber experiences you will ever have.",
    service: "Haircut",
  },
  {
    name: "Alex Dominguez",
    review:
      "I was genuinely surprised at the quality of my haircut and the accuracy of what I asked for. EM hooked it up for sure. I'll be back soon!",
    service: "Haircut",
  },
  {
    name: "chad griebel",
    review:
      "First time here with my 8 year old son — the cut looks great! Everyone was so nice and accommodating. Very happy with our experience!",
    service: "Haircut",
  },
  {
    name: "Pedro Rangel",
    review:
      "Cut came out legit. Great conversation too. Will definitely be back.",
    service: "Haircut",
  },
  {
    name: "Sue",
    review:
      "Sal is great!! Loved the haircut and will definitely be back!!",
    service: "Haircut & Design",
  },
  {
    name: "Ace",
    review:
      "Cory is the GOAT. It was quick and easy to schedule with him and he did a great job helping me figure out what exactly I wanted.",
    service: "Haircut",
  },
  {
    name: "Kelli",
    review:
      "Juan was amazing! My son is super happy with his haircut!",
    service: "Haircut",
  },
  {
    name: "RAD",
    review:
      "Roman definitely deserves 5-Stars! Stayed super late to take an impromptu appointment for me. Sweet haircut, great atmosphere with cool fishtank & definitely the best Barbershop in Simi. A+",
    service: "Haircut",
  },
  {
    name: "Anthony Salcido",
    review:
      "When I showed up I was impressed by how clean the barbershop was! Everything spotless! Hospitable and professional! They offered my young sons snacks and me a cold beverage. Leylo took his time and left me with a clean cut.",
    service: "Haircut",
  },
  {
    name: "Saul Leyva",
    review:
      "Great service, everyone is super friendly and it seems like an awesome place to regularly get your haircuts. 10/10",
    service: "Haircut",
  },
  {
    name: "Raymond Avalos",
    review:
      "Awesome possum. Great haircut. Great vibes. They turned me from a solid 3 to a flaky 7.8 best they could do bcuz I'm ugly.",
    service: "Haircut",
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
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            What{" "}
            <span className="text-yellow-400">Gentlemen</span>
            {" "}Say
          </h2>
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
                  <div className="h-full bg-white/[0.03] backdrop-blur-sm border border-white/8 rounded-2xl p-7 hover:border-amber-500/20 transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
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
                      <span className="text-xs font-semibold tracking-wider text-yellow-400 border border-yellow-400/20 rounded-full px-3 py-1">
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
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
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
