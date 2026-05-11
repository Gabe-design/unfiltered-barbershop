import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ServiceId = string;
export type AddOnId = string;
export type BarberId = string;

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  isHouseCall?: boolean;
}

export interface AddOn {
  id: string; // slug derived from name, e.g. "hot-towel"
  name: string;
  price: number;
  quantity: number;
}

export interface Barber {
  id: string; // DB slug
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  offersHouseCall: boolean;
  image?: string | null;
  initial?: string;
  color?: string;
}

// ─── Booking State ────────────────────────────────────────────────────────────

export interface BookingState {
  // Catalog loaded from DB
  catalogServices: Service[];
  catalogAddOns: AddOn[];
  catalogBarbers: Barber[];
  catalogLoading: boolean;

  // Navigation
  step: number;

  // Service selection
  service: Service | null;

  // Add-ons keyed by slug, value = quantity
  selectedAddOns: Record<string, number>;

  // Scheduling
  date: Date | null;
  startTime: string | null;

  // Barber
  barber: Barber | null;

  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  smsReminder: boolean;

  // House call
  isHouseCall: boolean;
  houseCallAddress: string;
  houseCallUnit: string;
  houseCallCity: string;
  houseCallZip: string;

  // Growth features
  source: string;
  promoCode: string;
  referralCode: string;
  discountAmount: number;
  abandonedId: string | null;

  // Confirmation
  confirmationId: string | null;
  isSubmitting: boolean;
  submitError: string | null;

  // Computed
  totalPrice: number;
  totalDuration: number;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface BookingActions {
  setCatalog: (services: Service[], addOns: AddOn[], barbers: Barber[]) => void;
  setCatalogLoading: (loading: boolean) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setService: (service: Service) => void;
  toggleAddOn: (id: string, delta: number) => void;
  setDate: (date: Date | null) => void;
  setStartTime: (time: string | null) => void;
  setBarber: (barber: Barber) => void;
  setCustomerInfo: (info: Partial<Pick<BookingState, "customerName" | "customerEmail" | "customerPhone" | "notes" | "smsReminder">>) => void;
  setHouseCallInfo: (info: Partial<Pick<BookingState, "houseCallAddress" | "houseCallUnit" | "houseCallCity" | "houseCallZip">>) => void;
  setSource: (source: string) => void;
  setPromoCode: (code: string) => void;
  setReferralCode: (code: string) => void;
  setDiscountAmount: (amount: number) => void;
  setAbandonedId: (id: string | null) => void;
  setConfirmationId: (id: string) => void;
  setIsSubmitting: (val: boolean) => void;
  setSubmitError: (err: string | null) => void;
  reset: () => void;
  recompute: () => void;
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const INITIAL_STATE: BookingState = {
  catalogServices: [],
  catalogAddOns: [],
  catalogBarbers: [],
  catalogLoading: true,
  step: 1,
  service: null,
  selectedAddOns: {},
  date: null,
  startTime: null,
  barber: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  notes: "",
  smsReminder: true,
  isHouseCall: false,
  houseCallAddress: "",
  houseCallUnit: "",
  houseCallCity: "",
  houseCallZip: "",
  source: "WEBSITE",
  promoCode: "",
  referralCode: "",
  discountAmount: 0,
  abandonedId: null,
  confirmationId: null,
  isSubmitting: false,
  submitError: null,
  totalPrice: 0,
  totalDuration: 0,
};

function computeTotals(state: Pick<BookingState, "service" | "selectedAddOns" | "catalogAddOns">): { totalPrice: number; totalDuration: number } {
  const basePrice = state.service?.price ?? 0;
  const baseDuration = state.service?.duration ?? 0;

  let addOnPrice = 0;
  for (const [id, qty] of Object.entries(state.selectedAddOns)) {
    const addOn = state.catalogAddOns.find((a) => a.id === id);
    if (addOn && qty > 0) addOnPrice += addOn.price * qty;
  }

  return { totalPrice: basePrice + addOnPrice, totalDuration: baseDuration };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBookingStore = create<BookingState & BookingActions>()(
  devtools(
    (set, get) => ({
      ...INITIAL_STATE,

      setCatalog: (services, addOns, barbers) =>
        set({ catalogServices: services, catalogAddOns: addOns, catalogBarbers: barbers, catalogLoading: false }, false, "setCatalog"),

      setCatalogLoading: (loading) =>
        set({ catalogLoading: loading }, false, "setCatalogLoading"),

      recompute: () => {
        const state = get();
        const { totalPrice, totalDuration } = computeTotals(state);
        set({ totalPrice, totalDuration }, false, "recompute");
      },

      setStep: (step) => set({ step }, false, "setStep"),

      nextStep: () => {
        const { step, isHouseCall, catalogAddOns } = get();
        const skipAddOns = isHouseCall || catalogAddOns.length === 0;
        if (step === 1 && skipAddOns) {
          set({ step: 3 }, false, "nextStep/skipAddOns");
        } else {
          set({ step: Math.min(step + 1, 7) }, false, "nextStep");
        }
      },

      prevStep: () => {
        const { step, isHouseCall, catalogAddOns } = get();
        const skipAddOns = isHouseCall || catalogAddOns.length === 0;
        if (step === 3 && skipAddOns) {
          set({ step: 1 }, false, "prevStep/skipAddOns");
        } else {
          set({ step: Math.max(step - 1, 1) }, false, "prevStep");
        }
      },

      setService: (service) => {
        const isHouseCall = service.isHouseCall ?? false;
        set({ service, isHouseCall }, false, "setService");
        const state = get();
        const { totalPrice, totalDuration } = computeTotals({ ...state, service });
        set({ totalPrice, totalDuration }, false, "setService/recompute");
      },

      toggleAddOn: (id, delta) => {
        const state = get();
        const current = state.selectedAddOns[id] ?? 0;
        const next = Math.max(0, current + delta);
        const selectedAddOns = { ...state.selectedAddOns, [id]: next };
        const { totalPrice, totalDuration } = computeTotals({ ...state, selectedAddOns });
        set({ selectedAddOns, totalPrice, totalDuration }, false, "toggleAddOn");
      },

      setDate: (date) => set({ date, startTime: null }, false, "setDate"),

      setStartTime: (startTime) => set({ startTime }, false, "setStartTime"),

      setBarber: (barber) => set({ barber }, false, "setBarber"),

      setCustomerInfo: (info) => set(info, false, "setCustomerInfo"),

      setHouseCallInfo: (info) => set(info, false, "setHouseCallInfo"),

      setSource: (source) => set({ source }, false, "setSource"),

      setPromoCode: (promoCode) => set({ promoCode }, false, "setPromoCode"),

      setReferralCode: (referralCode) => set({ referralCode }, false, "setReferralCode"),

      setDiscountAmount: (discountAmount) => set({ discountAmount }, false, "setDiscountAmount"),

      setAbandonedId: (abandonedId) => set({ abandonedId }, false, "setAbandonedId"),

      setConfirmationId: (id) => set({ confirmationId: id }, false, "setConfirmationId"),

      setIsSubmitting: (val) => set({ isSubmitting: val }, false, "setIsSubmitting"),

      setSubmitError: (err) => set({ submitError: err }, false, "setSubmitError"),

      reset: () => set(INITIAL_STATE, false, "reset"),
    }),
    { name: "booking-store" }
  )
);
