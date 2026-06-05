import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, KpiCard, Section } from "@/components/AppLayout";
import { useFlow, metrics } from "@/lib/store";
import { Download, BellRing, Target } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team Adoption — FlowCRM" }] }),
  component: Team,
});

const teams = [
  { name: "Enterprise Sales", adoption: 22, reps: 48 },
  { name: "SMB Sales", adoption: 15, reps: 62 },
  { name: "Customer Success", adoption: 31, reps: 41 },
  { name: "Account Management", adoption: 19, reps: 34 },
  { name: "RevOps", adoption: 64, reps: 12 },
];

function Team() {
  const { accepted } = useFlow();
  const m = metrics(accepted);
  return (
    <AppLayout title="Team Adoption and Data Quality" subtitle="Manager view · last 7 days">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KpiCard label="CRM adoption" value="18%" hint="Weekly active" tone="danger" />
          <KpiCard label="Team active users" value={`${m.wau} / ${m.wauTotal}`} />
          <KpiCard label="Stale records" value="61%" tone="danger" />
          <KpiCard label="Forecast confidence" value="41%" tone="warning" />
          <KpiCard label="Data quality" value={`${m.dataQuality} / 100`} tone="warning" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Section title="Adoption by team" description="Weekly active CRM users as a share of team size.">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
                  <div className="col-span-5">Team</div>
                  <div className="col-span-2">Reps</div>
                  <div className="col-span-3">Adoption</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                {teams.map((t) => {
                  const tone =
                    t.adoption >= 50
                      ? "success"
                      : t.adoption >= 25
                        ? "warning"
                        : "danger";
                  const toneCls =
                    tone === "success"
                      ? "bg-[color:var(--success)]"
                      : tone === "warning"
                        ? "bg-[color:var(--warning)]"
                        : "bg-[color:var(--danger)]";
                  const label =
                    tone === "success" ? "On track" : tone === "warning" ? "Watch" : "At risk";
                  return (
                    <div
                      key={t.name}
                      className="grid grid-cols-12 px-5 py-3.5 items-center border-b border-border last:border-0 text-sm"
                    >
                      <div className="col-span-5 font-medium text-foreground">{t.name}</div>
                      <div className="col-span-2 text-muted-foreground">{t.reps}</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-32 rounded-full bg-border overflow-hidden">
                            <div className={`h-full ${toneCls}`} style={{ width: `${t.adoption}%` }} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{t.adoption}%</span>
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
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Insights" description="What's driving the adoption gap.">
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "61% of records have had no update in 14+ days",
                  "48% of open deals are missing next steps",
                  "63% of reps maintain shadow spreadsheets",
                  "AI-assisted updates could reduce CRM update time from 11 minutes to under 2 minutes",
                ].map((t) => (
                  <div key={t} className="rounded-xl border border-border bg-card p-4 text-sm text-foreground">
                    {t}
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
                <ActionBtn icon={Target} label="Review adoption gaps" />
                <ActionBtn icon={BellRing} label="Send smart nudges" />
                <ActionBtn icon={Download} label="Export adoption summary" />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Forecast impact</div>
              <div className="mt-1 text-foreground text-sm leading-relaxed">
                Closing the data-quality gap on the top 30 stale deals would lift forecast confidence from{" "}
                <span className="font-semibold">41%</span> to{" "}
                <span className="font-semibold text-[color:var(--success)]">68%</span>.
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