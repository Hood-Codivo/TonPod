import { Connection, PublicKey } from "@solana/web3.js";
import { EventParser, Program, type Idl } from "@coral-xyz/anchor";

export type PricePoint = {
  time: number;
  price: number;
  side: "buy" | "sell";
};

const PRICE_SCALE = 1_000_000_000;

// Reconstructs a price history by scanning an account's transaction history
// for the program's trade/swap events and decoding the price recorded at
// each one. There's no off-chain indexer here, so this re-fetches and
// re-parses every call — fine for a single curve/pool's recent activity,
// not meant to scale to high-volume accounts.
export async function fetchPriceHistory<IDL extends Idl>(
  connection: Connection,
  program: Program<IDL>,
  account: PublicKey,
  eventName: "tradeEvent" | "swapEvent",
  tokenDecimals: number,
  quoteDecimals: number,
  limit = 100
): Promise<PricePoint[]> {
  const signatures = await connection.getSignaturesForAddress(account, { limit });
  const parser = new EventParser(program.programId, program.coder);
  const decimalsAdjust = 10 ** (tokenDecimals - quoteDecimals);
  const points: PricePoint[] = [];

  for (const sigInfo of signatures) {
    if (sigInfo.err) continue;
    const tx = await connection.getTransaction(sigInfo.signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    const logs = tx?.meta?.logMessages;
    if (!logs) continue;

    for (const event of parser.parseLogs(logs)) {
      if (event.name !== eventName) continue;
      const data = event.data as Record<string, { toString(): string } | boolean>;
      const priceScaled = BigInt((data.priceScaled as { toString(): string }).toString());
      const price = (Number(priceScaled) / PRICE_SCALE) * decimalsAdjust;
      const time = Number((data.timestamp as { toString(): string }).toString());
      const side: "buy" | "sell" =
        eventName === "tradeEvent" ? (data.isBuy ? "buy" : "sell") : (data.aToB ? "sell" : "buy");
      points.push({ time, price, side });
    }
  }

  return points.reverse();
}
