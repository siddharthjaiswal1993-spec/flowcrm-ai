import { CheckCircle2, X, Phone } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

/** Shared visual primitives used across the three Assistant screens. */

export function SectionCard({
  eyebrow,
  title,
  meta,
  right,
  children,
}: {
  eyebrow?: string;
  title: string;
  meta?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <header className="flex items-start justify-between gap-4 mb-4">
        <div>
          {eyebrow && (
            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/80">
              {eyebrow}
            </div>
          )}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {meta && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{meta}</p>
          )}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

export function KV({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
  tone?: "warning";
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 border-b border-border/60 last:border-0 sm:border-0 sm:py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-sm ${strong ? "font-semibold" : "font-medium"} ${
          tone === "warning" ? "text-[color:var(--warning)]" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function StateRow({
  label,
  value,
  missing,
}: {
  label: string;
  value: string;
  missing?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium ${
          missing ? "text-[color:var(--warning)]" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function SignalCard({
  icon: Icon,
  source,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  source: string;
  text: string;
}) {
  return (
    <div className="mb-2 last:mb-0 rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" /> {source}
      </div>
      <p className="mt-1 text-sm text-foreground leading-snug">"{text}"</p>
    </div>
  );
}

export function Suggestion({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 items-start rounded-md border border-border bg-background px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground pt-0.5">
        {label}
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export function ImpactItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)] mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export function SaveOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm grid place-items-center">
      <div className="rounded-xl bg-card border border-border shadow-lg px-6 py-5 flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}

export function Modal({
  children,
  onClose,
  title,
  subtitle,
}: {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 pt-5 pb-3 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                {subtitle && (
                  <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

export function SkeletonCard({
  title,
  icon: Icon,
  lines,
  highlight,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  lines: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-card p-5 ${
        highlight ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
      }`}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-muted/70 animate-pulse"
            style={{ width: `${95 - i * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function LoadingStep({
  label,
  state,
}: {
  label: string;
  state: "done" | "active" | "pending";
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`h-4 w-4 rounded-full grid place-items-center text-[10px] ${
          state === "done"
            ? "bg-[color:var(--success)] text-white"
            : state === "active"
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {state === "done" ? "✓" : state === "active" ? "•" : ""}
      </span>
      <span
        className={
          state === "done"
            ? "text-muted-foreground line-through"
            : state === "active"
              ? "text-foreground font-medium"
              : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </li>
  );
}

export function SourceMissing({
  icon: Icon,
  label,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-sm font-medium text-[color:var(--danger)]">{detail}</div>
    </div>
  );
}

// Re-export so screens can pull a single icon type alias.
export type { Phone };