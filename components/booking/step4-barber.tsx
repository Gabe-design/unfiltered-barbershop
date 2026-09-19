"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Check, ArrowRight, UserCheck } from "lucide-react";
import { useBookingStore, type Barber } from "@/lib/booking-store";
import { cn, SHOP_STATS } from "@/lib/utils";

const NO_PREFERENCE_BARBER: Barber = {
  id: "no-preference",
  name: "No Preference",
  specialty: "Any Available Barber",
  bio: "We'll match you with the next available barber based on your appointment time. All our barbers deliver the same premium experience.",
  rating: 5.0,
  reviewCount: SHOP_STATS.reviewCount,
  offersHouseCall: true,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "w-3 h-3",
            i <= Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-700 fill-gray-700"
          )}
        />
      ))}
    </div>
  );
}

function BarberAvatar({ barber, isNoPref, isSelected }: { barber: Barber; isNoPref: boolean; isSelected: boolean }) {
  if (barber.image) {
    return (
      <div className={cn("w-12 h-12 rounded-2xl overflow-hidden shrink-0 transition-all duration-300", isSelected ? "shadow-lg" : "opacity-80 group-hover:opacity-100")}>
        <Image src={barber.image} alt={barber.name} width={48} height={48} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300",
        isSelected ? "shadow-lg opacity-100" : "opacity-80 group-hover:opacity-100",
        "bg-zinc-700"
      )}
    >
      {isNoPref ? (
        <UserCheck className="w-6 h-6 text-white" />
      ) : (
        <span className="text-white font-bold text-lg">{barber.name.charAt(0)}</span>
      )}
    </div>
  );
}

export function Step4Barber() {
  const {
    barber: selectedBarber,
    isHouseCall,
    setBarber,
    nextStep,
    prevStep,
    catalogBarbers,
  } = useBookingStore();

  const eligibleBarbers = isHouseCall
    ? catalogBarbers.filter((b) => b.offersHouseCall)
    : catalogBarbers;

  const allOptions: Barber[] = [...eligibleBarbers, NO_PREFERENCE_BARBER];

  const handleSelect = (b: Barber) => {
    setBarber(b);
  };

  const canContinue = !!selectedBarber;

  return (
    <div className="w-full">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
          Step 3 of 7
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Choose Your Barber
        </h2>
        <p className="text-gray-400 text-sm">
          {isHouseCall
            ? "Select a barber for your house call. Only house call-eligible barbers are shown."
            : "Select a barber or choose no preference to be matched automatically."}
        </p>
      </motion.div>

      {/* Barber Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {allOptions.map((barber) => {
          const isSelected = selectedBarber?.id === barber.id;
          const isNoPref = barber.id === "no-preference";

          return (
            <motion.button
              key={barber.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(barber)}
              className={cn(
                "group relative text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer",
                "bg-[#111111] hover:bg-[#141414]",
                isSelected
                  ? "border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/50"
                  : "border-[#262626] hover:border-blue-500/40",
                isNoPref && "border-dashed"
              )}
            >
              {/* Check Badge */}
              <motion.div
                initial={false}
                animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
              >
                <Check className="w-3.5 h-3.5 text-white" />
              </motion.div>

              {/* Avatar + Name Row */}
              <div className="flex items-center gap-3.5 mb-4">
                <BarberAvatar barber={barber} isNoPref={isNoPref} isSelected={isSelected} />
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">
                    {barber.name}
                  </p>
                  <p className="text-transparent bg-clip-text [background-image:linear-gradient(135deg,#B91C1C,#1D4ED8)] text-xs mt-0.5 font-medium">
                    {barber.specialty}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                {barber.bio}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating rating={barber.rating} />
                  <span className="text-gray-500 text-xs">
                    {barber.rating.toFixed(1)} · {barber.reviewCount} reviews
                  </span>
                </div>

                {barber.offersHouseCall && !isNoPref && (
                  <span className="text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full font-medium">
                    House Calls
                  </span>
                )}
              </div>

              {/* Selected indicator bottom bar */}
              <motion.div
                initial={false}
                animate={isSelected ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full origin-left"
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 gap-4">
        <button
          onClick={prevStep}
          className="px-5 py-3 rounded-xl border border-[#262626] text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canContinue}
          className={cn(
            "flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200",
            canContinue
              ? "text-white hover:brightness-110 active:scale-[0.98]"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          )}
          style={canContinue ? { background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" } : undefined}
        >
          Review Booking
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
