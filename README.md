<div align="center">

<img src="./public/banner.jpeg" alt="RegimeGuard Banner" style="width: 100%; max-width: 1200px; height: 200px; object-fit: cover; border-radius: 8px;" />

# RegimeGuard

**An Explainable AI-Driven Risk-Adaptive Trading Engine for WEEX**

> AI controls risk, not greed.

[![Built for WEEX AI Wars](https://img.shields.io/badge/Hackathon-WEEX%20AI%20Wars-blue)](https://www.weex.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 🎯 The Problem

Most AI trading systems fail in real markets because they:

- ❌ **Over-optimize price prediction** — Chasing patterns that don't persist
- ❌ **Use excessive leverage** — Amplifying losses during volatility
- ❌ **Ignore regime shifts** — Applying trending strategies in ranging markets
- ❌ **Collapse during drawdowns** — No adaptive risk controls

**Result:** 95% of algorithmic traders lose money. Risk mismanagement, not signal quality, is the primary reason trading strategies fail.

WEEX explicitly discourages gambling-style strategies and favors sustainable, professional systems. **RegimeGuard is built with this philosophy at its core.**

---

## 💡 The Solution

RegimeGuard introduces a **risk-first trading architecture** where AI is used selectively and responsibly:

```typescript
interface TradingDecision {
  regime: "trending" | "range-bound" | "high-volatility";
  regimeConfidence: number; // AI-driven
  strategy: "trend-following" | "mean-reversion" | "no-trade"; // Rule-based
  riskControls: {
    positionSizeMultiplier: number; // AI-adjusted
    stopLossDistance: number; // AI-tightened
    tradeFrequency: "normal" | "reduced" | "paused"; // AI-controlled
  };
  explanation: string; // Full transparency
}
```

### Core Principles

- ✅ **AI does NOT decide trade direction** — No speculative price prediction
- ✅ **AI controls exposure** — Dynamic position sizing, stop-loss logic, trade frequency
- ✅ **Market regimes determine strategy** — Transparent, rule-based execution
- ✅ **Volatility anomalies trigger protection** — Automatic capital preservation

This creates a system that:

- 📉 Trades less during unstable conditions
- 📈 Scales exposure only when conditions are favorable
- 🛡️ Preserves capital during market stress

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Data Layer"
        A[WEEX Market Data API]
        A --> B[Real-time Price Feed]
        A --> C[Volume & Volatility Data]
    end

    subgraph "AI Intelligence Layer"
        D[Market Regime Classifier]
        E[Risk Control AI Engine]
        F[Volatility Anomaly Guard]

        B --> D
        C --> D
        D --> E
        C --> F
        F --> E
    end

    subgraph "Strategy Layer"
        G{Regime Router}
        H[Trend Following Strategy]
        I[Mean Reversion Strategy]
        J[Capital Preservation Mode]

        D --> G
        G -->|Trending| H
        G -->|Range-Bound| I
        G -->|High Volatility| J
    end

    subgraph "Execution Layer"
        K[Position Sizing Calculator]
        L[Risk Parameter Adjuster]
        M[Order Execution Engine]
        N[WEEX Trading API]

        E --> K
        E --> L
        H --> M
        I --> M
        J --> M
        K --> M
        L --> M
        M --> N
    end

    subgraph "Monitoring & Transparency"
        O[Trade Logger]
        P[Performance Analytics]
        Q[Explainability Dashboard]

        M --> O
        O --> P
        E --> Q
        D --> Q
    end

    style D fill:#4CAF50
    style E fill:#4CAF50
    style F fill:#4CAF50
    style Q fill:#2196F3
```

### Architecture Layers

| Layer            | Component                | Responsibility                                       | AI-Driven?    |
| ---------------- | ------------------------ | ---------------------------------------------------- | ------------- |
| **Intelligence** | Market Regime Classifier | Identify market conditions (Trending/Range/Volatile) | ✅ Yes        |
| **Intelligence** | Risk Control Engine      | Adjust position size, stops, frequency               | ✅ Yes        |
| **Intelligence** | Volatility Guard         | Detect anomalies, trigger kill-switch                | ✅ Yes        |
| **Strategy**     | Regime Router            | Select execution strategy based on regime            | ❌ Rule-based |
| **Strategy**     | Trend Following          | EMA/VWAP-based directional trades                    | ❌ Rule-based |
| **Strategy**     | Mean Reversion           | Support/resistance bounce trades                     | ❌ Rule-based |
| **Execution**    | Position Sizing          | Calculate trade size from risk parameters            | ❌ Computed   |
| **Execution**    | Order Manager            | Execute trades via WEEX API                          | ❌ Automated  |

---

## 🧠 AI Components Deep Dive

### 1. Market Regime Classifier (AI Component #1)

**Purpose:** Identify the current market environment, not predict price direction.

**Regimes:**

- 📈 **Trending** — Persistent directional movement
- ↔️ **Range-Bound** — Oscillating between support/resistance
- ⚠️ **High Volatility** — Unstable, unpredictable conditions

**Inputs:**

- Price momentum indicators
- Volatility metrics (ATR, realized volatility)
- Volume behavior patterns
- Trend persistence signals

**AI Methods:**

- Unsupervised clustering (K-Means, DBSCAN)
- Hidden Markov Models (HMM)
- Probabilistic regime confidence scoring

**Output Example:**

```json
{
  "regime": "trending",
  "confidence": 0.72,
  "features": {
    "momentum": 0.85,
    "volatility": 0.42,
    "trendStrength": 0.68
  }
}
```

### 2. Risk Control AI Engine (Core Innovation)

**Purpose:** Dynamically adjust risk exposure based on market conditions and portfolio state.

**What It Controls:**

- ✅ Position size multiplier (0.0 - 1.0)
- ✅ Stop-loss distance (tighter in uncertainty)
- ✅ Trade frequency (cooldown periods)
- ✅ Temporary trade suspension

**What It NEVER Controls:**

- ❌ Buy/sell direction
- ❌ Signal generation
- ❌ Strategy selection

**Inputs:**

- Regime confidence score
- Volatility forecast
- Recent drawdown percentage
- Trade clustering frequency
- Asset-specific risk metrics

**Outputs:**

```json
{
  "positionSizeMultiplier": 0.35,
  "stopLossAdjustment": "tightened",
  "tradeCooldown": true,
  "explanation": "Reduced exposure due to low regime confidence (0.52) and elevated volatility"
}
```

### 3. Volatility & Anomaly Guard (AI Component #2)

**Purpose:** Capital preservation kill-switch for extreme market conditions.

**Monitors:**

- Sudden volatility expansions (>2σ)
- Abnormal price-volume divergence
- Flash crash patterns
- Liquidity evaporation signals

**Behavior:**

- 🚨 Reduces exposure aggressively (50-100%)
- 🛑 Prevents new trades during unstable periods
- 🔄 Auto-resumes when conditions normalize

---

## 🎮 Trading Scope

### Supported Assets

| Symbol         | Name     | Leverage | Strategy             |
| -------------- | -------- | -------- | -------------------- |
| `cmt_btcusdt`  | Bitcoin  | 1-20x    | Trend/Mean Reversion |
| `cmt_ethusdt`  | Ethereum | 1-20x    | Trend/Mean Reversion |
| `cmt_solusdt`  | Solana   | 1-20x    | Trend/Mean Reversion |
| `cmt_bnbusdt`  | BNB      | 1-20x    | Trend/Mean Reversion |
| `cmt_xrpusdt`  | XRP      | 1-20x    | Trend/Mean Reversion |
| `cmt_adausdt`  | Cardano  | 1-20x    | Trend/Mean Reversion |
| `cmt_dogeusdt` | Dogecoin | 1-20x    | Trend/Mean Reversion |
| `cmt_ltcusdt`  | Litecoin | 1-20x    | Trend/Mean Reversion |

### Risk Parameters

- **Max Leverage:** 20x (conservative usage, typically 2-5x)
- **Max Position Size:** 30% of portfolio per asset
- **Max Drawdown:** 15% (triggers emergency de-risking)
- **Daily Loss Limit:** 5% (pauses trading for 24h)

---

## 🛠️ Tech Stack

| Layer                | Technology                           | Purpose                                  |
| -------------------- | ------------------------------------ | ---------------------------------------- |
| **Frontend**         | Next.js 16, React 19, TypeScript     | Dashboard UI                             |
| **UI Components**    | shadcn/ui, Tailwind CSS 4            | Modern, accessible design                |
| **State Management** | Jotai (atoms)                        | Lightweight, atomic state                |
| **Data Fetching**    | React Query                          | Server state, caching, real-time updates |
| **AI/ML**            | TensorFlow.js, scikit-learn (Python) | Regime classification, risk models       |
| **Trading API**      | WEEX OpenAPI                         | Order execution, market data             |
| **Database**         | PostgreSQL (Supabase)                | Trade history, performance metrics       |
| **Monitoring**       | Grafana, Prometheus                  | Real-time system health                  |
| **Runtime**          | Bun                                  | Fast package management & execution      |

---

## 📁 Project Structure

```
regimeguard/
├── app/
│   ├── api/
│   │   ├── account/          # Account balance & positions
│   │   │   ├── route.ts      # GET: balance/positions, POST: risk evaluation
│   │   │   └── data/
│   │   │       └── route.ts  # Additional account data
│   │   ├── agents/           # Multi-agent system status
│   │   │   └── route.ts      # GET: orchestrator & agent states
│   │   ├── ailog/            # AI decision logging (WEEX AiLog)
│   │   │   └── route.ts      # POST: upload AI logs (regime/risk/trade/volatility)
│   │   ├── health/           # System health check
│   │   │   └── route.ts      # GET: server status & latency
│   │   ├── market/           # Market data & regime analysis
│   │   │   ├── route.ts      # GET: ticker, regime, indicators, signals
│   │   │   └── data/
│   │   │       └── route.ts  # Additional market data
│   │   └── trade/            # Trade execution & management
│   │       └── route.ts      # GET/POST/DELETE/PATCH: full trading operations
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   └── ui/                   # shadcn/ui components
│       ├── accordion.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       └── ... (30+ components)
├── docs/
│   └── RegimeGuard.txt       # Project documentation
├── hooks/
│   └── use-mobile.ts         # Mobile responsive hook
├── lib/
│   └── utils.ts              # Utility functions
├── public/
│   └── banner.jpeg           # Project banner
├── src/
│   ├── client/
│   │   ├── hooks/
│   │   │   ├── use-trading.ts  # Trading state hooks
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   └── providers.tsx   # React Query provider
│   │   └── state/
│   │       ├── atoms.ts        # Jotai atoms
│   │       └── index.ts
│   ├── server/
│   │   ├── agents/
│   │   │   ├── base-agent.ts        # Base agent class
│   │   │   ├── orchestrator.ts      # Multi-agent coordinator
│   │   │   ├── regime-agent.ts      # Regime classification agent
│   │   │   ├── risk-agent.ts        # Risk management agent
│   │   │   ├── strategy-agent.ts    # Strategy selection agent
│   │   │   ├── volatility-agent.ts  # Volatility monitoring agent
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   ├── env.ts           # Environment config
│   │   │   └── index.ts
│   │   └── services/
│   │       ├── regime-classifier.ts  # Market regime classification
│   │       ├── risk-engine.ts        # Risk control engine
│   │       ├── strategy-executor.ts  # Trade signal generation
│   │       ├── volatility-guard.ts   # Volatility anomaly detection
│   │       ├── weex-account.ts       # Account API wrapper
│   │       ├── weex-ailog.ts         # AI logging service
│   │       ├── weex-client.ts        # Core WEEX client
│   │       ├── weex-market.ts        # Market data API
│   │       └── weex-trade.ts         # Trading API wrapper
│   └── shared/
│       ├── constants/
│       │   ├── trading.ts       # Trading pairs & constants
│       │   └── index.ts
│       ├── schemas/
│       │   ├── trading.ts       # Zod schemas
│       │   └── index.ts
│       ├── types/
│       │   ├── agents.ts        # Agent type definitions
│       │   ├── trading.ts       # Trading type definitions
│       │   └── index.ts
│       └── utils/
│           ├── calculations.ts   # Math utilities
│           └── index.ts
├── components.json
├── env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- WEEX API credentials (provided after hackathon approval)
- Node.js 20+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/regimeguard.git
cd regimeguard

# Install dependencies
bun install

# Install shadcn/ui components
bunx shadcn@latest init
```

### Environment Variables

Create a `.env.local` file:

```env
# WEEX API Credentials (provided by WEEX after approval)
WEEX_API_KEY=your_api_key
WEEX_SECRET_KEY=your_secret_key
WEEX_PASSPHRASE=your_passphrase
WEEX_BASE_URL=https://api-contract.weex.com

# Database (for trade history & analytics)
DATABASE_URL=postgresql://user:password@localhost:5432/regimeguard

# AI Model Configuration
REGIME_MODEL_PATH=/models/regime-classifier
RISK_MODEL_PATH=/models/risk-engine

# Risk Limits
MAX_LEVERAGE=20
MAX_DRAWDOWN_PCT=15
DAILY_LOSS_LIMIT_PCT=5

# Monitoring (optional)
GRAFANA_API_KEY=xxx
SENTRY_DSN=xxx
```

### Development

```bash
# Start development server
bun run dev

# Run backtests
bun run backtest

# Run unit tests
bun test

# Build for production
bun run build
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## 📡 API Endpoints

### Health Check

| Method | Endpoint      | Description                         |
| ------ | ------------- | ----------------------------------- |
| `GET`  | `/api/health` | System health, server time, latency |

### Account Management

| Method | Endpoint            | Description                                   |
| ------ | ------------------- | --------------------------------------------- |
| `GET`  | `/api/account`      | Get USDT balance & open positions             |
| `POST` | `/api/account`      | Evaluate risk for a given regime & volatility |
| `GET`  | `/api/account/data` | Additional account data                       |

### Market Data & Analysis

| Method | Endpoint                         | Description                                           |
| ------ | -------------------------------- | ----------------------------------------------------- |
| `GET`  | `/api/market?symbol=cmt_btcusdt` | Ticker, regime, indicators, volatility, trade signals |
| `GET`  | `/api/market/data`               | Additional market data endpoints                      |

**Response includes:**

- Latest ticker (price, volume, 24h stats)
- Regime classification (trending/range-bound/high-volatility)
- Technical indicators (RSI, EMA, ATR, VWAP)
- Volatility guard status
- Trade signal recommendations
- Contract information

### Trading Operations

| Method   | Endpoint                               | Description                               |
| -------- | -------------------------------------- | ----------------------------------------- |
| `GET`    | `/api/trade?action=current`            | Get current open orders                   |
| `GET`    | `/api/trade?action=history`            | Get order history                         |
| `GET`    | `/api/trade?action=fills`              | Get order fills                           |
| `GET`    | `/api/trade?action=detail&orderId=xxx` | Get specific order details                |
| `GET`    | `/api/trade?action=planCurrent`        | Get current trigger orders                |
| `GET`    | `/api/trade?action=planHistory`        | Get trigger order history                 |
| `POST`   | `/api/trade?action=order`              | Place market/limit order (single)         |
| `POST`   | `/api/trade?action=batchOrder`         | Place batch orders                        |
| `POST`   | `/api/trade?action=openLong`           | Quick long position                       |
| `POST`   | `/api/trade?action=openShort`          | Quick short position                      |
| `POST`   | `/api/trade?action=triggerOrder`       | Place stop-loss/take-profit trigger order |
| `POST`   | `/api/trade?action=tpsl`               | Place TP/SL order                         |
| `DELETE` | `/api/trade?action=cancel&orderId=xxx` | Cancel specific order                     |
| `DELETE` | `/api/trade?action=batchCancel`        | Cancel multiple orders                    |
| `DELETE` | `/api/trade?action=cancelAll`          | Cancel all orders for a symbol            |
| `DELETE` | `/api/trade?action=triggerCancel`      | Cancel trigger order                      |
| `DELETE` | `/api/trade?action=closeLong`          | Close long position                       |
| `DELETE` | `/api/trade?action=closeShort`         | Close short position                      |
| `DELETE` | `/api/trade?action=closeAll`           | Close all positions                       |
| `PATCH`  | `/api/trade?action=modifyTpSl`         | Modify TP/SL order                        |

### Multi-Agent System

| Method | Endpoint      | Description                                |
| ------ | ------------- | ------------------------------------------ |
| `GET`  | `/api/agents` | Get orchestrator status & all agent states |

**Agent Types:**

- Regime Agent (market condition classification)
- Risk Agent (exposure management)
- Strategy Agent (trade signal generation)
- Volatility Agent (anomaly detection)

### AI Decision Logging

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| `POST` | `/api/ailog?type=regime`     | Log regime classification decision |
| `POST` | `/api/ailog?type=risk`       | Log risk management decision       |
| `POST` | `/api/ailog?type=trade`      | Log trade execution decision       |
| `POST` | `/api/ailog?type=volatility` | Log volatility guard action        |
| `POST` | `/api/ailog?type=custom`     | Log custom AI decision             |

**Note:** All AI logs are uploaded to WEEX's AiLog system for transparency and compliance.

---

## 🎬 Demo Scenario: BTC Trending Market

1. **Market Data Ingestion** — Fetch BTC price, volume, volatility
2. **Regime Classification** — AI identifies "Trending" regime (confidence: 0.78)
3. **Strategy Selection** — Trend-following strategy activated
4. **Risk Assessment** — AI approves 0.6x position size (moderate confidence)
5. **Order Execution** — Long BTC at $95,000, stop-loss at $93,500
6. **Monitoring** — Volatility spike detected → AI tightens stop to $94,000
7. **Outcome Logging** — Trade closed at $96,200 (+1.26% profit)
8. **Explainability** — "Trade executed under trending regime (78% confidence). Exposure reduced mid-trade due to volatility expansion."

---

## 🔗 Why This Fits WEEX Perfectly

> "WEEX explicitly discourages gambling-style strategies and favors sustainable, professional systems."

RegimeGuard aligns with WEEX's philosophy:

- ✅ **Anti-Gambling** — No speculative AI price prediction
- ✅ **Risk-Adjusted Performance** — Sharpe ratio > raw returns
- ✅ **Institutional Grade** — Suitable for WEEX AI Strategy Fund
- ✅ **Transparent** — Every trade is explainable
- ✅ **Scalable** — Works across all WEEX trading pairs
- ✅ **Adaptive** — Survives regime changes and volatility spikes

---

## 📊 Project Status

| Component                 | Status      |
| ------------------------- | ----------- |
| WEEX API Integration      | ✅ Complete |
| Market Regime Classifier  | ✅ Complete |
| Risk Control Engine       | ✅ Complete |
| Volatility Guard          | ✅ Complete |
| **Multi-Agent AI System** | ✅ Complete |
| Trend Following Strategy  | ✅ Complete |
| Mean Reversion Strategy   | 📋 Planned  |
| Dashboard UI              | ✅ Complete |
| Backtesting Framework     | 📋 Planned  |
| Documentation             | ✅ Complete |

---

## 🗺️ Roadmap

### Phase 1: Hackathon MVP (Current)

- ✅ WEEX API integration
- 🔄 Basic regime classification (trending/range/volatile)
- 🔄 Simple risk controls (position sizing, stop-loss)
- 🔄 Dashboard with real-time monitoring

### Phase 2: Advanced AI (Post-Hackathon)

- 📋 Deep learning regime classifier (LSTM/Transformer)
- 📋 Reinforcement learning for risk optimization
- 📋 Multi-asset correlation analysis
- 📋 Sentiment analysis integration

### Phase 3: Production Deployment

- 📋 WEEX AI Strategy Fund integration
- 📋 Multi-account management
- 📋 Advanced backtesting with Monte Carlo
- 📋 Institutional-grade reporting

### Phase 4: Ecosystem Expansion

- 📋 Open-source strategy marketplace
- 📋 Community-contributed regime models
- 📋 Cross-exchange support (Binance, Bybit)

---

## 🏆 Competition Compliance

### WEEX AI Wars Rules

- ✅ **Trading Pairs:** Only approved pairs (cmt_btcusdt, etc.)
- ✅ **Leverage:** Max 20x (we use 2-5x typically)
- ✅ **Automation:** Semi-automated (AI + rules, not manual)
- ✅ **Fair Play:** No wash trading, no market manipulation
- ✅ **Transparency:** Open-source, explainable decisions

### API Testing Checklist

- [x] Account balance retrieval
- [x] Asset price fetching
- [x] Leverage adjustment
- [x] Order placement (~10 USDT test trade)
- [x] Trade history retrieval

---

## 👥 Team

- **Santhosh Kumar** — Full-Stack Developer, AI/ML Engineer
- **Vairamuthu M**- Full-Stack Developer, Blockchain Engineer

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- **WEEX** — For hosting the AI Wars hackathon
- **Open-Source Community** — TensorFlow.js, React Query, shadcn/ui

---

## 📞 Contact & Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/vmmuthu31/RegimeGuard/issues)
- **Telegram:** [Join WEEX AI Wars support group](https://t.me/weex_support)
- **Email:** mvairamuthu2003@gmail.com

---

**Built for WEEX AI Wars: Alpha Awakens** 🚀

> "In trading, survival is the first step to success. RegimeGuard ensures you survive to trade another day."
