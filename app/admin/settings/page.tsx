"use client";

import { useEffect, useState } from "react";
import { Settings, Save, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface AppSettings {
  googleReviewUrl: string;
  reviewRequestEnabled: boolean;
  reviewRequestDelayHours: number;
  rebookingReminderEnabled: boolean;
  defaultReminderWeeks: number;
  loyaltyEnabled: boolean;
  referralEnabled: boolean;
  referralRewardDescription: string;
  smsEnabled: boolean;
  shopPhone: string;
  instagramUrl: string;
}

const defaultSettings: AppSettings = {
  googleReviewUrl: "",
  reviewRequestEnabled: true,
  reviewRequestDelayHours: 2,
  rebookingReminderEnabled: true,
  defaultReminderWeeks: 3,
  loyaltyEnabled: true,
  referralEnabled: true,
  referralRewardDescription: "",
  smsEnabled: false,
  shopPhone: "",
  instagramUrl: "",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-red-600" : "bg-zinc-700"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5 space-y-4">
      <h2 className="text-white font-semibold text-sm">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-zinc-200 text-sm font-medium">{label}</p>
        {hint && <p className="text-zinc-500 text-xs mt-0.5">{hint}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm
        placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
    />
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Settings className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <p className="text-zinc-400 text-xs mt-0.5">Global platform configuration</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50
            text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save Changes
        </button>
      </div>

      <Section title="Google Review System">
        <div className="space-y-3">
          <div>
            <p className="text-zinc-400 text-xs mb-1.5">Google Review Link</p>
            <Input
              value={settings.googleReviewUrl}
              onChange={(v) => set("googleReviewUrl", v)}
              placeholder="https://g.page/r/your-review-link"
            />
          </div>
          <Field
            label="Auto-send review requests"
            hint="Sends a review email when a booking is marked Completed"
          >
            <Toggle
              checked={settings.reviewRequestEnabled}
              onChange={(v) => set("reviewRequestEnabled", v)}
            />
          </Field>
          <div>
            <p className="text-zinc-400 text-xs mb-1.5">Delay after completion (hours)</p>
            <Input
              type="number"
              value={settings.reviewRequestDelayHours}
              onChange={(v) => set("reviewRequestDelayHours", parseInt(v) || 0)}
            />
          </div>
        </div>
      </Section>

      <Section title="Rebooking Reminders">
        <Field
          label="Enable rebooking reminders"
          hint="Automatically remind customers to rebook after their visit"
        >
          <Toggle
            checked={settings.rebookingReminderEnabled}
            onChange={(v) => set("rebookingReminderEnabled", v)}
          />
        </Field>
        <div>
          <p className="text-zinc-400 text-xs mb-1.5">Default reminder interval (weeks)</p>
          <Input
            type="number"
            value={settings.defaultReminderWeeks}
            onChange={(v) => set("defaultReminderWeeks", parseInt(v) || 1)}
          />
        </div>
      </Section>

      <Section title="Loyalty & Referrals">
        <Field label="Loyalty program" hint="Track visit counts and VIP status">
          <Toggle checked={settings.loyaltyEnabled} onChange={(v) => set("loyaltyEnabled", v)} />
        </Field>
        <Field label="Referral program" hint="Allow customers to share referral codes">
          <Toggle checked={settings.referralEnabled} onChange={(v) => set("referralEnabled", v)} />
        </Field>
        <div>
          <p className="text-zinc-400 text-xs mb-1.5">Referral reward description</p>
          <Input
            value={settings.referralRewardDescription}
            onChange={(v) => set("referralRewardDescription", v)}
            placeholder="e.g. Free upgrade on your next visit"
          />
        </div>
      </Section>

      <Section title="Contact & Social">
        <div className="space-y-3">
          <div>
            <p className="text-zinc-400 text-xs mb-1.5">Shop phone number</p>
            <Input
              value={settings.shopPhone}
              onChange={(v) => set("shopPhone", v)}
              placeholder="+18059999999"
            />
          </div>
          <div>
            <p className="text-zinc-400 text-xs mb-1.5">Instagram URL</p>
            <Input
              value={settings.instagramUrl}
              onChange={(v) => set("instagramUrl", v)}
              placeholder="https://instagram.com/unfilteredbarbershop"
            />
          </div>
        </div>
      </Section>

      <Section title="SMS">
        <Field label="Enable SMS reminders" hint="Requires Twilio configuration in .env">
          <Toggle checked={settings.smsEnabled} onChange={(v) => set("smsEnabled", v)} />
        </Field>
      </Section>
    </div>
  );
}
