"use client";
import { InstagramIcon } from '@/components/ui/instagram-icon';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BUSINESS_HOURS, SHOP_ADDRESS } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const serviceOptions = [
  "Haircut - $45",
  "Haircut w/ Enhancement - $50",
  "Haircut & Design - $55",
  "Haircut & Beard - $60",
  "Beard Trim & Line Up w/ Hot Towel - $30",
  "Shape Up (No Beard) - $20",
  "House Call - $300",
  "General Inquiry",
];

const testimonials = [
  {
    name: "Darius M.",
    review:
      "Alex gave me the cleanest fade I've ever had. The atmosphere is elite - feels like a luxury lounge, not a typical barbershop.",
    service: "Haircut",
  },
  {
    name: "Kevin T.",
    review:
      "Walked in for a beard trim and left feeling like a new man. Marcus is an absolute artist with a straight razor.",
    service: "Beard Trim",
  },
  {
    name: "Marcus L.",
    review:
      "Best barbershop in the valley, period. The design on my fade was so crisp I got compliments all week long.",
    service: "Haircut & Design",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  }

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
                Reach Out
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                Get In{" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
                  Touch
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
                Questions, bookings, or just want to say hello - we&apos;re here. Drop us
                a message and we&apos;ll get back to you quickly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Two-column layout */}
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT: Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-[#111111] border border-[#262626] rounded-3xl p-7 sm:p-9">
                  <h2 className="text-white font-black text-2xl mb-2">Send a Message</h2>
                  <p className="text-white/40 text-sm mb-7">
                    Fill out the form below and we&apos;ll respond within 24 hours.
                  </p>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-10 gap-4"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-white font-bold text-xl">Message Sent!</h3>
                      <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                        Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                        In the meantime, feel free to book online.
                      </p>
                      <Link
                        href="/booking"
                        className="mt-2 inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:brightness-110"
                        style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
                      >
                        Book Appointment
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-white/35 hover:text-white/60 text-sm transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="w-full bg-white/5 border border-[#2a2a2a] hover:border-red-500/30 focus:border-red-500/60 focus:outline-none rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full bg-white/5 border border-[#2a2a2a] hover:border-red-500/30 focus:border-red-500/60 focus:outline-none rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm transition-colors"
                        />
                      </div>

                      {/* Phone (optional) */}
                      <div>
                        <label htmlFor="phone" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                          Phone Number{" "}
                          <span className="text-white/25 normal-case font-normal">(optional)</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="(805) 000-0000"
                          className="w-full bg-white/5 border border-[#2a2a2a] hover:border-red-500/30 focus:border-red-500/60 focus:outline-none rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm transition-colors"
                        />
                      </div>

                      {/* Service */}
                      <div>
                        <label htmlFor="service" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                          Service Interest
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          className="w-full bg-[#0f0f0f] border border-[#2a2a2a] hover:border-red-500/30 focus:border-red-500/60 focus:outline-none rounded-xl px-4 py-3.5 text-sm transition-colors appearance-none cursor-pointer"
                          style={{ color: form.service ? "white" : "rgba(255,255,255,0.25)" }}
                        >
                          <option value="" disabled className="text-white/40 bg-[#111111]">
                            Select a service...
                          </option>
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt} className="text-white bg-[#111111]">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us what's on your mind..."
                          className="w-full bg-white/5 border border-[#2a2a2a] hover:border-red-500/30 focus:border-red-500/60 focus:outline-none rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm transition-colors resize-none"
                        />
                      </div>

                      {/* Error */}
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                        style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* RIGHT: Info cards */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col gap-5"
              >
                {/* Address */}
                <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Location</p>
                    <a
                      href="https://maps.google.com/?q=1706+Erringer+Rd+Suite+4+Simi+Valley+CA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 text-sm hover:text-white transition-colors flex items-start gap-1 group"
                    >
                      1706 Erringer Rd Suite #4
                      <br />
                      Simi Valley, CA 93065
                      <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Phone</p>
                    <a
                      href={`tel:${SHOP_ADDRESS.phone.replace(/\D/g, "")}`}
                      className="text-white/50 text-sm hover:text-white transition-colors"
                    >
                      {SHOP_ADDRESS.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Email</p>
                    <a
                      href={`mailto:${SHOP_ADDRESS.email}`}
                      className="text-white/50 text-sm hover:text-white transition-colors break-all"
                    >
                      {SHOP_ADDRESS.email}
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                    <InstagramIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Instagram</p>
                    <a
                      href={`https://instagram.com/${SHOP_ADDRESS.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 text-sm hover:text-white transition-colors"
                    >
                      @{SHOP_ADDRESS.instagram}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm">Business Hours</p>
                  </div>
                  <ul className="space-y-2">
                    {BUSINESS_HOURS.map((day) => (
                      <li key={day.day} className="flex justify-between text-sm">
                        <span className="text-white/40">{day.day}</span>
                        <span className="text-white/70 font-medium">{day.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="pb-20 px-4 sm:px-6" id="map">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-[#262626]"
              style={{ height: "420px" }}
            >
              <iframe
                title="Unfiltered Barbershop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3293.7!2d-118.7609303!3d34.2687571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e829779b44ec43:0x80169315315984ae!2sUnfiltered+Barbershop!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.85) contrast(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 px-4 sm:px-6 border-t border-[#1a1a1a]" id="reviews">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-yellow-400">
                Google Reviews
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                585+ Five-Star Reviews
              </h2>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/40 text-sm">Rated 5.0 on Google Business</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[#111111] border border-[#262626] hover:border-red-500/25 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-5 italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-white font-semibold text-sm">{t.name}</span>
                    <span className="text-xs font-semibold text-yellow-400 border border-yellow-400/20 rounded-full px-3 py-1">
                      {t.service}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <a
                href="https://www.google.com/maps/search/?api=1&query=Unfiltered+Barbershop+Simi+Valley"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#111111] hover:bg-[#161616] border border-[#262626] hover:border-red-500/30 text-white font-semibold px-7 py-4 rounded-2xl transition-all duration-200 group"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Read All Reviews on Google
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-red-700/12 to-red-900/5 border border-red-500/20 rounded-3xl p-10 sm:p-12 text-center overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-500/10 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                  Ready to Look Your Best?
                </h2>
                <p className="text-white/50 text-base mb-8 max-w-md mx-auto leading-relaxed">
                  Book your appointment online in under 2 minutes. No phone call needed.
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
