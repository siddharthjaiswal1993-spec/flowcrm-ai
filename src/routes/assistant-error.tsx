import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { AlertTriangle, ArrowLeft, Mail, Phone, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/assistant-error")({
  head: () => ({ meta: [{ title: "AI could not generate update — FlowCRM" }] }),
  component: AssistantError,
});

function AssistantError() {
  return (
    <AppLayout
      title="AI CRM Assistant"
      subtitle="Vertex Manufacturing · $39,000 · Qualification"
    >
      <div className="p-6">
        <Link
          to="/workspace"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> Back to My CRM Work
        </Link>

        <div className="max-w-3xl">
          <div className="rounded-2xl border border-[color:var(--warning)]/30 bg-card shadow-sm overflow-hidden">
            <div className="bg-[color:var(--warning)]/10 border-b border-[color:var(--warning)]/20 px-6 py-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-[color:var(--warning)] text-white grid place-items-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  AI could not generate a complete recommendation
                </div>
                <div className="text-xs text-muted-foreground">
                  No recent email or call note was found for Vertex Manufacturing.
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">
                FlowCRM AI reviews recent CRM history, call notes, and email signals to
                draft a high-confidence update. For this deal, there has been no activity in
                the past 22 days, so we cannot reliably suggest a next step or auto-fill
                missing fields.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <SourceMissing icon={Phone} label="Call notes" detail="0 in last 30 days" />
                <SourceMissing icon={Mail} label="Email signals" detail="0 in last 30 days" />
                <SourceMissing icon={RefreshCw} label="CRM activity" detail="22 days stale" />
              </div>

              <div className="rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
                Suggested next move: log a discovery follow-up or send a re-engagement
                email, then run FlowCRM AI again.
              </div>
            </div>

            <div className="border-t border-border bg-muted/30 px-6 py-4 flex flex-wrap items-center gap-3 justify-end">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Back to workspace
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Log activity manually
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SourceMissing({
  icon: Icon,
  label,
  detail,
}: {
  icon: typeof Mail;
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