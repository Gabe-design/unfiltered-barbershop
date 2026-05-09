"use client";

import { useEffect, useState, useCallback } from "react";
import { Image, Plus, Trash2, RefreshCw, X } from "lucide-react";
import toast from "react-hot-toast";
import NextImage from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = { url: "", alt: "", category: "", displayOrder: 0, isActive: true };

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setImages(data.images ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.url) { toast.error("Image URL is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, displayOrder: Number(form.displayOrder) }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Image added");
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch {
      toast.error("Failed to add image");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this image?")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    toast.success("Image removed");
    load();
  };

  const toggle = async (img: GalleryImage) => {
    await fetch(`/api/admin/gallery?id=${img.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !img.isActive }),
    });
    load();
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg"><Image className="w-4 h-4 text-purple-400" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Gallery</h1>
            <p className="text-zinc-400 text-xs mt-0.5">{images.length} images</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg text-zinc-400 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />Add Image
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : images.length === 0 ? (
        <div className="bg-[#111111] border border-zinc-800 rounded-xl py-12 text-center">
          <Image className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No gallery images yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img) => (
            <div key={img.id} className={`group relative rounded-xl overflow-hidden border ${img.isActive ? "border-zinc-800" : "border-zinc-800/30 opacity-40"}`}>
              <div className="aspect-square relative bg-zinc-900">
                <NextImage
                  src={img.url}
                  alt={img.alt ?? "Gallery image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => toggle(img)} className="p-1.5 rounded-lg bg-zinc-900/90 text-zinc-300 hover:text-white text-xs">
                  {img.isActive ? "Hide" : "Show"}
                </button>
                <button onClick={() => remove(img.id)} className="p-1.5 rounded-lg bg-red-900/80 text-red-300 hover:text-white">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {img.category && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-black/70 text-zinc-300">{img.category}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-zinc-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold">Add Image</h2>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-zinc-400 hover:text-white" /></button>
            </div>
            {[
              { label: "Image URL *", key: "url", placeholder: "https://..." },
              { label: "Alt text", key: "alt", placeholder: "Fresh fade haircut" },
              { label: "Category", key: "category", placeholder: "fade, beard, design…" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-zinc-400 text-xs mb-1.5 block">{label}</label>
                <input
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            {form.url && (
              <div className="relative h-32 rounded-lg overflow-hidden bg-zinc-900">
                <NextImage src={form.url} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm border border-zinc-700 text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
