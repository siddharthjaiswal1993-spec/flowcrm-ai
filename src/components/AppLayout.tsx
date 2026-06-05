import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Building2,
  Briefcase,
  Database,
  Users,
  Sparkles,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, active: true },
  { to: "/workspace", label: "My CRM Work", icon: ListChecks, active: true },
  { to: "#", label: "Accounts", icon: Building2, active: false },
  { to: "#", label: "Deals", icon: Briefcase, active: false },
  { to: "#", label: "Data Quality", icon: Database, active: false },
  { to: "/team", label: "Team Adoption", icon: Users, active: true },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles, active: true },
] as const;

export function AppLayout({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-sidebar-primary grid place-items-center text-sidebar-primary-foreground font-semibold">
              F
            </div>
            <div>
              <div className="text-sm font-semibold">FlowCRM</div>
              <div className="text-[11px] text-sidebar-foreground/60">AI Workspace</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {nav.map((item) => {
            const isActive = item.active && pathname === item.to;
            const Icon = item.icon;
            const cls = `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            } ${!item.active ? "opacity-50 cursor-not-allowed" : ""}`;
            if (!item.active) {
              return (
                <div key={item.label} className={cls}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              );
            }
            return (
              <Link key={item.label} to={item.to} className={cls}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-sidebar-border text-[11px] text-sidebar-foreground/50">
          v0.4 · Prototype
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-border bg-card flex items-center px-6 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-2 rounded-md border border-border px-3 py-1.5 w-72 text-sm text-muted-foreground bg-background">
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Search deals, accounts, contacts…</span>
          </div>
          <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
            <Bell className="h-4 w-4" />
          </button>
          <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
            <Settings className="h-4 w-4" />
          </button>
          <div className="h-9 w-9 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">
            RS
          </div>
          {actions}
        </header>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "danger" | "warning" | "success";
  delta?: string;
}) {
  const toneCls =
    tone === "danger"
      ? "text-[color:var(--danger)]"
      : tone === "warning"
        ? "text-[color:var(--warning)]"
        : tone === "success"
          ? "text-[color:var(--success)]"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${toneCls}`}>{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        {hint && <span>{hint}</span>}
        {delta && (
          <span className="text-[color:var(--success)] font-medium">{delta}</span>
        )}
      </div>
    </div>
  );
}

export function Section({
  title,
  description,
  children,
  right,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}