"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  Filter,
  X,
  RefreshCw,
  ExternalLink,
  Archive,
  CheckCheck,
  Eye,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type ContactStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  messages: ContactMessage[];
  total: number;
  totalPages: number;
  page: number;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Messages" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

const STATUS_CONFIG: Record<
  ContactStatus,
  { label: string; classes: string; dot: string }
> = {
  NEW: {
    label: "New",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  READ: {
    label: "Read",
    classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    dot: "bg-zinc-400",
  },
  REPLIED: {
    label: "Replied",
    classes: "bg-green-500/10 text-green-400 border-green-500/20",
    dot: "bg-green-400",
  },
  ARCHIVED: {
    label: "Archived",
    classes: "bg-zinc-800/80 text-zinc-500 border-zinc-700/50",
    dot: "bg-zinc-600",
  },
};

function StatusBadge({ status }: { status: ContactStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// -- Detail Modal -----------------------------------------------------------

function MessageModal({
  message,
  onClose,
  onStatusChange,
}: {
  message: ContactMessage;
  onClose: () => void;
  onStatusChange: (id: string, status: ContactStatus) => Promise<void>;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    // Mark as READ on open if NEW
    if (message.status === "NEW") {
      onStatusChange(message.id, "READ").catch(() => {});
    }
    return () => document.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatus = async (status: ContactStatus) => {
    setUpdating(true);
    await onStatusChange(message.id, status);
    setUpdating(false);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-[#111111] z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold">{message.name}</h2>
              <p className="text-zinc-500 text-xs">
                {format(new Date(message.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={message.status} />
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleStatus("REPLIED")}
                disabled={updating || message.status === "REPLIED"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark Replied
              </button>
              <button
                onClick={() => handleStatus("ARCHIVED")}
                disabled={updating || message.status === "ARCHIVED"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  text-zinc-400 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-zinc-900/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-zinc-500 text-xs">Email</p>
              <a
                href={`mailto:${message.email}`}
                className="text-indigo-400 text-sm hover:underline flex items-center gap-1"
              >
                {message.email}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            {message.phone && (
              <div>
                <p className="text-zinc-500 text-xs">Phone</p>
                <a
                  href={`tel:${message.phone}`}
                  className="text-indigo-400 text-sm hover:underline"
                >
                  {message.phone}
                </a>
              </div>
            )}
            {message.service && (
              <div>
                <p className="text-zinc-500 text-xs">Service of Interest</p>
                <p className="text-white text-sm">{message.service}</p>
              </div>
            )}
          </div>

          {/* Message body */}
          <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide mb-3">
              Message
            </p>
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          {/* Reply CTA */}
          <div className="flex gap-3">
            <a
              href={`mailto:${message.email}?subject=Re: Your message to Unfiltered Barbershop`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
            >
              <Mail className="w-4 h-4" />
              Reply via Email
            </a>
            {message.phone && (
              <a
                href={`tel:${message.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Main page -------------------------------------------------------------

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const res = await fetch(`/api/admin/messages?${params}`);
      const data: ApiResponse = await res.json();
      setMessages(data.messages ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      setTotal((t) => t - 1);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  const newCount = messages.filter((m) => m.status === "NEW").length;

  return (
    <>
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {total} total
              {newCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {newCount} new
                </span>
              )}
            </p>
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700
              hover:border-zinc-600 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    statusFilter === opt.value
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      : "text-zinc-400 border-zinc-700 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-zinc-500 text-sm mt-3">Loading messages…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">No messages found</p>
              <p className="text-zinc-600 text-sm mt-1">
                {statusFilter !== "all" ? "Try a different filter" : "Contact form submissions will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["Date", "Name", "Email", "Phone", "Service", "Preview", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-zinc-500 font-medium px-5 py-3 text-xs uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg, idx) => (
                    <tr
                      key={msg.id}
                      className={`border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors cursor-pointer ${
                        idx === messages.length - 1 ? "border-b-0" : ""
                      } ${msg.status === "NEW" ? "bg-blue-500/3" : ""}`}
                      onClick={() => setSelected(msg)}
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <p className="text-zinc-300 text-xs">
                          {format(new Date(msg.createdAt), "MMM d")}
                        </p>
                        <p className="text-zinc-600 text-xs">
                          {format(new Date(msg.createdAt), "h:mm a")}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p
                          className={`text-xs font-medium ${
                            msg.status === "NEW" ? "text-white" : "text-zinc-300"
                          }`}
                        >
                          {msg.name}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <a
                          href={`mailto:${msg.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-400 text-xs hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          {msg.email}
                        </a>
                      </td>
                      <td className="px-5 py-3">
                        {msg.phone ? (
                          <a
                            href={`tel:${msg.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-zinc-300 text-xs hover:text-indigo-400 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            {msg.phone}
                          </a>
                        ) : (
                          <span className="text-zinc-600 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-zinc-400 text-xs">{msg.service ?? "-"}</span>
                      </td>
                      <td className="px-5 py-3 max-w-[200px]">
                        <p className="text-zinc-500 text-xs truncate">{msg.message}</p>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={msg.status} />
                      </td>
                      <td
                        className="px-5 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelected(msg)}
                            title="View message"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`mailto:${msg.email}?subject=Re: Your message to Unfiltered Barbershop`}
                            title="Reply via email"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                msg.id,
                                msg.status === "ARCHIVED" ? "READ" : "ARCHIVED"
                              )
                            }
                            title={msg.status === "ARCHIVED" ? "Unarchive" : "Archive"}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            disabled={deletingId === msg.id}
                            title="Delete message"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
            <p className="text-zinc-500 text-sm">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white border border-zinc-700
                  hover:border-zinc-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white border border-zinc-700
                  hover:border-zinc-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message detail modal */}
      {selected && (
        <MessageModal
          message={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
