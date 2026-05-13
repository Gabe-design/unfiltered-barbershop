"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isBefore, isToday, isSameDay, isSameMonth,
  addMonths, subMonths, getDay, startOfDay,
} from "date-fns";
import {
  ChevronLeft, ChevronRight, Clock, ArrowRight,
  Sun, Sunset, Moon, Check, UserCheck, Star,
} from "lucide-react";
import Image from "next/image";
import { useBookingStore, type Barber } from "@/lib/booking-store";
import { cn, formatTime } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SlotStatus = "available" | "unavailable";

const NO_PREFERENCE_BARBER: Barber = {
  id: "no-preference",
  name: "No Preference",
  specialty: "Any Available Barber",
  bio: "We'll match you with the next available barber. All our barbers deliver the same premium experience.",
  rating: 5.0,
  reviewCount: 585,
  offersHouseCall: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHoursForDay(date: Date): { start: number; end: number } | null {
  const dow = getDay(date);
  if (dow === 0) return { start: 10, end: 14 };
  if (dow === 6) return { start: 9, end: 17 };
  return { start: 9, end: 19 };
}

function generateSlots(date: Date, durationMinutes: number): string[] {
  const hours = getHoursForDay(date);
  if (!hours) return [];
  const slots: string[] = [];
  let cursor = hours.start * 60;
  const lastStart = hours.end * 60 - durationMinutes;
  while (cursor <= lastStart) {
    slots.push(`${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`);
    cursor += 30;
  }
  return slots;
}

function groupSlots(slots: string[]) {
  const morning: string[] = [], afternoon: string[] = [], evening: string[] = [];
  for (const s of slots) {
    const h = parseInt(s.split(":")[0]);
    if (h < 12) morning.push(s);
    else if (h < 17) afternoon.push(s);
    else evening.push(s);
  }
  return { morning, afternoon, evening };
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const today = startOfDay(new Date());
  const days = eachDayOfInterval({ start: startOfMonth(viewMonth), end: endOfMonth(viewMonth) });
  const startDow = getDay(startOfMonth(viewMonth));

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setViewMonth(subMonths(viewMonth, 1))} disabled={isSameMonth(viewMonth, today)}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <p className="text-white font-semibold text-sm">{format(viewMonth, "MMMM yyyy")}</p>
        <button onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-gray-600 text-xs font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDow }).map((_, i) => <div key={`b-${i}`} />)}
        {days.map((day) => {
          const disabled = isBefore(day, today);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const todayFlag = isToday(day);
          return (
            <button key={day.toISOString()} onClick={() => !disabled && onSelect(day)} disabled={disabled}
              className={cn(
                "aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-200",
                disabled ? "text-gray-700 cursor-not-allowed"
                  : "hover:[background:linear-gradient(135deg,#B91C1C1A_0%,#1D4ED81A_100%)] hover:text-white cursor-pointer",
                isSelected ? "text-white shadow-lg ring-2 ring-red-700/30"
                  : disabled ? "text-gray-700"
                  : todayFlag ? "text-transparent bg-clip-text [background-image:linear-gradient(135deg,#B91C1C,#1D4ED8)] font-bold"
                  : "text-gray-200"
              )}
              style={isSelected ? { background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" } : undefined}>
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/40 inline-block" />Available</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/10 inline-block" />Unavailable</span>
      </div>
    </div>
  );
}

// ─── Slot Group ───────────────────────────────────────────────────────────────

function SlotGroup({ label, Icon, slots, selected, slotStatuses, onSelect }: {
  label: string; Icon: React.ElementType; slots: string[];
  selected: string | null; slotStatuses: Record<string, SlotStatus>; onSelect: (s: string) => void;
}) {
  if (slots.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{label}</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const status = slotStatuses[slot] ?? "available";
          const isSelected = selected === slot;
          return (
            <button key={slot} onClick={() => status !== "unavailable" && onSelect(slot)}
              disabled={status === "unavailable"}
              className={cn(
                "py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all duration-200",
                status === "unavailable"
                  ? "bg-white/5 text-gray-700 cursor-not-allowed line-through"
                  : isSelected ? "text-white shadow-lg"
                  : "bg-white/5 border border-white/10 text-gray-200 hover:[background:linear-gradient(135deg,#B91C1C1A_0%,#1D4ED81A_100%)] hover:border-white/20 hover:text-white"
              )}
              style={status === "available" && isSelected ? { background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" } : undefined}>
              {formatTime(slot)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Barber Card ──────────────────────────────────────────────────────────────

function BarberCard({ barber, isSelected, isAvailable, timeSelected, onSelect }: {
  barber: Barber; isSelected: boolean; isAvailable: boolean; timeSelected: boolean; onSelect: () => void;
}) {
  const isNoPref = barber.id === "no-preference";
  const disabled = timeSelected && !isAvailable && !isNoPref;

  return (
    <motion.button
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={() => !disabled && onSelect()}
      disabled={disabled}
      className={cn(
        "group relative text-left rounded-2xl border p-4 transition-all duration-300",
        disabled ? "opacity-40 cursor-not-allowed bg-[#0e0e0e]"
          : "cursor-pointer bg-[#111111] hover:bg-[#141414]",
        isSelected ? "border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/50"
          : disabled ? "border-[#1e1e1e]"
          : "border-[#262626] hover:border-blue-500/40",
        isNoPref && !disabled && "border-dashed"
      )}
    >
      {/* Check */}
      <motion.div initial={false} animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" }}>
        <Check className="w-3 h-3 text-white" />
      </motion.div>

      {/* Availability badge */}
      {timeSelected && !isNoPref && (
        <span className={cn(
          "absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
          isSelected ? "hidden" : isAvailable ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"
        )}>
          {isAvailable ? "Open" : "Booked"}
        </span>
      )}

      <div className="flex items-center gap-3 mb-3">
        {barber.image ? (
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
            <Image src={barber.image} alt={barber.name} width={40} height={40} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center shrink-0">
            {isNoPref ? <UserCheck className="w-5 h-5 text-white" /> : <span className="text-white font-bold">{barber.name.charAt(0)}</span>}
          </div>
        )}
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{barber.name}</p>
          <p className="text-transparent bg-clip-text [background-image:linear-gradient(135deg,#B91C1C,#1D4ED8)] text-xs mt-0.5 font-medium">{barber.specialty}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={cn("w-2.5 h-2.5", i <= Math.floor(barber.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-700 fill-gray-700")} />
        ))}
        <span className="text-gray-500 text-xs ml-1">{barber.rating.toFixed(1)} · {barber.reviewCount} reviews</span>
      </div>

      <motion.div initial={false} animate={isSelected ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full origin-left" />
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Step3Combined() {
  const { date, startTime, barber, service, isHouseCall, setDate, setStartTime, setBarber, nextStep, prevStep, catalogBarbers } = useBookingStore();

  const duration = service?.duration ?? 60;
  const [slotStatuses, setSlotStatuses] = useState<Record<string, SlotStatus>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [barberAvailability, setBarberAvailability] = useState<Record<string, boolean>>({});
  const [loadingBarbers, setLoadingBarbers] = useState(false);

  // Fetch time slots when date or selected barber changes
  useEffect(() => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const barberId = barber?.id && barber.id !== "no-preference" ? barber.id : "";
    const params = new URLSearchParams({ date: dateStr, duration: String(duration) });
    if (barberId) params.set("barberId", barberId);

    setLoadingSlots(true);
    setSlotStatuses({});
    setStartTime(null);

    fetch(`/api/availability?${params}`)
      .then((r) => r.json())
      .then((data: { slots: { time: string; available: boolean }[] }) => {
        const map: Record<string, SlotStatus> = {};
        for (const s of data.slots ?? []) map[s.time] = s.available ? "available" : "unavailable";
        setSlotStatuses(map);
      })
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, barber?.id, duration]);

  // Fetch which barbers are available when date+time is selected
  useEffect(() => {
    if (!date || !startTime) { setBarberAvailability({}); return; }
    const params = new URLSearchParams({ date: format(date, "yyyy-MM-dd"), startTime, duration: String(duration) });

    setLoadingBarbers(true);
    fetch(`/api/availability/barbers?${params}`)
      .then((r) => r.json())
      .then((data: { barbers: Record<string, boolean> }) => setBarberAvailability(data.barbers ?? {}))
      .catch(() => {})
      .finally(() => setLoadingBarbers(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, startTime, duration]);

  const eligibleBarbers = isHouseCall ? catalogBarbers.filter((b) => b.offersHouseCall) : catalogBarbers;
  const allBarbers: Barber[] = [...eligibleBarbers, NO_PREFERENCE_BARBER];

  const slots = date ? generateSlots(date, duration) : [];
  const grouped = groupSlots(slots);
  const dateStr = date ? format(date, "yyyy-MM-dd") : "";
  const canContinue = !!date && !!startTime && !!barber;

  return (
    <div className="w-full">
      {/* Heading */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}>
          Step 3 of 6
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pick Your Date, Time & Barber</h2>
        <p className="text-gray-400 text-sm">
          Select a date and time — available barbers will be shown based on your selection, or choose a barber first to see their availability.
        </p>
      </motion.div>

      {/* Calendar + Time Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#111111] border border-[#262626] rounded-2xl p-5">
          <Calendar selected={date} onSelect={setDate} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#111111] border border-[#262626] rounded-2xl p-5">
          <AnimatePresence mode="wait">
            {!date ? (
              <motion.div key="no-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-10 h-10 text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">Select a date to see available time slots</p>
              </motion.div>
            ) : (
              <motion.div key={dateStr} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold text-sm">{format(date, "EEEE, MMMM d")}</p>
                  <span className="text-xs text-gray-500">{loadingSlots ? "Loading..." : `${slots.length} slots`}</span>
                </div>
                {loadingSlots ? (
                  <div className="flex justify-center py-10">
                    <div className="w-5 h-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <SlotGroup label="Morning" Icon={Sun} slots={grouped.morning} selected={startTime} slotStatuses={slotStatuses} onSelect={setStartTime} />
                    <SlotGroup label="Afternoon" Icon={Sunset} slots={grouped.afternoon} selected={startTime} slotStatuses={slotStatuses} onSelect={setStartTime} />
                    <SlotGroup label="Evening" Icon={Moon} slots={grouped.evening} selected={startTime} slotStatuses={slotStatuses} onSelect={setStartTime} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Barber Selection */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-semibold">Choose Your Barber</p>
            {startTime && date ? (
              <p className="text-xs text-gray-500 mt-0.5">
                Showing availability for {format(date, "MMM d")} at {formatTime(startTime)}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">Select a barber to filter their available time slots</p>
            )}
          </div>
          {loadingBarbers && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
        </div>

        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allBarbers.map((b) => (
            <BarberCard
              key={b.id}
              barber={b}
              isSelected={barber?.id === b.id}
              isAvailable={b.id === "no-preference" ? true : (barberAvailability[b.id] ?? true)}
              timeSelected={!!startTime && !!date && Object.keys(barberAvailability).length > 0}
              onSelect={() => setBarber(b)}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Selection Summary */}
      <AnimatePresence>
        {canContinue && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="mt-5 p-4 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3 [background:linear-gradient(135deg,#B91C1C1A_0%,#1D4ED81A_100%)]">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Selected</p>
              <p className="text-white font-semibold text-sm">
                {date && format(date, "EEEE, MMMM d, yyyy")}
                {startTime && ` at ${formatTime(startTime)}`}
                {barber && barber.id !== "no-preference" && ` · ${barber.name}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Clock className="w-3.5 h-3.5" />
              {duration} min session
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 gap-4">
        <button onClick={prevStep} className="px-5 py-3 rounded-xl border border-[#262626] text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium transition-all duration-200">
          Back
        </button>
        <button onClick={nextStep} disabled={!canContinue}
          className={cn("flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200",
            canContinue ? "text-white hover:brightness-110 active:scale-[0.98]" : "bg-white/5 text-gray-600 cursor-not-allowed")}
          style={canContinue ? { background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" } : undefined}>
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
