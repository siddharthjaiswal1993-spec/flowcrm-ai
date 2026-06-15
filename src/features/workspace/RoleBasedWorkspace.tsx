import { Link } from "@tanstack/react-router";
import { AppLayout, Section } from "@/components/AppLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyDeals, seedDemoData, type DealRow } from "@/lib/deals.functions";
import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ListChecks,
  Wand2,
  Database,
  Loader2,
} from "lucide-react";
import {
  customerSuccessItems,
  managerItems,
  roleTabs,
  type RoleTab,
} from "./data";

function fixHrefFor(deal: DealRow): "/assistant" | "/assistant-loading" | "/assistant-error" {
  if (deal.account === "Acme Logistics") return "/assistant-loading";
  if (deal.account === "Vertex Manufacturing") return "/assistant-error";
  return "/assistant";
}

function suggestedFor(deal: DealRow): string {
  if (deal.status === "Updated") return "Update saved to CRM";
  if (deal.account === "Acme Logistics") return "Schedule pricing review call for Friday";
  if (deal.account === "Northstar Retail") return "Add CFO as economic buyer";
  if (deal.account === "BluePeak Software") return "Send demo scheduling email";
  if (deal.account === "Vertex Manufacturing") return "Send re-engagement email";
  return "Review with AI";
}

function signalFor(deal: DealRow): string {
  if (deal.account === "Acme Logistics") return "Pricing objection mentioned in call notes";
  if (deal.account === "Northstar Retail") return "Email thread mentions CFO approval";
  if (deal.account === "BluePeak Software") return "Demo requested by VP Sales";
  if (deal.account === "Vertex Manufacturing") return "No activity after discovery call";
  return "Needs attention";
}

/** PRD screen #2 — Role-Based Workspace (My CRM Work). */
export function RoleBasedWorkspace() {
  const fetchDeals = useServerFn(listMyDeals);
  const seedFn = useServerFn(seedDemoData);
  const qc = useQueryClient();
  const [tab, setTab] = useState<RoleTab>("Sales Rep");

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["my-deals"],
    queryFn: () => fetchDeals(),
  });

  const seed = useMutation({
    mutationFn: () => seedFn(),
    onSuccess: () => qc.invalidateQueries(),
  });

  const stale = deals.filter((d) => d.status === "Stale" || d.status === "At risk").length;
  const missingNext = deals.filter((d) => d.problem?.toLowerCase().includes("next step")).length;
  const updated = deals.filter((d) => d.status === "Updated").length;
  const ownerName = deals[0]?.owner_name ?? "there";

  return (
    <AppLayout
      title="My CRM Work"
      subtitle="Your daily priority view. Built for action, not data entry."
    >
      <div className="p-6 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Today
              </div>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">
                Good morning, {ownerName}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You have <span className="font-medium text-foreground">{deals.length} CRM actions</span> ready for review.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-primary/10 text-primary px-3 py-2 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> AI ready · 6 of 8 fields auto-fillable
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <PriorityCard color="danger" icon={AlertTriangle} count={`${stale}`} label="Stale deals" />
            <PriorityCard color="warning" icon={ListChecks} count={`${missingNext}`} label="Missing next steps" />
            <PriorityCard color="primary" icon={Clock} count={`${deals.length}`} label="Total in pipeline" />
            <PriorityCard color="success" icon={Wand2} count={`${updated}`} label="Updated by AI" />
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-border">
          {roleTabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto text-xs text-muted-foreground">
            Showing {deals.length} priority deals
          </div>
        </div>

        {tab === "Sales Rep" ? (
          <Section title="Today's priority deals" description="Tap Fix with AI to update a record in seconds.">
            {isLoading ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Loading deals…
              </div>
            ) : deals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                <Database className="h-6 w-6 text-muted-foreground mx-auto" />
                <div className="mt-3 text-sm font-medium text-foreground">No deals yet</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Seed the demo data to walk the AI golden path.
                </p>
                <button
                  onClick={() => seed.mutate()}
                  disabled={seed.isPending}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {seed.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Seed demo data
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {deals.map((d) => (
                  <DealRowCard
                    key={d.id}
                    deal={d}
                    primary={d.account === "Acme Logistics"}
                    fixHref={fixHrefFor(d)}
                  />
                ))}
              </div>
            )}
          </Section>
        ) : tab === "Customer Success" ? (
          <LightTab heading="3 accounts need a check-in this week" items={customerSuccessItems} />
        ) : (
          <LightTab heading="Team needs attention" items={managerItems} />
        )}
      </div>
    </AppLayout>
  );
}

function PriorityCard({
  color,
  icon: Icon,
  count,
  label,
}: {
  color: "danger" | "warning" | "primary" | "success";
  icon: typeof AlertTriangle;
  count: string;
  label: string;
}) {
  const map = {
    danger: "bg-[color:var(--danger)]/10 text-[color:var(--danger)]",
    warning: "bg-[color:var(--warning)]/10 text-[color:var(--warning)]",
    primary: "bg-primary/10 text-primary",
    success: "bg-[color:var(--success)]/10 text-[color:var(--success)]",
  };
  return (
    <div className="rounded-xl border border-border p-4 flex items-center gap-3 bg-background">
      <div className={`h-10 w-10 rounded-md grid place-items-center ${map[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-semibold text-foreground">{count}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DealRow["status"] }) {
  const map: Record<DealRow["status"], string> = {
    Stale: "bg-[color:var(--danger)]/10 text-[color:var(--danger)]",
    "At risk": "bg-[color:var(--warning)]/10 text-[color:var(--warning)]",
    Active: "bg-primary/10 text-primary",
    Updated: "bg-[color:var(--success)]/10 text-[color:var(--success)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${map[status]}`}>
      {status === "Updated" && <CheckCircle2 className="h-3 w-3" />}
      {status}
    </span>
  );
}

function DealRowCard({
  deal,
  primary,
  fixHref,
}: {
  deal: DealRow;
  primary?: boolean;
  fixHref: "/assistant" | "/assistant-loading" | "/assistant-error";
}) {
  const isUpdated = deal.status === "Updated";
  return (
    <div
      className={`rounded-xl border bg-card p-5 transition ${
        primary && !isUpdated ? "border-primary/40 ring-1 ring-primary/15 shadow-sm" : "border-border"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">{deal.account}</h3>
            <StatusBadge status={deal.status} />
            <span className="text-xs text-muted-foreground">· {deal.stage}</span>
            <span className="text-xs text-muted-foreground">· Owner: {deal.owner_name}</span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">${deal.value.toLocaleString()}</span>
            <span>Last activity {deal.last_activity_human}</span>
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Risk reason</div>
              <div className="text-foreground">{deal.problem ?? signalFor(deal)}</div>
            </div>
            <div className="rounded-md bg-primary/5 border border-primary/15 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-primary/80 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI suggested next step
              </div>
              <div className="text-foreground">{suggestedFor(deal)}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 min-w-[160px]">
          {isUpdated ? (
            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--success)]/10 text-[color:var(--success)] px-4 py-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Updated
            </button>
          ) : primary ? (
            <Link
              to={fixHref}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" /> Fix with AI
            </Link>
          ) : (
            <Link
              to={fixHref}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Sparkles className="h-4 w-4 text-primary" /> Fix with AI
            </Link>
          )}
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
            Open record <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LightTab({
  heading,
  items,
}: {
  heading: string;
  items: { title: string; meta: string }[];
}) {
  return (
    <Section title={heading} description="Lightweight view — switch to Sales Rep tab for the full flow.">
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {items.map((i) => (
          <div key={i.title} className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-foreground">{i.title}</div>
              <div className="text-xs text-muted-foreground">{i.meta}</div>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">Review</button>
          </div>
        ))}
      </div>
    </Section>
  );
}