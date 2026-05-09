"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  MessageSquare,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Star,
  Gift,
  Trophy,
  Mail,
  UserX,
  Tag,
  TrendingUp,
} from "lucide-react";

const sidebarGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Bookings",
    items: [
      { href: "/admin/bookings", label: "Bookings", icon: Calendar },
      { href: "/admin/abandoned", label: "Abandoned", icon: UserX },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/admin/customers", label: "CRM", icon: Users },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/loyalty", label: "Loyalty", icon: Trophy },
      { href: "/admin/referrals", label: "Referrals", icon: Gift },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/admin/promos", label: "Promos", icon: Tag },
      { href: "/admin/email-templates", label: "Email Templates", icon: Mail },
    ],
  },
  {
    label: "Shop",
    items: [
      { href: "/admin/barbers", label: "Barbers", icon: Scissors },
      { href: "/admin/services", label: "Services", icon: TrendingUp },
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/gallery", label: "Gallery", icon: Image },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (
      status === "authenticated" &&
      !["ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")
    ) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    !["ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")
  ) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const currentLabel =
    sidebarGroups
      .flatMap((g) => g.items)
      .find((i) => isActive(i.href))?.label ?? "Admin";

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-[#111111] border-r border-zinc-800 z-30
          flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-white tracking-tight text-xs uppercase">
              Unfiltered
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-1">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium
                        transition-all duration-150 group relative
                        ${
                          active
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent"
                        }
                      `}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"}`}
                      />
                      {label}
                      {active && (
                        <ChevronRight className="w-3 h-3 ml-auto text-blue-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-900 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 text-[10px] font-bold uppercase">
                {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "A"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-medium truncate">
                {session?.user?.name ?? "Admin"}
              </p>
              <p className="text-zinc-500 text-[10px] truncate">
                {session?.user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium
              text-zinc-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent
              hover:border-red-500/10 transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-5 py-3.5 bg-[#111111] border-b border-zinc-800 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-zinc-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-sm truncate">{currentLabel}</h2>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <span className="text-blue-400 text-[10px] font-bold uppercase">
                  {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "A"}
                </span>
              </div>
              <span className="text-zinc-300 text-xs font-medium">
                {session?.user?.name ?? session?.user?.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-700
                hover:border-red-500/20 transition-all duration-150"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">{children}</main>
      </div>
    </div>
  );
}
