"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, Minus, Search, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn, SHOP_ADDRESS } from "@/lib/utils";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "faq-1",
    category: "Appointments",
    question: "Do you accept walk-ins?",
    answer:
      "We're appointment only. Booking online takes under two minutes and locks in your preferred barber and time. If you're nearby without an appointment, call us and we'll tell you if a chair has opened up.",
  },
  {
    id: "faq-2",
    category: "Appointments",
    question: "How do I book an appointment?",
    answer:
      `Use our online booking system at the 'Book Appointment' link. Select your service, choose your preferred barber, pick a date and time, and fill in your contact details. A confirmation email is sent instantly upon booking. You can also call us at ${SHOP_ADDRESS.phone} during business hours.`,
  },
  {
    id: "faq-3",
    category: "Services",
    question: "What haircut styles do you specialize in?",
    answer:
      "Our barbers are trained in a wide range of styles including precision skin fades, low/mid/high fades, modern textured cuts, classic scissor cuts, beard sculpting, creative hair designs, and hair enhancements. We work across all hair types - straight, wavy, curly, and coily. If you have a reference photo, bring it in or send it ahead of time.",
  },
  {
    id: "faq-4",
    category: "Services",
    question: "Do you cut kids' hair?",
    answer:
      "Yes! Kids' cuts are available at our standard haircut pricing. Our barbers are patient and experienced with younger clients and we work to make the experience comfortable and fun. We recommend booking during weekday morning hours for a more relaxed environment for kids.",
  },
  {
    id: "faq-5",
    category: "Pricing & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, Amex), debit cards, cash, Venmo, CashApp, and Zelle. There is no minimum purchase required for card payments. Gratuity is always appreciated but never required - it can be added to card payments at checkout.",
  },
  {
    id: "faq-6",
    category: "Services",
    question: "Are beard services available as a standalone appointment?",
    answer:
      "Absolutely. Our Beard Trim & Line Up with Hot Towel is a premium standalone service at $30 for 45 minutes. No haircut required. You can come in exclusively for a beard service and leave looking completely clean and refined. We also offer a Shape Up (No Beard) for quick edge maintenance at $20.",
  },
  {
    id: "faq-7",
    category: "Services",
    question: "Do you offer house calls?",
    answer:
      "Yes - our House Call service is available at $300 for a 3-hour session. This includes a barber traveling to your location (home, office, event, or photoshoot) within a 40-mile radius of Simi Valley, CA. Additional mileage may incur extra charges. House calls are perfect for events, executives, or anyone who prefers the Unfiltered experience on their terms.",
  },
  {
    id: "faq-8",
    category: "Appointments",
    question: "What is your cancellation and no-show policy?",
    answer:
      "We ask that you cancel or reschedule at least 24 hours in advance. This gives us time to offer the slot to another client. Late cancellations (within 24 hours) or no-shows may incur a fee of up to 50% of the service price. We understand emergencies happen - please reach out and we'll work with you. Repeated no-shows may result in loss of booking privileges.",
  },
];

const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

function FAQItem({ faq, isOpen }: { faq: FAQ; isOpen: boolean }) {
  return (
    <Accordion.Item
      value={faq.id}
      className={cn(
        "border rounded-xl overflow-hidden transition-all duration-300",
        isOpen
          ? "border-red-500/40 bg-red-700/5"
          : "border-[#262626] bg-[#111111] hover:border-[#333333]"
      )}
    >
      <Accordion.Header>
        <Accordion.Trigger className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group">
          <span
            className={cn(
              "text-sm sm:text-base font-semibold leading-snug transition-colors duration-200",
              isOpen ? "text-transparent bg-clip-text" : "text-white group-hover:text-white/90"
            )}
            style={isOpen ? { backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" } : undefined}
          >
            {faq.question}
          </span>
          <span
            className={cn(
              "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200",
              isOpen
                ? "bg-red-700 border-red-700 text-white"
                : "border-[#303030] text-white/35 group-hover:border-white/30 group-hover:text-white/60"
            )}
          >
            {isOpen ? <Minus size={13} /> : <Plus size={13} />}
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="px-6 pb-6">
          <p className="text-white/55 text-sm leading-relaxed">{faq.answer}</p>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openItem, setOpenItem] = useState<string>("");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <>
      <Navbar />
      <main className="bg-[#0A0A0A] min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-700/7 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-5 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
                Support
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
                  Questions
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
                Everything you need to know about booking, services, pricing, and
                what to expect at Unfiltered Barbershop.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search + Filter */}
        <section className="pb-8 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Search input */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30 pointer-events-none" style={{ width: 18, height: 18 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full bg-[#111111] border border-[#262626] hover:border-red-500/30 focus:border-red-500/50 focus:outline-none rounded-2xl pl-11 pr-5 py-4 text-white placeholder-white/25 text-sm transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 text-xs font-medium transition-colors"
                >
                  Clear
                </button>
              )}
            </motion.div>

            {/* Category filter */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    activeCategory === cat
                      ? "bg-red-700 text-white shadow-lg shadow-red-600/20"
                      : "bg-[#111111] border border-[#262626] text-white/45 hover:text-white hover:border-red-500/25"
                  )}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-4 pb-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {filtered.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Accordion.Root
                  type="single"
                  collapsible
                  value={openItem}
                  onValueChange={setOpenItem}
                  className="flex flex-col gap-3"
                >
                  {filtered.map((faq) => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isOpen={openItem === faq.id}
                    />
                  ))}
                </Accordion.Root>

                <p className="text-white/25 text-xs text-center mt-6">
                  Showing {filtered.length} of {faqs.length} questions
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-white/25" />
                </div>
                <p className="text-white/40 text-base font-medium mb-2">No results found</p>
                <p className="text-white/25 text-sm">
                  Try a different search term or{" "}
                  <button
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                    className="underline transition-opacity text-transparent bg-clip-text hover:opacity-75"
                    style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}
                  >
                    clear filters
                  </button>
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 pb-24 border-t border-[#1a1a1a]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-red-700/12 to-red-900/5 border border-red-500/20 rounded-3xl p-10 sm:p-12 text-center overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/10 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-red-700/15 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-6 h-6 text-white/70" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                  Still Have Questions?
                </h2>
                <p className="text-white/50 text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
                  Can&apos;t find the answer you&apos;re looking for? Reach out directly and we&apos;ll
                  get back to you promptly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-red-600/25 active:scale-95"
                  >
                    Contact Us
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200"
                  >
                    Book Appointment
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
