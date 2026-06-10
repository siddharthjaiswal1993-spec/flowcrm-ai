import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useFlow } from "@/lib/store";
import { useState, type ReactNode } from "react";
import {
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  X,
  Pencil,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Update — Acme Logistics" }] }),
  component: Assistant,
});

function Assistant() {
  const { accept } = useFlow();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nextStep, setNextStep] = useState("Schedule pricing review call for Friday");
  const [objection, setObjection] = useState("Pricing concern (multi-location rollout)");
  const [followUp, setFollowUp] = useState(
    "Send pricing options and book review call · due Wed",
  );
  const [health, setHealth] = useState("At risk");

  const finalizeAccept = () => {
    setSaving(true);
    setTimeout(() => {
      accept();
      navigate({ to: "/" });
    }, 1400);
  };

  return (
    <AppLayout
      title="AI CRM Assistant"
      subtitle="Reviewing Acme Logistics · $84,000 · Proposal"
    >
      <div className="p-6">
        <Link
          to="/workspace"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3 w-3" /> Back to My CRM Work
        </Link>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Current CRM state + signals */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Selected deal
                  </div>
                  <div className="mt-1 text-base font-semibold text-foreground">
                    Acme Logistics
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Owner: Riya Sharma · Proposal · $84,000
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last activity 18 days ago
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--danger)]/10 text-[color:var(--danger)] px-2 py-0.5 text-[11px] font-medium">
                  Stale
                </span>
              </div>

              <div className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">
                Current CRM state
              </div>
              <div className="mt-2 space-y-2.5 text-sm">
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
                  <div
                    className="h-full bg-[color:var(--danger)]"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Source signals reviewed
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

          {/* RIGHT: AI Suggestion */}
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-2xl border border-primary/30 bg-card shadow-sm overflow-hidden">
              <div className="bg-primary/8 border-b border-primary/15 px-6 py-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground grid place-items-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    AI-suggested CRM update
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on recent call notes, emails, and stage history. Review before
                    confirming.
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-[color:var(--success)]/10 text-[color:var(--success)] px-3 py-1 text-xs font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" /> AI confidence: 92%
                </div>
              </div>

              <div className="p-6 space-y-3">
                <SuggestionRow label="Add next step" value={nextStep} />
                <SuggestionRow label="Capture pricing objection" value={objection} />
                <SuggestionRow label="Create follow-up task" value={followUp} />
                <SuggestionRow
                  label="Update deal health"
                  value={`Stale → ${health}`}
                />
                <SuggestionRow
                  label="Auto-fill required fields"
                  value="6 of 8 pre-filled (decision criteria, competitors, timeline, budget, champion, use case)"
                />

                <div className="rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
                  Accepting this update will add a next step, create a task, and improve
                  data quality. Estimated time saved vs. the standard CRM form:{" "}
                  <span className="font-medium text-foreground">~9 minutes</span>.
                </div>
              </div>

              <div className="border-t border-border bg-muted/30 px-6 py-4 flex flex-wrap items-center gap-3 justify-end">
                <button
                  onClick={() => setRejectOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" /> Reject suggestion
                </button>
                <button
                  onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" /> Edit before saving
                </button>
                <button
                  onClick={finalizeAccept}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-4 w-4" /> Accept AI update
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <FootMetric label="AI acceptance rate" value="72%" />
              <FootMetric label="Fields auto-filled" value="6 of 8" />
              <FootMetric label="Avg. time vs. form" value="−9 min" />
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <Modal
          onClose={() => setEditOpen(false)}
          title="Edit before saving"
          subtitle="Review AI's suggested update and adjust any field."
        >
          <div className="space-y-4">
            <EditField label="Next step" value={nextStep} onChange={setNextStep} />
            <EditField label="Objection" value={objection} onChange={setObjection} />
            <EditField label="Follow-up task" value={followUp} onChange={setFollowUp} />
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Deal health
              </label>
              <select
                value={health}
                onChange={(e) => setHealth(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>At risk</option>
                <option>Engaged</option>
                <option>Healthy</option>
                <option>Stalled</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setEditOpen(false)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setEditOpen(false);
                finalizeAccept();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save edited update
            </button>
          </div>
        </Modal>
      )}

      {rejectOpen && (
        <Modal onClose={() => setRejectOpen(false)}>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-[color:var(--danger)]/10 text-[color:var(--danger)] grid place-items-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Reject AI suggestion?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This will keep Acme Logistics marked as{" "}
                <span className="font-medium text-foreground">stale</span>. Missing next
                step and follow-up task will remain unresolved.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setRejectOpen(false);
                navigate({ to: "/workspace" });
              }}
              className="inline-flex items-center gap-2 rounded-md border border-[color:var(--danger)]/30 bg-background px-4 py-2 text-sm font-medium text-[color:var(--danger)] hover:bg-[color:var(--danger)]/10"
            >
              Reject suggestion
            </button>
            <button
              onClick={() => setRejectOpen(false)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Go back
            </button>
          </div>
        </Modal>
      )}

      {saving && (
        <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm grid place-items-center">
          <div className="rounded-xl bg-card border border-border shadow-lg px-6 py-5 flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                Saving CRM update…
              </div>
              <div className="text-xs text-muted-foreground">
                Writing 8 fields to Acme Logistics.
              </div>
            </div>
          </div>
        </div>
      )}
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
        <div className="text-[11px] uppercase tracking-wide text-primary font-medium">
          {label}
        </div>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

function FootMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Modal({
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

function EditField({
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