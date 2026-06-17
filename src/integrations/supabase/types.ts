export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_analysis_runs: {
        Row: {
          completed_at: string | null
          confidence: number | null
          created_at: string
          deal_id: string
          error_message: string | null
          id: string
          loading_steps: Json
          reasoning: string | null
          reviewed_source_count: number
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          deal_id: string
          error_message?: string | null
          id?: string
          loading_steps?: Json
          reasoning?: string | null
          reviewed_source_count?: number
          status: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          confidence?: number | null
          created_at?: string
          deal_id?: string
          error_message?: string | null
          id?: string
          loading_steps?: Json
          reasoning?: string | null
          reviewed_source_count?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_runs_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_suggestions: {
        Row: {
          auto_filled_field_names: Json | null
          auto_filled_fields: number | null
          confidence: number | null
          created_at: string
          deal_id: string
          follow_up: string | null
          health: string | null
          id: string
          impact_preview: Json | null
          next_step: string | null
          objection: string | null
          reasoning: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          save_error_message: string | null
          source_signal_ids: Json | null
          status: Database["public"]["Enums"]["suggestion_status"]
          total_fields: number | null
          updated_at: string
        }
        Insert: {
          auto_filled_field_names?: Json | null
          auto_filled_fields?: number | null
          confidence?: number | null
          created_at?: string
          deal_id: string
          follow_up?: string | null
          health?: string | null
          id?: string
          impact_preview?: Json | null
          next_step?: string | null
          objection?: string | null
          reasoning?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          save_error_message?: string | null
          source_signal_ids?: Json | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          total_fields?: number | null
          updated_at?: string
        }
        Update: {
          auto_filled_field_names?: Json | null
          auto_filled_fields?: number | null
          confidence?: number | null
          created_at?: string
          deal_id?: string
          follow_up?: string | null
          health?: string | null
          id?: string
          impact_preview?: Json | null
          next_step?: string | null
          objection?: string | null
          reasoning?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          save_error_message?: string | null
          source_signal_ids?: Json | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          total_fields?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      app_config: {
        Row: {
          created_at: string
          id: string
          key: string
          metadata: Json
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          metadata?: Json
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          metadata?: Json
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      crm_health_snapshots: {
        Row: {
          avg_update_time_minutes: number
          created_at: string
          crm_adoption_pct: number
          data_quality_score: number
          duplicate_accounts_pct: number
          forecast_confidence_pct: number
          forecast_confidence_target_pct: number
          id: string
          internal_csat_score: number
          licensed_users: number
          period_end: string
          period_start: string
          shadow_spreadsheet_usage_pct: number
          target_update_time_minutes: number
          team: string | null
          time_saved_hours: number
          weekly_active_users: number
        }
        Insert: {
          avg_update_time_minutes?: number
          created_at?: string
          crm_adoption_pct?: number
          data_quality_score?: number
          duplicate_accounts_pct?: number
          forecast_confidence_pct?: number
          forecast_confidence_target_pct?: number
          id?: string
          internal_csat_score?: number
          licensed_users?: number
          period_end: string
          period_start: string
          shadow_spreadsheet_usage_pct?: number
          target_update_time_minutes?: number
          team?: string | null
          time_saved_hours?: number
          weekly_active_users?: number
        }
        Update: {
          avg_update_time_minutes?: number
          created_at?: string
          crm_adoption_pct?: number
          data_quality_score?: number
          duplicate_accounts_pct?: number
          forecast_confidence_pct?: number
          forecast_confidence_target_pct?: number
          id?: string
          internal_csat_score?: number
          licensed_users?: number
          period_end?: string
          period_start?: string
          shadow_spreadsheet_usage_pct?: number
          target_update_time_minutes?: number
          team?: string | null
          time_saved_hours?: number
          weekly_active_users?: number
        }
        Relationships: []
      }
      deals: {
        Row: {
          account: string
          created_at: string
          follow_up: string | null
          health: string | null
          id: string
          last_activity_at: string | null
          next_step: string | null
          objection: string | null
          owner_id: string | null
          problem: string | null
          required_fields_completed: number | null
          stage: string
          status: Database["public"]["Enums"]["deal_status"]
          total_required_fields: number | null
          updated_at: string
          value: number
        }
        Insert: {
          account: string
          created_at?: string
          follow_up?: string | null
          health?: string | null
          id?: string
          last_activity_at?: string | null
          next_step?: string | null
          objection?: string | null
          owner_id?: string | null
          problem?: string | null
          required_fields_completed?: number | null
          stage: string
          status?: Database["public"]["Enums"]["deal_status"]
          total_required_fields?: number | null
          updated_at?: string
          value?: number
        }
        Update: {
          account?: string
          created_at?: string
          follow_up?: string | null
          health?: string | null
          id?: string
          last_activity_at?: string | null
          next_step?: string | null
          objection?: string | null
          owner_id?: string | null
          problem?: string | null
          required_fields_completed?: number | null
          stage?: string
          status?: Database["public"]["Enums"]["deal_status"]
          total_required_fields?: number | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      manager_actions: {
        Row: {
          action_type: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          role_required: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          role_required?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          role_required?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_initials: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          manager_id: string | null
          team: string | null
          updated_at: string
        }
        Insert: {
          avatar_initials?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          manager_id?: string | null
          team?: string | null
          updated_at?: string
        }
        Update: {
          avatar_initials?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          manager_id?: string | null
          team?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          content: string
          created_at: string
          deal_id: string
          id: string
          kind: Database["public"]["Enums"]["signal_kind"]
          occurred_at: string
          source_label: string
        }
        Insert: {
          content: string
          created_at?: string
          deal_id: string
          id?: string
          kind: Database["public"]["Enums"]["signal_kind"]
          occurred_at?: string
          source_label: string
        }
        Update: {
          content?: string
          created_at?: string
          deal_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["signal_kind"]
          occurred_at?: string
          source_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "signals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      team_metrics: {
        Row: {
          adoption_pct: number
          created_at: string
          id: string
          missing_next_steps_count: number
          period_end: string
          period_start: string
          rep_count: number
          stale_records_count: number
          team_name: string
        }
        Insert: {
          adoption_pct: number
          created_at?: string
          id?: string
          missing_next_steps_count?: number
          period_end: string
          period_start: string
          rep_count: number
          stale_records_count?: number
          team_name: string
        }
        Update: {
          adoption_pct?: number
          created_at?: string
          id?: string
          missing_next_steps_count?: number
          period_end?: string
          period_start?: string
          rep_count?: number
          stale_records_count?: number
          team_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_insights: {
        Row: {
          attribution: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          metadata: Json
          team: string | null
          text: string
          type: string
          updated_at: string
        }
        Insert: {
          attribution?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          metadata?: Json
          team?: string | null
          text: string
          type: string
          updated_at?: string
        }
        Update: {
          attribution?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          metadata?: Json
          team?: string | null
          text?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "rep" | "manager" | "admin"
      deal_status: "Stale" | "At risk" | "Active" | "Updated"
      signal_kind: "call" | "email" | "crm" | "meeting"
      suggestion_status:
        | "pending"
        | "accepted"
        | "edited"
        | "rejected"
        | "draft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["rep", "manager", "admin"],
      deal_status: ["Stale", "At risk", "Active", "Updated"],
      signal_kind: ["call", "email", "crm", "meeting"],
      suggestion_status: ["pending", "accepted", "edited", "rejected", "draft"],
    },
  },
} as const
