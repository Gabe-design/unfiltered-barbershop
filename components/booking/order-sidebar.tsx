"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, DollarSign, Calendar, Scissors } from "lucide-react";
import { format } from "date-fns";
import {
  useBookingStore,
  ADD_ONS,
  type AddOnId,
} from "@/lib/booking-store";
import { cn, formatCurrency, formatDuration, formatTime } from "@/lib/utils";

export function OrderSidebar() {
  const {
    step,
    service,
    selectedAddOns,
    date,
    startTime,
    barber,
    totalPrice,
    totalDuration,
    isHouseCall,
    toggleAddOn,
    setStep,
  } = useBookingStore();

  const activeAddOns = ADD_ONS.filter((a) => (selectedAddOns[a.id] ?? 0) > 0);
  const hasContent = !!service;

  if (!hasContent || step < 3) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
      className="w-full lg:w-80 xl:w-96 shrink-0"
    >
      <div
        className={cn(
          "rounded-2xl border border-white/10 overflow-hidden sticky top-28",
          "bg-white/5 backdrop-blur-xl"
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Your Booking
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {step} of 7
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Service */}
          {service && (
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Service
              </p>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm leading-tight">
                    {service.name}
                  </p>
                  {isHouseCall && (
                    <p className="text-blue-400 text-xs mt-0.5">House Call</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-gray-400 text-sm">
                    {formatCurrency(service.price)}
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-blue-400 transition-colors"
                    aria-label="Edit service"
                  >
                    <span className="text-[10px] underline underline-offset-2">edit</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add-ons */}
          <AnimatePresence>
            {activeAddOns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                  Add-ons
                </p>
                {activeAddOns.map((addOn) => {
                  const qty = selectedAddOns[addOn.id] ?? 0;
                  return (
                    <motion.div
                      key={addOn.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAddOn(addOn.id as AddOnId, -1)}
                          className="w-4 h-4 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                          aria-label={`Remove ${addOn.name}`}
                        >
                          <X className="w-2.5 h-2.5 text-gray-400" />
                        </button>
                        <span className="text-gray-300 text-sm">
                          {addOn.name}
                          {qty > 1 && (
                            <span className="text-gray-500 ml-1">×{qty}</span>
                          )}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {formatCurrency(addOn.price * qty)}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Barber */}
          {barber && (
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                  barber.color
                )}
              >
                {barber.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium leading-none mb-0.5">
                  Barber
                </p>
                <p className="text-white text-sm font-medium truncate">
                  {barber.name === "no-preference" ? "No Preference" : barber.name}
                </p>
              </div>
              <button
                onClick={() => setStep(4)}
                className="text-[10px] text-gray-600 hover:text-blue-400 transition-colors underline underline-offset-2 shrink-0"
              >
                edit
              </button>
            </div>
          )}

          {/* Date & Time */}
          {(date || startTime) && (
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Appointment
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>
                    {date ? format(date, "EEE, MMM d") : "—"}
                    {startTime && ` at ${formatTime(startTime)}`}
                  </span>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-[10px] text-gray-600 hover:text-blue-400 transition-colors underline underline-offset-2 shrink-0"
                >
                  edit
                </button>
              </div>
            </div>
          )}

          {/* Duration */}
          {totalDuration > 0 && (
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Est. duration: {formatDuration(totalDuration)}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm font-medium">Total</span>
            </div>
            <motion.span
              key={totalPrice}
              initial={{ scale: 1.15, color: "#60A5FA" }}
              animate={{ scale: 1, color: "#FFFFFF" }}
              className="text-white font-bold text-xl"
            >
              {formatCurrency(totalPrice)}
            </motion.span>
          </div>

          {/* CTA */}
          {step < 6 && (
            <button
              onClick={() => setStep(6)}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

