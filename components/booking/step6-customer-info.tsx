"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, MessageSquare, Bell, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useBookingStore } from "@/lib/booking-store";
import { cn, formatCurrency, formatTime, generateConfirmationId } from "@/lib/utils";

// ─── Validation Schema ─────────────────────────────────────────────────────────

const customerSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  customerPhone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    ),
  customerEmail: z
    .string()
    .email("Please enter a valid email address")
    .max(120, "Email is too long"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  smsReminder: z.boolean(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

// ─── Field Component ──────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required, children }: FormFieldProps) {
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

const inputClass = cn(
  "w-full bg-[#161616] border border-[#262626] rounded-xl px-4 py-3 text-white text-sm",
  "placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50",
  "transition-all duration-200"
);

const inputErrorClass = "border-red-500/50 focus:border-red-500 focus:ring-red-500/20";

// ─── Main Component ───────────────────────────────────────────────────────────

export function Step6CustomerInfo() {
  const {
    customerName,
    customerEmail,
    customerPhone,
    notes,
    smsReminder,
    service,
    selectedAddOns,
    date,
    startTime,
    barber,
    totalPrice,
    isHouseCall,
    houseCallAddress,
    houseCallCity,
    houseCallZip,
    setCustomerInfo,
    setConfirmationId,
    setIsSubmitting,
    setSubmitError,
    isSubmitting,
    submitError,
    nextStep,
    prevStep,
  } = useBookingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: "onBlur",
    defaultValues: {
      customerName,
      customerPhone,
      customerEmail,
      notes,
      smsReminder,
    },
  });

  const watchedSms = watch("smsReminder");
  const watchedNotes = watch("notes") ?? "";

  const onSubmit = async (data: CustomerFormData) => {
    setCustomerInfo(data);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        // Service: send slug so API can resolve via slug fallback
        serviceSlug: service?.id,
        // Add-ons: send as slug record (e.g. { "eyebrows": 1, "hot-towel": 2 })
        addOnSlugs: selectedAddOns,
        addOnIds: [],
        date: date ? format(date, "yyyy-MM-dd") : null,
        startTime,
        // Barber: send slug for API resolution
        barberSlug: barber?.id !== "no-preference" ? barber?.id : null,
        barberId: null,
        totalPrice,
        isHouseCall,
        houseCallAddress: isHouseCall ? houseCallAddress : undefined,
        houseCallUnit: isHouseCall ? "" : undefined,
        houseCallCity: isHouseCall ? houseCallCity : undefined,
        houseCallZip: isHouseCall ? houseCallZip : undefined,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        notes: data.notes,
        smsReminder: data.smsReminder,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Failed to create booking. Please try again.");
      }

      const confirmationId = json.confirmationId ?? generateConfirmationId();
      setConfirmationId(confirmationId);
      nextStep();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
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
          Step 6 of 7
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Your Information
        </h2>
        <p className="text-gray-400 text-sm">
          We'll use these details to confirm your appointment and send reminders.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Name */}
            <FormField label="Full Name" required error={errors.customerName?.message}>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  {...register("customerName")}
                  type="text"
                  autoComplete="name"
                  placeholder="John Smith"
                  className={cn(inputClass, "pl-10", errors.customerName && inputErrorClass)}
                />
              </div>
            </FormField>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Phone" required error={errors.customerPhone?.message}>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    {...register("customerPhone")}
                    type="tel"
                    autoComplete="tel"
                    placeholder="(805) 555-0100"
                    className={cn(inputClass, "pl-10", errors.customerPhone && inputErrorClass)}
                  />
                </div>
              </FormField>

              <FormField label="Email" required error={errors.customerEmail?.message}>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    {...register("customerEmail")}
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    className={cn(inputClass, "pl-10", errors.customerEmail && inputErrorClass)}
                  />
                </div>
              </FormField>
            </div>

            {/* Notes */}
            <FormField label="Special Requests (optional)" error={errors.notes?.message}>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600" />
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Any special requests or notes for your barber…"
                  className={cn(inputClass, "pl-10 resize-none leading-relaxed", errors.notes && inputErrorClass)}
                />
                <span
                  className={cn(
                    "absolute bottom-2.5 right-3 text-[10px]",
                    watchedNotes.length > 450 ? "text-amber-400" : "text-gray-700"
                  )}
                >
                  {watchedNotes.length}/500
                </span>
              </div>
            </FormField>

            {/* SMS Reminder toggle */}
            <button
              type="button"
              onClick={() => setValue("smsReminder", !watchedSms, { shouldValidate: true })}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                watchedSms
                  ? "bg-blue-600/10 border-blue-500/40"
                  : "bg-[#161616] border-[#262626] hover:border-[#333]"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  watchedSms ? "bg-blue-600" : "bg-white/5"
                )}
              >
                <Bell className={cn("w-4 h-4", watchedSms ? "text-white" : "text-gray-500")} />
              </div>
              <div className="flex-1">
                <p className={cn("font-semibold text-sm transition-colors", watchedSms ? "text-white" : "text-gray-400")}>
                  SMS Appointment Reminders
                </p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Get a text 24 hours and 1 hour before your appointment
                </p>
              </div>
              {/* Toggle */}
              <div
                className={cn(
                  "w-11 h-6 rounded-full border transition-all duration-300 relative shrink-0",
                  watchedSms ? "bg-blue-600 border-blue-500" : "bg-white/10 border-white/20"
                )}
              >
                <motion.div
                  animate={{ x: watchedSms ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </button>

            {/* Error Banner */}
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
          </motion.div>

          {/* Mini Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#111111] border border-[#262626] rounded-2xl p-5 sticky top-28 space-y-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Booking at a Glance
              </p>

              {service && (
                <div>
                  <p className="text-white font-semibold text-sm">{service.name}</p>
                  {date && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      {format(date, "MMM d, yyyy")}
                      {startTime && ` · ${formatTime(startTime)}`}
                    </p>
                  )}
                  {barber && (
                    <p className="text-gray-500 text-xs mt-0.5">
                      with {barber.id === "no-preference" ? "Any Available Barber" : barber.name}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-[#1e1e1e] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  Pay at appointment · No deposit
                </p>
              </div>

              <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3">
                <p className="text-blue-300 text-xs leading-relaxed">
                  A confirmation email will be sent once your booking is complete.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 gap-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="px-5 py-3 rounded-xl border border-[#262626] text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all duration-200 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 min-w-[160px] justify-center",
              isSubmitting
                ? "bg-blue-600/50 text-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white hover:shadow-lg hover:shadow-blue-500/25"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming…
              </>
            ) : (
              <>
                Confirm Booking
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
