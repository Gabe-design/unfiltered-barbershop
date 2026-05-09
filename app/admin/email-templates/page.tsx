"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, Pencil, X, Save, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

type TemplateType =
  | "BOOKING_CONFIRMATION"
  | "BOOKING_REMINDER"
  | "REVIEW_REQUEST"
  | "REBOOKING_REMINDER"
  | "ABANDONED_BOOKING"
  | "REFERRAL_INVITE"
  | "PROMO_CAMPAIGN";

interface EmailTemplate {
  id: string;
  type: TemplateType;
  name: string;
  subject: string;
  htmlBody: string;
  isActive: boolean;
  updatedAt: string;
}

const TYPE_LABELS: Record<TemplateType, string> = {
  BOOKING_CONFIRMATION: "Booking Confirmation",
  BOOKING_REMINDER: "Booking Reminder",
  REVIEW_REQUEST: "Review Request",
  REBOOKING_REMINDER: "Rebooking Reminder",
  ABANDONED_BOOKING: "Abandoned Booking Recovery",
  REFERRAL_INVITE: "Referral Invite",
  PROMO_CAMPAIGN: "Promo Campaign",
};

const TYPE_HINTS: Record<TemplateType, string> = {
  BOOKING_CONFIRMATION: "Sent when a booking is created. Variables: {{customerName}}, {{date}}, {{time}}, {{barber}}, {{total}}, {{confirmationId}}",
  BOOKING_REMINDER: "Sent 24h before appointment. Variables: {{customerName}}, {{date}}, {{time}}, {{barber}}",
  REVIEW_REQUEST: "Sent after booking is marked Completed. Variables: {{customerName}}, {{reviewLink}}",
  REBOOKING_REMINDER: "Sent X weeks after last visit. Variables: {{customerName}}, {{weeksAgo}}, {{bookingUrl}}",
  ABANDONED_BOOKING: "Sent when someone starts but doesn't finish booking. Variables: {{name}}, {{bookingUrl}}",
  REFERRAL_INVITE: "Sent to referred friends. Variables: {{referrerName}}, {{referralCode}}, {{reward}}, {{bookingUrl}}",
  PROMO_CAMPAIGN: "Manual promo blast. Variables: {{customerName}}, {{promoCode}}, {{discount}}, {{endDate}}",
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/email-templates");
    const data = await res.json();
    setTemplates(data.templates ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/email-templates?id=${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          subject: editing.subject,
          htmlBody: editing.htmlBody,
          isActive: editing.isActive,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Template saved");
      setEditing(null);
      load();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const ALL_TYPES = Object.keys(TYPE_LABELS) as TemplateType[];

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Email Templates</h1>
            <p className="text-zinc-400 text-xs mt-0.5">Customize automated emails</p>
          </div>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <p className="text-zinc-500 text-xs bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
        Templates are used as overrides when set. If no template is saved for a type, the built-in code template is used.
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {ALL_TYPES.map((type) => {
            const tmpl = templates.find((t) => t.type === type);
            return (
              <div key={type} className="bg-[#111111] border border-zinc-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{TYPE_LABELS[type]}</h3>
                      {tmpl ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tmpl.isActive ? "bg-green-500/10 text-green-400" : "bg-zinc-800 text-zinc-500"}`}>
                          {tmpl.isActive ? "Active" : "Inactive"}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">Using default</span>
                      )}
                    </div>
                    <p className="text-zinc-600 text-xs">{TYPE_HINTS[type]}</p>
                    {tmpl && <p className="text-zinc-400 text-xs mt-1">Subject: {tmpl.subject}</p>}
                  </div>
                  <button
                    onClick={() =>
                      setEditing(
                        tmpl ?? {
                          id: "",
                          type,
                          name: TYPE_LABELS[type],
                          subject: "",
                          htmlBody: "",
                          isActive: true,
                          updatedAt: "",
                        }
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all flex-shrink-0"
                  >
                    <Pencil className="w-3 h-3" />
                    {tmpl ? "Edit" : "Create"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-white font-bold">{TYPE_LABELS[editing.type]}</h2>
              <button onClick={() => setEditing(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 flex-1">
              <p className="text-zinc-500 text-xs bg-zinc-900 rounded-lg p-3">{TYPE_HINTS[editing.type]}</p>

              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Template name</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Email subject</label>
                <input
                  value={editing.subject}
                  onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Subject line…"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">HTML body</label>
                <textarea
                  value={editing.htmlBody}
                  onChange={(e) => setEditing({ ...editing, htmlBody: e.target.value })}
                  rows={14}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500 resize-y"
                  placeholder="<!DOCTYPE html>…"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isActive}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-0"
                />
                <span className="text-zinc-300 text-sm">Active (overrides built-in template)</span>
              </label>
            </div>
            <div className="flex gap-3 p-5 border-t border-zinc-800">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "Saving…" : "Save Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
