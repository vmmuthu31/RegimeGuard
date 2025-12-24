import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

const SupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

function getSupabaseEnv() {
  const result = SupabaseEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!result.success) {
    return null;
  }

  return result.data;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          created_at: string;
          updated_at: string;
          settings: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          settings?: Record<string, unknown>;
        };
        Update: {
          wallet_address?: string;
          settings?: Record<string, unknown>;
          updated_at?: string;
        };
        Relationships: [];
      };
      trades: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          side: string;
          position_side: string;
          strategy: string;
          regime: string;
          entry_price: number;
          exit_price: number | null;
          size: number;
          leverage: number;
          stop_loss: number;
          take_profit: number;
          fee: number;
          realized_pnl: number | null;
          pnl_percent: number | null;
          status: string;
          confidence: number;
          explanation: string;
          order_id: string;
          created_at: string;
          closed_at: string | null;
          ai_log_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          side: string;
          position_side: string;
          strategy: string;
          regime: string;
          entry_price: number;
          size: number;
          leverage: number;
          stop_loss: number;
          take_profit: number;
          fee?: number;
          confidence: number;
          explanation: string;
          order_id: string;
          status?: string;
        };
        Update: {
          exit_price?: number;
          realized_pnl?: number;
          pnl_percent?: number;
          status?: string;
          closed_at?: string;
        };
        Relationships: [];
      };
      positions: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          side: string;
          margin_mode: string;
          size: number;
          entry_price: number;
          mark_price: number;
          liquidation_price: number;
          leverage: number;
          margin: number;
          unrealized_pnl: number;
          unrealized_pnl_percent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          side: string;
          margin_mode: string;
          size: number;
          entry_price: number;
          mark_price: number;
          liquidation_price: number;
          leverage: number;
          margin: number;
          unrealized_pnl?: number;
          unrealized_pnl_percent?: number;
        };
        Update: {
          mark_price?: number;
          size?: number;
          unrealized_pnl?: number;
          unrealized_pnl_percent?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_decisions: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          type: string;
          regime: string;
          confidence: number;
          risk_level: string;
          decision: Record<string, unknown>;
          explanation: string;
          indicators: Record<string, number>;
          created_at: string;
          weex_log_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          type: string;
          regime: string;
          confidence: number;
          risk_level: string;
          decision: Record<string, unknown>;
          explanation: string;
          indicators: Record<string, number>;
        };
        Update: {
          weex_log_id?: string;
        };
        Relationships: [];
      };
      trading_sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          stopped_at: string | null;
          status: string;
          symbols: string[];
          interval_ms: number;
          dry_run: boolean;
          cycles_completed: number;
          trades_executed: number;
          total_pnl: number;
          errors: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          symbols: string[];
          interval_ms: number;
          dry_run?: boolean;
          status?: string;
        };
        Update: {
          stopped_at?: string;
          status?: string;
          cycles_completed?: number;
          trades_executed?: number;
          total_pnl?: number;
          errors?: string[];
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let serverClient: SupabaseClient<Database> | null = null;
let publicClient: SupabaseClient<Database> | null = null;

export function getSupabaseServerClient(): SupabaseClient<Database> {
  if (serverClient) return serverClient;

  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Supabase environment variables not configured");
  }

  serverClient = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return serverClient;
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (publicClient) return publicClient;

  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Supabase environment variables not configured");
  }

  publicClient = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return publicClient;
}
