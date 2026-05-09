"use client";
import { InstagramIcon } from '@/components/ui/instagram-icon';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  User,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const DAYS = [
  { key: 0, label: "Sun" },
  { key: 1, label: "Mon" },
  { key: 2, label: "Tue" },
  { key: 3, label: "Wed" },
  { key: 4, label: "Thu" },
  { key: 5, label: "Fri" },
  { key: 6, label: "Sat" },
];

interface AvailabilitySlot {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Barber {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  specialty?: string | null;
  instagram?: string | null;
  isActive: boolean;
  offersHouseCall: boolean;
  displayOrder: number;
  availability: AvailabilitySlot[];
  _count?: { bookings: number };
}

interface BarberForm {
  name: string;
  slug: string;
  bio: string;
  specialty: string;
  instagram: string;
  isActive: boolean;
  offersHouseCall: boolean;
  displayOrder: number;
  schedule: Record<number, { startTime: string; endTime: string; isActive: boolean }>;
}

const DEFAULT_FORM: BarberForm = {
  name: "",
  slug: "",
  bio: "",
  specialty: "",
  instagram: "",
  isActive: true,
  offersHouseCall: false,
  displayOrder: 0,
  schedule: Object.fromEntries(
    DAYS.map(({ key }) => [
      key,
      {
        startTime: "09:00",
        endTime: "19:00",
        isActive: key >= 1 && key <= 5, // Mon–Fri on by default
      },
    ])
  ),
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function availabilityToSchedule(
  av: AvailabilitySlot[]
): Record<number, { startTime: string; endTime: string; isActive: boolean }> {
  const schedule = { ...DEFAULT_FORM.schedule };
  av.forEach((slot) => {
    schedule[slot.dayOfWeek] = {
      startTime: slot.startTime,
      endTime: slot.endTime,
      isActive: slot.isActive,
    };
  });
  return schedule;
}

// -- Barber card ------------------------------------------------------------

function BarberCard({
  barber,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleHouseCall,
}: {
  barber: Barber;
  onEdit: (b: Barber) => void;
  onDelete: (b: Barber) => void;
  onToggleActive: (b: Barber) => void;
  onToggleHouseCall: (b: Barber) => void;
}) {
  return (
    <div
      className={`bg-[#111111] border rounded-xl p-5 flex flex-col gap-4 transition-colors ${
        barber.isActive ? "border-zinc-800" : "border-zinc-800/40 opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{barber.name}</h3>
            {barber.specialty && (
              <p className="text-zinc-500 text-xs mt-0.5">{barber.specialty}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onEdit(barber)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Edit barber"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(barber)}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete barber"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {barber.bio && (
        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{barber.bio}</p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span>{barber._count?.bookings ?? 0} bookings</span>
        {barber.instagram && (
          <a
            href={`https://instagram.com/${barber.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
          >
            <InstagramIcon className="w-3 h-3" />
            {barber.instagram}
          </a>
        )}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          onClick={() => onToggleActive(barber)}
          className={`flex items-center gap-2 text-xs font-medium transition-colors ${
            barber.isActive ? "text-green-400" : "text-zinc-500"
          }`}
        >
          {barber.isActive ? (
            <ToggleRight className="w-5 h-5" />
          ) : (
            <ToggleLeft className="w-5 h-5" />
          )}
          {barber.isActive ? "Active" : "Inactive"}
        </button>

        <button
          onClick={() => onToggleHouseCall(barber)}
          className={`flex items-center gap-2 text-xs font-medium transition-colors ${
            barber.offersHouseCall ? "text-blue-400" : "text-zinc-500"
          }`}
        >
          {barber.offersHouseCall ? (
            <ToggleRight className="w-5 h-5" />
          ) : (
            <ToggleLeft className="w-5 h-5" />
          )}
          House Calls
        </button>
      </div>

      {/* Schedule preview */}
      {barber.availability.length > 0 && (
        <div className="pt-2 border-t border-zinc-800">
          <p className="text-zinc-500 text-xs flex items-center gap-1 mb-2">
            <Clock className="w-3 h-3" />
            Schedule
          </p>
          <div className="flex flex-wrap gap-1">
            {DAYS.map(({ key, label }) => {
              const slot = barber.availability.find((a) => a.dayOfWeek === key);
              const active = slot?.isActive;
              return (
                <span
                  key={key}
                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    active
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-zinc-800 text-zinc-600 border border-zinc-700"
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// -- Edit / Create Modal ---------------------------------------------------

function BarberModal({
  barber,
  onClose,
  onSave,
}: {
  barber: Barber | null;
  onClose: () => void;
  onSave: (form: BarberForm, id?: string) => Promise<void>;
}) {
  const isNew = !barber;
  const [form, setForm] = useState<BarberForm>(
    barber
      ? {
          name: barber.name,
          slug: barber.slug,
          bio: barber.bio ?? "",
          specialty: barber.specialty ?? "",
          instagram: barber.instagram ?? "",
          isActive: barber.isActive,
          offersHouseCall: barber.offersHouseCall,
          displayOrder: barber.displayOrder,
          schedule: availabilityToSchedule(barber.availability),
        }
      : DEFAULT_FORM
  );
  const [saving, setSaving] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: isNew ? slugify(name) : f.slug }));
  };

  const handleScheduleChange = (
    day: number,
    field: "startTime" | "endTime" | "isActive",
    value: string | boolean
  ) => {
    setForm((f) => ({
      ...f,
      schedule: {
        ...f.schedule,
        [day]: { ...f.schedule[day], [field]: value },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form, barber?.id);
    setSaving(false);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-[#111111] z-10">
          <h2 className="text-white font-bold">{isNew ? "Add New Barber" : "Edit Barber"}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wide block mb-1.5">
                Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Marco Rodriguez"
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                  px-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wide block mb-1.5">
                Slug *
              </label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                placeholder="e.g. marco-rodriguez"
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                  px-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wide block mb-1.5">
                Specialty
              </label>
              <input
                value={form.specialty}
                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                placeholder="e.g. Precision Fades"
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                  px-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wide block mb-1.5">
                instagram
              </label>
              <input
                value={form.instagram}
                onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                placeholder="@handle"
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                  px-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium uppercase tracking-wide block mb-1.5">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Short bio shown on the team page…"
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                px-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-zinc-600 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wide block mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))
                }
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg
                  px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  form.isActive ? "bg-green-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form.isActive ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-zinc-300 text-sm">Active</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, offersHouseCall: !f.offersHouseCall }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  form.offersHouseCall ? "bg-blue-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form.offersHouseCall ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-zinc-300 text-sm">Offers House Calls</span>
            </label>
          </div>

          {/* Schedule */}
          <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
              Weekly Schedule
            </p>
            <div className="space-y-2">
              {DAYS.map(({ key, label }) => {
                const slot = form.schedule[key];
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      onClick={() => handleScheduleChange(key, "isActive", !slot.isActive)}
                      className={`w-9 h-4.5 rounded-full relative cursor-pointer transition-colors flex-shrink-0 ${
                        slot.isActive ? "bg-blue-500" : "bg-zinc-700"
                      }`}
                      style={{ height: "1.125rem" }}
                    >
                      <div
                        className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                          slot.isActive ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium w-8 flex-shrink-0 ${
                        slot.isActive ? "text-white" : "text-zinc-600"
                      }`}
                    >
                      {label}
                    </span>
                    <input
                      type="time"
                      value={slot.startTime}
                      disabled={!slot.isActive}
                      onChange={(e) => handleScheduleChange(key, "startTime", e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg
                        px-2 py-1.5 focus:outline-none focus:border-blue-500 transition-colors
                        disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <span className="text-zinc-600 text-xs">–</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      disabled={!slot.isActive}
                      onChange={(e) => handleScheduleChange(key, "endTime", e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg
                        px-2 py-1.5 focus:outline-none focus:border-blue-500 transition-colors
                        disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white border border-zinc-700
                hover:border-zinc-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : isNew ? "Create Barber" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -- Delete Confirm Modal --------------------------------------------------

function DeleteModal({
  barber,
  onClose,
  onConfirm,
}: {
  barber: Barber;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-white font-bold">Delete Barber</h2>
            <p className="text-zinc-400 text-sm">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-zinc-300 text-sm">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">{barber.name}</span>? All associated data
          will be removed.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white border
              border-zinc-700 hover:border-zinc-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600
              hover:bg-red-500 disabled:opacity-60 transition-all"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -- Main page -------------------------------------------------------------

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBarber, setEditBarber] = useState<Barber | null | undefined>(undefined); // undefined = closed, null = new
  const [deleteBarber, setDeleteBarber] = useState<Barber | null>(null);

  const fetchBarbers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/barbers");
      const data: Barber[] = await res.json();
      setBarbers(data ?? []);
    } catch {
      toast.error("Failed to load barbers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const handleSave = async (form: BarberForm, id?: string) => {
    try {
      const method = id ? "PATCH" : "POST";
      const res = await fetch("/api/admin/barbers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(id ? "Barber updated" : "Barber created");
      setEditBarber(undefined);
      fetchBarbers();
    } catch {
      toast.error("Failed to save barber");
    }
  };

  const handleToggle = async (barber: Barber, field: "isActive" | "offersHouseCall") => {
    try {
      const res = await fetch("/api/admin/barbers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...barber, id: barber.id, [field]: !barber[field] }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setBarbers((prev) =>
        prev.map((b) => (b.id === barber.id ? { ...b, [field]: !b[field] } : b))
      );
      toast.success("Updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (barber: Barber) => {
    try {
      const res = await fetch(`/api/admin/barbers?id=${barber.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setBarbers((prev) => prev.filter((b) => b.id !== barber.id));
      setDeleteBarber(null);
      toast.success("Barber deleted");
    } catch {
      toast.error("Failed to delete barber");
    }
  };

  return (
    <>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Barbers</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {barbers.length} barber{barbers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchBarbers}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700
                hover:border-zinc-600 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setEditBarber(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                text-white bg-blue-600 hover:bg-blue-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Barber
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : barbers.length === 0 ? (
          <div className="bg-[#111111] border border-zinc-800 rounded-xl p-12 text-center">
            <User className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium">No barbers yet</p>
            <p className="text-zinc-600 text-sm mt-1">Click &quot;Add Barber&quot; to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                onEdit={setEditBarber}
                onDelete={setDeleteBarber}
                onToggleActive={(b) => handleToggle(b, "isActive")}
                onToggleHouseCall={(b) => handleToggle(b, "offersHouseCall")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create modal */}
      {editBarber !== undefined && (
        <BarberModal
          barber={editBarber}
          onClose={() => setEditBarber(undefined)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm modal */}
      {deleteBarber && (
        <DeleteModal
          barber={deleteBarber}
          onClose={() => setDeleteBarber(null)}
          onConfirm={() => handleDelete(deleteBarber)}
        />
      )}
    </>
  );
}


