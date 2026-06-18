import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Shared, calm error/loading primitives. We use them everywhere instead of
 * blanking the screen on a query failure or letting a generic root boundary
 * render — recovery action is always one click away.
 */
export function ErrorCard({
  title = "Could not load CRM data.",
  description = "Check your connection and try again.",
  onRetry,
  busy,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  busy?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--danger)]/30 bg-card p-5 flex items-start gap-4">
      <div className="h-10 w-10 rounded-md bg-[color:var(--danger)]/10 text-[color:var(--danger)] grid place-items-center shrink-0">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Retry
        </button>
      )}
    </div>
  );
}

/** Plain neutral block — use for skeleton placeholders. */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function KpiSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-6 w-16 mt-3" />
          <SkeletonBlock className="h-3 w-24 mt-3" />
        </div>
      ))}
    </div>
  );
}

export function DealRowsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex gap-3">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <SkeletonBlock className="h-3 w-2/3" />
          <div className="grid md:grid-cols-2 gap-3">
            <SkeletonBlock className="h-12 w-full" />
            <SkeletonBlock className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DealDetailSkeleton() {
  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 space-y-3">
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <SkeletonBlock className="h-32 w-full" />
        <SkeletonBlock className="h-32 w-full" />
        <SkeletonBlock className="h-40 w-full" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    </div>
  );
}

export function EmptyCard({
  icon: Icon,
  title,
  description,
  actions,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
      <Icon className="h-6 w-6 text-muted-foreground mx-auto" />
      <div className="mt-3 text-sm font-medium text-foreground">{title}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {actions && <div className="mt-4 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}

/** Detect 401-ish errors thrown by `requireSupabaseAuth`. */
export function isAuthError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  return /unauthorized|invalid token|no authorization header|jwt|expired/i.test(msg);
}