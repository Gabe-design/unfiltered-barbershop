"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";


import { format } from "date-fns";
import {
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  MessageSquare,
  AlertCircle,
  Loader2,
  ArrowRight,
  Info,
} from "lucide-react";
import { useBookingStore, BARBERS } from "@/lib/booking-store";
import { cn, generateConfirmationId } from "@/lib/utils";

// ─── Schema ───────────────────────────────────────────────────────────────────

const houseCallSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  customerPhone: z
    .string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, "Valid phone required"),
  customerEmail: z.string().email("Valid email required"),
  houseCallAddress: z.string().min(5, "Street address required"),
  houseCallUnit: z.string().optional(),
  houseCallCity: z.string().min(2, "City required"),
  houseCallZip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code required"),
  barberId: z.string().min(1, "Please select a barber preference"),
  specialInstructions: z.string().max(500, "Max 500 characters").optional(),
});

type HouseCallFormData = z.infer<typeof houseCallSchema>;

// ─── Field Wrapper ────────────────────────────────────────────────────────────

const inputClass =
  "w-full bg-[#161616] border border-[#262626] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-medium text-gray-400 uppercase tracking-widest">
        {label}
        {required && <span className="text-blue-400">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-red-400 text-xs"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── House Call Barbers ───────────────────────────────────────────────────────

type BarberOption = { id: string; name: string; specialty: string; initial: string; color: string };
const houseCallBarbers = BARBERS.filter((b) => b.offersHouseCall);
const barberOptions: BarberOption[] = [
  ...houseCallBarbers.map((b) => ({
    id: b.id,
    name: b.name,
    specialty: b.specialty,
    initial: b.initial,
    color: b.color,
  })),
  {
    id: "no-preference",
    name: "No Preference",
    specialty: "Next Available",
    initial: "?",
    color: "bg-gray-700",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function HouseCallFlow() {
  const {
    date,
    startTime,
    houseCallAddress,
    houseCallUnit,
    houseCallCity,
    houseCallZip,
    customerName,
    customerEmail,
    customerPhone,
    setHouseCallInfo,
    setCustomerInfo,
    setBarber,
    setConfirmationId,
    setIsSubmitting,
    setSubmitError,
    isSubmitting,
    submitError,
    nextStep,
    service,
    totalPrice,
  } = useBookingStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HouseCallFormData>({
    resolver: zodResolver(houseCallSchema),
    mode: "onBlur",
    defaultValues: {
      customerName,
      customerEmail,
      customerPhone,
      houseCallAddress,
      houseCallUnit,
      houseCallCity,
      houseCallZip,
      barberId: "no-preference",
    },
  });

  const selectedBarberId = watch("barberId");
  const specialInstructions = watch("specialInstructions") ?? "";

  const onSubmit = async (data: HouseCallFormData) => {
    // Persist to store
    setHouseCallInfo({
      houseCallAddress: data.houseCallAddress,
      houseCallUnit: data.houseCallUnit ?? "",
      houseCallCity: data.houseCallCity,
      houseCallZip: data.houseCallZip,
    });
    setCustomerInfo({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      notes: data.specialInstructions,
    });

    const chosenBarber = BARBERS.find((b) => b.id === data.barberId);
    if (chosenBarber) setBarber(chosenBarber);

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: service?.id,
          addOnIds: [],
          addOnSlugs: {},
          barberSlug: data.barberId !== "no-preference" ? data.barberId : null,
          barberId: null,
          isHouseCall: true,
          date: date ? format(date, "yyyy-MM-dd") : null,
          startTime,
          totalPrice,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          notes: data.specialInstructions,
          smsReminder: false,
          houseCallAddress: data.houseCallAddress,
          houseCallUnit: data.houseCallUnit ?? "",
          houseCallCity: data.houseCallCity,
          houseCallZip: data.houseCallZip,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to submit booking.");

      setConfirmationId(json.confirmationId ?? generateConfirmationId());
      nextStep();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-5 h-5 text-blue-400" />
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-[0.25em]">
            House Call Booking
          </p>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Your Location Details
        </h2>
        <p className="text-gray-400 text-sm">
          We&apos;ll bring the full Unfiltered experience to your door. Please fill in your address and contact details.
        </p>
      </div>

      {/* Radius Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 mb-6">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-blue-200 text-xs leading-relaxed">
          House calls are available within a <strong>40-mile radius</strong> of Simi Valley, CA 93065.
          Additional travel fees may apply for distances over 20 miles. We&apos;ll confirm with you after booking.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Contact Section */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mb-3">
            Contact Information
          </p>
          <div className="space-y-4">
            <Field label="Full Name" required error={errors.customerName?.message}>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input {...register("customerName")} type="text" autoComplete="name" placeholder="John Smith" className={cn(inputClass, "pl-10")} />
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone" required error={errors.customerPhone?.message}>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input {...register("customerPhone")} type="tel" autoComplete="tel" placeholder="(805) 555-0100" className={cn(inputClass, "pl-10")} />
                </div>
              </Field>
              <Field label="Email" required error={errors.customerEmail?.message}>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input {...register("customerEmail")} type="email" autoComplete="email" placeholder="john@example.com" className={cn(inputClass, "pl-10")} />
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mb-3">
            Service Address
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field label="Street Address" required error={errors.houseCallAddress?.message}>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input {...register("houseCallAddress")} type="text" autoComplete="street-address" placeholder="123 Main St" className={cn(inputClass, "pl-10")} />
                  </div>
                </Field>
              </div>
              <Field label="Unit/Apt" error={errors.houseCallUnit?.message}>
                <input {...register("houseCallUnit")} type="text" placeholder="Apt 4B" className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="City" required error={errors.houseCallCity?.message}>
                <input {...register("houseCallCity")} type="text" autoComplete="address-level2" placeholder="Simi Valley" className={inputClass} />
              </Field>
              <Field label="ZIP Code" required error={errors.houseCallZip?.message}>
                <input {...register("houseCallZip")} type="text" autoComplete="postal-code" placeholder="93065" className={inputClass} />
              </Field>
            </div>
          </div>
        </div>

        {/* Barber Preference */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mb-3">
            Barber Preference
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {barberOptions.map((b) => {
              const isSelected = selectedBarberId === b.id;
              return (
                <label
                  key={b.id}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                    isSelected
                      ? "border-blue-500 bg-blue-600/10"
                      : "border-[#262626] bg-[#111111] hover:border-[#333]"
                  )}
                >
                  <input {...register("barberId")} type="radio" value={b.id} className="sr-only" />
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0", b.color)}>
                    {b.initial}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium leading-tight", isSelected ? "text-white" : "text-gray-300")}>
                      {b.name}
                    </p>
                    <p className="text-gray-600 text-[10px]">{b.specialty}</p>
                  </div>
                </label>
              );
            })}
          </div>
          {errors.barberId && (
            <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
              <AlertCircle className="w-3 h-3" />
              {errors.barberId.message}
            </p>
          )}
        </div>

        {/* Special Instructions */}
        <Field label="Special Instructions (optional)" error={errors.specialInstructions?.message}>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
            <textarea
              {...register("specialInstructions")}
              rows={3}
              placeholder="Parking info, gate codes, special requests…"
              className={cn(inputClass, "pl-10 resize-none leading-relaxed")}
            />
            <span className={cn("absolute bottom-2.5 right-3 text-[10px]", specialInstructions.length > 450 ? "text-amber-400" : "text-gray-700")}>
              {specialInstructions.length}/500
            </span>
          </div>
        </Field>

        {/* Error */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{submitError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl text-sm transition-all duration-200",
            isSubmitting
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "text-white hover:brightness-110 active:scale-[0.98]"
          )}
          style={!isSubmitting ? { background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" } : undefined}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting House Call Request…
            </>
          ) : (
            <>
              Request House Call
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
