"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
  isToday,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  getDay,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, ArrowRight, Sun, Sunset, Moon } from "lucide-react";
import { useBookingStore } from "@/lib/booking-store";
import { cn, formatTime } from "@/lib/utils";

// ─── Time-slot generation ─────────────────────────────────────────────────────

function getHoursForDay(date: Date): { start: number; end: number } | null {
  const dow = getDay(date); // 0=Sun, 6=Sat
  if (dow === 0) return { start: 10, end: 14 };   // Sunday: 10am–2pm
  if (dow === 6) return { start: 9, end: 17 };    // Saturday: 9am–5pm
  return { start: 9, end: 19 };                    // Mon-Fri: 9am–7pm
}

function generateSlots(date: Date, durationMinutes: number): string[] {
  const hours = getHoursForDay(date);
  if (!hours) return [];

  const slots: string[] = [];
  let cursor = hours.start * 60; // minutes since midnight
  const lastStart = hours.end * 60 - durationMinutes;

  while (cursor <= lastStart) {
    const hh = String(Math.floor(cursor / 60)).padStart(2, "0");
    const mm = String(cursor % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
    cursor += 30;
  }
  return slots;
}

type SlotStatus = "available" | "limited" | "unavailable";

// Deterministic fake availability for demo
function getSlotStatus(dateStr: string, slot: string): SlotStatus {
  const hash = (dateStr + slot).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = hash % 10;
  if (r <= 6) return "available";
  if (r <= 8) return "limited";
  return "unavailable";
}

function groupSlots(slots: string[]): { morning: string[]; afternoon: string[]; evening: string[] } {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];
  for (const s of slots) {
    const h = parseInt(s.split(":")[0]);
    if (h < 12) morning.push(s);
    else if (h < 17) afternoon.push(s);
    else evening.push(s);
  }
  return { morning, afternoon, evening };
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

interface CalendarProps {
  selected: Date | null;
  onSelect: (d: Date) => void;
}

function Calendar({ selected, onSelect }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Leading blanks
  const startDow = getDay(monthStart); // 0=Sun

  const isPast = (d: Date) => isBefore(d, today);

  return (
    <div className="select-none">
      {/* Month Nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={isSameMonth(viewMonth, today)}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        <p className="text-white font-semibold text-sm">
          {format(viewMonth, "MMMM yyyy")}
        </p>

        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-gray-600 text-xs font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Blank cells */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const disabled = isPast(day);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const todayFlag = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelect(day)}
              disabled={disabled}
              className={cn(
                "aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-200",
                disabled
                  ? "text-gray-700 cursor-not-allowed"
                  : "hover:bg-red-700/20 hover:text-red-400 cursor-pointer",
                isSelected
                  ? "bg-red-700 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-600/50"
                  : disabled
                  ? "text-gray-700"
                  : todayFlag
                  ? "text-red-400 font-bold"
                  : "text-gray-200"
              )}
              aria-label={format(day, "MMMM d, yyyy")}
              aria-pressed={isSelected}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/40 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          Limited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/10 inline-block" />
          Unavailable
        </span>
      </div>
    </div>
  );
}

// ─── Time Slot Group ──────────────────────────────────────────────────────────

interface SlotGroupProps {
  label: string;
  Icon: React.ElementType;
  slots: string[];
  selected: string | null;
  dateStr: string;
  onSelect: (s: string) => void;
}

function SlotGroup({ label, Icon, slots, selected, dateStr, onSelect }: SlotGroupProps) {
  if (slots.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{label}</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const status = getSlotStatus(dateStr, slot);
          const isSelected = selected === slot;

          return (
            <button
              key={slot}
              onClick={() => status !== "unavailable" && onSelect(slot)}
              disabled={status === "unavailable"}
              className={cn(
                "py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all duration-200 relative",
                status === "unavailable"
                  ? "bg-white/5 text-gray-700 cursor-not-allowed line-through"
                  : status === "limited"
                  ? isSelected
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                    : "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                  : isSelected
                  ? "bg-red-700 text-white shadow-lg shadow-red-600/25"
                  : "bg-white/5 border border-white/10 text-gray-200 hover:bg-red-700/20 hover:border-red-600/40 hover:text-red-400"
              )}
              aria-label={`Select ${formatTime(slot)}`}
              aria-pressed={isSelected}
            >
              {formatTime(slot)}
              {status === "limited" && !isSelected && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 border border-[#111]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Step3DateTime() {
  const {
    date,
    startTime,
    service,
    setDate,
    setStartTime,
    nextStep,
    prevStep,
  } = useBookingStore();

  const durationMinutes = service?.duration ?? 60;

  const slots = date ? generateSlots(date, durationMinutes) : [];
  const grouped = groupSlots(slots);
  const dateStr = date ? format(date, "yyyy-MM-dd") : "";

  const canContinue = !!date && !!startTime;

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
          Pick a Date & Time
        </h2>
        <p className="text-gray-400 text-sm">
          Select your preferred appointment date, then choose an available time slot.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#111111] border border-[#262626] rounded-2xl p-5"
        >
          <Calendar selected={date} onSelect={setDate} />
        </motion.div>

        {/* Time Slots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#111111] border border-[#262626] rounded-2xl p-5"
        >
          <AnimatePresence mode="wait">
            {!date ? (
              <motion.div
                key="no-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-12 text-center"
              >
                <Clock className="w-10 h-10 text-gray-700 mb-3" />
                <p className="text-gray-500 text-sm">
                  Select a date to see available time slots
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold text-sm">
                    {format(date, "EEEE, MMMM d")}
                  </p>
                  <span className="text-xs text-gray-500">
                    {slots.length} slots
                  </span>
                </div>

                <SlotGroup
                  label="Morning"
                  Icon={Sun}
                  slots={grouped.morning}
                  selected={startTime}
                  dateStr={dateStr}
                  onSelect={setStartTime}
                />
                <SlotGroup
                  label="Afternoon"
                  Icon={Sunset}
                  slots={grouped.afternoon}
                  selected={startTime}
                  dateStr={dateStr}
                  onSelect={setStartTime}
                />
                <SlotGroup
                  label="Evening"
                  Icon={Moon}
                  slots={grouped.evening}
                  selected={startTime}
                  dateStr={dateStr}
                  onSelect={setStartTime}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Selection Summary */}
      <AnimatePresence>
        {canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-5 p-4 rounded-xl bg-red-700/10 border border-red-600/20 flex items-center justify-between flex-wrap gap-3"
          >
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Selected</p>
              <p className="text-white font-semibold text-sm">
                {date && format(date, "EEEE, MMMM d, yyyy")}
                {startTime && ` at ${formatTime(startTime)}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <Clock className="w-3.5 h-3.5" />
              {durationMinutes} min session
            </div>
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
          disabled={!canContinue}
          className={cn(
            "flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200",
            canContinue
              ? "text-white hover:brightness-110 active:scale-[0.98]"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          )}
          style={canContinue ? { background: "linear-gradient(135deg, #B91C1C 0%, #1D4ED8 100%)" } : undefined}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
