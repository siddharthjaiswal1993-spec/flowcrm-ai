import { Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { vertexMissingSources } from "./data";
import { SourceMissing } from "./primitives";

/** PRD screen #5 — AI Assistant Empty Signals (Vertex Manufacturing error state). */
export function AssistantEmptySignalsScreen() {
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
                No recent email or call note was found for this deal. Without source signals,
                FlowCRM AI cannot reliably suggest a next step or auto-fill missing fields.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                {vertexMissingSources.map((s) => (
                  <SourceMissing key={s.label} icon={s.icon} label={s.label} detail={s.detail} />
                ))}
              </div>

              <div className="rounded-md bg-muted/50 border border-border p-3 text-xs text-foreground">
                <span className="font-medium">Suggested manual action:</span>{" "}
                <span className="text-muted-foreground">
                  Create a manual follow-up or add a next step manually.
                </span>
              </div>
            </div>

            <div className="border-t border-border bg-muted/30 px-6 py-4 flex flex-wrap items-center gap-3 justify-end">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Create Manual Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}