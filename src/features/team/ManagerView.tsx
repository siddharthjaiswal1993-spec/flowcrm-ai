import { AppLayout, KpiCard, Section } from "@/components/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardMetrics } from "@/lib/deals.functions";
import {
  getLatestCrmHealth,
  listManagerActions,
  listTeamMetrics,
  listWorkflowInsights,
} from "@/lib/insights.functions";
import { Download, BellRing, Target } from "lucide-react";
import { ErrorCard, KpiSkeleton, SkeletonBlock, EmptyCard } from "@/components/feedback";
import { Users } from "lucide-react";
import {
  labelForTone,
  toneForAdoption,
} from "./data";

const ACTION_ICONS: Record<string, typeof Target> = {
  review_gaps: Target,
  send_nudges: BellRing,
  export_summary: Download,
};

/** PRD screen #6 — Manager View (Team Adoption and Data Quality). */
export function ManagerView() {
  const fetchMetrics = useServerFn(getDashboardMetrics);
  const fetchTeams = useServerFn(listTeamMetrics);
  const fetchInsights = useServerFn(listWorkflowInsights);
  const fetchActions = useServerFn(listManagerActions);
  const fetchHealth = useServerFn(getLatestCrmHealth);

  const {
    data: m,
    isLoading: mLoading,
    isError: mError,
    refetch: refetchMetrics,
    isFetching: mFetching,
  } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: () => fetchMetrics(),
  });
  const {
    data: teams = [],
    isLoading: teamsLoading,
    isError: teamsError,
    refetch: refetchTeams,
    isFetching: teamsFetching,
  } = useQuery({
    queryKey: ["team-metrics"],
    queryFn: () => fetchTeams(),
  });
  const { data: insights = [] } = useQuery({
    queryKey: ["workflow-insights"],
    queryFn: () => fetchInsights(),
  });
  const { data: actions = [] } = useQuery({
    queryKey: ["manager-actions"],
    queryFn: () => fetchActions(),
  });
  const { data: health } = useQuery({
    queryKey: ["crm-health"],
    queryFn: () => fetchHealth(),
  });

  const adoptionInsights = insights.filter((i) => i.type === "manager_insight");
  const dataQuality = m && m.totalDeals > 0
    ? Math.round((1 - (m.stale + m.missingNext) / Math.max(1, m.totalDeals * 2)) * 100)
    : health?.data_quality_score ?? 54;

  return (
    <AppLayout title="Team Adoption and Data Quality" subtitle="Manager view · last 7 days">
      <div className="p-6 space-y-6">
        {(mError || teamsError) && (
          <ErrorCard
            onRetry={() => {
              if (mError) refetchMetrics();
              if (teamsError) refetchTeams();
            }}
            busy={mFetching || teamsFetching}
          />
        )}

        {mLoading ? (
          <KpiSkeleton count={5} />
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KpiCard label="CRM adoption" value={`${health?.crm_adoption_pct ?? 18}%`} hint="Weekly active" tone="danger" />
          <KpiCard label="My pipeline" value={`${m?.totalDeals ?? 0} deals`} />
          <KpiCard label="Stale records" value={`${m?.stale ?? 0}`} tone="danger" />
          <KpiCard label="Pending AI updates" value={`${m?.pendingSuggestions ?? 0}`} tone="warning" />
          <KpiCard label="Data quality" value={`${dataQuality} / 100`} tone="warning" />
        </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Section title="Adoption by team" description="Weekly active CRM users as a share of team size.">
              {teamsLoading ? (
                <div className="space-y-2">
                  <SkeletonBlock className="h-10 w-full" />
                  <SkeletonBlock className="h-10 w-full" />
                  <SkeletonBlock className="h-10 w-full" />
                </div>
              ) : teams.length === 0 ? (
                <EmptyCard
                  icon={Users}
                  title="No team adoption data yet."
                  description="Team metrics will appear after reps start using the CRM workspace."
                />
              ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
                  <div className="col-span-5">Team</div>
                  <div className="col-span-2">Reps</div>
                  <div className="col-span-3">Adoption</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                {teams.map((t) => {
                  const tone = toneForAdoption(t.adoption_pct);
                  const toneCls =
                    tone === "success"
                      ? "bg-[color:var(--success)]"
                      : tone === "warning"
                        ? "bg-[color:var(--warning)]"
                        : "bg-[color:var(--danger)]";
                  return (
                    <div
                      key={t.id}
                      className="grid grid-cols-12 px-5 py-3.5 items-center border-b border-border last:border-0 text-sm"
                    >
                      <div className="col-span-5 font-medium text-foreground">{t.team_name}</div>
                      <div className="col-span-2 text-muted-foreground">{t.rep_count}</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-32 rounded-full bg-border overflow-hidden">
                            <div className={`h-full ${toneCls}`} style={{ width: `${t.adoption_pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{t.adoption_pct}%</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            tone === "success"
                              ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                              : tone === "warning"
                                ? "bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
                                : "bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
                          }`}
                        >
                          {labelForTone(tone)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </Section>

            <Section title="Insights" description="What's driving the adoption gap.">
              <div className="grid md:grid-cols-2 gap-3">
                {adoptionInsights.map((t) => (
                  <div key={t.id} className="rounded-xl border border-border bg-card p-4 text-sm text-foreground">
                    {t.text}
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-3">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-sm font-semibold text-foreground">Manager actions</div>
              <p className="text-xs text-muted-foreground mt-1">
                Drive adoption without adding more required fields.
              </p>
              <div className="mt-4 space-y-2">
                {actions.map((a) => (
                  <ActionBtn key={a.id} icon={ACTION_ICONS[a.action_type] ?? Target} label={a.label} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Forecast impact</div>
              <div className="mt-1 text-foreground text-sm leading-relaxed">
                Closing the data-quality gap on the top 30 stale deals would lift forecast confidence from{" "}
                <span className="font-semibold">{health?.forecast_confidence_pct ?? 41}%</span> to{" "}
                <span className="font-semibold text-[color:var(--success)]">{health?.forecast_confidence_target_pct ?? 68}%</span>.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

function ActionBtn({
  icon: Icon,
  label,
}: {
  icon: typeof Target;
  label: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground hover:bg-muted text-left">
      <Icon className="h-4 w-4 text-primary" /> {label}
    </button>
  );
}