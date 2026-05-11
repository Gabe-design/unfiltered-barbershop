"use client";

import { useEffect, useState, useCallback } from "react";
import { Tag, Plus, RefreshCw, Pencil, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Promo {
  id: string;
  title: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  code: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableServices: string[];
  usedCount: number;
  maxUses: number | null;
  isFirstTimeOnly: boolean;
  bannerText: string | null;
  _count: { bookings: number };
}

const emptyForm: {
  title: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  code: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableServices: string[];
  maxUses: string;
  isFirstTimeOnly: boolean;
  bannerText: string;
} = {
  title: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: 10,
  code: "",
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  isActive: true,
  applicableServices: [] as string[],
  maxUses: "",
  isFirstTimeOnly: false,
  bannerText: "",
};

function Input({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-zinc-400 text-xs mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm
          placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
      />
    </div>
  );
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/promos");
    const data = await res.json();
    setPromos(data.promos ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (p: Promo) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description ?? "",
      discountType: p.discountType,
      discountValue: p.discountValue,
      code: p.code,
      startDate: format(new Date(p.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(p.endDate), "yyyy-MM-dd"),
      isActive: p.isActive,
      applicableServices: p.applicableServices,
      maxUses: p.maxUses ? String(p.maxUses) : "",
      isFirstTimeOnly: p.isFirstTimeOnly,
      bannerText: p.bannerText ?? "",
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title || !form.code) { toast.error("Title and code are required"); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
      };
      const url = editing ? `/api/admin/promos?id=${editing.id}` : "/api/admin/promos";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed");
      }
      toast.success(editing ? "Promo updated" : "Promo created");
      setShowForm(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const deletePromo = async (id: string) => {
    if (!confirm("Delete this promo?")) return;
    await fetch(`/api/admin/promos?id=${id}`, { method: "DELETE" });
    toast.success("Promo deleted");
    load();
  };

  const now = new Date();

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Tag className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Promo Campaigns</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{promos.length} campaigns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg text-zinc-400 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Promo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-[#111111] border border-zinc-800 rounded-xl py-12 text-center">
          <Tag className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No promos yet. Create your first campaign.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((p) => {
            const isLive = p.isActive && new Date(p.startDate) <= now && new Date(p.endDate) >= now;
            const isExpired = new Date(p.endDate) < now;
            return (
              <div key={p.id} className="bg-[#111111] border border-zinc-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-white font-semibold text-sm">{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isLive ? "bg-green-500/10 text-green-400" :
                        isExpired ? "bg-zinc-800 text-zinc-500" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {isLive ? "Live" : isExpired ? "Expired" : "Scheduled"}
                      </span>
                      {p.isFirstTimeOnly && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">First-time only</span>
                      )}
                    </div>
                    {p.description && <p className="text-zinc-400 text-xs mb-2">{p.description}</p>}
                    {p.bannerText && (
                      <p className="text-red-400 text-xs italic mb-2">&quot;{p.bannerText}&quot;</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
                      <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">{p.code}</span>
                      <span>
                        {p.discountType === "PERCENTAGE" ? `${p.discountValue}% off` : `$${p.discountValue} off`}
                      </span>
                      <span>{format(new Date(p.startDate), "MMM d")} – {format(new Date(p.endDate), "MMM d, yyyy")}</span>
                      <span>{p._count.bookings} uses{p.maxUses ? ` / ${p.maxUses} max` : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deletePromo(p.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 bg-zinc-900 border border-zinc-800 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-zinc-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold">{editing ? "Edit Promo" : "New Promo"}</h2>
              <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <Input label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Summer Special" />
            <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Short description…" />
            <Input label="Banner text (shown on site)" value={form.bannerText} onChange={(v) => setForm({ ...form, bannerText: v })} placeholder="🎉 Summer sale: 20% off all cuts" />
            <Input label="Promo code *" value={form.code} onChange={(v) => setForm({ ...form, code: v.toUpperCase() })} placeholder="SUMMER20" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Discount type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as "PERCENTAGE" | "FIXED" })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed ($)</option>
                </select>
              </div>
              <Input label="Discount value" type="number" value={form.discountValue} onChange={(v) => setForm({ ...form, discountValue: Number(v) })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Start date" type="date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} />
              <Input label="End date" type="date" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} />
            </div>

            <Input label="Max uses (leave blank for unlimited)" type="number" value={form.maxUses} onChange={(v) => setForm({ ...form, maxUses: v })} placeholder="100" />

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFirstTimeOnly} onChange={(e) => setForm({ ...form, isFirstTimeOnly: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0" />
                <span className="text-zinc-300 text-sm">First-time clients only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0" />
                <span className="text-zinc-300 text-sm">Active</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
