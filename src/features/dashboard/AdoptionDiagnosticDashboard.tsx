import { Link } from "@tanstack/react-router";
import { AppLayout, KpiCard, Section } from "@/components/AppLayout";
import { useFlow, metrics } from "@/features/shared/flow-store";
import {
  AlertTriangle,
  ArrowRight,
  FileWarning,
  Copy,
  Gauge,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  workflowBlockers,
  voiceOfUser,
  aiSuggestionShortcuts,
} from "./data";

/** PRD screen #1 — Adoption Diagnostic Dashboard. */
export function AdoptionDiagnosticDashboard() {
  const { accepted } = useFlow();
  const m = metrics(accepted);

  return (
    <AppLayout
      title="Adoption Diagnostic Dashboard"
      subtitle="Why the CRM isn't being used — and what to do about it today."
    >
      <div className="grid grid-cols-12 gap-6 p-6">
        <div className="col-span-12 xl:col-span-9 space-y-6">
          {accepted && <AcceptedBanner m={m} />}

          <Section title="CRM health at a glance" description="Adoption KPIs from the past 7 days.">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KpiCard label="CRM adoption" value="18%" hint="Weekly active" tone="danger" />
              <KpiCard label="Weekly active users" value={`${m.wau} / ${m.wauTotal}`} hint="across all teams" />
              <KpiCard label="Avg. update time" value={`${m.avgUpdate} min`} hint="Target: 2 min" tone="warning" />
              <KpiCard label="Shadow spreadsheets" value="63%" hint="of reps use them" tone="danger" />
              <KpiCard label="Internal CSAT" value="2.1 / 5" hint="quarterly survey" tone="danger" />
            </div>
          </Section>

          <Section title="Why adoption is low" description="Data quality signals that erode trust.">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <InsightStat icon={AlertTriangle} label="Stale records" value="61%" tone="danger" />
              <InsightStat icon={FileWarning} label="Missing next steps" value={`${m.missingNext}%`} tone="warning" />
              <InsightStat icon={Copy} label="Duplicate accounts" value="17%" tone="warning" />
              <InsightStat icon={Gauge} label="Data quality score" value={`${m.dataQuality} / 100`} tone="warning" />
            </div>
          </Section>

          <Section title="Top workflow blockers" description="Why reps avoid the CRM today.">
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {workflowBlockers.map((b, i) => (
                <div key={b} className="flex items-center gap-4 px-5 py-3 text-sm">
                  <div className="h-6 w-6 rounded-md bg-muted text-muted-foreground grid place-items-center text-xs font-medium">
                    {i + 1}
                  </div>
                  <span className="text-foreground">{b}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Voice of the user" description="From last quarter's adoption interviews.">
            <div className="grid md:grid-cols-2 gap-4">
              {voiceOfUser.map((q) => (
                <Quote key={q.who} text={q.text} who={q.who} />
              ))}
            </div>
          </Section>
        </div>

        <aside className="col-span-12 xl:col-span-3">
          <div className="sticky top-6 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary grid place-items-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">FlowCRM AI</div>
                <div className="text-[11px] text-muted-foreground">Adoption assistant</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground/90 leading-relaxed">
              Your CRM adoption is low because users don't get immediate workflow value.
              Start with <span className="font-medium">stale deals that have missing next steps</span>.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <MiniStat label="Pending updates" value={`${m.pending}`} />
              <MiniStat label="Time saved" value={`${m.timeSaved}h`} />
              <MiniStat label="AI acceptance" value="72%" />
              <MiniStat label="Auto-filled" value="6 of 8" />
            </div>
            <Link
              to="/workspace"
              className="mt-5 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Review today's CRM priorities
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-4 space-y-2">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Suggested for you
              </div>
              {aiSuggestionShortcuts.map((s) => (
                <Link
                  key={s}
                  to="/workspace"
                  className="flex items-center justify-between text-sm rounded-md border border-border px-3 py-2 hover:bg-muted/60"
                >
                  <span className="text-foreground">{s}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}

function AcceptedBanner({ m }: { m: ReturnType<typeof metrics> }) {
  return (
    <div className="rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="h-7 w-7 rounded-full bg-[color:var(--success)] text-white grid place-items-center text-xs shrink-0">
          ✓
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">
            Acme Logistics updated. CRM data quality improved.
          </div>
          <div className="text-xs text-muted-foreground">
            Next step added · pricing objection captured · follow-up task created.
          </div>
        </div>
        <Link
          to="/workspace"
          className="text-xs font-medium text-primary hover:underline shrink-0"
        >
          View deal
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <DiffPill label="Suggested updates pending" before="23" after={`${m.pending}`} />
        <DiffPill label="Missing next steps" before="48%" after={`${m.missingNext}%`} />
        <DiffPill label="Time saved this week" before="18.5h" after={`${m.timeSaved}h`} positive />
        <DiffPill label="Acme Logistics" before="Stale" after="Updated" positive />
      </div>
      <div className="rounded-md bg-background/60 border border-[color:var(--success)]/20 px-3 py-2 text-xs text-foreground">
        <span className="text-muted-foreground">Acme Logistics · next step:</span>{" "}
        <span className="font-medium">Schedule pricing review call for Friday</span>
      </div>
    </div>
  );
}

function InsightStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: string;
  tone: "danger" | "warning";
}) {
  const cls =
    tone === "danger"
      ? "text-[color:var(--danger)] bg-[color:var(--danger)]/10"
      : "text-[color:var(--warning)] bg-[color:var(--warning)]/10";
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-md grid place-items-center ${cls}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Quote({ text, who }: { text: string; who: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-foreground leading-relaxed">"{text}"</p>
      <p className="mt-2 text-xs text-muted-foreground">— {who}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2 py-2">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function DiffPill({
  label,
  before,
  after,
  positive,
}: {
  label: string;
  before: string;
  after: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-md bg-background border border-border px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1.5 text-sm">
        <span className="text-muted-foreground line-through">{before}</span>
        <span className="text-muted-foreground">→</span>
        <span
          className={`font-semibold ${
            positive ? "text-[color:var(--success)]" : "text-foreground"
          }`}
        >
          {after}
        </span>
      </div>
    </div>
  );
}