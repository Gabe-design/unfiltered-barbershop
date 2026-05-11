"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Sparkles,
  Clock,
  Edit2,
  ArrowRight,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { useBookingStore } from "@/lib/booking-store";
import { formatCurrency, formatDuration, formatTime } from "@/lib/utils";

interface SummaryRowProps {
  label: string;
  value: string;
  subValue?: string;
  price?: number;
  onEdit?: () => void;
}

function SummaryRow({ label, value, subValue, price, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-[#1e1e1e] last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-0.5">
          {label}
        </p>
        <p className="text-white text-sm font-medium leading-snug">{value}</p>
        {subValue && (
          <p className="text-gray-500 text-xs mt-0.5">{subValue}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {price !== undefined && (
          <span className="text-gray-300 text-sm font-medium">
            {formatCurrency(price)}
          </span>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-400 transition-colors text-xs group"
          >
            <Edit2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function Step5Summary() {
  const {
    service,
    selectedAddOns,
    date,
    startTime,
    barber,
    totalPrice,
    totalDuration,
    isHouseCall,
    nextStep,
    prevStep,
    setStep,
    catalogAddOns,
  } = useBookingStore();

  const activeAddOns = catalogAddOns.filter((a) => (selectedAddOns[a.id] ?? 0) > 0);
  const addOnTotal = activeAddOns.reduce(
    (sum, a) => sum + a.price * (selectedAddOns[a.id] ?? 0),
    0
  );

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
          Step 5 of 7
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Review Your Booking
        </h2>
        <p className="text-gray-400 text-sm">
          Everything look right? Confirm the details below before proceeding.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-3 bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-white font-semibold text-sm">Booking Summary</span>
          </div>

          <div className="px-6 py-2">
            {/* Service */}
            <SummaryRow
              label="Service"
              value={service?.name ?? "-"}
              subValue={
                isHouseCall ? "At your location (House Call)" : "At Unfiltered Barbershop"
              }
              price={service?.price}
              onEdit={() => setStep(1)}
            />

            {/* Add-ons */}
            {activeAddOns.length > 0 && (
              <div className="py-3.5 border-b border-[#1e1e1e]">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                    Add-ons
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm font-medium">
                      {formatCurrency(addOnTotal)}
                    </span>
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-400 transition-colors text-xs group"
                    >
                      <Edit2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                </div>
                {activeAddOns.map((addOn) => {
                  const qty = selectedAddOns[addOn.id] ?? 0;
                  return (
                    <div key={addOn.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span className="text-gray-400 text-xs">
                          {addOn.name}
                          {qty > 1 && <span className="text-gray-600 ml-1">×{qty}</span>}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {formatCurrency(addOn.price * qty)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Barber */}
            <SummaryRow
              label="Barber"
              value={barber?.name === "no-preference" ? "No Preference" : (barber?.name ?? "-")}
              subValue={barber?.specialty}
              onEdit={() => setStep(4)}
            />

            {/* Date & Time */}
            <SummaryRow
              label="Date & Time"
              value={
                date
                  ? `${format(date, "EEEE, MMMM d, yyyy")}${startTime ? ` at ${formatTime(startTime)}` : ""}`
                  : "-"
              }
              subValue={`Duration: ${formatDuration(totalDuration)}`}
              onEdit={() => setStep(3)}
            />
          </div>
        </motion.div>

        {/* Price Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Price Breakdown */}
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span className="text-white font-semibold text-sm">Price Breakdown</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{service?.name}</span>
                <span className="text-gray-300">{formatCurrency(service?.price ?? 0)}</span>
              </div>

              {activeAddOns.map((addOn) => {
                const qty = selectedAddOns[addOn.id] ?? 0;
                return (
                  <div key={addOn.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {addOn.name}
                      {qty > 1 && ` ×${qty}`}
                    </span>
                    <span className="text-gray-500">
                      +{formatCurrency(addOn.price * qty)}
                    </span>
                  </div>
                );
              })}

              <div className="border-t border-[#262626] pt-2.5 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-medium">Subtotal</span>
                  <span className="text-gray-300 text-sm">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-gray-500 text-xs">Tax (paid at shop)</span>
                  <span className="text-gray-600 text-xs">-</span>
                </div>
              </div>

              <div className="border-t border-[#262626] pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total Due</span>
                  <motion.span
                    key={totalPrice}
                    initial={{ scale: 1.1, color: "#60A5FA" }}
                    animate={{ scale: 1, color: "#FFFFFF" }}
                    className="text-white font-bold text-xl"
                  >
                    {formatCurrency(totalPrice)}
                  </motion.span>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  No deposit required · Pay at appointment
                </p>
              </div>
            </div>
          </div>

          {/* Duration Card */}
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(185,28,28,0.2) 0%, rgba(29,78,216,0.2) 100%)" }}>
              <Clock className="w-5 h-5 text-white/70" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Est. Duration</p>
              <p className="text-white font-semibold text-sm">
                {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

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
          Looks Good - Proceed
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
