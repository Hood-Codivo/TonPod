"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useLaunchpadProgram } from "@/lib/programs";

type CurveRow = {
  mint: PublicKey;
  creator: PublicKey;
  tokensSold: bigint;
  totalSupply: bigint;
  migrated: boolean;
  migrating: boolean;
  paused: boolean;
};

export default function LaunchpadPage() {
  const program = useLaunchpadProgram();
  const [curves, setCurves] = useState<CurveRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!program) return;
    let cancelled = false;
    program.account.bondingCurve
      .all()
      .then((accounts) => {
        if (cancelled) return;
        setCurves(
          accounts.map(({ account }) => ({
            mint: account.mint,
            creator: account.creator,
            tokensSold: BigInt(account.tokensSold.toString()),
            totalSupply: BigInt(account.totalSupply.toString()),
            migrated: account.migrated,
            migrating: account.migrating,
            paused: account.paused,
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
        <h1 className="text-2xl font-semibold">Launchpad</h1>
        <Link
          href="/launchpad/create"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Create launch
        </Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!curves && !error && <p className="text-sm text-zinc-500">Loading curves...</p>}
      {curves && curves.length === 0 && (
        <p className="text-sm text-zinc-500">No launches yet.</p>
      )}

      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {curves?.map((curve) => (
          <Link
            key={curve.mint.toBase58()}
            href={`/launchpad/${curve.mint.toBase58()}`}
            className="flex items-center justify-between py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div>
              <p className="font-mono text-sm">{curve.mint.toBase58()}</p>
              <p className="text-xs text-zinc-500">
                creator {curve.creator.toBase58().slice(0, 8)}...
              </p>
            </div>
            <div className="text-right text-xs text-zinc-500">
              <p>
                {curve.tokensSold.toLocaleString()} / {curve.totalSupply.toLocaleString()} sold
              </p>
              <p>
                {curve.migrated
                  ? "Migrated"
                  : curve.migrating
                  ? "Migrating"
                  : curve.paused
                  ? "Paused"
                  : "Active"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
