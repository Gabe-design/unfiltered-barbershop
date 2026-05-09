export interface ServiceOption {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  duration: number;
  category: string;
  isHouseCall: boolean;
  afterHoursFee: number;
  addOns: AddOnOption[];
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface BarberOption {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  image?: string | null;
  instagram?: string | null;
  specialty?: string | null;
  rating: number;
  reviewCount: number;
  offersHouseCall: boolean;
}

export interface BookingState {
  step: number;
  service: ServiceOption | null;
  selectedAddOns: { addOn: AddOnOption; quantity: number }[];
  date: Date | null;
  startTime: string;
  barber: BarberOption | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  smsReminder: boolean;
  isHouseCall: boolean;
  houseCallAddress: string;
  houseCallUnit: string;
  houseCallCity: string;
  houseCallZip: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  period: "morning" | "afternoon" | "evening";
}
