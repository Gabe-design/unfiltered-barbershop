import twilio from "twilio";
import { format } from "date-fns";
import { formatTime } from "./utils";

function getClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
    timeout: 8000,
  });
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

function isConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}

export async function sendSms(to: string, body: string) {
  if (!isConfigured()) {
    console.warn("[SMS] Twilio not configured — skipping");
    return;
  }
  const normalized = normalizePhone(to);
  return getClient().messages.create({
    to: normalized,
    from: process.env.TWILIO_PHONE_NUMBER!,
    body,
  });
}

export async function sendBookingConfirmationSms(data: {
  customerPhone: string;
  customerName: string;
  date: Date;
  startTime: string;
  barberName?: string;
}) {
  const dateStr = format(data.date, "EEEE, MMMM d");
  const timeStr = formatTime(data.startTime);
  const barberPart = data.barberName ? ` with ${data.barberName}` : "";
  const body =
    `Your booking at Unfiltered Barbershop${barberPart} on ${dateStr} at ${timeStr} is confirmed! ` +
    `We're at 1706 Erringer Rd Suite #4, Simi Valley. See you soon! 💈`;
  return sendSms(data.customerPhone, body);
}

export async function sendBarberNotificationSms(data: {
  barberPhone: string;
  barberName: string;
  customerName: string;
  date: Date;
  startTime: string;
  serviceName: string;
}) {
  const dateStr = format(data.date, "EEEE, MMMM d");
  const timeStr = formatTime(data.startTime);
  const body =
    `New booking, ${data.barberName}! ${data.customerName} booked a ${data.serviceName} on ${dateStr} at ${timeStr}. Check the admin panel for details.`;
  return sendSms(data.barberPhone, body);
}

export async function sendBookingReminderSms(data: {
  customerPhone: string;
  customerName: string;
  date: Date;
  startTime: string;
  barberName?: string;
}) {
  const timeStr = formatTime(data.startTime);
  const barberPart = data.barberName ? ` with ${data.barberName}` : "";
  const body =
    `Reminder: Your Unfiltered Barbershop appointment${barberPart} is coming up in about 12 hours at ${timeStr}. ` +
    `1706 Erringer Rd Suite #4, Simi Valley. See you then! 💈`;
  return sendSms(data.customerPhone, body);
}
