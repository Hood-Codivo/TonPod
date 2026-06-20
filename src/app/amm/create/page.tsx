"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAmmProgram } from "@/lib/programs";
import { getAmmConfigPda, getPoolPda } from "@/lib/pda";

export default function CreatePoolPage() {
  const { connected, publicKey } = useWallet();
  const program = useAmmProgram();
  const router = useRouter();

  const [mintA, setMintA] = useState("");
  const [mintB, setMintB] = useState("");
  const [tradeFeeBps, setTradeFeeBps] = useState("30");
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    if (!program || !publicKey) return;
    setStatus("Submitting...");
    try {
      const mintAPk = new PublicKey(mintA);
      const mintBPk = new PublicKey(mintB);
      const [config] = getAmmConfigPda();
      const [pool] = getPoolPda(mintAPk, mintBPk);
      const vaultA = Keypair.generate();
      const vaultB = Keypair.generate();
      const lpMint = Keypair.generate();

      const sig = await program.methods
        .createPool(Number(tradeFeeBps))
        .accounts({
          payer: publicKey,
          config,
          mintA: mintAPk,
          mintB: mintBPk,
          vaultA: vaultA.publicKey,
          vaultB: vaultB.publicKey,
          lpMint: lpMint.publicKey,
        })
        .signers([vaultA, vaultB, lpMint])
        .rpc();

      setStatus(`Done: ${sig}`);
      router.push(`/amm/${pool.toBase58()}`);
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`);
    }
  }

  if (!connected) {
    return <p className="text-zinc-600 dark:text-zinc-400">Connect a wallet to create a pool.</p>;
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Create pool</h1>
      <p className="text-xs text-zinc-500">
        Both mints must already exist. The AMM config must be initialized first
        (see Admin).
      </p>
      <Field label="Mint A address" value={mintA} onChange={setMintA} />
      <Field label="Mint B address" value={mintB} onChange={setMintB} />
      <Field label="Trade fee (bps)" value={tradeFeeBps} onChange={setTradeFeeBps} />
      <button
        onClick={submit}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Create
      </button>
      {status && <p className="break-all text-xs text-zinc-500">{status}</p>}
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
