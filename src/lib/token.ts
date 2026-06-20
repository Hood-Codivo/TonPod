import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";

export function ata(mint: PublicKey, owner: PublicKey) {
  return getAssociatedTokenAddressSync(mint, owner);
}

// Returns a `createAssociatedTokenAccountInstruction` to prepend to a
// transaction when the owner's ATA for `mint` does not exist yet, else null.
export async function ensureAtaIx(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey
): Promise<TransactionInstruction | null> {
  const address = ata(mint, owner);
  const info = await connection.getAccountInfo(address);
  if (info) return null;
  return createAssociatedTokenAccountInstruction(payer, address, owner, mint);
}

export async function fetchDecimals(connection: Connection, mint: PublicKey) {
  const info = await getMint(connection, mint);
  return info.decimals;
}

export function formatTokenAmount(amount: bigint | number, decimals: number) {
  const value = Number(amount) / 10 ** decimals;
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function toRawAmount(value: string, decimals: number): bigint {
  const [whole, frac = ""] = value.trim().split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const wholeDigits = whole === "" ? "0" : whole;
  return BigInt(wholeDigits + fracPadded || "0");
}
