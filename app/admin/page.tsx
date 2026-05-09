"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CONTACTED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

interface Booking {
  id: string;
  confirmationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  isHouseCall: boolean;
  barber?: { name: string } | null;
  items: Array<{
    service?: { name: string } | null;
    addOn?: { name: string } | null;
    price: number;
  }>;
  createdAt: string;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; classes: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  CONTACTED: {
    label: "Contacted",
    classes: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    dot: "bg-purple-400",
  },
  COMPLETED: {
    label: "Completed",
    classes: "bg-green-500/10 text-green-400 border-green-500/20",
    dot: "bg-green-400",
  },
  CANCELLED: {
    label: "Cancelled",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  NO_SHOW: {
    label: "No Show",
    classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, sub, color }: StatCardProps) {
  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function getServiceName(booking: Booking): string {
  const service = booking.items.find((i) => i.service)?.service;
  return service?.name ?? "—";
}

// Simple CSS bar chart for status breakdown
function StatusBarChart({ bookings }: { bookings: Booking[] }) {
  const counts = bookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const total = bookings.length || 1;
  const items = [
    { key: "CONFIRMED", label: "Confirmed", color: "bg-blue-500" },
    { key: "PENDING", label: "Pending", color: "bg-amber-500" },
    { key: "COMPLETED", label: "Completed", color: "bg-green-500" },
    { key: "CANCELLED", label: "Cancelled", color: "bg-red-500" },
    { key: "NO_SHOW", label: "No Show", color: "bg-zinc-500" },
  ] as const;

  return (
    <div className="space-y-3">
      {items.map(({ key, label, color }) => {
        const count = counts[key] ?? 0;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-zinc-400 text-xs w-20 flex-shrink-0">{label}</span>
            <div className="flex-1 bg-zinc-800 rounded-full h-2">
              <div
                className={`${color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-zinc-300 text-xs w-6 text-right flex-shrink-0">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings?limit=100");
      const data: BookingsResponse = await res.json();
      setBookings(data.bookings ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthBookings = bookings.filter((b) => {
    const d = new Date(b.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthRevenue = thisMonthBookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;

  const recent = [...bookings].slice(0, 10);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {format(now, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700
            hover:border-zinc-600 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Bookings"
          value={total}
          sub="All time"
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={DollarSign}
          label="This Month Revenue"
          value={`$${monthRevenue.toFixed(0)}`}
          sub={`${thisMonthBookings.length} bookings this month`}
          color="bg-green-500/10 text-green-400"
        />
        <StatCard
          icon={Clock}
          label="Pending Bookings"
          value={pendingCount}
          sub="Awaiting confirmation"
          color="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Confirmed"
          value={confirmedCount}
          sub="Ready to go"
          color="bg-purple-500/10 text-purple-400"
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent bookings table */}
        <div className="xl:col-span-2 bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">Recent Bookings</h2>
            </div>
            <a
              href="/admin/bookings"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : recent.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">No bookings yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide hidden md:table-cell">
                      Service
                    </th>
                    <th className="text-left text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide hidden lg:table-cell">
                      Barber
                    </th>
                    <th className="text-left text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-left text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide hidden sm:table-cell">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((booking, idx) => (
                    <tr
                      key={booking.id}
                      className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                        idx === recent.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-white font-medium text-xs">
                            {booking.customerName}
                          </p>
                          <p className="text-zinc-500 text-xs">{booking.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-zinc-300 text-xs">{getServiceName(booking)}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="text-zinc-300 text-xs">
                          {booking.barber?.name ?? "Any"}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <div>
                          <p className="text-zinc-300 text-xs">
                            {format(new Date(booking.date), "MMM d, yyyy")}
                          </p>
                          <p className="text-zinc-500 text-xs">{booking.startTime}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-5 py-3 text-right hidden sm:table-cell">
                        <span className="text-zinc-300 text-xs font-medium">
                          ${booking.totalPrice.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status breakdown chart */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h2 className="text-white font-semibold text-sm">Status Breakdown</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <StatusBarChart bookings={bookings} />
          )}

          {/* Revenue by month mini-section */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
              This Month
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs">Bookings</span>
                <span className="text-white text-xs font-medium">
                  {thisMonthBookings.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs">Revenue</span>
                <span className="text-green-400 text-xs font-medium">
                  ${monthRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs">Pending</span>
                <span className="text-amber-400 text-xs font-medium">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs">Confirmed</span>
                <span className="text-blue-400 text-xs font-medium">{confirmedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
