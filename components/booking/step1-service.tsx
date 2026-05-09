"use client";

import { motion } from "framer-motion";
import { Clock, Check, Home, Scissors, Star } from "lucide-react";
import { useBookingStore, SERVICES, type Service } from "@/lib/booking-store";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
};

export function Step1Service() {
  const { service: selectedService, setService, nextStep, setStep } = useBookingStore();

  const handleSelect = (s: Service) => {
    setService(s);
    if (s.isHouseCall) {
      // House call: skip add-ons (step 2) → go to step 3 (date/time)
      setStep(3);
    } else {
      nextStep();
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-[0.25em] mb-2">
          Step 1 of 7
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Choose Your Service
        </h2>
        <p className="text-gray-400 text-sm">
          Select the service you&apos;d like to book. Prices and durations are listed for each option.
        </p>
      </motion.div>

      {/* Service Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {SERVICES.map((s) => {
          const isSelected = selectedService?.id === s.id;
          const isHouseCall = s.isHouseCall;

          return (
            <motion.button
              key={s.id}
              variants={cardVariants}
              onClick={() => handleSelect(s)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer",
                "bg-[#111111] hover:bg-[#141414]",
                isSelected
                  ? "border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/50"
                  : "border-[#262626] hover:border-blue-500/40",
                isHouseCall && "sm:col-span-2"
              )}
            >
              {/* Selected checkmark */}
              <AnimatedCheck visible={isSelected} />

              {/* House call badge */}
              {isHouseCall && (
                <span className="absolute top-4 right-4 flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  <Home className="w-3 h-3" />
                  At Your Location
                </span>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
                  isSelected
                    ? "bg-blue-600"
                    : "bg-white/5 group-hover:bg-blue-600/20"
                )}
              >
                {isHouseCall ? (
                  <Home
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isSelected ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                    )}
                  />
                ) : (
                  <Scissors
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isSelected ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                    )}
                  />
                )}
              </div>

              {/* Info */}
              <div className="pr-8">
                <h3 className="text-white font-semibold text-base mb-1 leading-tight">
                  {s.name}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {s.description}
                </p>
              </div>

              {/* Price & Duration Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-xl font-bold transition-colors",
                      isSelected ? "text-blue-400" : "text-white"
                    )}
                  >
                    {formatCurrency(s.price)}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {formatDuration(s.duration)}
                  </div>
                </div>

                <span
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300",
                    isSelected
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "border-[#333] text-gray-500 group-hover:border-blue-500/50 group-hover:text-blue-400"
                  )}
                >
                  {isSelected ? "Selected" : "Select"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-gray-600 text-xs text-center flex items-center justify-center gap-1.5"
      >
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
        All services include a complimentary consultation and professional finish.
      </motion.p>
    </div>
  );
}

function AnimatedCheck({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center"
    >
      <Check className="w-3.5 h-3.5 text-white" />
    </motion.div>
  );
}

