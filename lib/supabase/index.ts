// ─────────────────────────────────────────────────────────────
// AURUM — Supabase Client
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;

// Client-side (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (service role — only in Route Handlers / Server Actions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ─── Database schema reference ───────────────────────────────
// Tables:
//   agent_profiles       — static agent identity
//   agent_status_snapshots — rolling status/decision snapshots
//   market_signals       — chart analysis outputs
//   news_items           — classified news articles
//   polymarket_snapshots — Polymarket odds snapshots
//   decision_logs        — full decision history with context
//   thesis_posts         — published thesis entries
//   token_metrics        — fee/treasury/price data from Bankr
//   compute_metrics      — API cost and runway tracking

export type Database = {
  public: {
    Tables: {
      agent_profiles: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string;
          mission: string;
          thesis: string;
          risk_framework: string;
          market_focus: string[];
          token_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["agent_profiles"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["agent_profiles"]["Insert"]>;
      };
      decision_logs: {
        Row: {
          id: string;
          agent_id: string;
          decision: string;
          confidence: number;
          reasoning: string;
          input_signals: Record<string, string>;
          invalidation_conditions: string[];
          resolved_at: string | null;
          outcome: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["decision_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["decision_logs"]["Insert"]>;
      };
    };
  };
};
