#!/usr/bin/env node

/**
 * RegimeGuard - Execute 50 Trades Script
 *
 * This script executes 50 trades for testing/demonstration.
 * Uses direct trade API (bypasses AI approval).
 *
 * WEEX Minimum Order Sizes:
 * - BTC: 0.0001 BTC (~$8.8 at $88k)
 * - ETH: 0.001 ETH (~$3 at $3k)
 *
 * Usage: npx tsx scripts/execute-50-trades.ts
 *
 * Make sure dev server is running: npm run dev
 */

const API_BASE = "http://localhost:3000";

// Minimum order sizes per asset
const MIN_SIZES: Record<string, string> = {
  cmt_btcusdt: "0.0001", // ~$8.8 at $88k
  cmt_ethusdt: "0.001", // ~$3 at $3k
};

interface TradeResult {
  success: boolean;
  tradeNum: number;
  action: "buy" | "sell";
  symbol: string;
  orderId?: string;
  error?: string;
}

async function executeTrade(
  tradeNum: number,
  action: "buy" | "sell",
  symbol: string
): Promise<TradeResult> {
  try {
    const size = MIN_SIZES[symbol] || "0.0001";

    const res = await fetch(`${API_BASE}/api/trade/direct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        symbol,
        size,
        isMarket: true,
      }),
    });

    const data = await res.json();

    if (data.success) {
      console.log(
        `✅ #${tradeNum.toString().padStart(2, "0")}: ${action
          .toUpperCase()
          .padEnd(4)} ${symbol
          .replace("cmt_", "")
          .replace("usdt", "")
          .toUpperCase()
          .padEnd(4)} (${size}) → Order: ${data.data?.orderId || "N/A"}`
      );
      return {
        success: true,
        tradeNum,
        action,
        symbol,
        orderId: data.data?.orderId,
      };
    } else {
      console.log(
        `❌ #${tradeNum.toString().padStart(2, "0")}: ${action
          .toUpperCase()
          .padEnd(4)} ${symbol
          .replace("cmt_", "")
          .replace("usdt", "")
          .toUpperCase()
          .padEnd(4)} → ${data.error?.slice(0, 60)}...`
      );
      return { success: false, tradeNum, action, symbol, error: data.error };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.log(`❌ #${tradeNum.toString().padStart(2, "0")}: Network error`);
    return { success: false, tradeNum, action, symbol, error: errorMsg };
  }
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("");
  console.log("🚀 RegimeGuard - Executing 50 Trades");
  console.log("=====================================");
  console.log("BTC: 0.0001 (~$8.8) | ETH: 0.001 (~$3)");
  console.log("Total: 50 trades (25 BUY + 25 SELL)");
  console.log("=====================================");
  console.log("");

  const symbols = ["cmt_btcusdt", "cmt_ethusdt"];
  const results: TradeResult[] = [];

  // Execute 50 trades alternating buy/sell and symbols
  for (let i = 1; i <= 50; i++) {
    const action: "buy" | "sell" = i % 2 === 1 ? "buy" : "sell";
    const symbol = symbols[(i - 1) % symbols.length];

    const result = await executeTrade(i, action, symbol);
    results.push(result);

    // 500ms delay between trades
    await delay(500);
  }

  console.log("");
  console.log("=====================================");
  console.log("📊 TRADE SUMMARY");
  console.log("=====================================");

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const buyCount = successful.filter((r) => r.action === "buy").length;
  const sellCount = successful.filter((r) => r.action === "sell").length;

  console.log(`✅ Successful: ${successful.length}`);
  console.log(`   - Buys:  ${buyCount}`);
  console.log(`   - Sells: ${sellCount}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📈 Total: ${results.length}`);
  console.log("");

  if (failed.length > 0 && failed.length < 50) {
    console.log("Some errors:");
    failed.slice(0, 3).forEach((f) => {
      console.log(`   #${f.tradeNum}: ${f.error?.slice(0, 80)}`);
    });
  }

  console.log("✨ Done! Check WEEX dashboard for positions.");
}

main().catch(console.error);
