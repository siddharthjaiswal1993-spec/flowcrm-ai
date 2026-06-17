import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Reads for shared reference data: workflow insights, team metrics,
 * CRM health snapshot, manager actions, app config, and current profile.
 * All callers must be signed in; rows are org-shared and readable by any
 * authenticated user (writes are restricted to managers/admins).
 */

export type InsightType = "blocker" | "quote" | "ai_shortcut" | "manager_insight";

export type WorkflowInsight = {
  id: string;
  type: InsightType;
  text: string;
  attribution: string | null;
  display_order: number;
};

export const listWorkflowInsights = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WorkflowInsight[]> => {
    const { data, error } = await context.supabase
      .from("workflow_insights")
      .select("id, type, text, attribution, display_order")
      .eq("is_active", true)
      .order("type", { ascending: true })
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as WorkflowInsight[];
  });

export type TeamMetric = {
  id: string;
  team_name: string;
  adoption_pct: number;
  rep_count: number;
};

export const listTeamMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TeamMetric[]> => {
    const { data, error } = await context.supabase
      .from("team_metrics")
      .select("id, team_name, adoption_pct, rep_count, period_end")
      .order("period_end", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    // Take latest snapshot per team
    const seen = new Set<string>();
    const latest: TeamMetric[] = [];
    for (const row of data ?? []) {
      if (seen.has(row.team_name)) continue;
      seen.add(row.team_name);
      latest.push({
        id: row.id,
        team_name: row.team_name,
        adoption_pct: row.adoption_pct,
        rep_count: row.rep_count,
      });
    }
    return latest;
  });

export type CrmHealth = {
  crm_adoption_pct: number;
  duplicate_accounts_pct: number;
  data_quality_score: number;
  forecast_confidence_pct: number;
  forecast_confidence_target_pct: number;
  weekly_active_users: number;
  licensed_users: number;
  avg_update_time_minutes: number;
  target_update_time_minutes: number;
};

export const getLatestCrmHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CrmHealth | null> => {
    const { data, error } = await context.supabase
      .from("crm_health_snapshots")
      .select(
        "crm_adoption_pct, duplicate_accounts_pct, data_quality_score, forecast_confidence_pct, forecast_confidence_target_pct, weekly_active_users, licensed_users, avg_update_time_minutes, target_update_time_minutes",
      )
      .order("period_end", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? null;
  });

export type ManagerAction = { id: string; label: string; action_type: string };

export const listManagerActions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ManagerAction[]> => {
    const { data, error } = await context.supabase
      .from("manager_actions")
      .select("id, label, action_type")
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export type CurrentProfile = {
  id: string;
  full_name: string;
  email: string | null;
  avatar_initials: string;
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export const getCurrentProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CurrentProfile | null> => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, full_name, email, avatar_initials")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      avatar_initials: data.avatar_initials ?? initialsOf(data.full_name),
    };
  });