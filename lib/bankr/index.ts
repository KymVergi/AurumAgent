// ─────────────────────────────────────────────────────────────
// AURUM — Bankr / Wallet Adapter (Base chain)
// Lee el balance de la wallet del agente en Base via RPC público.
// No requiere API key para lectura — solo la dirección de la wallet.
// Bankr execution (trades, fees) se activa con BANKR_API_KEY.
// ─────────────────────────────────────────────────────────────

import type { TokenMetrics } from "@/types";
import { mockTokenMetrics } from "@/lib/mock-data";

const BANKR_API_KEY   = process.env.BANKR_API_KEY ?? "";
const AGENT_WALLET    = process.env.BANKR_AGENT_ADDRESS ?? "";
const TOKEN_CONTRACT  = process.env.AURUM_TOKEN_CONTRACT ?? "";

// Base mainnet — RPC público, sin key
const BASE_RPC = "https://mainnet.base.org";

// ─── ETH balance en Base ──────────────────────────────────────

export async function fetchWalletBalance(
  address?: string
): Promise<{ eth: number; usd: number } | null> {
  const wallet = address ?? AGENT_WALLET;
  if (!wallet) return null;

  try {
    // eth_getBalance devuelve wei en hex
    const res = await fetch(BASE_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [wallet, "latest"],
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const weiHex: string = data?.result ?? "0x0";
    const eth = parseInt(weiHex, 16) / 1e18;

    // ETH/USD via CoinGecko — sin key
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 300 } }
    );
    const priceData = await priceRes.json();
    const ethPrice: number = priceData?.ethereum?.usd ?? 0;

    return { eth, usd: eth * ethPrice };
  } catch {
    return null;
  }
}

// ─── ERC-20 token balance (AURUM token en Base) ───────────────
// Llama balanceOf(address) del contrato del token.

export async function fetchTokenBalance(
  walletAddress: string,
  contractAddress: string
): Promise<number | null> {
  if (!contractAddress) return null;

  try {
    // balanceOf(address) = keccak256 selector 0x70a08231 + address padded a 32 bytes
    const paddedWallet = walletAddress.replace("0x", "").padStart(64, "0");
    const data = `0x70a08231${paddedWallet}`;

    const res = await fetch(BASE_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to: contractAddress, data }, "latest"],
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const result = await res.json();
    const hex: string = result?.result ?? "0x0";
    // Asume 18 decimales — ajusta si el token usa otro valor
    const balance = parseInt(hex, 16) / 1e18;
    return balance;
  } catch {
    return null;
  }
}

// ─── Token metrics completas ──────────────────────────────────

export async function fetchTokenMetrics(
  agentAddress?: string
): Promise<TokenMetrics> {
  // Si hay Bankr API key → usa su API
  if (BANKR_API_KEY) {
    try {
      const wallet = agentAddress ?? AGENT_WALLET;
      const res = await fetch(
        `https://api.bankr.xyz/v1/agent/${wallet}/metrics`,
        {
          headers: { Authorization: `Bearer ${BANKR_API_KEY}` },
          next: { revalidate: 60 },
        }
      );
      if (res.ok) return await res.json();
    } catch {
      // fallthrough
    }
  }

  // Si solo hay wallet address → enriquece mock con balance real de Base
  if (AGENT_WALLET) {
    const balance = await fetchWalletBalance(AGENT_WALLET);
    if (balance) {
      return {
        ...mockTokenMetrics,
        treasuryBalance: balance.usd,
        recordedAt: new Date().toISOString(),
      };
    }
  }

  return mockTokenMetrics;
}

// ─── Execution stub (requiere Bankr key) ─────────────────────

export async function submitExecution(params: {
  action: "long" | "short" | "close";
  asset: string;
  sizePercent: number;
  reasoning: string;
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
  if (!BANKR_API_KEY) {
    return {
      success: false,
      error: "Bankr execution no activo — agrega BANKR_API_KEY para habilitar",
    };
  }
  // TODO: implementar llamada live a Bankr cuando esté disponible
  return { success: false, error: "Execution endpoint pendiente de configuración" };
}

// ─── Status helpers ───────────────────────────────────────────

export const bankrStatus = {
  live: !!BANKR_API_KEY,
  walletConnected: !!AGENT_WALLET,
  chain: "Base",
  rpc: BASE_RPC,
  message: BANKR_API_KEY
    ? "Bankr integration activa"
    : AGENT_WALLET
    ? "Wallet conectada (read-only en Base) — Bankr execution pendiente"
    : "Agrega BANKR_AGENT_ADDRESS al .env.local para ver el treasury real",
};
