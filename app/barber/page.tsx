"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format, isToday, isTomorrow } from "date-fns";
import Image from "next/image";
import { Clock, Phone, MapPin, LogOut, Scissors, User, RefreshCw } from "lucide-react";
import { formatTime, formatCurrency } from "@/lib/utils";

interface BookingItem {
  service?: { name: string } | null;
  addOn?: { name: string } | null;
  quantity?: number;
}

interface Booking {
  id: string;
  confirmationId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  totalDuration: number;
  status: string;
  notes?: string | null;
  isHouseCall: boolean;
  houseCallAddress?: string | null;
  items: BookingItem[];
}

interface ScheduleData {
  barber: { name: string; image: string | null };
  bookings: Booking[];
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, MMMM d");
}

function statusColor(status: string) {
  if (status === "CONFIRMED") return "bg-green-500/15 text-green-400 border-green-500/20";
  if (status === "COMPLETED") return "bg-blue-500/15 text-blue-400 border-blue-500/20";
  if (status === "PENDING") return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";
  return "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
}

export default function BarberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session.user?.role !== "BARBER") {
      router.push(session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN" ? "/admin" : "/");
      return;
    }
    if (status === "authenticated") fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchSchedule = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/barber/schedule");
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group bookings by date
  const grouped: Record<string, Booking[]> = {};
  for (const b of data?.bookings ?? []) {
    const key = b.date.split("T")[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  }
  const days = Object.keys(grouped).sort();
  const todayBookings = data?.bookings.filter((b) => isToday(new Date(b.date))) ?? [];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-xl border-b border-white/5 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.barber.image ? (
              <Image src={data.barber.image} alt={data.barber.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            <div>
              <p className="text-white font-semibold text-sm">{data?.barber.name}</p>
              <p className="text-zinc-500 text-xs">My Schedule</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchSchedule(true)} disabled={refreshing}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Today summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-1">Today</p>
            <p className="text-white text-2xl font-bold">{todayBookings.length}</p>
            <p className="text-zinc-500 text-xs mt-0.5">appointment{todayBookings.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-1">This Week</p>
            <p className="text-white text-2xl font-bold">{data?.bookings.length ?? 0}</p>
            <p className="text-zinc-500 text-xs mt-0.5">total upcoming</p>
          </div>
        </div>

        {/* No bookings */}
        {days.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Scissors className="w-10 h-10 text-zinc-700 mb-3" />
            <p className="text-white font-semibold mb-1">All clear!</p>
            <p className="text-zinc-500 text-sm">No upcoming bookings in the next 7 days.</p>
          </div>
        )}

        {/* Bookings grouped by day */}
        {days.map((dateKey) => (
          <div key={dateKey}>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-white font-semibold">{dayLabel(dateKey)}</p>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                {grouped[dateKey].length} booking{grouped[dateKey].length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-3">
              {grouped[dateKey].map((booking) => {
                const services = booking.items.filter((i) => i.service).map((i) => i.service!.name);
                const addOns = booking.items.filter((i) => i.addOn).map((i) => i.addOn!.name);
                return (
                  <div key={booking.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-3">
                    {/* Time + status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-white font-semibold text-sm">
                          {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-white text-sm font-medium">{booking.customerName}</span>
                      </div>
                      <a href={`tel:${booking.customerPhone}`}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs transition-colors">
                        <Phone className="w-3 h-3" />
                        {booking.customerPhone}
                      </a>
                    </div>

                    {/* Service */}
                    {services.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Scissors className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                        <div>
                          <span className="text-zinc-200 text-sm">{services.join(", ")}</span>
                          {addOns.length > 0 && (
                            <span className="text-zinc-500 text-xs ml-1">+ {addOns.join(", ")}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* House call address */}
                    {booking.isHouseCall && booking.houseCallAddress && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                        <span className="text-amber-300 text-xs">{booking.houseCallAddress}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {booking.notes && (
                      <p className="text-zinc-500 text-xs italic border-t border-white/5 pt-2">
                        &ldquo;{booking.notes}&rdquo;
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-zinc-500 text-xs">{booking.totalDuration} min</span>
                      <span className="text-white font-semibold text-sm">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
