"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { NATIVE_MINT, createCloseAccountInstruction, createSyncNativeInstruction } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAmmProgram, useLaunchpadProgram } from "@/lib/programs";
import { getAmmConfigPda, getCurvePda, getGlobalConfigPda, getPoolPda } from "@/lib/pda";
import { ata, ensureAtaIx, fetchDecimals, formatTokenAmount, getTokenBalance } from "@/lib/token";

type Curve = {
  creator: PublicKey;
  mint: PublicKey;
  quoteMint: PublicKey;
  tokenVault: PublicKey;
  quoteVault: PublicKey;
  realTokenReserves: BN;
  realQuoteReserves: BN;
  virtualTokenReserves: BN;
  virtualQuoteReserves: BN;
  totalSupply: BN;
  tokensSold: BN;
  migrated: boolean;
  migrating: boolean;
  paused: boolean;
};

export default function CurveDetailPage() {
  const params = useParams<{ mint: string }>();
  const mintPk = useMemo(() => new PublicKey(params.mint), [params.mint]);
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const program = useLaunchpadProgram();
  const ammProgram = useAmmProgram();

  const [curve, setCurve] = useState<Curve | null>(null);
  const [feeRecipient, setFeeRecipient] = useState<PublicKey | null>(null);
  const [decimals, setDecimals] = useState({ token: 0, quote: 0 });
  const [error, setError] = useState<string | null>(null);

  const [quoteAmountIn, setQuoteAmountIn] = useState("");
  const [minTokenOut, setMinTokenOut] = useState("0");
  const [tokenAmountIn, setTokenAmountIn] = useState("");
  const [minQuoteOut, setMinQuoteOut] = useState("0");
  const [status, setStatus] = useState<string | null>(null);
  const [migrateStatus, setMigrateStatus] = useState<string | null>(null);
  const [finalizeStatus, setFinalizeStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!program) return;
    try {
      const [curvePda] = getCurvePda(mintPk);
      const account = await program.account.bondingCurve.fetch(curvePda);
      setCurve(account as unknown as Curve);
      const [configPda] = getGlobalConfigPda();
      const config = await program.account.globalConfig.fetch(configPda);
      setFeeRecipient(config.feeRecipient as PublicKey);
      const [tokenDecimals, quoteDecimals] = await Promise.all([
        fetchDecimals(connection, account.mint as PublicKey),
        fetchDecimals(connection, account.quoteMint as PublicKey),
      ]);
      setDecimals({ token: tokenDecimals, quote: quoteDecimals });
    } catch (err) {
      setError((err as Error).message);
    }
  }, [program, connection, mintPk]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleBuy() {
    if (!program || !publicKey || !curve || !feeRecipient) return;
    setStatus("Submitting...");
    try {
      const buyerTokenAccount = ata(curve.mint, publicKey);
      const buyerQuoteAccount = ata(curve.quoteMint, publicKey);
      const feeRecipientQuoteAccount = ata(curve.quoteMint, feeRecipient);
      const preIx = (
        await Promise.all([
          ensureAtaIx(connection, publicKey, curve.mint, publicKey),
          ensureAtaIx(connection, publicKey, curve.quoteMint, publicKey),
          ensureAtaIx(connection, publicKey, curve.quoteMint, feeRecipient),
        ])
      ).filter((ix): ix is NonNullable<typeof ix> => ix !== null);

      // Quote asset is wSOL: top up the buyer's wSOL ATA from their native
      // SOL balance in this same transaction, pump.fun-style, instead of
      // requiring a separate manual wrap step.
      let wrapped = false;
      if (curve.quoteMint.equals(NATIVE_MINT)) {
        const desired = BigInt(quoteAmountIn || "0");
        const balance = await getTokenBalance(connection, buyerQuoteAccount);
        if (balance < desired) {
          const shortfall = desired - balance;
          preIx.push(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: buyerQuoteAccount,
              lamports: Number(shortfall),
            }),
            createSyncNativeInstruction(buyerQuoteAccount)
          );
          wrapped = true;
        }
      }

      // `buy` debits exactly `quoteAmountIn` from buyerQuoteAccount, so when
      // we topped it up to exactly that amount, its balance lands back at 0
      // afterward — safe to close and reclaim the rent as native SOL, so the
      // wallet shows a plain SOL change instead of a lingering wSOL line.
      const postIx = wrapped
        ? [createCloseAccountInstruction(buyerQuoteAccount, publicKey, publicKey)]
        : [];

      const sig = await program.methods
        .buy(new BN(quoteAmountIn), new BN(minTokenOut))
        .accounts({
          buyer: publicKey,
          config: getGlobalConfigPda()[0],
          curve: getCurvePda(curve.mint)[0],
          buyerQuoteAccount,
          buyerTokenAccount,
          feeRecipientQuoteAccount,
        })
        .preInstructions(preIx)
        .postInstructions(postIx)
        .rpc();
      setStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`);
    }
  }

  async function handleSell() {
    if (!program || !publicKey || !curve || !feeRecipient) return;
    setStatus("Submitting...");
    try {
      const sellerTokenAccount = ata(curve.mint, publicKey);
      const sellerQuoteAccount = ata(curve.quoteMint, publicKey);
      const feeRecipientQuoteAccount = ata(curve.quoteMint, feeRecipient);
      const preIx = (
        await Promise.all([
          ensureAtaIx(connection, publicKey, curve.mint, publicKey),
          ensureAtaIx(connection, publicKey, curve.quoteMint, publicKey),
          ensureAtaIx(connection, publicKey, curve.quoteMint, feeRecipient),
        ])
      ).filter((ix): ix is NonNullable<typeof ix> => ix !== null);

      const sig = await program.methods
        .sell(new BN(tokenAmountIn), new BN(minQuoteOut))
        .accounts({
          seller: publicKey,
          config: getGlobalConfigPda()[0],
          curve: getCurvePda(curve.mint)[0],
          sellerTokenAccount,
          sellerQuoteAccount,
          feeRecipientQuoteAccount,
        })
        .preInstructions(preIx)
        .rpc();
      setStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`);
    }
  }

  async function handleMigrate() {
    if (!program || !publicKey || !curve) return;
    setMigrateStatus("Submitting...");
    try {
      const [config] = getGlobalConfigPda();
      const [ammConfig] = getAmmConfigPda();
      const [ammPool] = getPoolPda(curve.mint, curve.quoteMint);
      const ammVaultA = Keypair.generate();
      const ammVaultB = Keypair.generate();
      const ammLpMint = Keypair.generate();

      const sig = await program.methods
        .migrateToAmm()
        .accounts({
          migrationPayer: publicKey,
          config,
          curve: getCurvePda(curve.mint)[0],
          ammConfig,
          ammPool,
          ammVaultA: ammVaultA.publicKey,
          ammVaultB: ammVaultB.publicKey,
          ammLpMint: ammLpMint.publicKey,
        })
        .signers([ammVaultA, ammVaultB, ammLpMint])
        .rpc();
      setMigrateStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setMigrateStatus(`Error: ${(err as Error).message}`);
    }
  }

  async function handleFinalize() {
    if (!program || !ammProgram || !publicKey || !curve) return;
    setFinalizeStatus("Submitting...");
    try {
      const [ammPoolPda] = getPoolPda(curve.mint, curve.quoteMint);
      const pool = await ammProgram.account.pool.fetch(ammPoolPda);
      const lpDestination = Keypair.generate();

      const sig = await program.methods
        .finalizeMigration()
        .accounts({
          migrationPayer: publicKey,
          curve: getCurvePda(curve.mint)[0],
          ammPool: ammPoolPda,
          ammVaultA: pool.vaultA,
          ammVaultB: pool.vaultB,
          ammLpMint: pool.lpMint,
          lpDestination: lpDestination.publicKey,
        })
        .signers([lpDestination])
        .rpc();
      setFinalizeStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setFinalizeStatus(`Error: ${(err as Error).message}`);
    }
  }

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!curve) return <p className="text-sm text-zinc-500">Loading curve...</p>;

  const statusLabel = curve.migrated
    ? "Migrated"
    : curve.migrating
    ? "Migrating"
    : curve.paused
    ? "Paused"
    : "Active";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="break-all text-xl font-semibold">{curve.mint.toBase58()}</h1>
        <p className="text-sm text-zinc-500">Status: {statusLabel}</p>
      </div>

      <div className="grid gap-4 rounded-xl border border-zinc-200 p-6 text-sm dark:border-zinc-800 sm:grid-cols-2">
        <Stat label="Real token reserves" value={formatTokenAmount(BigInt(curve.realTokenReserves.toString()), decimals.token)} />
        <Stat label="Real quote reserves" value={formatTokenAmount(BigInt(curve.realQuoteReserves.toString()), decimals.quote)} />
        <Stat label="Tokens sold" value={formatTokenAmount(BigInt(curve.tokensSold.toString()), decimals.token)} />
        <Stat label="Total supply" value={formatTokenAmount(BigInt(curve.totalSupply.toString()), decimals.token)} />
      </div>

      {!connected && <p className="text-sm text-zinc-500">Connect a wallet to trade.</p>}

      {connected && !curve.migrated && !curve.migrating && (
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium">Buy</h2>
            <Field label="Quote amount in (raw)" value={quoteAmountIn} onChange={setQuoteAmountIn} />
            <Field label="Min token out (raw)" value={minTokenOut} onChange={setMinTokenOut} />
            <button onClick={handleBuy} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
              Buy
            </button>
          </section>
          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium">Sell</h2>
            <Field label="Token amount in (raw)" value={tokenAmountIn} onChange={setTokenAmountIn} />
            <Field label="Min quote out (raw)" value={minQuoteOut} onChange={setMinQuoteOut} />
            <button onClick={handleSell} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
              Sell
            </button>
          </section>
        </div>
      )}

      {status && <p className="break-all text-xs text-zinc-500">{status}</p>}

      {connected && (curve.migrating || (!curve.migrated && !curve.paused)) && (
        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">Migration to AMM</h2>
          <p className="text-xs text-zinc-500">
            Step 1 creates the AMM pool once the curve&apos;s market cap reaches the
            configured threshold. Step 2 seeds it with the curve&apos;s real reserves.
          </p>
          {!curve.migrating && (
            <>
              <button onClick={handleMigrate} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
                1. Start migration
              </button>
              {migrateStatus && <p className="break-all text-xs text-zinc-500">{migrateStatus}</p>}
            </>
          )}
          {curve.migrating && (
            <>
              <button onClick={handleFinalize} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
                2. Finalize migration
              </button>
              {finalizeStatus && <p className="break-all text-xs text-zinc-500">{finalizeStatus}</p>}
            </>
          )}
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-zinc-500">{label}</p>
      <p className="font-mono">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <input
        className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
