import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useFlow } from "@/lib/store";
import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  X,
  Pencil,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Update — Acme Logistics" }] }),
  component: Assistant,
});

function Assistant() {
  const { accept, accepted } = useFlow();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(accepted);

  const handleAccept = () => {
    accept();
    setConfirmed(true);
  };

  return (
    <AppLayout
      title="AI CRM Assistant"
      subtitle="Updating Acme Logistics · $84,000 · Proposal"
    >
      <div className="p-6">
        <Link
          to="/workspace"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> Back to My CRM Work
        </Link>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Current CRM state */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Current CRM state
              </div>
              <div className="mt-2 text-base font-semibold text-foreground">Acme Logistics</div>
              <div className="text-xs text-muted-foreground">Owner: Riya Sharma</div>

              <div className="mt-4 space-y-2.5 text-sm">
                <Field label="Stage" value="Proposal" />
                <Field label="Deal value" value="$84,000" />
                <Field label="Last activity" value="18 days ago" tone="danger" />
                <Field label="Next step" value="Empty" tone="danger" />
                <Field label="Pricing objection" value="Not captured" tone="danger" />
                <Field label="Follow-up task" value="Not created" tone="danger" />
              </div>

              <div className="mt-4 rounded-md bg-muted/60 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Required fields completed</span>
                  <span className="font-medium text-foreground">2 of 8</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-[color:var(--danger)]" style={{ width: "25%" }} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Signals AI is reading
              </div>
              <SignalCard
                icon={Phone}
                source="Call note · 19 days ago"
                text="Customer asked if pricing can be adjusted for multi-location rollout."
              />
              <SignalCard
                icon={Mail}
                source="Email · 12 days ago"
                text="Can we discuss pricing options before moving forward?"
              />
              <SignalCard
                icon={FileText}
                source="CRM history"
                text="Proposal sent 18 days ago. No next step logged."
              />
            </div>
          </div>

          {/* RIGHT: AI Suggestion / Confirmation */}
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-2xl border border-primary/30 bg-card shadow-sm overflow-hidden">
              <div className="bg-primary/8 border-b border-primary/15 px-6 py-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground grid place-items-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {confirmed ? "Update applied" : "AI-suggested CRM update"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {confirmed
                      ? "Acme Logistics is now up to date."
                      : "Based on recent call notes, emails, and stage history. Review before confirming."}
                  </div>
                </div>
              </div>

              {!confirmed ? (
                <>
                  <div className="p-6 space-y-3">
                    <SuggestionRow
                      label="Add next step"
                      value="Schedule pricing review call for Friday"
                    />
                    <SuggestionRow
                      label="Add objection"
                      value="Pricing concern (multi-location rollout)"
                    />
                    <SuggestionRow
                      label="Create follow-up task"
                      value="Send pricing options and book review call · due Wed"
                    />
                    <SuggestionRow
                      label="Update deal health"
                      value="At risk → Engaged after action"
                    />
                    <SuggestionRow
                      label="Auto-fill required fields"
                      value="6 of 8 pre-filled (decision criteria, competitors, timeline, budget, champion, use case)"
                    />

                    <div className="rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
                      Accepting this update will add a next step, create a task, and improve data quality.
                      Estimated time saved vs. the standard CRM form: <span className="font-medium text-foreground">~9 minutes</span>.
                    </div>
                  </div>

                  <div className="border-t border-border bg-muted/30 px-6 py-4 flex flex-wrap items-center gap-3 justify-end">
                    <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" /> Reject suggestion
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                      <Pencil className="h-4 w-4" /> Edit before saving
                    </button>
                    <button
                      onClick={handleAccept}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Accept AI update
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3 rounded-xl bg-[color:var(--success)]/10 border border-[color:var(--success)]/25 p-4">
                    <div className="h-8 w-8 rounded-full bg-[color:var(--success)] text-white grid place-items-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">CRM updated successfully.</div>
                      <div className="text-sm text-muted-foreground">
                        6 fields auto-filled. Next step added. Follow-up task created.
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <DiffCard before="Empty" after="Schedule pricing review call · Fri" label="Next step" />
                    <DiffCard before="Not captured" after="Pricing concern" label="Objection" />
                    <DiffCard before="Not created" after="Send pricing options · due Wed" label="Follow-up task" />
                    <DiffCard before="2 of 8" after="8 of 8" label="Required fields" />
                  </div>

                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      onClick={() => navigate({ to: "/workspace" })}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      Back to workspace
                    </button>
                    <button
                      onClick={() => navigate({ to: "/" })}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      View updated dashboard <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <FootMetric label="AI acceptance rate" value="72%" />
              <FootMetric label="Fields auto-filled" value="6 of 8" />
              <FootMetric label="Avg. time vs. form" value="−9 min" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Field({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "danger";
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium ${
          tone === "danger" ? "text-[color:var(--danger)]" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SignalCard({
  icon: Icon,
  source,
  text,
}: {
  icon: typeof Phone;
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

function SuggestionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
      <input
        type="checkbox"
        defaultChecked
        className="mt-1 h-4 w-4 rounded border-border accent-[color:var(--primary)]"
      />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wide text-primary font-medium">{label}</div>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

function DiffCard({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs text-muted-foreground line-through">{before}</div>
      <div className="text-sm text-foreground font-medium flex items-center gap-1">
        <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)]" /> {after}
      </div>
    </div>
  );
}

function FootMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}