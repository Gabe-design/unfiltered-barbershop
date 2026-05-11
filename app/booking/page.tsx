"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Step1Service } from "@/components/booking/step1-service";
import { Step2AddOns } from "@/components/booking/step2-addons";
import { Step3DateTime } from "@/components/booking/step3-datetime";
import { Step4Barber } from "@/components/booking/step4-barber";
import { Step5Summary } from "@/components/booking/step5-summary";
import { Step6CustomerInfo } from "@/components/booking/step6-customer-info";
import { Step7Confirmation } from "@/components/booking/step7-confirmation";
import { OrderSidebar } from "@/components/booking/order-sidebar";
import { useBookingStore, type Service, type AddOn, type Barber } from "@/lib/booking-store";
import { cn } from "@/lib/utils";

// ─── Step Definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Service" },
  { number: 2, label: "Add-ons" },
  { number: 3, label: "Date & Time" },
  { number: 4, label: "Barber" },
  { number: 5, label: "Summary" },
  { number: 6, label: "Your Info" },
  { number: 7, label: "Confirm" },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  isHouseCall,
}: {
  currentStep: number;
  isHouseCall: boolean;
}) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-center min-w-max mx-auto px-1 py-1 gap-0">
        {STEPS.map((step, index) => {
          const isSkipped = isHouseCall && step.number === 2;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex items-center">
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted
                      ? "#B91C1C"
                      : isCurrent
                      ? "#DC2626"
                      : "transparent",
                    borderColor:
                      isCompleted || isCurrent ? "#DC2626" : "#262626",
                    scale: isCurrent ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    isSkipped && "opacity-30"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-bold",
                        isCurrent ? "text-white" : "text-gray-600"
                      )}
                    >
                      {step.number}
                    </span>
                  )}
                </motion.div>

                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap transition-colors hidden sm:block",
                    isCurrent
                      ? "text-red-400"
                      : isCompleted
                      ? "text-gray-400"
                      : "text-gray-700",
                    isSkipped && "opacity-30 line-through"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {index < STEPS.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor:
                      currentStep > step.number ? "#DC2626" : "#262626",
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-8 sm:w-12 h-0.5 mx-1 mb-5 rounded-full shrink-0"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const pageTransition = { duration: 0.28, ease: [0.4, 0, 0.6, 1] as [number,number,number,number] };

// ─── Step Renderer ────────────────────────────────────────────────────────────

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1: return <Step1Service />;
    case 2: return <Step2AddOns />;
    case 3: return <Step3DateTime />;
    case 4: return <Step4Barber />;
    case 5: return <Step5Summary />;
    case 6: return <Step6CustomerInfo />;
    case 7: return <Step7Confirmation />;
    default: return <Step1Service />;
  }
}

// ─── Booking Page ─────────────────────────────────────────────────────────────

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function BookingPage() {
  const { step, isHouseCall, setCatalog, setCatalogLoading } = useBookingStore();

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [servicesRes, barbersRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/barbers"),
        ]);
        const rawServices = await servicesRes.json();
        const rawBarbers = await barbersRes.json();

        const services: Service[] = rawServices.map((s: Record<string, unknown>) => ({
          id: s.slug as string,
          name: s.name as string,
          price: s.price as number,
          duration: s.duration as number,
          description: (s.description as string) ?? "",
          isHouseCall: s.isHouseCall as boolean,
        }));

        // Collect unique add-ons across all services, deduped by slug
        const addOnMap = new Map<string, AddOn>();
        for (const s of rawServices) {
          for (const a of (s.addOns as Array<Record<string, unknown>>) ?? []) {
            const slug = nameToSlug(a.name as string);
            if (!addOnMap.has(slug)) {
              addOnMap.set(slug, { id: slug, name: a.name as string, price: a.price as number, quantity: 0 });
            }
          }
        }
        const addOns = Array.from(addOnMap.values());

        const barbers: Barber[] = rawBarbers.map((b: Record<string, unknown>) => ({
          id: b.slug as string,
          name: b.name as string,
          specialty: (b.specialty as string) ?? "",
          bio: (b.bio as string) ?? "",
          rating: (b.rating as number) ?? 5.0,
          reviewCount: (b.reviewCount as number) ?? 0,
          offersHouseCall: b.offersHouseCall as boolean,
          image: b.image as string | null,
        }));

        setCatalog(services, addOns, barbers);
      } catch {
        setCatalogLoading(false);
      }
    };
    loadCatalog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSidebar = step >= 3 && step < 7;
  const isConfirmation = step === 7;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A0A0A] pt-24 pb-24">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          {!isConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-red-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Online Booking
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1.5">
                Book Your Appointment
              </h1>
              <p className="text-gray-500 text-sm">
                Unfiltered Barbershop · 1706 Erringer Rd Suite #4, Simi Valley, CA
              </p>
            </motion.div>
          )}

          {/* Step Indicator */}
          {!isConfirmation && (
            <div className="mb-10">
              <StepIndicator currentStep={step} isHouseCall={isHouseCall} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className={cn(
              "flex gap-8 items-start",
              isConfirmation && "justify-center"
            )}
          >
            {/* Step Panel */}
            <div
              className={cn(
                "flex-1 min-w-0",
                isConfirmation && "max-w-2xl w-full"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                >
                  <StepContent step={step} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Persistent Sidebar */}
            {showSidebar && (
              <div className="hidden lg:block">
                <AnimatePresence>
                  <OrderSidebar />
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      {!isConfirmation && <Footer />}
    </>
  );
}

