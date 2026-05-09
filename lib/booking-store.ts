import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Service & Add-on Types ───────────────────────────────────────────────────

export type ServiceId =
  | "haircut"
  | "haircut-enhancement"
  | "haircut-design"
  | "haircut-beard"
  | "beard-trim"
  | "shape-up"
  | "house-call";

export interface Service {
  id: ServiceId;
  name: string;
  price: number;
  duration: number; // minutes
  description: string;
  isHouseCall?: boolean;
}

export type AddOnId = "eyebrows" | "hot-towel" | "hair-wash" | "enhancement-upgrade";

export interface AddOn {
  id: AddOnId;
  name: string;
  price: number;
  quantity: number;
}

// ─── Barber Types ─────────────────────────────────────────────────────────────

export type BarberId = "alex-reyes" | "marcus-williams" | "jordan-cruz" | "no-preference";

export interface Barber {
  id: BarberId;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  offersHouseCall: boolean;
  initial: string;
  color: string;
}

// ─── Booking State ────────────────────────────────────────────────────────────

export interface BookingState {
  // Navigation
  step: number;

  // Service selection
  service: Service | null;

  // Add-ons (stored as record with quantity)
  selectedAddOns: Record<AddOnId, number>;

  // Scheduling
  date: Date | null;
  startTime: string | null; // "HH:MM" 24h

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
  source: string; // BookingSourceType
  promoCode: string;
  referralCode: string;
  discountAmount: number;
  abandonedId: string | null; // ID of AbandonedBooking record if captured

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
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setService: (service: Service) => void;
  toggleAddOn: (id: AddOnId, delta: number) => void;
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

// ─── Constants ────────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: "haircut",
    name: "Haircut",
    price: 45,
    duration: 60,
    description: "Precision cut tailored to your style. Includes a consultation, shampoo rinse, and styled finish.",
  },
  {
    id: "haircut-enhancement",
    name: "Haircut w/ Enhancement",
    price: 50,
    duration: 60,
    description: "Classic haircut elevated with a toning or texturizing enhancement for added depth and dimension.",
  },
  {
    id: "haircut-design",
    name: "Haircut & Design",
    price: 55,
    duration: 75,
    description: "Sharp cut paired with a custom line or geometric design. Artistic and precision-driven.",
  },
  {
    id: "haircut-beard",
    name: "Haircut & Beard",
    price: 60,
    duration: 60,
    description: "Full haircut combined with a professional beard trim and shape-up. The complete package.",
  },
  {
    id: "beard-trim",
    name: "Beard Trim & Line Up w/ Hot Towel",
    price: 30,
    duration: 45,
    description: "Expert beard sculpting and line-up finished with a relaxing hot-towel treatment.",
  },
  {
    id: "shape-up",
    name: "Shape Up",
    price: 20,
    duration: 15,
    description: "Clean, precise edge-up around the hairline, temples, and neck for a fresh look.",
  },
  {
    id: "house-call",
    name: "House Call",
    price: 300,
    duration: 180,
    description: "The full Unfiltered experience brought to your door. Premium service at your home or event.",
    isHouseCall: true,
  },
];

export const ADD_ONS: AddOn[] = [
  { id: "eyebrows", name: "Eyebrows", price: 5, quantity: 0 },
  { id: "hot-towel", name: "Hot Towel", price: 5, quantity: 0 },
  { id: "hair-wash", name: "Hair Wash", price: 10, quantity: 0 },
  { id: "enhancement-upgrade", name: "Enhancement Upgrade", price: 10, quantity: 0 },
];

export const BARBERS: Barber[] = [
  {
    id: "alex-reyes",
    name: "Alex Reyes",
    specialty: "Precision Fades",
    bio: "10+ years crafting clean fades and sharp lines. Alex's eye for detail has earned him a loyal following across the valley.",
    rating: 5.0,
    reviewCount: 247,
    offersHouseCall: true,
    initial: "A",
    color: "bg-blue-600",
  },
  {
    id: "marcus-williams",
    name: "Marcus Williams",
    specialty: "Beard Grooming",
    bio: "The beard whisperer of Simi Valley. Marcus transforms facial hair into a statement, with meticulous sculpting and hot-towel expertise.",
    rating: 5.0,
    reviewCount: 198,
    offersHouseCall: true,
    initial: "M",
    color: "bg-purple-600",
  },
  {
    id: "jordan-cruz",
    name: "Jordan Cruz",
    specialty: "Hair Enhancements",
    bio: "Jordan's creative flair brings custom designs and enhancements to life. From subtle textures to bold geometric cuts, he does it all.",
    rating: 5.0,
    reviewCount: 140,
    offersHouseCall: false,
    initial: "J",
    color: "bg-emerald-600",
  },
];

// ─── Initial State ─────────────────────────────────────────────────────────────

const INITIAL_STATE: BookingState = {
  step: 1,
  service: null,
  selectedAddOns: {
    eyebrows: 0,
    "hot-towel": 0,
    "hair-wash": 0,
    "enhancement-upgrade": 0,
  },
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

function computeTotals(state: BookingState): { totalPrice: number; totalDuration: number } {
  const basePrice = state.service?.price ?? 0;
  const baseDuration = state.service?.duration ?? 0;

  let addOnPrice = 0;
  for (const [id, qty] of Object.entries(state.selectedAddOns)) {
    const addOn = ADD_ONS.find((a) => a.id === id);
    if (addOn && qty > 0) {
      addOnPrice += addOn.price * qty;
    }
  }

  return {
    totalPrice: basePrice + addOnPrice,
    totalDuration: baseDuration, // add-ons don't change duration meaningfully
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBookingStore = create<BookingState & BookingActions>()(
  devtools(
    (set, get) => ({
      ...INITIAL_STATE,

      recompute: () => {
        const state = get();
        const { totalPrice, totalDuration } = computeTotals(state);
        set({ totalPrice, totalDuration }, false, "recompute");
      },

      setStep: (step) => set({ step }, false, "setStep"),

      nextStep: () => {
        const { step, isHouseCall } = get();
        // House call skips add-ons (step 2)
        if (step === 1 && isHouseCall) {
          set({ step: 3 }, false, "nextStep/skipAddOns");
        } else {
          set({ step: Math.min(step + 1, 7) }, false, "nextStep");
        }
      },

      prevStep: () => {
        const { step, isHouseCall } = get();
        if (step === 3 && isHouseCall) {
          set({ step: 1 }, false, "prevStep/skipAddOns");
        } else {
          set({ step: Math.max(step - 1, 1) }, false, "prevStep");
        }
      },

      setService: (service) => {
        const isHouseCall = service.isHouseCall ?? false;
        set({ service, isHouseCall }, false, "setService");
        const state = get();
        const { totalPrice, totalDuration } = computeTotals({ ...state, service, isHouseCall });
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
