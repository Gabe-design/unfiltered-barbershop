"use client";

import { useEffect, useState, useCallback } from "react";
import { Trophy, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type VipStatus = "NONE" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

interface LoyaltyProfile {
  id: string;
  visitCount: number;
  rewardsEarned: number;
  rewardsUsed: number;
  vipStatus: VipStatus;
  vipSince: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    lastVisitDate: string | null;
  };
}

interface Stats {
  none: number;
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

const VIP_CONFIG: Record<VipStatus, { label: string; classes: string; dot: string }> = {
  NONE: { label: "None", classes: "bg-zinc-800 text-zinc-400", dot: "bg-zinc-600" },
  BRONZE: { label: "Bronze", classes: "bg-amber-900/40 text-amber-400", dot: "bg-amber-500" },
  SILVER: { label: "Silver", classes: "bg-zinc-600/40 text-zinc-300", dot: "bg-zinc-400" },
  GOLD: { label: "Gold", classes: "bg-yellow-900/40 text-yellow-400", dot: "bg-yellow-400" },
  PLATINUM: { label: "Platinum", classes: "bg-red-900/40 text-red-400", dot: "bg-red-400" },
};

const VIP_LEVELS: VipStatus[] = ["NONE", "BRONZE", "SILVER", "GOLD", "PLATINUM"];

export default function LoyaltyPage() {
  const [profiles, setProfiles] = useState<LoyaltyProfile[]>([]);
  const [stats, setStats] = useState<Stats>({ none: 0, bronze: 0, silver: 0, gold: 0, platinum: 0 });
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("vipStatus", filter);
    const res = await fetch(`/api/admin/loyalty?${params}`);
    const data = await res.json();
    setProfiles(data.profiles ?? []);
    setStats(data.stats ?? { none: 0, bronze: 0, silver: 0, gold: 0, platinum: 0 });
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateVip = async (id: string, vipStatus: VipStatus) => {
    await fetch("/api/admin/loyalty", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, vipStatus }),
    });
    toast.success("VIP status updated");
    load();
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Loyalty & VIP</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{total} loyalty profiles</p>
          </div>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["bronze", "silver", "gold", "platinum"] as const).map((tier) => {
          const cfg = VIP_CONFIG[tier.toUpperCase() as VipStatus];
          return (
            <div key={tier} className={`bg-[#111111] border border-zinc-800 rounded-xl p-4 text-center`}>
              <div className={`w-2 h-2 rounded-full ${cfg.dot} mx-auto mb-2`} />
              <p className={`text-xl font-bold ${cfg.classes.split(" ").find((c) => c.startsWith("text-"))}`}>
                {stats[tier]}
              </p>
              <p className="text-zinc-400 text-xs mt-1">{cfg.label}</p>
            </div>
          );
        })}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-white">{stats.none}</p>
          <p className="text-zinc-400 text-xs mt-1">No Status</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === "all" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-zinc-500 hover:text-white border border-transparent"}`}
        >
          All
        </button>
        {VIP_LEVELS.map((level) => {
          const cfg = VIP_CONFIG[level];
          return (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === level ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-zinc-500 hover:text-white border border-transparent"}`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">No loyalty profiles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Customer", "Visits", "Rewards", "Last Visit", "VIP Status", "Change Status"].map((h) => (
                    <th key={h} className="text-left text-zinc-500 font-medium px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const cfg = VIP_CONFIG[p.vipStatus];
                  return (
                    <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-medium">{p.customer.name}</p>
                        <p className="text-zinc-500 text-xs">{p.customer.email}</p>
                      </td>
                      <td className="px-4 py-3"><span className="text-white text-xs font-bold">{p.visitCount}</span></td>
                      <td className="px-4 py-3">
                        <span className="text-green-400 text-xs">{p.rewardsEarned} earned</span>
                        <span className="text-zinc-600 text-xs"> / {p.rewardsUsed} used</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-zinc-400 text-xs">
                          {p.customer.lastVisitDate ? format(new Date(p.customer.lastVisitDate), "MMM d, yyyy") : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.classes}`}>
                          {cfg.label}
                        </span>
                        {p.vipSince && (
                          <p className="text-zinc-600 text-xs mt-0.5">since {format(new Date(p.vipSince), "MMM d, yyyy")}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.vipStatus}
                          onChange={(e) => updateVip(p.id, e.target.value as VipStatus)}
                          className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-red-500"
                        >
                          {VIP_LEVELS.map((l) => (
                            <option key={l} value={l}>{VIP_CONFIG[l].label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
