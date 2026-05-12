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

export const SHOP_ADDRESS = {
  street: "1706 Erringer Rd Suite #4",
  city: "Simi Valley",
  state: "CA",
  zip: "93065",
  lat: 34.2694,
  lng: -118.7815,
  phone: "(805) 555-0100",
  email: "info@unfilteredbarbershop.com",
  instagram: "unfltrdbarbershop",
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
