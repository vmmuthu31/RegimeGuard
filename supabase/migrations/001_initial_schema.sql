-- RegimeGuard Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{
    "tradingEnabled": false,
    "maxPositionSizePercent": 0.1,
    "maxDailyLossPercent": 0.05,
    "defaultLeverage": 5,
    "preferredPairs": [],
    "riskProfile": "moderate"
  }'::jsonb
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  position_side TEXT NOT NULL CHECK (position_side IN ('LONG', 'SHORT')),
  strategy TEXT NOT NULL,
  regime TEXT NOT NULL,
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC,
  size NUMERIC NOT NULL,
  leverage INTEGER NOT NULL DEFAULT 1,
  stop_loss NUMERIC NOT NULL,
  take_profit NUMERIC NOT NULL,
  fee NUMERIC DEFAULT 0,
  realized_pnl NUMERIC,
  pnl_percent NUMERIC,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'LIQUIDATED', 'CANCELLED')),
  confidence NUMERIC NOT NULL,
  explanation TEXT NOT NULL,
  order_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  ai_log_id UUID
);

-- Positions table  
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('LONG', 'SHORT')),
  margin_mode TEXT NOT NULL CHECK (margin_mode IN ('CROSS', 'ISOLATED', 'SHARED')),
  size NUMERIC NOT NULL,
  entry_price NUMERIC NOT NULL,
  mark_price NUMERIC NOT NULL,
  liquidation_price NUMERIC NOT NULL,
  leverage INTEGER NOT NULL,
  margin NUMERIC NOT NULL,
  unrealized_pnl NUMERIC DEFAULT 0,
  unrealized_pnl_percent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol, side)
);

-- AI Decisions table
CREATE TABLE IF NOT EXISTS ai_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('REGIME', 'RISK', 'TRADE', 'VOLATILITY')),
  regime TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  risk_level TEXT NOT NULL,
  decision JSONB NOT NULL,
  explanation TEXT NOT NULL,
  indicators JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  weex_log_id TEXT
);

-- Trading Sessions table
CREATE TABLE IF NOT EXISTS trading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  stopped_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'RUNNING' CHECK (status IN ('RUNNING', 'PAUSED', 'STOPPED', 'ERROR')),
  symbols TEXT[] NOT NULL,
  interval_ms INTEGER NOT NULL DEFAULT 60000,
  dry_run BOOLEAN DEFAULT true,
  cycles_completed INTEGER DEFAULT 0,
  trades_executed INTEGER DEFAULT 0,
  total_pnl NUMERIC DEFAULT 0,
  errors TEXT[] DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_user_id ON ai_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_created_at ON ai_decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trading_sessions_user_id ON trading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_sessions_status ON trading_sessions(status);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own trades" ON trades
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can view own positions" ON positions
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can view own ai_decisions" ON ai_decisions
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

CREATE POLICY "Users can view own trading_sessions" ON trading_sessions
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL);

-- Service role bypass (for server-side operations)
CREATE POLICY "Service role full access users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access trades" ON trades
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access positions" ON positions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access ai_decisions" ON ai_decisions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access trading_sessions" ON trading_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at
  BEFORE UPDATE ON positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
