import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const bookingStep1Schema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
});

export const bookingStep3Schema = z.object({
  date: z.date({ message: "Please select a date" }),
  startTime: z.string().min(1, "Please select a time"),
});

export const bookingStep4Schema = z.object({
  barberId: z.string().optional(),
});

export const bookingStep6Schema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, "Please enter a valid phone number"),
  notes: z.string().optional(),
  smsReminder: z.boolean().optional(),
});

export const houseCallSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid street address"),
  unit: z.string().optional(),
  city: z.string().min(2, "Please enter a city"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  date: z.date({ message: "Please select a date" }),
  startTime: z.string().min(1, "Please select a time"),
  barberId: z.string().optional(),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type BookingStep6Data = z.infer<typeof bookingStep6Schema>;
export type HouseCallData = z.infer<typeof houseCallSchema>;
export type LoginData = z.infer<typeof loginSchema>;
