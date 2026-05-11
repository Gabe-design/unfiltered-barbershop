import { InstagramIcon } from '@/components/ui/instagram-icon';
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { BUSINESS_HOURS, SHOP_ADDRESS } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/un.PNG"
                alt="Unfiltered Barbershop"
                width={180}
                height={72}
                className="h-14 w-auto object-contain"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7)) drop-shadow(0 0 12px rgba(255,255,255,0.4))" }}
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Simi Valley&apos;s premier luxury barbershop. Precision cuts, modern culture,
              and an elite grooming experience you won&apos;t find anywhere else.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${SHOP_ADDRESS.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500/50 transition-all"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/gallery", label: "Gallery" },
                { href: "/team", label: "Our Team" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
                { href: "/booking", label: "Book Appointment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                <Clock className="w-3 h-3 text-white" />
              </span>
              Hours
            </h4>
            <ul className="space-y-2">
              {BUSINESS_HOURS.map((day) => (
                <li key={day.day} className="flex justify-between text-sm">
                  <span className="text-gray-500">{day.day}</span>
                  <span className="text-gray-300">{day.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://maps.google.com/?q=1706+Erringer+Rd+Suite+4+Simi+Valley+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-500 hover:text-white text-sm transition-colors group"
                >
                  <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                    <MapPin className="w-3 h-3 text-white" />
                  </span>
                  <span>
                    1706 Erringer Rd Suite #4
                    <br />
                    Simi Valley, CA 93065
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+18055550100"
                  className="flex items-center gap-3 text-gray-500 hover:text-white text-sm transition-colors"
                >
                  <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                    <Phone className="w-3 h-3 text-white" />
                  </span>
                  (805) 555-0100
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@unfilteredbarbershop.com"
                  className="flex items-center gap-3 text-gray-500 hover:text-white text-sm transition-colors"
                >
                  <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
                    <Mail className="w-3 h-3 text-white" />
                  </span>
                  info@unfilteredbarbershop.com
                </a>
              </li>
            </ul>

            <Link
              href="/booking"
              className="mt-6 w-full flex items-center justify-center text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 hover:brightness-110 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
            >
              Book Appointment
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} Unfiltered Barbershop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



