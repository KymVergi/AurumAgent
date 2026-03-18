-- ─────────────────────────────────────────────────────────────
-- AURUM — Supabase Schema
-- Run this in your Supabase SQL editor to initialize the database.
-- ─────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── agent_profiles ───────────────────────────────────────────
create table if not exists agent_profiles (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name            text not null,
  tagline         text,
  mission         text,
  thesis          text,
  risk_framework  text,
  market_focus    text[] default '{}',
  token_address   text,
  created_at      timestamptz default now()
);

-- Seed the AURUM agent
insert into agent_profiles (slug, name, tagline, mission, thesis, risk_framework, market_focus)
values (
  'aurum',
  'AURUM',
  'The self-funding macro agent',
  'Study markets. Act on conviction. Fund intelligence through proof.',
  'Over-trading is the primary failure mode. Wait for convergence across chart, news, and prediction market signals before acting.',
  'Long bias: composite >= +35, confidence >= 65%. Short bias: composite <= -35, confidence >= 65%. No trade if confidence < 50% or risk budget < 20%.',
  array['BTC/USD', 'ETH/USD', 'DXY', 'GOLD', 'SPX', '10Y Yield', 'Fed Funds Rate', 'CPI']
) on conflict (slug) do nothing;


-- ─── agent_status_snapshots ────────────────────────────────────
create table if not exists agent_status_snapshots (
  id                uuid primary key default uuid_generate_v4(),
  agent_id          text not null references agent_profiles(slug),
  decision          text not null check (decision in ('no_trade','watch','long_bias','short_bias','reduce_risk','thesis_update')),
  confidence        integer not null check (confidence between 0 and 100),
  reasoning         text,
  risk_level        text check (risk_level in ('low','medium','high','critical')),
  composite_score   integer check (composite_score between -100 and 100),
  chart_signal      text,
  news_signal       text,
  polymarket_signal text,
  treasury_health   integer check (treasury_health between 0 and 100),
  compute_runway    integer,
  snapshot_at       timestamptz default now()
);

create index if not exists idx_snapshots_agent_id on agent_status_snapshots(agent_id);
create index if not exists idx_snapshots_snapshot_at on agent_status_snapshots(snapshot_at desc);


-- ─── market_signals ────────────────────────────────────────────
create table if not exists market_signals (
  id            uuid primary key default uuid_generate_v4(),
  asset         text not null,
  timeframe     text not null,
  trend         text check (trend in ('bullish','bearish','neutral','mixed')),
  structure     text,
  volatility    numeric(6,2),
  key_levels    jsonb default '{"support":[],"resistance":[]}',
  summary       text,
  confidence    integer check (confidence between 0 and 100),
  recorded_at   timestamptz default now()
);

create index if not exists idx_market_signals_asset on market_signals(asset);
create index if not exists idx_market_signals_recorded_at on market_signals(recorded_at desc);


-- ─── news_items ────────────────────────────────────────────────
create table if not exists news_items (
  id              uuid primary key default uuid_generate_v4(),
  headline        text not null,
  source          text,
  url             text,
  sentiment       text check (sentiment in ('bullish','bearish','neutral','mixed')),
  relevance_score integer check (relevance_score between 0 and 100),
  category        text,
  summary         text,
  published_at    timestamptz,
  classified_at   timestamptz default now()
);

create index if not exists idx_news_published_at on news_items(published_at desc);
create index if not exists idx_news_sentiment on news_items(sentiment);


-- ─── polymarket_snapshots ──────────────────────────────────────
create table if not exists polymarket_snapshots (
  id                  uuid primary key default uuid_generate_v4(),
  market_id           text not null,
  question            text not null,
  yes_odds            numeric(5,4) check (yes_odds between 0 and 1),
  no_odds             numeric(5,4) check (no_odds between 0 and 1),
  volume              numeric(15,2),
  liquidity           numeric(15,2),
  relevance_score     integer check (relevance_score between 0 and 100),
  macro_implication   text,
  snapshot_at         timestamptz default now()
);

create index if not exists idx_pm_snapshots_market_id on polymarket_snapshots(market_id);
create index if not exists idx_pm_snapshots_snapshot_at on polymarket_snapshots(snapshot_at desc);


-- ─── decision_logs ─────────────────────────────────────────────
create table if not exists decision_logs (
  id                       uuid primary key default uuid_generate_v4(),
  agent_id                 text not null references agent_profiles(slug),
  decision                 text not null check (decision in ('no_trade','watch','long_bias','short_bias','reduce_risk','thesis_update')),
  confidence               integer check (confidence between 0 and 100),
  reasoning                text,
  input_signals            jsonb default '{}',
  invalidation_conditions  text[] default '{}',
  resolved_at              timestamptz,
  outcome                  text,
  created_at               timestamptz default now()
);

create index if not exists idx_decision_logs_agent_id on decision_logs(agent_id);
create index if not exists idx_decision_logs_created_at on decision_logs(created_at desc);


-- ─── thesis_posts ──────────────────────────────────────────────
create table if not exists thesis_posts (
  id                       uuid primary key default uuid_generate_v4(),
  agent_id                 text not null references agent_profiles(slug),
  title                    text not null,
  body                     text not null,
  support_signals          text[] default '{}',
  headlines                text[] default '{}',
  event_odds               jsonb default '[]',
  confidence               integer check (confidence between 0 and 100),
  invalidation_conditions  text[] default '{}',
  watching                 text[] default '{}',
  published_at             timestamptz default now()
);

create index if not exists idx_thesis_posts_agent_id on thesis_posts(agent_id);
create index if not exists idx_thesis_posts_published_at on thesis_posts(published_at desc);


-- ─── token_metrics ─────────────────────────────────────────────
create table if not exists token_metrics (
  id                    uuid primary key default uuid_generate_v4(),
  price                 numeric(20,8),
  market_cap            numeric(20,2),
  volume_24h            numeric(20,2),
  holders               integer,
  fees_collected_24h    numeric(20,2),
  total_fees_collected  numeric(20,2),
  treasury_balance      numeric(20,2),
  recorded_at           timestamptz default now()
);

create index if not exists idx_token_metrics_recorded_at on token_metrics(recorded_at desc);


-- ─── compute_metrics ───────────────────────────────────────────
create table if not exists compute_metrics (
  id                uuid primary key default uuid_generate_v4(),
  daily_cost        numeric(10,4),
  total_spent       numeric(15,2),
  treasury_balance  numeric(20,2),
  runway_days       integer,
  api_calls_today   integer,
  tokens_used_today integer,
  recorded_at       timestamptz default now()
);

create index if not exists idx_compute_metrics_recorded_at on compute_metrics(recorded_at desc);


-- ─── Row Level Security ────────────────────────────────────────
-- Public read access for all tables (the agent is public)
alter table agent_profiles enable row level security;
alter table agent_status_snapshots enable row level security;
alter table market_signals enable row level security;
alter table news_items enable row level security;
alter table polymarket_snapshots enable row level security;
alter table decision_logs enable row level security;
alter table thesis_posts enable row level security;
alter table token_metrics enable row level security;
alter table compute_metrics enable row level security;

-- Allow public read on all tables
create policy "Public read" on agent_profiles for select using (true);
create policy "Public read" on agent_status_snapshots for select using (true);
create policy "Public read" on market_signals for select using (true);
create policy "Public read" on news_items for select using (true);
create policy "Public read" on polymarket_snapshots for select using (true);
create policy "Public read" on decision_logs for select using (true);
create policy "Public read" on thesis_posts for select using (true);
create policy "Public read" on token_metrics for select using (true);
create policy "Public read" on compute_metrics for select using (true);

-- Service role can write everything (used from server-side Route Handlers)
-- This is automatically granted via the service role key — no policy needed.
