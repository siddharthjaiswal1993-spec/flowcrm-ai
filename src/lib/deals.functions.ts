import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Demo seed data, keyed by account name. Matches the original prototype's
 * Acme/Vertex golden-path screens.
 */
const SEED_DEALS = [
  {
    account: "Acme Logistics",
    stage: "Proposal",
    value: 84000,
    problem: "Missing next step",
    status: "Stale" as const,
    days_stale: 18,
    signals: [
      { kind: "call" as const, source_label: "Call note · 19 days ago", content: "Customer asked if pricing can be adjusted for multi-location rollout." },
      { kind: "email" as const, source_label: "Email snippet · 12 days ago", content: "Can we discuss pricing options before moving forward?" },
      { kind: "crm" as const, source_label: "CRM history", content: "Proposal sent 18 days ago, no next step logged." },
    ],
  },
  {
    account: "Northstar Retail",
    stage: "Negotiation",
    value: 126000,
    problem: "No decision-maker mapped",
    status: "At risk" as const,
    days_stale: 9,
    signals: [
      { kind: "email" as const, source_label: "Email thread · 5 days ago", content: "Looping in CFO for final approval." },
    ],
  },
  {
    account: "BluePeak Software",
    stage: "Discovery",
    value: 52000,
    problem: "Follow-up due today",
    status: "Active" as const,
    days_stale: 3,
    signals: [
      { kind: "meeting" as const, source_label: "Demo request · 2 days ago", content: "VP Sales requested live demo for next week." },
    ],
  },
  {
    account: "Vertex Manufacturing",
    stage: "Qualification",
    value: 39000,
    problem: "Deal has no next step",
    status: "Stale" as const,
    days_stale: 22,
    signals: [],
  },
];

function daysAgoIso(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}

function humanizeLastActivity(iso: string | null): string {
  if (!iso) return "no activity";
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export type DealRow = {
  id: string;
  account: string;
  stage: string;
  value: number;
  status: "Stale" | "At risk" | "Active" | "Updated";
  problem: string | null;
  last_activity_iso: string | null;
  last_activity_human: string;
  owner_name: string;
};

/** List the signed-in user's deals. */
export const listMyDeals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DealRow[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("deals")
      .select("id, account, stage, value, status, problem, last_activity_at, owner_id")
      .eq("owner_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    const owner_name = profile?.full_name ?? "You";

    return (data ?? []).map((d) => ({
      id: d.id,
      account: d.account,
      stage: d.stage,
      value: Number(d.value),
      status: d.status,
      problem: d.problem,
      last_activity_iso: d.last_activity_at,
      last_activity_human: humanizeLastActivity(d.last_activity_at),
      owner_name,
    }));
  });

export type DashboardMetrics = {
  totalDeals: number;
  stale: number;
  missingNext: number;
  updated: number;
  pendingSuggestions: number;
  acceptedSuggestions: number;
};

export const getDashboardMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardMetrics> => {
    const { supabase, userId } = context;
    const { data: deals } = await supabase
      .from("deals")
      .select("id, status, problem")
      .eq("owner_id", userId);
    const list = deals ?? [];
    const dealIds = list.map((d) => d.id);
    let pending = 0;
    let accepted = 0;
    if (dealIds.length > 0) {
      const { data: sugs } = await supabase
        .from("ai_suggestions")
        .select("status")
        .in("deal_id", dealIds);
      for (const s of sugs ?? []) {
        if (s.status === "accepted" || s.status === "edited") accepted++;
        else if (s.status === "pending" || s.status === "draft") pending++;
      }
    }
    return {
      totalDeals: list.length,
      stale: list.filter((d) => d.status === "Stale").length,
      missingNext: list.filter((d) => d.problem?.toLowerCase().includes("next step")).length,
      updated: list.filter((d) => d.status === "Updated").length,
      pendingSuggestions: pending,
      acceptedSuggestions: accepted,
    };
  });

export type DealDetail = {
  deal: DealRow;
  signals: Array<{
    id: string;
    kind: "call" | "email" | "crm" | "meeting";
    source_label: string;
    content: string;
  }>;
  latestSuggestion: {
    status: string;
    next_step: string | null;
    objection: string | null;
    follow_up: string | null;
    health: string | null;
    reasoning: string | null;
    confidence: number | null;
    auto_filled_fields: number | null;
    total_fields: number | null;
    auto_filled_field_names: string[];
    impact_preview: string[];
  } | null;
};

/** Look up a deal by account name (used by the assistant screens). */
export const getDealByAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { account: string }) =>
    z.object({ account: z.string().min(1).max(255) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<DealDetail | null> => {
    const { supabase, userId } = context;
    const { data: deal, error } = await supabase
      .from("deals")
      .select("id, account, stage, value, status, problem, last_activity_at, owner_id")
      .eq("owner_id", userId)
      .eq("account", data.account)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!deal) return null;

    const [{ data: signals }, { data: sug }, { data: profile }] = await Promise.all([
      supabase
        .from("signals")
        .select("id, kind, source_label, content, occurred_at")
        .eq("deal_id", deal.id)
        .order("occurred_at", { ascending: false }),
      supabase
        .from("ai_suggestions")
        .select(
          "status, next_step, objection, follow_up, health, reasoning, confidence, auto_filled_fields, total_fields, auto_filled_field_names, impact_preview",
        )
        .eq("deal_id", deal.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    ]);

    return {
      deal: {
        id: deal.id,
        account: deal.account,
        stage: deal.stage,
        value: Number(deal.value),
        status: deal.status,
        problem: deal.problem,
        last_activity_iso: deal.last_activity_at,
        last_activity_human: humanizeLastActivity(deal.last_activity_at),
        owner_name: profile?.full_name ?? "You",
      },
      signals: (signals ?? []).map((s) => ({
        id: s.id,
        kind: s.kind,
        source_label: s.source_label,
        content: s.content,
      })),
      latestSuggestion: sug
        ? {
            status: sug.status,
            next_step: sug.next_step,
            objection: sug.objection,
            follow_up: sug.follow_up,
            health: sug.health,
            reasoning: sug.reasoning,
            confidence: sug.confidence,
            auto_filled_fields: sug.auto_filled_fields,
            total_fields: sug.total_fields,
            auto_filled_field_names: Array.isArray(sug.auto_filled_field_names)
              ? (sug.auto_filled_field_names as string[])
              : [],
            impact_preview: Array.isArray(sug.impact_preview)
              ? (sug.impact_preview as string[])
              : [],
          }
        : null,
    };
  });

/** Persist an accepted AI suggestion and mark the deal as Updated. */
export const acceptSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    dealId: string;
    nextStep: string;
    objection: string;
    followUp: string;
    health: string;
    edited: boolean;
  }) =>
    z
      .object({
        dealId: z.string().uuid(),
        nextStep: z.string().min(1).max(500),
        objection: z.string().min(1).max(500),
        followUp: z.string().min(1).max(500),
        health: z.string().min(1).max(50),
        edited: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const now = new Date().toISOString();

    // Idempotency guard: if the most recent suggestion for this deal is already
    // an accepted/edited row with identical content (i.e. a spam click that
    // raced past the disabled button) we treat it as a no-op rather than
    // inserting a duplicate row.
    const { data: latest } = await supabase
      .from("ai_suggestions")
      .select("status, next_step, objection, follow_up, health, reviewed_at")
      .eq("deal_id", data.dealId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sameContent =
      latest &&
      (latest.status === "accepted" || latest.status === "edited") &&
      latest.next_step === data.nextStep &&
      latest.objection === data.objection &&
      latest.follow_up === data.followUp &&
      latest.health === data.health &&
      latest.reviewed_at &&
      Date.now() - new Date(latest.reviewed_at).getTime() < 60_000;
    if (sameContent) {
      return { ok: true, deduped: true } as const;
    }

    const { error: insertError } = await supabase.from("ai_suggestions").insert({
      deal_id: data.dealId,
      next_step: data.nextStep,
      objection: data.objection,
      follow_up: data.followUp,
      health: data.health,
      confidence: 0.92,
      auto_filled_fields: 6,
      total_fields: 8,
      status: data.edited ? "edited" : "accepted",
      reviewed_by: userId,
      reviewed_at: now,
    });
    if (insertError) throw new Error(insertError.message);

    const { error: updateError } = await supabase
      .from("deals")
      .update({
        status: "Updated",
        last_activity_at: now,
        problem: `Next step added: ${data.nextStep}`,
      })
      .eq("id", data.dealId);
    if (updateError) throw new Error(updateError.message);

    return { ok: true, deduped: false } as const;
  });

/** Seed the four demo deals + signals for the current user. Idempotent. */
export const seedDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("deals")
      .select("id, account")
      .eq("owner_id", userId);
    const haveAccounts = new Set((existing ?? []).map((d) => d.account));

    for (const s of SEED_DEALS) {
      if (haveAccounts.has(s.account)) continue;
      const { data: inserted, error } = await supabase
        .from("deals")
        .insert({
          account: s.account,
          owner_id: userId,
          stage: s.stage,
          value: s.value,
          problem: s.problem,
          status: s.status,
          last_activity_at: daysAgoIso(s.days_stale),
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      if (s.signals.length > 0) {
        const { error: sigErr } = await supabase.from("signals").insert(
          s.signals.map((sig) => ({
            deal_id: inserted.id,
            kind: sig.kind,
            source_label: sig.source_label,
            content: sig.content,
            occurred_at: daysAgoIso(s.days_stale - 1),
          })),
        );
        if (sigErr) throw new Error(sigErr.message);
      }
    }
    return { ok: true };
  });

/** Wipe the current user's demo data (for re-seeding). */
export const resetDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: mine } = await supabase
      .from("deals")
      .select("id")
      .eq("owner_id", userId);
    const ids = (mine ?? []).map((d) => d.id);
    if (ids.length === 0) return { ok: true };
    await supabase.from("ai_suggestions").delete().in("deal_id", ids);
    await supabase.from("signals").delete().in("deal_id", ids);
    await supabase.from("deals").delete().in("id", ids);
    return { ok: true };
  });