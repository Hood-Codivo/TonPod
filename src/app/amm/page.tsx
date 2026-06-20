"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useAmmProgram } from "@/lib/programs";

type PoolRow = {
  address: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  reserveA: bigint;
  reserveB: bigint;
  tradeFeeBps: number;
  locked: boolean;
};

export default function AmmPage() {
  const program = useAmmProgram();
  const [pools, setPools] = useState<PoolRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!program) return;
    let cancelled = false;
    program.account.pool
      .all()
      .then((accounts) => {
        if (cancelled) return;
        setPools(
          accounts.map(({ publicKey, account }) => ({
            address: publicKey,
            mintA: account.mintA,
            mintB: account.mintB,
            reserveA: BigInt(account.reserveA.toString()),
            reserveB: BigInt(account.reserveB.toString()),
            tradeFeeBps: account.tradeFeeBps,
            locked: account.locked,
          }))
        );
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [program]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AMM Pools</h1>
        <Link
          href="/amm/create"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Create pool
        </Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!pools && !error && <p className="text-sm text-zinc-500">Loading pools...</p>}
      {pools && pools.length === 0 && <p className="text-sm text-zinc-500">No pools yet.</p>}

      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {pools?.map((pool) => (
          <Link
            key={pool.address.toBase58()}
            href={`/amm/${pool.address.toBase58()}`}
            className="flex items-center justify-between py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div>
              <p className="font-mono text-xs">{pool.mintA.toBase58()}</p>
              <p className="font-mono text-xs text-zinc-500">{pool.mintB.toBase58()}</p>
            </div>
            <div className="text-right text-xs text-zinc-500">
              <p>
                {pool.reserveA.toLocaleString()} / {pool.reserveB.toLocaleString()}
              </p>
              <p>{pool.locked ? "Locked" : `${pool.tradeFeeBps} bps`}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
