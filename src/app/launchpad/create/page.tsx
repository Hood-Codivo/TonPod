"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLaunchpadProgram } from "@/lib/programs";
import { getGlobalConfigPda } from "@/lib/pda";
import { ata } from "@/lib/token";

export default function CreateLaunchPage() {
  const { connected, publicKey } = useWallet();
  const program = useLaunchpadProgram();
  const router = useRouter();

  const [mint, setMint] = useState("");
  const [quoteMint, setQuoteMint] = useState("");
  const [realTokenReserves, setRealTokenReserves] = useState("");
  const [virtualTokenReserves, setVirtualTokenReserves] = useState("");
  const [virtualQuoteReserves, setVirtualQuoteReserves] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    if (!program || !publicKey) return;
    setStatus("Submitting...");
    try {
      const mintPk = new PublicKey(mint);
      const quoteMintPk = new PublicKey(quoteMint);
      const [config] = getGlobalConfigPda();
      const tokenVault = Keypair.generate();
      const quoteVault = Keypair.generate();

      const sig = await program.methods
        .createLaunch(
          new BN(realTokenReserves),
          new BN(virtualTokenReserves),
          new BN(virtualQuoteReserves),
          new BN(totalSupply)
        )
        .accounts({
          creator: publicKey,
          config,
          mint: mintPk,
          quoteMint: quoteMintPk,
          creatorTokenAccount: ata(mintPk, publicKey),
          tokenVault: tokenVault.publicKey,
          quoteVault: quoteVault.publicKey,
        })
        .signers([tokenVault, quoteVault])
        .rpc();

      setStatus(`Done: ${sig}`);
      router.push(`/launchpad/${mintPk.toBase58()}`);
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`);
    }
  }

  if (!connected) {
    return <p className="text-zinc-600 dark:text-zinc-400">Connect a wallet to create a launch.</p>;
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Create launch</h1>
      <p className="text-xs text-zinc-500">
        The mint and quote mint must already exist, and your wallet must hold at
        least <code>real_token_reserves</code> of the mint before submitting.
      </p>
      <Field label="Mint address" value={mint} onChange={setMint} />
      <Field label="Quote mint address" value={quoteMint} onChange={setQuoteMint} />
      <Field
        label="Real token reserves (raw base units)"
        value={realTokenReserves}
        onChange={setRealTokenReserves}
      />
      <Field
        label="Virtual token reserves (raw)"
        value={virtualTokenReserves}
        onChange={setVirtualTokenReserves}
      />
      <Field
        label="Virtual quote reserves (raw)"
        value={virtualQuoteReserves}
        onChange={setVirtualQuoteReserves}
      />
      <Field
        label="Total supply (raw base units)"
        value={totalSupply}
        onChange={setTotalSupply}
      />
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
