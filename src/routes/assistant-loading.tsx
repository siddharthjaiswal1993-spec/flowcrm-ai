import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useEffect } from "react";
import { Sparkles, Phone, Mail, FileText, Wand2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/assistant-loading")({
  head: () => ({ meta: [{ title: "AI is reviewing… — FlowCRM" }] }),
  component: AssistantLoading,
});

function AssistantLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/assistant" }), 1500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <AppLayout
      title="AI CRM Assistant"
      subtitle="Reviewing Acme Logistics · $84,000 · Proposal"
    >
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* LEFT: deal context (skeletons) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Selected deal
                </div>
                <div className="mt-1 text-base font-semibold text-foreground">
                  Acme Logistics
                </div>
                <div className="text-xs text-muted-foreground">
                  Riya Sharma · Proposal · $84,000 · Last activity 18 days ago
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--danger)]/10 text-[color:var(--danger)] px-2 py-0.5 text-[11px] font-medium">
                Stale
              </span>
            </div>
          </div>

          <SkeletonCard title="CRM history" icon={FileText} lines={3} />
          <SkeletonCard title="Call notes" icon={Phone} lines={2} />
          <SkeletonCard title="Email thread" icon={Mail} lines={3} />
          <SkeletonCard title="Suggested update" icon={Wand2} lines={4} highlight />
        </div>

        {/* RIGHT: AI Assistant drawer */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-6 rounded-2xl border border-primary/30 bg-card shadow-sm overflow-hidden">
            <div className="bg-primary/8 border-b border-primary/15 px-5 py-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground grid place-items-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  FlowCRM AI
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Building your CRM update
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/15 p-3">
                <Loader2 className="h-4 w-4 text-primary mt-0.5 animate-spin" />
                <p className="text-sm text-foreground leading-relaxed">
                  Reviewing CRM history, call notes, and email signals…
                </p>
              </div>

              <ul className="space-y-2.5 text-sm">
                <Step done label="Pulled deal history (18 days)" />
                <Step done label="Scanned 2 call notes" />
                <Step active label="Reading 4 emails for objections" />
                <Step label="Drafting next step + follow-up task" />
                <Step label="Auto-filling required CRM fields" />
              </ul>

              <div className="rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
                Typical review takes a few seconds. You will be able to review and edit
                every change before it is saved.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}

function SkeletonCard({
  title,
  icon: Icon,
  lines,
  highlight,
}: {
  title: string;
  icon: typeof Phone;
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

function Step({
  label,
  done,
  active,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`h-4 w-4 rounded-full grid place-items-center text-[10px] ${
          done
            ? "bg-[color:var(--success)] text-white"
            : active
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? "✓" : active ? "•" : ""}
      </span>
      <span
        className={
          done
            ? "text-muted-foreground line-through"
            : active
              ? "text-foreground font-medium"
              : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </li>
  );
}