import { Connection, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import {
  NATIVE_MINT,
  TokenAccountNotFoundError,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  getAccount,
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

export async function fetchMintSupply(connection: Connection, mint: PublicKey): Promise<bigint> {
  const info = await getMint(connection, mint);
  return info.supply;
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

// Like ensureAtaIx, but for several (mint, owner) pairs at once, deduplicated
// by the resulting ATA address. Without this, two different "roles" (e.g.
// buyer and fee recipient) that happen to resolve to the same address would
// each queue their own Create instruction, and the second one fails since
// the first already created it.
export async function ensureAtaIxBatch(
  connection: Connection,
  payer: PublicKey,
  targets: { mint: PublicKey; owner: PublicKey }[]
): Promise<TransactionInstruction[]> {
  const unique = new Map<string, { mint: PublicKey; owner: PublicKey }>();
  for (const target of targets) {
    unique.set(ata(target.mint, target.owner).toBase58(), target);
  }
  const ixs = await Promise.all(
    Array.from(unique.values()).map(({ mint, owner }) => ensureAtaIx(connection, payer, mint, owner))
  );
  return ixs.filter((ix): ix is NonNullable<typeof ix> => ix !== null);
}

// If `mint` is wrapped SOL, returns a closeAccount instruction that unwraps
// whatever's left in `address` back into the owner's native SOL balance —
// so users only ever end up holding plain SOL, never a leftover wSOL
// account, regardless of which side of an action touched it.
export function closeIfNativeIx(
  mint: PublicKey,
  address: PublicKey,
  owner: PublicKey
): TransactionInstruction[] {
  if (!mint.equals(NATIVE_MINT)) return [];
  return [createCloseAccountInstruction(address, owner, owner)];
}

// If `mint` is wrapped SOL and `address` doesn't already hold at least
// `desired`, returns instructions that top it up from the owner's native
// SOL balance — the same auto-wrap bundling used for Buy, generalized for
// any action that needs a wSOL ATA pre-funded before it runs.
export async function wrapShortfallIx(
  connection: Connection,
  owner: PublicKey,
  mint: PublicKey,
  address: PublicKey,
  desired: bigint
): Promise<TransactionInstruction[]> {
  if (!mint.equals(NATIVE_MINT) || desired <= BigInt(0)) return [];
  const balance = await getTokenBalance(connection, address);
  if (balance >= desired) return [];
  const shortfall = desired - balance;
  return [
    SystemProgram.transfer({ fromPubkey: owner, toPubkey: address, lamports: Number(shortfall) }),
    createSyncNativeInstruction(address),
  ];
}

export async function getTokenBalance(connection: Connection, address: PublicKey): Promise<bigint> {
  try {
    const account = await getAccount(connection, address);
    return account.amount;
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) return BigInt(0);
    throw err;
  }
}
