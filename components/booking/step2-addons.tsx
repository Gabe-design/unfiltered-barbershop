"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, Sparkles } from "lucide-react";
import { useBookingStore } from "@/lib/booking-store";
import { cn, formatCurrency } from "@/lib/utils";

export function Step2AddOns() {
  const {
    selectedAddOns,
    toggleAddOn,
    service,
    totalPrice,
    nextStep,
    prevStep,
    catalogAddOns,
  } = useBookingStore();

  const activeCount = Object.values(selectedAddOns).filter((q) => q > 0).length;

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
          Step 2 of 7
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Enhance Your Experience
        </h2>
        <p className="text-gray-400 text-sm">
          Customize your visit with optional add-ons. Skip this step if you don&apos;t need anything extra.
        </p>
      </motion.div>

      {/* Add-ons List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="space-y-3"
      >
        {catalogAddOns.map((addOn) => {
          const qty = selectedAddOns[addOn.id] ?? 0;
          const isActive = qty > 0;

          return (
            <motion.div
              key={addOn.id}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
              }}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                isActive
                  ? "[background:linear-gradient(135deg,#B91C1C1A_0%,#1D4ED81A_100%)] border-white/10 shadow-sm shadow-black/20"
                  : "bg-[#111111] border-[#262626] hover:border-[#333]"
              )}
            >
              {/* Add-on Info */}
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0",
                    !isActive && "bg-white/5"
                  )}
                  style={isActive ? { background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" } : undefined}
                >
                  <Sparkles
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm transition-colors",
                      isActive ? "text-white" : "text-gray-300"
                    )}
                  >
                    {addOn.name}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-0.5 font-medium",
                      isActive ? "text-red-400" : "text-gray-500"
                    )}
                  >
                    +{formatCurrency(addOn.price)} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <motion.span
                      key="price"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-transparent bg-clip-text [background-image:linear-gradient(135deg,#B91C1C,#1D4ED8)] font-semibold text-sm tabular-nums"
                    >
                      {formatCurrency(addOn.price * qty)}
                    </motion.span>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAddOn(addOn.id, -1)}
                    disabled={qty === 0}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                      qty === 0
                        ? "bg-white/5 text-gray-700 cursor-not-allowed"
                        : "bg-white/10 text-gray-300 hover:[background:linear-gradient(135deg,#B91C1C1A_0%,#1D4ED81A_100%)] hover:text-white active:scale-90"
                    )}
                    aria-label={`Remove ${addOn.name}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={qty}
                      initial={{ opacity: 0, y: -8, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="w-7 text-center text-white font-bold text-sm tabular-nums"
                    >
                      {qty}
                    </motion.span>
                  </AnimatePresence>

                  <button
                    onClick={() => toggleAddOn(addOn.id, 1)}
                    className="w-8 h-8 rounded-lg text-white flex items-center justify-center transition-all duration-200 active:scale-90 hover:brightness-110"
                    style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
                    aria-label={`Add ${addOn.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Price Summary */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-5 p-4 rounded-xl border border-white/10 flex items-center justify-between [background:linear-gradient(135deg,#B91C1C1A_0%,#1D4ED81A_100%)]"
          >
            <div>
              <p className="text-gray-400 text-xs">Service + {activeCount} add-on{activeCount !== 1 ? "s" : ""}</p>
              <p className="text-white font-semibold text-sm mt-0.5">
                {service?.name}
              </p>
            </div>
            <motion.div
              key={totalPrice}
              initial={{ scale: 1.2, color: "#F87171" }}
              animate={{ scale: 1, color: "#FFFFFF" }}
              className="text-right"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total</p>
              <p className="text-white font-bold text-xl">{formatCurrency(totalPrice)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}
        >
          {activeCount === 0 ? "Skip Add-ons" : "Continue"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
