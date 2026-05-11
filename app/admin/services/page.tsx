"use client";

import { useEffect, useState, useCallback } from "react";
import { Scissors, Plus, Pencil, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

type ServiceCategory = "HAIRCUT" | "BEARD" | "DESIGN" | "ENHANCEMENT" | "HOUSE_CALL" | "COMBO";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  category: ServiceCategory;
  isActive: boolean;
  isHouseCall: boolean;
  afterHoursFee: number;
  displayOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  _count: { bookingItems: number };
}

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  HAIRCUT: "Haircut",
  BEARD: "Beard",
  DESIGN: "Design",
  ENHANCEMENT: "Enhancement",
  HOUSE_CALL: "House Call",
  COMBO: "Combo",
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: 45,
  duration: 60,
  category: "HAIRCUT" as ServiceCategory,
  isActive: true,
  isHouseCall: false,
  afterHoursFee: 0,
  displayOrder: 0,
  seoTitle: "",
  seoDescription: "",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data.services ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      slug: s.slug,
      description: s.description ?? "",
      price: s.price,
      duration: s.duration,
      category: s.category,
      isActive: s.isActive,
      isHouseCall: s.isHouseCall,
      afterHoursFee: s.afterHoursFee,
      displayOrder: s.displayOrder,
      seoTitle: s.seoTitle ?? "",
      seoDescription: s.seoDescription ?? "",
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug required"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/services?id=${editing.id}` : "/api/admin/services";
      const method = editing ? "PATCH" : "POST";
      const payload = { ...form, price: Number(form.price), duration: Number(form.duration), afterHoursFee: Number(form.afterHoursFee), displayOrder: Number(form.displayOrder) };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
      toast.success(editing ? "Service updated" : "Service created");
      setShowForm(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (s: Service) => {
    await fetch(`/api/admin/services?id=${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    load();
  };

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg"><Scissors className="w-4 h-4 text-indigo-400" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Services</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{services.length} services</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg text-zinc-400 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />New Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Service", "Price", "Duration", "Category", "Bookings", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-zinc-500 font-medium px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium">{s.name}</p>
                      <p className="text-zinc-600 text-xs font-mono">{s.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-400 text-xs font-medium">${s.price}</span>
                      {s.afterHoursFee > 0 && <span className="text-zinc-600 text-xs"> +${s.afterHoursFee}</span>}
                    </td>
                    <td className="px-4 py-3"><span className="text-zinc-300 text-xs">{s.duration}m</span></td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{CATEGORY_LABELS[s.category]}</span>
                    </td>
                    <td className="px-4 py-3"><span className="text-zinc-400 text-xs">{s._count.bookingItems}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(s)} className={`text-xs px-2 py-0.5 rounded-full transition-all ${s.isActive ? "bg-green-500/10 text-green-400" : "bg-zinc-800 text-zinc-500"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-zinc-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold">{editing ? "Edit Service" : "New Service"}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>

            {[
              { label: "Name *", key: "name", placeholder: "Haircut & Design" },
              { label: "Slug *", key: "slug", placeholder: "haircut-design" },
              { label: "Description", key: "description", placeholder: "Service description…" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-zinc-400 text-xs mb-1.5 block">{label}</label>
                <input
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({ ...form, [key]: val, ...(key === "name" && !editing ? { slug: slugify(val) } : {}) });
                  }}
                  placeholder={placeholder}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Price ($)", key: "price", type: "number" },
                { label: "Duration (min)", key: "duration", type: "number" },
                { label: "After-hours fee ($)", key: "afterHoursFee", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-zinc-400 text-xs mb-1.5 block">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form] as number}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-zinc-400 text-xs mb-1.5 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div className="flex gap-4">
              {[
                { label: "Active", key: "isActive" },
                { label: "House Call", key: "isHouseCall" },
              ].map(({ label, key }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0" />
                  <span className="text-zinc-300 text-sm">{label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm border border-zinc-700 text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
