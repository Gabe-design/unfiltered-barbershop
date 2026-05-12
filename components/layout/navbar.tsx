"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Scissors } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Team" },
  { href: "/contact#reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/un.PNG"
              alt="Unfiltered Barbershop"
              width={180}
              height={72}
              className="h-16 w-auto object-contain"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7)) drop-shadow(0 0 12px rgba(255,255,255,0.4))" }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+18055550100"
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              (805) 555-0100
            </a>
            <Link
              href="/booking"
              className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-95"
              style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20 px-4"
          >
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-5 py-4 rounded-xl text-lg font-semibold transition-colors",
                      pathname === link.href
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="tel:+18055550100"
                className="flex items-center justify-center gap-2 border border-white/20 text-white font-semibold py-4 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <Link
                href="/booking"
                className="flex items-center justify-center text-white font-semibold py-4 rounded-xl transition-all duration-200 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky booking button — hidden on the booking page itself */}
      <div className={`lg:hidden fixed bottom-6 left-4 right-4 z-30 ${pathname.startsWith("/booking") ? "hidden" : ""}`}>
        <Link
          href="/booking"
          className="flex items-center justify-center gap-2 w-full text-white font-bold py-4 rounded-2xl shadow-2xl transition-all active:scale-95 hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)", boxShadow: "0 8px 32px rgba(185,28,28,0.3), 0 8px 32px rgba(29,78,216,0.2)" }}
        >
          <Scissors className="w-5 h-5" />
          Book Your Cut
        </Link>
      </div>
    </>
  );
}
