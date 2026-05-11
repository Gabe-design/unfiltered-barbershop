"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface LoyaltyProfile {
  vipStatus: string;
  visitCount: number;
  rewardsEarned: number;
}

interface ReferralCode {
  code: string;
  usedCount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  favoriteBarber: string | null;
  preferredService: string | null;
  totalSpent: number;
  visitCount: number;
  noShowCount: number;
  lastVisitDate: string | null;
  nextSuggestedDate: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
  loyaltyProfile: LoyaltyProfile | null;
  referralCode: ReferralCode | null;
  _count: { bookings: number };
}

const VIP_COLORS: Record<string, string> = {
  NONE: "bg-zinc-700 text-zinc-400",
  BRONZE: "bg-amber-900/40 text-amber-400",
  SILVER: "bg-zinc-600/40 text-zinc-300",
  GOLD: "bg-yellow-900/40 text-yellow-400",
  PLATINUM: "bg-purple-900/40 text-purple-400",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Customer | null>(null);

  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    setCustomers(data.customers ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CRM</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{total} customers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, email, phone…"
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs
                placeholder-zinc-600 focus:outline-none focus:border-indigo-500 w-56 transition-colors"
            />
          </div>
          <button
            onClick={load}
            className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Customer", "Visits", "Spent", "Last Visit", "VIP", "Referral"].map((h) => (
                    <th key={h} className="text-left text-zinc-500 font-medium px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium">{c.name}</p>
                      <p className="text-zinc-500 text-xs">{c.email}</p>
                      {c.phone && <p className="text-zinc-600 text-xs">{c.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-300 text-xs font-medium">{c.visitCount}</span>
                      {c.noShowCount > 0 && (
                        <span className="ml-1 text-red-400 text-xs">({c.noShowCount} no-show)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-400 text-xs font-medium">${c.totalSpent.toFixed(0)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-400 text-xs">
                        {c.lastVisitDate ? format(new Date(c.lastVisitDate), "MMM d, yyyy") : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${VIP_COLORS[c.loyaltyProfile?.vipStatus ?? "NONE"]}`}>
                        {c.loyaltyProfile?.vipStatus ?? "None"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.referralCode ? (
                        <span className="text-indigo-400 text-xs font-mono">
                          {c.referralCode.code} <span className="text-zinc-600">({c.referralCode.usedCount})</span>
                        </span>
                      ) : (
                        <span className="text-zinc-700 text-xs">-</span>
                      )}
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
          <p className="text-zinc-500 text-xs">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 bg-zinc-900 border border-zinc-700 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-zinc-400 text-xs">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 bg-zinc-900 border border-zinc-700 transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-end"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md h-full bg-[#111111] border-l border-zinc-800 overflow-y-auto p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{selected.name}</h2>
                <p className="text-zinc-400 text-xs mt-0.5">{selected.email}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-zinc-400 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Visits", value: selected.visitCount, color: "text-white" },
                { label: "Total Spent", value: `$${selected.totalSpent.toFixed(0)}`, color: "text-green-400" },
                { label: "No-Shows", value: selected.noShowCount, color: "text-red-400" },
                { label: "VIP Status", value: selected.loyaltyProfile?.vipStatus ?? "None", color: "text-indigo-400" },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900 rounded-lg p-3">
                  <p className="text-zinc-500 text-xs">{s.label}</p>
                  <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {selected.phone && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">Phone</p>
                <p className="text-white text-sm">{selected.phone}</p>
              </div>
            )}

            {selected.favoriteBarber && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">Preferred Barber</p>
                <p className="text-white text-sm">{selected.favoriteBarber}</p>
              </div>
            )}

            {selected.preferredService && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">Preferred Service</p>
                <p className="text-white text-sm">{selected.preferredService}</p>
              </div>
            )}

            {selected.lastVisitDate && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">Last Visit</p>
                <p className="text-white text-sm">{format(new Date(selected.lastVisitDate), "MMMM d, yyyy")}</p>
              </div>
            )}

            {selected.nextSuggestedDate && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">Next Suggested Visit</p>
                <p className="text-indigo-400 text-sm">{format(new Date(selected.nextSuggestedDate), "MMMM d, yyyy")}</p>
              </div>
            )}

            {selected.referralCode && (
              <div className="bg-zinc-900 rounded-lg p-3">
                <p className="text-zinc-500 text-xs mb-1">Referral Code</p>
                <p className="text-indigo-400 font-mono text-sm font-bold">{selected.referralCode.code}</p>
                <p className="text-zinc-600 text-xs mt-0.5">{selected.referralCode.usedCount} uses</p>
              </div>
            )}

            {selected.tags.length > 0 && (
              <div>
                <p className="text-zinc-500 text-xs mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.notes && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">Notes</p>
                <p className="text-zinc-300 text-sm whitespace-pre-wrap">{selected.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
