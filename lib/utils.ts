import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, addMinutes } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());
  const lastPossibleStart = addMinutes(end, -durationMinutes);

  let current = start;
  while (current <= lastPossibleStart) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, intervalMinutes);
  }

  return slots;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function isAfterHours(time: string): boolean {
  const minutes = timeToMinutes(time);
  return minutes < timeToMinutes("09:00") || minutes >= timeToMinutes("19:00");
}

export function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 3958.8; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function generateConfirmationId(): string {
  return `UB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// ─── Shop-local dates ─────────────────────────────────────────────────────────
// The server (Vercel) runs on UTC while the shop runs on Pacific time. To keep
// results independent of the server clock: Booking.date is always stored as UTC
// midnight of the calendar day, and "now" is always evaluated in SHOP_TIMEZONE.

export const SHOP_TIMEZONE = "America/Los_Angeles";

/** Parses "YYYY-MM-DD" into the UTC-midnight Date stored in Booking.date. Returns null if malformed. */
export function parseDateOnly(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(y, m - 1, d));
  // Date.UTC silently rolls over impossible dates (e.g. Feb 31) — reject those
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

export function addDaysUTC(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

/** 0 = Sunday … 6 = Saturday for a UTC-midnight booking date. */
export function dayOfWeekOf(date: Date): number {
  return date.getUTCDay();
}

function shopTimeParts(at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP_TIMEZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute"), second: get("second") };
}

/** The current calendar date ("YYYY-MM-DD") and minutes since midnight, in the shop's timezone. */
export function shopNow(at: Date = new Date()): { dateStr: string; minutes: number } {
  const t = shopTimeParts(at);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    dateStr: `${t.year}-${pad(t.month)}-${pad(t.day)}`,
    minutes: t.hour * 60 + t.minute,
  };
}

/** Offset of SHOP_TIMEZONE from UTC at a given instant, in minutes (e.g. -420 during PDT). */
function shopOffsetMinutes(at: Date): number {
  const t = shopTimeParts(at);
  const asUtc = Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute, t.second);
  return Math.round((asUtc - at.getTime()) / 60_000);
}

/** Converts a booking's calendar date + "HH:mm" (shop wall-clock time) into an absolute instant. */
export function shopDateTimeToInstant(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const wallClockAsUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), h, m);
  // Shift by the zone offset; re-check once in case the shift crossed a DST boundary.
  const firstGuess = wallClockAsUtc - shopOffsetMinutes(new Date(wallClockAsUtc)) * 60_000;
  return new Date(wallClockAsUtc - shopOffsetMinutes(new Date(firstGuess)) * 60_000);
}

const BOOKING_DATE_STYLES = {
  long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },   // Sunday, September 20, 2026
  short: { weekday: "long", month: "long", day: "numeric" },                    // Sunday, September 20
  medium: { month: "long", day: "numeric", year: "numeric" },                   // September 20, 2026
  compact: { month: "short", day: "numeric", year: "numeric" },                 // Sep 20, 2026
} satisfies Record<string, Intl.DateTimeFormatOptions>;

/**
 * Formats a Booking.date (UTC midnight, or its ISO string) as a calendar date.
 * Safe in any timezone — `format(new Date(booking.date), …)` would show the previous
 * day for viewers west of UTC.
 */
export function formatBookingDate(date: Date | string, style: keyof typeof BOOKING_DATE_STYLES = "long"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...BOOKING_DATE_STYLES[style] }).format(d);
}

export const SHOP_ADDRESS = {
  street: "1706 Erringer Rd Suite #4",
  city: "Simi Valley",
  state: "CA",
  zip: "93065",
  lat: 34.2694,
  lng: -118.7815,
  phone: "(805) 438-0050",
  phoneHref: "+18054380050",
  email: "info@unfilteredbarbershop.com",
  instagram: "unfltrdbarbershop",
};

// Live figures from the shop's Booksy listing. Update here, not in the pages.
export const BOOKSY_URL = "https://booksy.com/en-us/436530_unfiltered-barbershop_barber-shop_134644_simi-valley";

export const SHOP_STATS = {
  rating: "5.0",
  reviewCount: 641, // Booksy, checked 2026-09-19
  reviewCountLabel: "640+",
};

export const BUSINESS_HOURS = [
  { day: "Sunday", open: "10:00", close: "14:00", label: "10 AM – 2 PM" },
  { day: "Monday", open: "09:00", close: "19:00", label: "9 AM – 7 PM" },
  { day: "Tuesday", open: "09:00", close: "19:00", label: "9 AM – 7 PM" },
  { day: "Wednesday", open: "09:00", close: "19:00", label: "9 AM – 7 PM" },
  { day: "Thursday", open: "09:00", close: "19:00", label: "9 AM – 7 PM" },
  { day: "Friday", open: "09:00", close: "19:00", label: "9 AM – 7 PM" },
  { day: "Saturday", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
];
