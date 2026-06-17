import { Link } from "@tanstack/react-router";
import { AppLayout, KpiCard, Section } from "@/components/AppLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getDashboardMetrics,
  seedDemoData,
  resetDemoData,
} from "@/lib/deals.functions";
import {
  getLatestCrmHealth,
  listWorkflowInsights,
} from "@/lib/insights.functions";
import {
  AlertTriangle,
  ArrowRight,
  FileWarning,
  Copy,
  Gauge,
  Sparkles,
  ChevronRight,
  Database,
  Loader2,
  RotateCcw,
} from "lucide-react";

/** PRD screen #1 — Adoption Diagnostic Dashboard. */
export function AdoptionDiagnosticDashboard() {
  const fetchMetrics = useServerFn(getDashboardMetrics);
  const seedFn = useServerFn(seedDemoData);
  const resetFn = useServerFn(resetDemoData);
  const fetchInsights = useServerFn(listWorkflowInsights);
  const fetchHealth = useServerFn(getLatestCrmHealth);
  const qc = useQueryClient();

  const { data: m, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: () => fetchMetrics(),
  });
  const { data: insights = [] } = useQuery({
    queryKey: ["workflow-insights"],
    queryFn: () => fetchInsights(),
  });
  const { data: health } = useQuery({
    queryKey: ["crm-health"],
    queryFn: () => fetchHealth(),
  });

  const workflowBlockers = insights.filter((i) => i.type === "blocker");
  const voiceOfUser = insights.filter((i) => i.type === "quote");
  const aiSuggestionShortcuts = insights.filter((i) => i.type === "ai_shortcut");

  const seed = useMutation({
    mutationFn: () => seedFn(),
    onSuccess: () => qc.invalidateQueries(),
  });
  const reset = useMutation({
    mutationFn: () => resetFn(),
    onSuccess: () => qc.invalidateQueries(),
  });

  const hasData = (m?.totalDeals ?? 0) > 0;
  const accepted = (m?.acceptedSuggestions ?? 0) > 0;
  const dataQuality = hasData
    ? Math.round((1 - (m!.stale + m!.missingNext) / Math.max(1, m!.totalDeals * 2)) * 100)
    : health?.data_quality_score ?? 54;

  return (
    <AppLayout
      title="Adoption Diagnostic Dashboard"
      subtitle="Why the CRM isn't being used — and what to do about it today."
    >
      <div className="grid grid-cols-12 gap-6 p-6">
        <div className="col-span-12 xl:col-span-9 space-y-6">
          {!isLoading && !hasData && (
            <SeedBanner busy={seed.isPending} onSeed={() => seed.mutate()} />
          )}
          {hasData && accepted && <AcceptedBanner pending={m!.pendingSuggestions} />}

          <Section title="CRM health at a glance" description="Adoption KPIs from your workspace.">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KpiCard label="My deals" value={`${m?.totalDeals ?? 0}`} hint="In your pipeline" />
              <KpiCard label="Stale deals" value={`${m?.stale ?? 0}`} hint="No activity 14+ days" tone="danger" />
              <KpiCard label="Missing next steps" value={`${m?.missingNext ?? 0}`} hint="Need attention" tone="warning" />
              <KpiCard label="Pending AI updates" value={`${m?.pendingSuggestions ?? 0}`} hint="Awaiting review" />
              <KpiCard label="Accepted AI updates" value={`${m?.acceptedSuggestions ?? 0}`} hint="Saved to CRM" tone="success" />
            </div>
          </Section>

          <Section title="Why adoption is low" description="Data quality signals that erode trust.">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <InsightStat icon={AlertTriangle} label="Stale records" value={`${m?.stale ?? 0}`} tone="danger" />
              <InsightStat icon={FileWarning} label="Missing next steps" value={`${m?.missingNext ?? 0}`} tone="warning" />
              <InsightStat icon={Copy} label="Duplicate accounts" value={`${health?.duplicate_accounts_pct ?? 17}%`} tone="warning" />
              <InsightStat icon={Gauge} label="Data quality" value={`${dataQuality} / 100`} tone="warning" />
            </div>
          </Section>

          <Section title="Top workflow blockers" description="Why reps avoid the CRM today.">
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {workflowBlockers.map((b, i) => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                  <div className="h-6 w-6 rounded-md bg-muted text-muted-foreground grid place-items-center text-xs font-medium">
                    {i + 1}
                  </div>
                  <span className="text-foreground">{b.text}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Voice of the user" description="From last quarter's adoption interviews.">
            <div className="grid md:grid-cols-2 gap-4">
              {voiceOfUser.map((q) => (
                <Quote key={q.id} text={q.text} who={q.attribution ?? "Anonymous"} />
              ))}
            </div>
          </Section>

          {hasData && (
            <div className="flex justify-end">
              <button
                onClick={() => reset.mutate()}
                disabled={reset.isPending}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {reset.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                Reset demo data
              </button>
            </div>
          )}
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
              <MiniStat label="Pending updates" value={`${m?.pendingSuggestions ?? 0}`} />
              <MiniStat label="Accepted" value={`${m?.acceptedSuggestions ?? 0}`} />
              <MiniStat label="My deals" value={`${m?.totalDeals ?? 0}`} />
              <MiniStat label="Stale" value={`${m?.stale ?? 0}`} />
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
                  key={s.id}
                  to="/workspace"
                  className="flex items-center justify-between text-sm rounded-md border border-border px-3 py-2 hover:bg-muted/60"
                >
                  <span className="text-foreground">{s.text}</span>
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

function SeedBanner({ busy, onSeed }: { busy: boolean; onSeed: () => void }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-wrap items-center gap-4">
      <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground grid place-items-center">
        <Database className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-[240px]">
        <div className="text-sm font-semibold text-foreground">Your workspace is empty</div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Seed 4 demo deals (Acme Logistics, Northstar, BluePeak, Vertex) with signals so you can walk the AI golden path.
        </p>
      </div>
      <button
        onClick={onSeed}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Seed demo data
      </button>
    </div>
  );
}

function AcceptedBanner({ pending }: { pending: number }) {
  return (
    <div className="rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-4 flex items-start gap-3">
      <div className="h-7 w-7 rounded-full bg-[color:var(--success)] text-white grid place-items-center text-xs shrink-0">
        ✓
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-foreground">
          AI update saved. CRM data quality improved.
        </div>
        <div className="text-xs text-muted-foreground">
          {pending} suggestion{pending === 1 ? "" : "s"} still pending review.
        </div>
      </div>
      <Link to="/workspace" className="text-xs font-medium text-primary hover:underline shrink-0">
        View deals
      </Link>
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