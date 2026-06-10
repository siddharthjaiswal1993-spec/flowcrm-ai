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
  TrendingUp,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Update — Acme Logistics" }] }),
  component: Assistant,
});

type SaveState = "idle" | "saving" | "error" | "draft";

function Assistant() {
  const { accept } = useFlow();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [simulateFailure, setSimulateFailure] = useState(false);

  const [nextStep, setNextStep] = useState("Schedule pricing review call for Friday");
  const [objection, setObjection] = useState("Pricing concern");
  const [followUp, setFollowUp] = useState(
    "Send pricing options and book review call",
  );
  const [health, setHealth] = useState("At risk");

  const disabled = saveState === "saving";

  const startSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      if (simulateFailure) {
        setSaveState("error");
      } else {
        accept();
        navigate({ to: "/" });
      }
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

        {saveState === "draft" && (
          <div className="mb-4 rounded-xl border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/10 px-4 py-3 flex items-start gap-3">
            <Info className="h-4 w-4 text-[color:var(--warning)] mt-0.5" />
            <div className="text-sm text-foreground">
              <span className="font-medium">Draft saved.</span>{" "}
              <span className="text-muted-foreground">
                Acme Logistics still needs to be updated in CRM.
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Source signals (evidence rail) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <SectionCard
              eyebrow="Section 3"
              title="Source signals reviewed"
              meta="AI reviewed 3 available sources."
            >
              <SignalCard
                icon={Phone}
                source="Call note · 19 days ago"
                text="Customer asked if pricing can be adjusted for multi-location rollout."
              />
              <SignalCard
                icon={Mail}
                source="Email snippet · 12 days ago"
                text="Can we discuss pricing options before moving forward?"
              />
              <SignalCard
                icon={FileText}
                source="CRM history"
                text="Proposal sent 18 days ago, no next step logged."
              />
            </SectionCard>

            <div className="rounded-md border border-dashed border-border bg-card px-3 py-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Demo: simulate save failure</span>
              <button
                onClick={() => setSimulateFailure((v) => !v)}
                className={`h-4 w-8 rounded-full transition relative ${
                  simulateFailure ? "bg-[color:var(--danger)]" : "bg-muted-foreground/40"
                }`}
                aria-pressed={simulateFailure}
              >
                <span
                  className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                    simulateFailure ? "left-4" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* RIGHT: The structured AI panel */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* 1. Selected deal */}
            <SectionCard eyebrow="Section 1" title="Selected deal">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <KV label="Account" value="Acme Logistics" strong />
                <KV
                  label="Status"
                  value={
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--warning)]/15 text-[color:var(--warning)] px-2 py-0.5 text-[11px] font-medium">
                      Stale
                    </span>
                  }
                />
                <KV label="Deal value" value="$84,000" strong />
                <KV label="Stage" value="Proposal" />
                <KV label="Owner" value="Riya Sharma" />
                <KV label="Last activity" value="18 days ago" tone="warning" />
              </div>
            </SectionCard>

            {/* 2. Current CRM state */}
            <SectionCard eyebrow="Section 2" title="Current CRM state">
              <div className="space-y-2 text-sm">
                <StateRow label="Next step" value="Empty" missing />
                <StateRow label="Pricing objection" value="Not captured" missing />
                <StateRow label="Follow-up task" value="Not created" missing />
              </div>
              <div className="mt-4 rounded-md bg-muted/50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Required fields completed
                  </span>
                  <span className="font-medium text-foreground">2 of 8</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-[color:var(--warning)]"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
            </SectionCard>

            {/* 4. AI suggested update */}
            <SectionCard
              eyebrow="Section 4"
              title="AI suggested update"
              right={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--success)]/12 text-[color:var(--success)] px-2.5 py-1 text-[11px] font-medium">
                  <ShieldCheck className="h-3 w-3" /> AI confidence: High
                </span>
              }
            >
              <div className="space-y-2">
                <Suggestion label="Add next step" value={nextStep} />
                <Suggestion label="Add objection" value={objection} />
                <Suggestion label="Create follow-up task" value={followUp} />
                <Suggestion label="Update deal health" value={health} />
                <Suggestion
                  label="Auto-fill required fields"
                  value="6 of 8 fields (decision criteria, competitors, timeline, budget, champion, use case)"
                />
              </div>

              <div className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-xs text-foreground leading-relaxed">
                <span className="font-medium text-foreground">Reasoning · </span>
                <span className="text-muted-foreground">
                  Pricing concern was found in both call notes and email. No next step
                  exists in CRM.
                </span>
              </div>
            </SectionCard>

            {/* 5. Impact preview */}
            <SectionCard
              eyebrow="Section 5"
              title="Impact preview"
              right={
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <TrendingUp className="h-3 w-3" /> If accepted
                </span>
              }
            >
              <ul className="space-y-1.5 text-sm text-foreground">
                <ImpactItem>Add a next step</ImpactItem>
                <ImpactItem>Create one follow-up task</ImpactItem>
                <ImpactItem>Capture pricing objection</ImpactItem>
                <ImpactItem>
                  Improve CRM completeness from{" "}
                  <span className="font-medium">2 / 8</span> to{" "}
                  <span className="font-medium text-[color:var(--success)]">
                    8 / 8
                  </span>{" "}
                  fields
                </ImpactItem>
                <ImpactItem>
                  Reduce pending AI updates from{" "}
                  <span className="font-medium">23</span> to{" "}
                  <span className="font-medium text-[color:var(--success)]">22</span>
                </ImpactItem>
              </ul>
            </SectionCard>

            {/* 6. Actions */}
            <div className="rounded-xl border border-border bg-card px-5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Review the suggested update. You can edit any field before saving.
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setRejectOpen(true)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  Reject Suggestion
                </button>
                <button
                  onClick={() => setEditOpen(true)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Before Saving
                </button>
                <button
                  onClick={startSave}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {disabled ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" /> Accept AI Update
                    </>
                  )}
                </button>
              </div>
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
                startSave();
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

      {saveState === "saving" && (
        <SaveOverlay>
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <div>
            <div className="text-sm font-semibold text-foreground">
              Saving update to CRM…
            </div>
            <div className="text-xs text-muted-foreground">
              Writing 8 fields to Acme Logistics.
            </div>
          </div>
        </SaveOverlay>
      )}

      {saveState === "error" && (
        <Modal onClose={() => setSaveState("idle")}>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-[color:var(--danger)]/10 text-[color:var(--danger)] grid place-items-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Update could not be saved.
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The CRM connection timed out. Your AI suggestion is still saved as a
                draft.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button
              onClick={() => setSaveState("idle")}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => setSaveState("draft")}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Save as Draft
            </button>
            <button
              onClick={startSave}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}

/* ---------- primitives ---------- */

function SectionCard({
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

function KV({
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
          tone === "warning"
            ? "text-[color:var(--warning)]"
            : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StateRow({
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

function Suggestion({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 items-start rounded-md border border-border bg-background px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground pt-0.5">
        {label}
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

function ImpactItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)] mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function SaveOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm grid place-items-center">
      <div className="rounded-xl bg-card border border-border shadow-lg px-6 py-5 flex items-center gap-3">
        {children}
      </div>
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