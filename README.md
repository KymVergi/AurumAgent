<div align="center">
  <img src="public/logos/aurum_logo.png" alt="AURUM" width="100" style="mix-blend-mode:screen"/>
  <br/>
  <img src="public/logos/aurum_name.png" alt="Aurum Agent" width="280"/>
  <br/><br/>

  **The self-funding macro agent.**

  *Charts. News. Odds. Conviction.*

  [![Next.js](https://img.shields.io/badge/Next.js-15.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
  [![Anthropic](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-orange?style=flat-square)](https://anthropic.com)
  [![Base](https://img.shields.io/badge/Chain-Base-0052FF?style=flat-square&logo=coinbase)](https://base.org)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🧠 What is AURUM?

**AURUM** is a public autonomous macro intelligence agent. It studies chart structure, classifies news, reads prediction market odds, and decides whether to act — *publicly, transparently, autonomously*.

Every signal it processes, every decision it makes, and every thesis it publishes is available to anyone. The agent has no private feed, no hidden edge, no opaque process. **Public proof is the product.**

> *"Most market participants over-trade. They act on noise, miss structure, and confuse activity with edge. AURUM's thesis is the opposite."*

---

## ⚡ How it works

```
Chart (Finnhub OHLC)      ──── 35% weight ──┐
News  (Finnhub news)      ──── 30% weight ──┤──→ Composite Score (-100 to +100)
Polymarket (public odds)  ──── 25% weight ──┤        ──→ Decision
Risk Budget (treasury)    ──── 10% weight ──┘              ──→ Public Thesis
```

### 🔄 The Signal Pipeline

| Step | What happens |
|------|-------------|
| **1. Chart ingestion** | OHLC data for BTC/USD, ETH/USD, DXY fetched from Finnhub |
| **2. AI chart analysis** | Claude analyzes trend, structure, key levels, signal strength |
| **3. News classification** | Headlines classified for sentiment, relevance, macro implication |
| **4. Polymarket scoring** | Prediction market odds scored for macro relevance |
| **5. Composite signal** | All signals weighted into a score from -100 to +100 |
| **6. Decision** | Agent decides: `WATCH`, `LONG BIAS`, `SHORT BIAS`, `NO TRADE` |
| **7. Public thesis** | Full reasoning published publicly |

### 🎯 Decision Thresholds

| Decision | Condition |
|----------|-----------|
| 🟢 **LONG BIAS** | Composite ≥ +35 and confidence ≥ 65% |
| 🔴 **SHORT BIAS** | Composite ≤ −35 and confidence ≥ 65% |
| 🟡 **WATCH** | Between thresholds with directional lean |
| ⚪ **NO TRADE** | Confidence < 50% or risk budget < 20% |
| 🟠 **REDUCE RISK** | Deteriorating conditions with open exposure |

> **"No trade" is not a failure state. It is often the highest-conviction output the system can produce.**

---

## 🔁 The Fee Flywheel

```
Token holders → fees → treasury → compute → intelligence
      ↑                                           |
      └──── attention ← public proof ← decisions ┘
```

AURUM is designed to fund itself. Token fees pay for intelligence. Intelligence generates proof. Proof attracts attention. Attention generates fees.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15.3.6 — App Router, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **AI** | Anthropic Claude Sonnet |
| **Market Data** | Finnhub (free tier) + webhook |
| **Prediction Markets** | Polymarket (public endpoints) |
| **Persistence** | Supabase (PostgreSQL) |
| **Chain** | Base (EVM) |
| **Execution** | Bankr (roadmap) |
| **Cron** | GitHub Actions (free) |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-org/aurum
cd aurum
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
# 🤖 Anthropic — AI intelligence layer
ANTHROPIC_API_KEY=sk-ant-...

# 📊 Finnhub — market data & news
FINNHUB_API_KEY=your_key
FINNHUB_WEBHOOK_SECRET=your_webhook_secret

# 🗄️ Supabase — persistence
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 🔗 Bankr / Base chain — treasury & execution
BANKR_AGENT_ADDRESS=0x...
AURUM_TOKEN_CONTRACT=0x...
BANKR_API_KEY=                    # only needed for live trading

# ⚙️ App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your_long_random_secret
```

### 3. Initialize Supabase

Run the contents of `supabase/schema.sql` in your Supabase SQL editor. Creates all 9 tables with indexes and RLS policies.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the signal pipeline

```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/cron/signal" `
  -Headers @{"x-cron-secret"="your_cron_secret"}
```

```bash
# bash / macOS / Linux
curl -X GET http://localhost:3000/api/cron/signal \
  -H "x-cron-secret: your_cron_secret"
```

**Expected response:**
```json
{
  "success": true,
  "decision": "watch",
  "confidence": 58,
  "score": 15,
  "generatedAt": "2026-03-18T00:34:55.669Z"
}
```

---

## 📁 Project Structure

```
aurum/
├── app/
│   ├── page.tsx                    → Landing page
│   ├── dashboard/page.tsx          → Intelligence terminal
│   ├── agent/aurum/page.tsx        → Public agent profile
│   ├── thesis/page.tsx             → Current market thesis
│   └── api/
│       ├── signals/route.ts        → Composite signal endpoint
│       ├── news/route.ts           → News feed endpoint
│       ├── polymarket/route.ts     → Polymarket endpoint
│       ├── thesis/route.ts         → Thesis endpoint
│       ├── agent/route.ts          → Agent profile endpoint
│       ├── cron/signal/route.ts    → Signal pipeline (cron)
│       ├── cron/thesis/route.ts    → Thesis generation (cron)
│       └── webhooks/finnhub/       → Finnhub real-time webhook
│
├── components/
│   ├── layout/                     → Nav, Footer
│   ├── marketing/                  → Landing page sections
│   ├── dashboard/                  → All 10 dashboard modules
│   └── shared/                     → UI primitives, charts, ticker
│
├── lib/
│   ├── anthropic/index.ts          → 5 AI helper functions
│   ├── bankr/index.ts              → Base chain wallet adapter
│   ├── polymarket/index.ts         → Polymarket public API
│   ├── market/index.ts             → Finnhub adapter
│   ├── supabase/index.ts           → Database client
│   └── mock-data.ts                → Seed data (dev fallback)
│
├── public/
│   ├── logos/                      → Brand assets
│   └── docs/index.html             → Full documentation (static)
│
├── supabase/schema.sql             → Full database schema
├── .github/workflows/              → GitHub Actions cron jobs
└── types/index.ts                  → All TypeScript types
```

---

## 🤖 AI Helpers

All AI interactions live in `lib/anthropic/index.ts` — strongly typed, modular, with conservative fallbacks:

```typescript
// Analyze chart structure
summarizeChartContext(asset, timeframe, priceData, currentPrice)
  → ChartContextSummary

// Classify news sentiment and relevance
classifyNewsBatch(headlines)
  → NewsClassification[]

// Score prediction market signals
scorePolymarketContext(markets)
  → PolymarketContextScore[]

// Build composite trading decision
buildCompositeSignal(inputs)
  → CompositeSignal

// Generate public thesis
generatePublicThesis(signals, news, polymarkets, decision, confidence)
  → ThesisPost
```

> Every helper returns a **conservative fallback** (`no_trade`, confidence 0) if the API call fails. The agent never crashes because of a failed AI response.

---

## ⏱️ Cron Jobs (GitHub Actions — free)

Two automated workflows in `.github/workflows/`:

| Workflow | Schedule | What it does |
|----------|----------|-------------|
| `signal-pipeline.yml` | Every 15 min | Full signal pipeline → new decision |
| `thesis-generation.yml` | Every 6 hours | Generates and publishes new thesis |

**Setup:** Add these secrets to your GitHub repo under `Settings → Secrets`:

```
APP_URL     → https://your-vercel-domain.vercel.app
CRON_SECRET → same value as in .env.local
```

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add all environment variables in **Vercel → Settings → Environment Variables**, then set your Finnhub webhook URL to:

```
https://your-domain.vercel.app/api/webhooks/finnhub
```

---

## 📊 Dashboard Modules

| Module | Description |
|--------|-------------|
| 🟢 **Agent Status** | Current decision, confidence, reasoning, composite score |
| 📈 **Market Overview** | Sparklines and trend for BTC, ETH, DXY |
| 🕯️ **Chart Analysis** | Detailed structure with key levels and signal strength |
| 📰 **News Pulse** | Classified headlines with sentiment and relevance score |
| 🎯 **Polymarket Context** | Active macro markets with real-money odds |
| ⚡ **Composite Signal** | Weighted score gauge and decision breakdown |
| 📜 **Decision Feed** | Full history of agent decisions with outcomes |
| 💰 **Treasury / Fees** | Token price, market cap, fees collected |
| 💻 **Compute Runway** | Daily cost, total spent, days remaining |
| 🕐 **Recent Actions** | Latest pipeline actions with status |

---

## 🗺️ Roadmap

- [x] Next.js 15 foundation with full design system
- [x] Anthropic intelligence layer (5 typed helpers)
- [x] Polymarket, Finnhub, and Base chain adapters
- [x] Supabase schema and client
- [x] GitHub Actions cron pipeline
- [x] Finnhub real-time webhook
- [ ] Supabase persistence (decision log, thesis archive)
- [ ] Token launch via Bankr
- [ ] Fee loop implementation
- [ ] Live trading execution
- [ ] Polymarket on-chain participation
- [ ] Auto-publish thesis to [@AurumAgent](https://x.com/AurumAgent)

---

## ⚠️ Disclaimer

AURUM is an **experimental autonomous AI agent**. Nothing it produces constitutes financial advice, investment advice, or a recommendation to buy or sell any asset. The AURUM token is a utility token — not a security, not a promise of return. Token value may go to zero.

*Use at your own risk. See `/docs` for full disclaimer.*

---

<div align="center">

  Built with [Anthropic](https://anthropic.com) · [Polymarket](https://polymarket.com) · [Finnhub](https://finnhub.io) · [Base](https://base.org)

  Follow the agent → [@AurumAgent](https://x.com/AurumAgent)

</div>