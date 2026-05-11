"use client";

import { useEffect, useState, useCallback } from "react";
import { UserX, RefreshCw, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface AbandonedBooking {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  stepReached: number;
  serviceSlug: string | null;
  barberSlug: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  isHouseCall: boolean;
  followUpSent: boolean;
  followUpSentAt: string | null;
  recovered: boolean;
  source: string | null;
  createdAt: string;
}

const STEP_LABELS: Record<number, string> = {
  1: "Service",
  2: "Add-ons",
  3: "Date/Time",
  4: "Barber",
  5: "Summary",
  6: "Customer Info",
  7: "Confirmation",
};

export default function AbandonedPage() {
  const [abandoned, setAbandoned] = useState<AbandonedBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filter === "recovered") params.set("recovered", "true");
    if (filter === "pending") params.set("recovered", "false");
    const res = await fetch(`/api/admin/abandoned?${params}`);
    const data = await res.json();
    setAbandoned(data.abandoned ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const sendFollowUp = async (id: string) => {
    setSending(id);
    try {
      const res = await fetch("/api/admin/abandoned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Follow-up email sent");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setSending(null);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const stats = {
    total: abandoned.length,
    recovered: abandoned.filter((a) => a.recovered).length,
    followedUp: abandoned.filter((a) => a.followUpSent).length,
    hasEmail: abandoned.filter((a) => a.email).length,
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <UserX className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Abandoned Bookings</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{total} total</p>
          </div>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Has Email", value: stats.hasEmail, color: "text-indigo-400" },
          { label: "Followed Up", value: stats.followedUp, color: "text-amber-400" },
          { label: "Recovered", value: stats.recovered, color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111111] border border-zinc-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-zinc-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {[
          { value: "all", label: "All" },
          { value: "pending", label: "Not Recovered" },
          { value: "recovered", label: "Recovered" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.value
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "text-zinc-500 hover:text-white border border-transparent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : abandoned.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">No abandoned bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Lead", "Dropped At", "Service", "Date/Time", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left text-zinc-500 font-medium px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {abandoned.map((a) => (
                  <tr key={a.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium">{a.name ?? "Unknown"}</p>
                      {a.email && <p className="text-zinc-500 text-xs">{a.email}</p>}
                      {a.phone && <p className="text-zinc-600 text-xs">{a.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-amber-400 text-xs font-medium">
                        Step {a.stepReached}: {STEP_LABELS[a.stepReached] ?? "Unknown"}
                      </span>
                      <p className="text-zinc-600 text-xs mt-0.5">{format(new Date(a.createdAt), "MMM d, h:mm a")}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-400 text-xs">{a.serviceSlug?.replace(/-/g, " ") ?? "-"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-400 text-xs">
                        {a.preferredDate ? format(new Date(a.preferredDate), "MMM d") : "-"}
                        {a.preferredTime && ` · ${a.preferredTime}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.recovered ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Recovered</span>
                      ) : a.followUpSent ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">Followed up</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {a.email && !a.recovered && (
                        <button
                          onClick={() => sendFollowUp(a.id)}
                          disabled={sending === a.id}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                            bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20
                            disabled:opacity-30 transition-all"
                        >
                          {sending === a.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                          {a.followUpSent ? "Resend" : "Follow Up"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
