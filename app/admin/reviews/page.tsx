"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, RefreshCw, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type ReviewStatus = "NOT_REQUESTED" | "REQUESTED" | "CLICKED" | "REVIEWED";

interface ReviewRequest {
  id: string;
  email: string;
  status: ReviewStatus;
  sentAt: string | null;
  clickedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  booking: {
    confirmationId: string;
    customerName: string;
    customerEmail: string;
    date: string;
    totalPrice: number;
    barber: { name: string } | null;
  };
  customer: { name: string; email: string } | null;
}

const STATUS_CONFIG: Record<ReviewStatus, { label: string; classes: string }> = {
  NOT_REQUESTED: { label: "Not Sent", classes: "bg-zinc-800 text-zinc-400" },
  REQUESTED: { label: "Sent", classes: "bg-blue-500/10 text-blue-400" },
  CLICKED: { label: "Clicked", classes: "bg-amber-500/10 text-amber-400" },
  REVIEWED: { label: "Reviewed", classes: "bg-green-500/10 text-green-400" },
};

export default function ReviewsPage() {
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filter !== "all") params.set("status", filter);
    const res = await fetch(`/api/admin/reviews?${params}`);
    const data = await res.json();
    setRequests(data.requests ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const sendRequest = async (bookingId: string) => {
    setSending(bookingId);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Review request sent");
      load();
    } catch {
      toast.error("Failed to send review request");
    } finally {
      setSending(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const stats = {
    sent: requests.filter((r) => r.status !== "NOT_REQUESTED").length,
    clicked: requests.filter((r) => r.status === "CLICKED" || r.status === "REVIEWED").length,
    reviewed: requests.filter((r) => r.status === "REVIEWED").length,
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Review Requests</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{total} total</p>
          </div>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sent", value: stats.sent, color: "text-blue-400" },
          { label: "Clicked", value: stats.clicked, color: "text-amber-400" },
          { label: "Reviewed", value: stats.reviewed, color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111111] border border-zinc-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-zinc-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {["all", "NOT_REQUESTED", "REQUESTED", "CLICKED", "REVIEWED"].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "text-zinc-500 hover:text-white border border-transparent"
            }`}
          >
            {f === "all" ? "All" : STATUS_CONFIG[f as ReviewStatus]?.label ?? f}
          </button>
        ))}
      </div>

      <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">No review requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Customer", "Booking", "Sent", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left text-zinc-500 font-medium px-4 py-3 text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const cfg = STATUS_CONFIG[r.status];
                  return (
                    <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-medium">{r.booking.customerName}</p>
                        <p className="text-zinc-500 text-xs">{r.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-zinc-300 text-xs font-mono">{r.booking.confirmationId.slice(0, 8)}</p>
                        <p className="text-zinc-600 text-xs">
                          {format(new Date(r.booking.date), "MMM d, yyyy")}
                          {r.booking.barber && ` · ${r.booking.barber.name}`}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-zinc-400 text-xs">
                          {r.sentAt ? format(new Date(r.sentAt), "MMM d") : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.classes}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => sendRequest(r.booking.confirmationId ? r.id : r.id)}
                          disabled={sending === r.id || r.status === "REVIEWED"}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                            bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20
                            disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="Send review request email"
                        >
                          {sending === r.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          {r.status === "NOT_REQUESTED" ? "Send" : "Resend"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-zinc-500 text-xs">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 bg-zinc-900 border border-zinc-700">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 bg-zinc-900 border border-zinc-700">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
