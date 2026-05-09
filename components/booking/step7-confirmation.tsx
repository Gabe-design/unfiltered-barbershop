"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  CheckCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  MapPin,
  Mail,
  Home,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useBookingStore, ADD_ONS } from "@/lib/booking-store";
import { cn, formatCurrency, formatDuration, formatTime, SHOP_ADDRESS } from "@/lib/utils";

// ─── Confetti ─────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  rotation: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ["#3B82F6", "#60A5FA", "#93C5FD", "#FFFFFF", "#D4AF37", "#F5E27A"];
    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: p.rotation }}
            animate={{
              y: "110vh",
              opacity: [1, 1, 0],
              rotate: p.rotation + 720,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: [0.4, 0, 1, 1] as [number,number,number,number] }}
            style={{
              position: "fixed",
              top: 0,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200",
        copied
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/15 border border-white/10"
      )}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy ID
        </>
      )}
    </button>
  );
}

// ─── What's Next Step ─────────────────────────────────────────────────────────

function NextStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + number * 0.1 }}
      className="flex items-start gap-4"
    >
      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Step7Confirmation() {
  const {
    confirmationId,
    service,
    selectedAddOns,
    date,
    startTime,
    barber,
    totalPrice,
    totalDuration,
    isHouseCall,
    houseCallAddress,
    houseCallCity,
    houseCallZip,
    customerName,
    customerEmail,
    reset,
  } = useBookingStore();

  const activeAddOns = ADD_ONS.filter((a) => (selectedAddOns[a.id] ?? 0) > 0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="w-full max-w-2xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-600/20 border-2 border-blue-500/50 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-blue-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
          >
            You're All Set!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm"
          >
            Your booking has been confirmed. See you soon, {customerName.split(" ")[0]}!
          </motion.p>
        </motion.div>

        {/* Confirmation ID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-5 mb-5 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-[10px] text-blue-300 uppercase tracking-widest font-medium mb-1">
              Confirmation ID
            </p>
            <p className="text-white font-mono font-bold text-lg tracking-wider">
              {confirmationId ?? "UB-XXXXXXX"}
            </p>
          </div>
          <CopyButton text={confirmationId ?? "UB-XXXXXXX"} />
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden mb-5"
        >
          <div className="px-5 py-3.5 border-b border-[#1e1e1e]">
            <p className="text-white font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Appointment Details
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Service</p>
                <p className="text-white text-sm font-medium">{service?.name}</p>
                {activeAddOns.length > 0 && (
                  <p className="text-gray-500 text-xs mt-0.5">
                    + {activeAddOns.map((a) => a.name).join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Date & Time</p>
                <p className="text-white text-sm font-medium">
                  {date ? format(date, "EEEE, MMMM d, yyyy") : "—"}
                  {startTime && ` at ${formatTime(startTime)}`}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Duration: {formatDuration(totalDuration)}
                </p>
              </div>
            </div>

            {/* Barber */}
            {barber && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Barber</p>
                  <p className="text-white text-sm font-medium">
                    {barber.id === "no-preference" ? "Next Available Barber" : barber.name}
                  </p>
                  {barber.specialty && barber.id !== "no-preference" && (
                    <p className="text-gray-500 text-xs mt-0.5">{barber.specialty}</p>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {isHouseCall ? (
                  <Home className="w-4 h-4 text-blue-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">
                  {isHouseCall ? "House Call Address" : "Location"}
                </p>
                {isHouseCall ? (
                  <p className="text-white text-sm font-medium">
                    {houseCallAddress}, {houseCallCity}, CA {houseCallZip}
                  </p>
                ) : (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${SHOP_ADDRESS.street}, ${SHOP_ADDRESS.city}, ${SHOP_ADDRESS.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm font-medium flex items-center gap-1 hover:text-blue-400 transition-colors group"
                  >
                    {SHOP_ADDRESS.street}, {SHOP_ADDRESS.city}, {SHOP_ADDRESS.state}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-[#1e1e1e] pt-4 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Due at Appointment</span>
              <span className="text-white font-bold text-xl">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </motion.div>

        {/* Email Confirmation Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-6"
        >
          <Mail className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-gray-400 text-xs leading-relaxed">
            A confirmation email has been sent to{" "}
            <span className="text-white font-medium">{customerEmail}</span>. Check
            your spam folder if you don't see it within a few minutes.
          </p>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="bg-[#111111] border border-[#262626] rounded-2xl p-5 mb-8"
        >
          <p className="text-white font-semibold text-sm mb-5">What&apos;s Next?</p>
          <div className="space-y-4">
            <NextStep
              number={1}
              title="Check Your Email"
              description="Your confirmation email has all the booking details and a link to reschedule if needed."
            />
            <NextStep
              number={2}
              title="Add to Calendar"
              description="Don't forget your appointment! Save it to your calendar so you get a reminder."
            />
            <NextStep
              number={3}
              title="Arrive a Few Minutes Early"
              description="Come in 5 minutes before your appointment time so we can get you set up right away."
            />
            <NextStep
              number={4}
              title="Pay at the Shop"
              description={`No deposit required. Pay ${formatCurrency(totalPrice)} when you arrive. We accept cash and all major cards.`}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={reset}
            className="flex-1 py-3.5 rounded-xl border border-[#262626] text-gray-300 hover:text-white hover:border-white/30 text-sm font-semibold transition-all duration-200 hover:bg-white/5"
          >
            Book Another Appointment
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </>
  );
}

