"use client";

import { useEffect, useState, useCallback } from "react";
import { Gift, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface ReferralCode {
  id: string;
  code: string;
  rewardType: string | null;
  rewardValue: number | null;
  isActive: boolean;
  usedCount: number;
  createdAt: string;
  customer: { name: string; email: string; phone: string | null } | null;
  referrals: { id: string; status: string; createdAt: string; referredEmail: string }[];
}

interface Referral {
  id: string;
  referredEmail: string;
  status: string;
  rewardGiven: boolean;
  createdAt: string;
  referralCode: { code: string; customer: { name: string } | null };
  booking: { confirmationId: string; totalPrice: number } | null;
}

interface Stats {
  totalCodes: number;
  totalReferrals: number;
  converted: number;
  pending: number;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  CONVERTED: "bg-indigo-500/10 text-indigo-400",
  REWARDED: "bg-green-500/10 text-green-400",
};

export default function ReferralsPage() {
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCodes: 0, totalReferrals: 0, converted: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"codes" | "referrals">("codes");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/referrals");
    const data = await res.json();
    setCodes(data.codes ?? []);
    setReferrals(data.referrals ?? []);
    setStats(data.stats ?? { totalCodes: 0, totalReferrals: 0, converted: 0, pending: 0 });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRewarded = async (referralId: string) => {
    await fetch("/api/admin/referrals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralId, status: "REWARDED" }),
    });
    toast.success("Marked as rewarded");
    load();
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Gift className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Referrals</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{stats.totalCodes} codes · {stats.totalReferrals} referrals</p>
          </div>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Codes", value: stats.totalCodes, color: "text-white" },
          { label: "Total Referrals", value: stats.totalReferrals, color: "text-indigo-400" },
          { label: "Converted", value: stats.converted, color: "text-green-400" },
          { label: "Pending", value: stats.pending, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111111] border border-zinc-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-zinc-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {(["codes", "referrals"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
              tab === t
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "text-zinc-500 hover:text-white border border-transparent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === "codes" ? (
        <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
          {codes.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">No referral codes yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["Customer", "Code", "Uses", "Recent Referrals", "Created"].map((h) => (
                      <th key={h} className="text-left text-zinc-500 font-medium px-4 py-3 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-medium">{c.customer?.name ?? "Unknown"}</p>
                        <p className="text-zinc-500 text-xs">{c.customer?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-indigo-400 font-mono font-bold text-sm">{c.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-zinc-300 text-xs font-medium">{c.usedCount}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {c.referrals.slice(0, 2).map((r) => (
                            <div key={r.id} className="flex items-center gap-2">
                              <span className="text-zinc-500 text-xs truncate max-w-[120px]">{r.referredEmail}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_COLORS[r.status] ?? ""}`}>
                                {r.status.toLowerCase()}
                              </span>
                            </div>
                          ))}
                          {c.referrals.length === 0 && <span className="text-zinc-700 text-xs">None yet</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-zinc-500 text-xs">{format(new Date(c.createdAt), "MMM d, yyyy")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
          {referrals.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">No referrals yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["Referred By", "Referred Email", "Status", "Booking", "Date", "Action"].map((h) => (
                      <th key={h} className="text-left text-zinc-500 font-medium px-4 py-3 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs">{r.referralCode.customer?.name ?? "-"}</p>
                        <p className="text-zinc-600 text-xs font-mono">{r.referralCode.code}</p>
                      </td>
                      <td className="px-4 py-3"><span className="text-zinc-300 text-xs">{r.referredEmail}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status] ?? "bg-zinc-800 text-zinc-400"}`}>
                          {r.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.booking ? (
                          <span className="text-zinc-400 text-xs">${r.booking.totalPrice.toFixed(0)}</span>
                        ) : <span className="text-zinc-700 text-xs">-</span>}
                      </td>
                      <td className="px-4 py-3"><span className="text-zinc-500 text-xs">{format(new Date(r.createdAt), "MMM d")}</span></td>
                      <td className="px-4 py-3">
                        {r.status === "CONVERTED" && !r.rewardGiven && (
                          <button
                            onClick={() => markRewarded(r.id)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all"
                          >
                            Mark Rewarded
                          </button>
                        )}
                        {r.rewardGiven && <span className="text-green-400 text-xs">✓ Rewarded</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
