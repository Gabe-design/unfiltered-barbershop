"use client";

import { useEffect, useState } from "react";
import {
  BarChart3, DollarSign, Calendar, CheckCircle, XCircle, Star,
  TrendingUp, Users, RefreshCw, Trophy, UserX, ArrowUpRight,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShowRate: number;
    repeatCustomerRate: number;
    totalRevenue: number;
    avgBookingValue: number;
    reviewRequestConversionRate: number;
  };
  thisMonth: { bookings: number; revenue: number; newCustomers: number };
  lastMonth: { bookings: number; revenue: number };
  bySource: Record<string, number>;
  topServices: { name: string; count: number; revenue: number }[];
  topBarbers: { name: string; count: number; revenue: number }[];
  byStatus: Record<string, number>;
  reviewStats: { sent: number; clicked: number; reviewed: number; conversionRate: number };
  loyaltyStats: { bronze: number; silver: number; gold: number; platinum: number; totalVip: number };
  abandonedStats: { total: number; recovered: number; recoveryRate: number; followUpSent: number };
  referralStats: { totalCodes: number; totalReferrals: number; converted: number; pending: number };
}

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-white text-xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-400 text-xs w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-zinc-300 text-xs w-8 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-red-400" />
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE: "Website", INSTAGRAM: "Instagram", GOOGLE: "Google",
  REFERRAL: "Referral", DIRECT: "Direct", ADS: "Ads", QR_CODE: "QR Code",
};

const VIP_COLORS: Record<string, string> = {
  bronze: "bg-amber-600", silver: "bg-zinc-400", gold: "bg-yellow-400", platinum: "bg-red-400",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { overview, thisMonth, lastMonth, bySource, topServices, topBarbers, reviewStats, loyaltyStats, abandonedStats, referralStats } = data;
  const maxSource = Math.max(...Object.values(bySource), 1);
  const maxService = topServices[0]?.count ?? 1;
  const maxBarber = topBarbers[0]?.count ?? 1;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Analytics</h1>
            <p className="text-zinc-400 text-xs mt-0.5">Full platform performance</p>
          </div>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all">
          <RefreshCw className="w-3.5 h-3.5" />Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Calendar} label="Total Bookings" value={overview.totalBookings} sub="All time" color="bg-red-500/10 text-red-400" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${overview.totalRevenue.toFixed(0)}`} sub={`Avg $${overview.avgBookingValue.toFixed(0)}/booking`} color="bg-green-500/10 text-green-400" />
        <StatCard icon={CheckCircle} label="Completed" value={overview.completedBookings} sub={`${Math.round((overview.completedBookings / Math.max(overview.totalBookings, 1)) * 100)}% rate`} color="bg-emerald-500/10 text-emerald-400" />
        <StatCard icon={XCircle} label="No-Show Rate" value={`${(overview.noShowRate * 100).toFixed(1)}%`} sub={`${(overview.repeatCustomerRate * 100).toFixed(0)}% repeat customers`} color="bg-red-500/10 text-red-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">This Month</p>
          <div className="space-y-2">
            {[
              { label: "Bookings", value: thisMonth.bookings, color: "text-white" },
              { label: "Revenue", value: `$${thisMonth.revenue.toFixed(0)}`, color: "text-green-400" },
              { label: "New Customers", value: thisMonth.newCustomers, color: "text-red-400" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">{r.label}</span>
                <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">Last Month vs This Month</p>
          <div className="space-y-2">
            {[
              { label: "Last month bookings", value: lastMonth.bookings, color: "text-zinc-300" },
              { label: "Last month revenue", value: `$${lastMonth.revenue.toFixed(0)}`, color: "text-zinc-300" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">{r.label}</span>
                <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
            {thisMonth.revenue > 0 && lastMonth.revenue > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <span className="text-zinc-400 text-xs">Revenue change</span>
                <span className={`text-xs font-bold flex items-center gap-1 ${thisMonth.revenue >= lastMonth.revenue ? "text-green-400" : "text-red-400"}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {(((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <Panel title="Bookings by Source" icon={TrendingUp}>
          <div className="space-y-2.5">
            {Object.entries(bySource).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a).map(([src, count]) => (
              <BarRow key={src} label={SOURCE_LABELS[src] ?? src} value={count} max={maxSource} color="bg-red-600" />
            ))}
            {Object.values(bySource).every((v) => v === 0) && <p className="text-zinc-600 text-xs text-center py-4">No data yet</p>}
          </div>
        </Panel>

        <Panel title="Top Services" icon={TrendingUp}>
          <div className="space-y-2.5">
            {topServices.map((s) => (
              <div key={s.name}>
                <BarRow label={s.name} value={s.count} max={maxService} color="bg-purple-500" />
                <p className="text-zinc-600 text-[10px] text-right mt-0.5">${s.revenue.toFixed(0)} revenue</p>
              </div>
            ))}
            {topServices.length === 0 && <p className="text-zinc-600 text-xs text-center py-4">No data yet</p>}
          </div>
        </Panel>

        <Panel title="Top Barbers" icon={Users}>
          <div className="space-y-2.5">
            {topBarbers.map((b) => (
              <div key={b.name}>
                <BarRow label={b.name} value={b.count} max={maxBarber} color="bg-amber-500" />
                <p className="text-zinc-600 text-[10px] text-right mt-0.5">${b.revenue.toFixed(0)} revenue</p>
              </div>
            ))}
            {topBarbers.length === 0 && <p className="text-zinc-600 text-xs text-center py-4">No data yet</p>}
          </div>
        </Panel>

        <Panel title="Review Requests" icon={Star}>
          <div className="space-y-3">
            {[
              { label: "Sent", value: reviewStats.sent, color: "text-red-400" },
              { label: "Clicked", value: reviewStats.clicked, color: "text-amber-400" },
              { label: "Reviewed", value: reviewStats.reviewed, color: "text-green-400" },
              { label: "Conversion", value: `${(reviewStats.conversionRate * 100).toFixed(1)}%`, color: "text-emerald-400" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">{r.label}</span>
                <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Loyalty / VIP" icon={Trophy}>
          <div className="space-y-2.5">
            {(["bronze", "silver", "gold", "platinum"] as const).map((tier) => (
              <BarRow
                key={tier}
                label={tier.charAt(0).toUpperCase() + tier.slice(1)}
                value={loyaltyStats[tier]}
                max={Math.max(loyaltyStats.bronze, loyaltyStats.silver, loyaltyStats.gold, loyaltyStats.platinum, 1)}
                color={VIP_COLORS[tier]}
              />
            ))}
            <div className="pt-2 border-t border-zinc-800 flex justify-between">
              <span className="text-zinc-400 text-xs">Total VIP</span>
              <span className="text-white text-xs font-bold">{loyaltyStats.totalVip}</span>
            </div>
          </div>
        </Panel>

        <Panel title="Abandoned & Referrals" icon={UserX}>
          <div className="space-y-3">
            <p className="text-zinc-500 text-[10px] uppercase tracking-wide font-semibold">Abandoned</p>
            {[
              { label: "Total", value: abandonedStats.total, color: "text-red-400" },
              { label: "Follow-ups sent", value: abandonedStats.followUpSent, color: "text-amber-400" },
              { label: "Recovered", value: abandonedStats.recovered, color: "text-green-400" },
              { label: "Recovery rate", value: `${(abandonedStats.recoveryRate * 100).toFixed(1)}%`, color: "text-emerald-400" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">{r.label}</span>
                <span className={`text-xs font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
            <p className="text-zinc-500 text-[10px] uppercase tracking-wide font-semibold pt-2 border-t border-zinc-800">Referrals</p>
            {[
              { label: "Active codes", value: referralStats.totalCodes, color: "text-red-400" },
              { label: "Total referrals", value: referralStats.totalReferrals, color: "text-white" },
              { label: "Converted", value: referralStats.converted, color: "text-green-400" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">{r.label}</span>
                <span className={`text-xs font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
