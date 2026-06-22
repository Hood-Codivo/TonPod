"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAmmProgram } from "@/lib/programs";
import { ata, ensureAtaIx, fetchDecimals, formatTokenAmount } from "@/lib/token";
import { fetchPriceHistory, type PricePoint } from "@/lib/priceHistory";
import { PriceChart } from "@/components/PriceChart";

type Pool = {
  mintA: PublicKey;
  mintB: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;
  lpMint: PublicKey;
  reserveA: BN;
  reserveB: BN;
  tradeFeeBps: number;
  protocolFeeBps: number;
  locked: boolean;
};

export default function PoolDetailPage() {
  const params = useParams<{ pool: string }>();
  const poolPk = useMemo(() => new PublicKey(params.pool), [params.pool]);
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const program = useAmmProgram();

  const [pool, setPool] = useState<Pool | null>(null);
  const [decimals, setDecimals] = useState({ a: 0, b: 0 });
  const [error, setError] = useState<string | null>(null);
  const [pricePoints, setPricePoints] = useState<PricePoint[]>([]);
  const [priceLoading, setPriceLoading] = useState(false);

  const [initAmountA, setInitAmountA] = useState("");
  const [initAmountB, setInitAmountB] = useState("");
  const [initMinLp, setInitMinLp] = useState("0");
  const [initStatus, setInitStatus] = useState<string | null>(null);

  const [addAmountA, setAddAmountA] = useState("");
  const [addAmountB, setAddAmountB] = useState("");
  const [addMinA, setAddMinA] = useState("0");
  const [addMinB, setAddMinB] = useState("0");
  const [addStatus, setAddStatus] = useState<string | null>(null);

  const [removeLp, setRemoveLp] = useState("");
  const [removeMinA, setRemoveMinA] = useState("0");
  const [removeMinB, setRemoveMinB] = useState("0");
  const [removeStatus, setRemoveStatus] = useState<string | null>(null);

  const [swapDirection, setSwapDirection] = useState<"aToB" | "bToA">("aToB");
  const [swapAmountIn, setSwapAmountIn] = useState("");
  const [swapMinOut, setSwapMinOut] = useState("0");
  const [swapStatus, setSwapStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!program) return;
    try {
      const account = await program.account.pool.fetch(poolPk);
      setPool(account as unknown as Pool);
      const [decA, decB] = await Promise.all([
        fetchDecimals(connection, account.mintA as PublicKey),
        fetchDecimals(connection, account.mintB as PublicKey),
      ]);
      setDecimals({ a: decA, b: decB });

      setPriceLoading(true);
      fetchPriceHistory(connection, program, poolPk, "swapEvent", decA, decB)
        .then(setPricePoints)
        .catch((err) => console.error("price history fetch failed", err))
        .finally(() => setPriceLoading(false));
    } catch (err) {
      setError((err as Error).message);
    }
  }, [program, connection, poolPk]);

  useEffect(() => {
    load();
  }, [load]);

  function baseAccounts() {
    if (!pool || !publicKey) return null;
    return {
      pool: poolPk,
      depositorTokenA: ata(pool.mintA, publicKey),
      depositorTokenB: ata(pool.mintB, publicKey),
      depositorLp: ata(pool.lpMint, publicKey),
    };
  }

  async function ataPreIx(mints: PublicKey[]) {
    if (!publicKey) return [];
    const ixs = await Promise.all(
      mints.map((mint) => ensureAtaIx(connection, publicKey, mint, publicKey))
    );
    return ixs.filter((ix): ix is NonNullable<typeof ix> => ix !== null);
  }

  async function handleInitLiquidity() {
    if (!program || !publicKey || !pool) return;
    setInitStatus("Submitting...");
    try {
      const accounts = baseAccounts();
      if (!accounts) return;
      const preIx = await ataPreIx([pool.mintA, pool.mintB, pool.lpMint]);
      const sig = await program.methods
        .initializePoolLiquidity(new BN(initAmountA), new BN(initAmountB), new BN(initMinLp))
        .accounts({ depositor: publicKey, ...accounts })
        .preInstructions(preIx)
        .rpc();
      setInitStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setInitStatus(`Error: ${(err as Error).message}`);
    }
  }

  async function handleAddLiquidity() {
    if (!program || !publicKey || !pool) return;
    setAddStatus("Submitting...");
    try {
      const accounts = baseAccounts();
      if (!accounts) return;
      const preIx = await ataPreIx([pool.mintA, pool.mintB, pool.lpMint]);
      const sig = await program.methods
        .addLiquidity(new BN(addAmountA), new BN(addAmountB), new BN(addMinA), new BN(addMinB))
        .accounts({ depositor: publicKey, ...accounts })
        .preInstructions(preIx)
        .rpc();
      setAddStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setAddStatus(`Error: ${(err as Error).message}`);
    }
  }

  async function handleRemoveLiquidity() {
    if (!program || !publicKey || !pool) return;
    setRemoveStatus("Submitting...");
    try {
      const accounts = baseAccounts();
      if (!accounts) return;
      const preIx = await ataPreIx([pool.mintA, pool.mintB]);
      const sig = await program.methods
        .removeLiquidity(new BN(removeLp), new BN(removeMinA), new BN(removeMinB))
        .accounts({ depositor: publicKey, ...accounts })
        .preInstructions(preIx)
        .rpc();
      setRemoveStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setRemoveStatus(`Error: ${(err as Error).message}`);
    }
  }

  async function handleSwap() {
    if (!program || !publicKey || !pool) return;
    setSwapStatus("Submitting...");
    try {
      const inputMint = swapDirection === "aToB" ? pool.mintA : pool.mintB;
      const outputMint = swapDirection === "aToB" ? pool.mintB : pool.mintA;
      const userInput = ata(inputMint, publicKey);
      const userOutput = ata(outputMint, publicKey);
      const preIx = await ataPreIx([inputMint, outputMint]);

      const sig = await program.methods
        .swapExactIn(new BN(swapAmountIn), new BN(swapMinOut))
        .accounts({
          user: publicKey,
          pool: poolPk,
          userInput,
          userOutput,
        })
        .preInstructions(preIx)
        .rpc();
      setSwapStatus(`Done: ${sig}`);
      load();
    } catch (err) {
      setSwapStatus(`Error: ${(err as Error).message}`);
    }
  }

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!pool) return <p className="text-sm text-zinc-500">Loading pool...</p>;

  const hasLiquidity = pool.reserveA.gtn(0) || pool.reserveB.gtn(0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Pool</h1>
        <p className="break-all font-mono text-xs text-zinc-500">{poolPk.toBase58()}</p>
      </div>

      <div className="grid gap-4 rounded-xl border border-zinc-200 p-6 text-sm dark:border-zinc-800 sm:grid-cols-2">
        <Stat label="Mint A" value={pool.mintA.toBase58()} mono />
        <Stat label="Mint B" value={pool.mintB.toBase58()} mono />
        <Stat label="Reserve A" value={formatTokenAmount(BigInt(pool.reserveA.toString()), decimals.a)} />
        <Stat label="Reserve B" value={formatTokenAmount(BigInt(pool.reserveB.toString()), decimals.b)} />
        <Stat label="Trade fee" value={`${pool.tradeFeeBps} bps`} />
        <Stat label="Locked" value={pool.locked ? "Yes" : "No"} />
      </div>

      <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-3 text-lg font-medium">Price (A in B)</h2>
        <PriceChart points={pricePoints} loading={priceLoading} />
      </div>

      {!connected && <p className="text-sm text-zinc-500">Connect a wallet to interact with this pool.</p>}

      {connected && !hasLiquidity && (
        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">Initialize liquidity</h2>
          <Field label="Amount A (raw)" value={initAmountA} onChange={setInitAmountA} />
          <Field label="Amount B (raw)" value={initAmountB} onChange={setInitAmountB} />
          <Field label="Minimum LP out (raw)" value={initMinLp} onChange={setInitMinLp} />
          <button onClick={handleInitLiquidity} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
            Initialize liquidity
          </button>
          {initStatus && <p className="break-all text-xs text-zinc-500">{initStatus}</p>}
        </section>
      )}

      {connected && hasLiquidity && (
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium">Add liquidity</h2>
            <Field label="Amount A desired (raw)" value={addAmountA} onChange={setAddAmountA} />
            <Field label="Amount B desired (raw)" value={addAmountB} onChange={setAddAmountB} />
            <Field label="Amount A min (raw)" value={addMinA} onChange={setAddMinA} />
            <Field label="Amount B min (raw)" value={addMinB} onChange={setAddMinB} />
            <button onClick={handleAddLiquidity} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
              Add liquidity
            </button>
            {addStatus && <p className="break-all text-xs text-zinc-500">{addStatus}</p>}
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium">Remove liquidity</h2>
            <Field label="LP amount (raw)" value={removeLp} onChange={setRemoveLp} />
            <Field label="Amount A min (raw)" value={removeMinA} onChange={setRemoveMinA} />
            <Field label="Amount B min (raw)" value={removeMinB} onChange={setRemoveMinB} />
            <button onClick={handleRemoveLiquidity} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
              Remove liquidity
            </button>
            {removeStatus && <p className="break-all text-xs text-zinc-500">{removeStatus}</p>}
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800 sm:col-span-2">
            <h2 className="text-lg font-medium">Swap</h2>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Direction</span>
              <select
                className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
                value={swapDirection}
                onChange={(e) => setSwapDirection(e.target.value as "aToB" | "bToA")}
              >
                <option value="aToB">Mint A → Mint B</option>
                <option value="bToA">Mint B → Mint A</option>
              </select>
            </label>
            <Field label="Amount in (raw)" value={swapAmountIn} onChange={setSwapAmountIn} />
            <Field label="Minimum amount out (raw)" value={swapMinOut} onChange={setSwapMinOut} />
            <button onClick={handleSwap} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
              Swap
            </button>
            {swapStatus && <p className="break-all text-xs text-zinc-500">{swapStatus}</p>}
          </section>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-zinc-500">{label}</p>
      <p className={mono ? "break-all font-mono text-xs" : "font-mono"}>{value}</p>
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
