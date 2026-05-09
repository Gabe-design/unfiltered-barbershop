"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Filter,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

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
  totalDuration: number;
  status: BookingStatus;
  isHouseCall: boolean;
  houseCallAddress?: string | null;
  houseCallCity?: string | null;
  houseCallZip?: string | null;
  notes?: string | null;
  barber?: { name: string } | null;
  items: Array<{
    price: number;
    duration: number;
    service?: { name: string } | null;
    addOn?: { name: string } | null;
  }>;
  createdAt: string;
}

interface ApiResponse {
  bookings: Booking[];
  total: number;
  totalPages: number;
  page: number;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No Show" },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; classes: string; dot: string }> = {
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
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function DetailModal({
  booking,
  onClose,
  onStatusChange,
}: {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void>;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleStatus = async (status: BookingStatus) => {
    setUpdating(true);
    await onStatusChange(booking.id, status);
    setUpdating(false);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-[#111111] z-10">
          <div>
            <h2 className="text-white font-bold">Booking Details</h2>
            <p className="text-zinc-500 text-xs mt-0.5 font-mono">
              #{booking.confirmationId.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status update */}
          <div className="flex items-center gap-3">
            <StatusBadge status={booking.status} />
            <select
              value={booking.status}
              onChange={(e) => handleStatus(e.target.value as BookingStatus)}
              disabled={updating}
              className="ml-auto bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5
                focus:outline-none focus:border-blue-500 transition-colors"
            >
              {STATUS_OPTIONS.slice(1).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Customer info */}
          <section>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
              Customer
            </p>
            <div className="bg-zinc-900/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-zinc-500 text-xs">Name</p>
                <p className="text-white text-sm font-medium">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Email</p>
                <a
                  href={`mailto:${booking.customerEmail}`}
                  className="text-blue-400 text-sm hover:underline"
                >
                  {booking.customerEmail}
                </a>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Phone</p>
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="text-blue-400 text-sm hover:underline"
                >
                  {booking.customerPhone}
                </a>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Booking Type</p>
                <p className="text-white text-sm">
                  {booking.isHouseCall ? "House Call" : "In-Shop"}
                </p>
              </div>
            </div>
          </section>

          {/* Appointment info */}
          <section>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
              Appointment
            </p>
            <div className="bg-zinc-900/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-zinc-500 text-xs">Date</p>
                <p className="text-white text-sm font-medium">
                  {format(new Date(booking.date), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Time</p>
                <p className="text-white text-sm">
                  {booking.startTime} – {booking.endTime}
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Barber</p>
                <p className="text-white text-sm">{booking.barber?.name ?? "Any Available"}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Duration</p>
                <p className="text-white text-sm">{booking.totalDuration} min</p>
              </div>
            </div>
          </section>

          {/* Services */}
          <section>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
              Services
            </p>
            <div className="space-y-2">
              {booking.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-white text-sm">
                      {item.service?.name ?? item.addOn?.name ?? "Unknown"}
                    </p>
                    <p className="text-zinc-500 text-xs">{item.duration} min</p>
                  </div>
                  <p className="text-zinc-300 text-sm font-medium">${item.price.toFixed(2)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-2">
                <p className="text-white font-semibold text-sm">Total</p>
                <p className="text-blue-400 font-bold">${booking.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </section>

          {/* House call address */}
          {booking.isHouseCall && booking.houseCallAddress && (
            <section>
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
                House Call Address
              </p>
              <div className="bg-zinc-900/50 rounded-xl p-4">
                <p className="text-white text-sm">
                  {booking.houseCallAddress}
                  {booking.houseCallCity && `, ${booking.houseCallCity}`}
                  {booking.houseCallZip && ` ${booking.houseCallZip}`}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${booking.houseCallAddress}, ${booking.houseCallCity}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 text-xs mt-2 hover:underline"
                >
                  Open in Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>
          )}

          {/* Notes */}
          {booking.notes && (
            <section>
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
                Notes
              </p>
              <div className="bg-zinc-900/50 rounded-xl p-4">
                <p className="text-zinc-300 text-sm whitespace-pre-wrap">{booking.notes}</p>
              </div>
            </section>
          )}

          <p className="text-zinc-600 text-xs">
            Booked: {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(status !== "all" && { status }),
        ...(search && { search }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data: ApiResponse = await res.json();
      setBookings(data.bookings ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [page, status, search, dateFrom, dateTo]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    if (bookings.length === 0) return;
    const headers = [
      "Confirmation ID",
      "Customer Name",
      "Email",
      "Phone",
      "Service",
      "Barber",
      "Date",
      "Time",
      "Total",
      "Status",
      "Type",
      "Booked At",
    ];
    const rows = bookings.map((b) => [
      b.confirmationId,
      b.customerName,
      b.customerEmail,
      b.customerPhone,
      b.items.find((i) => i.service)?.service?.name ?? "",
      b.barber?.name ?? "Any",
      format(new Date(b.date), "yyyy-MM-dd"),
      b.startTime,
      b.totalPrice.toFixed(2),
      b.status,
      b.isHouseCall ? "House Call" : "In-Shop",
      format(new Date(b.createdAt), "yyyy-MM-dd HH:mm"),
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasFilters = search || status !== "all" || dateFrom || dateTo;

  return (
    <>
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Bookings</h1>
            <p className="text-zinc-400 text-sm mt-1">{total} total bookings</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700
                hover:border-zinc-600 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                text-white bg-blue-600 hover:bg-blue-500 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, confirmation ID…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                  pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600 transition-colors"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                  pl-9 pr-8 py-2 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date from */}
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            />

            {/* Date to */}
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            />

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400
                  hover:text-white border border-zinc-700 hover:border-zinc-600 transition-all flex-shrink-0"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-zinc-500 text-sm mt-3">Loading bookings…</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-400 font-medium">No bookings found</p>
              <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {[
                      "ID",
                      "Customer",
                      "Service",
                      "Barber",
                      "Date / Time",
                      "Total",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, idx) => (
                    <tr
                      key={booking.id}
                      className={`border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors cursor-pointer ${
                        idx === bookings.length - 1 ? "border-b-0" : ""
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="px-5 py-3">
                        <span className="font-mono text-zinc-400 text-xs">
                          #{booking.confirmationId.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-white font-medium text-xs">{booking.customerName}</p>
                          <p className="text-zinc-500 text-xs">{booking.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-zinc-300 text-xs">
                          {booking.items.find((i) => i.service)?.service?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-zinc-300 text-xs">
                          {booking.barber?.name ?? "Any"}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <p className="text-zinc-300 text-xs">
                          {format(new Date(booking.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-zinc-500 text-xs">
                          {booking.startTime}
                          {booking.isHouseCall && (
                            <span className="ml-1 text-purple-400">(HC)</span>
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-white text-xs font-medium">
                          ${booking.totalPrice.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td
                        className="px-5 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={booking.status}
                          disabled={updatingId === booking.id}
                          onChange={(e) =>
                            handleStatusChange(booking.id, e.target.value as BookingStatus)
                          }
                          className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg
                            px-2 py-1.5 focus:outline-none focus:border-blue-500 transition-colors
                            disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.slice(1).map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 text-sm">
              Page {page} of {totalPages} &mdash; {total} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-zinc-400
                  hover:text-white border border-zinc-700 hover:border-zinc-600 transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-zinc-400
                  hover:text-white border border-zinc-700 hover:border-zinc-600 transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedBooking && (
        <DetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
