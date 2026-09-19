"use client";

import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: "faq-1",
    question: "Do you accept walk-ins?",
    answer:
      "We're appointment only, so book online to lock in your barber and time. If you're nearby without one, call us and we'll tell you if a chair has opened up.",
  },
  {
    id: "faq-2",
    question: "How do I book an appointment?",
    answer:
      "Use our online booking system. Select your service, choose your barber and preferred time, then fill in your details. An email confirmation is sent instantly.",
  },
  {
    id: "faq-3",
    question: "What haircut styles do you specialize in?",
    answer:
      "Precision fades (skin, low, mid, high), modern textured cuts, beard sculpting, creative hair designs, and enhancements. Our barbers are trained in the latest techniques across all hair types.",
  },
  {
    id: "faq-4",
    question: "Do you cut kids' hair?",
    answer:
      "Yes! Kids' cuts are available at standard haircut pricing. We make the experience comfortable and enjoyable for younger clients.",
  },
  {
    id: "faq-5",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, cash, Venmo, CashApp, and Zelle. No minimum required for card payments.",
  },
  {
    id: "faq-6",
    question: "Are beard services available standalone?",
    answer:
      "Yes. Our Beard Trim & Line Up with Hot Towel is a premium standalone service. No haircut required - come in just for a clean beard experience.",
  },
  {
    id: "faq-7",
    question: "Do you offer house calls?",
    answer:
      "$300 includes a 3-hour session within a 40-mile radius of Simi Valley. Perfect for events, photoshoots, and busy executives who need premium grooming on their schedule.",
  },
  {
    id: "faq-8",
    question: "What is your cancellation policy?",
    answer:
      "Please cancel or reschedule at least 24 hours in advance. Late cancellations or no-shows may incur a fee to respect the time of our barbers.",
  },
];

function FaqItem({
  faq,
  isOpen,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
}) {
  return (
    <Accordion.Item
      value={faq.id}
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-amber-500/40 bg-[#DC2626]/5"
          : "border-white/8 bg-[#111111] hover:border-white/15"
      }`}
    >
      <Accordion.Header>
        <Accordion.Trigger className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group">
          <span
            className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
              isOpen ? "text-transparent bg-clip-text" : "text-white group-hover:text-white/90"
            }`}
          style={isOpen ? { backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" } : undefined}
          >
            {faq.question}
          </span>
          <span
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 ${
              isOpen
                ? "bg-[#DC2626] border-[#DC2626] text-white"
                : "border-white/20 text-white/40 group-hover:border-white/40 group-hover:text-white/60"
            }`}
          >
            {isOpen ? <Minus size={12} /> : <Plus size={12} />}
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="px-6 pb-5">
          <p className="text-white/55 text-sm leading-relaxed">{faq.answer}</p>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function FaqSection() {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Got Questions?{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>We&apos;ve Got Answers.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Accordion.Root
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="flex flex-col gap-3"
          >
            {faqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openItem === faq.id}
              />
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  );
}
