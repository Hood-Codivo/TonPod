"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProvider, useLaunchpadProgram } from "@/lib/programs";
import { getGlobalConfigPda } from "@/lib/pda";
import { ata } from "@/lib/token";

export default function CreateLaunchPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const program = useLaunchpadProgram();
  const provider = useAnchorProvider();
  const router = useRouter();

  const [tokenDecimals, setTokenDecimals] = useState("6");
  const [tokenSupplyHuman, setTokenSupplyHuman] = useState("1000000000");
  const [createTokenStatus, setCreateTokenStatus] = useState<string | null>(null);

  const [mint, setMint] = useState("");
  const [quoteMint, setQuoteMint] = useState("");
  const [realTokenReserves, setRealTokenReserves] = useState("");
  const [virtualTokenReserves, setVirtualTokenReserves] = useState("");
  const [virtualQuoteReserves, setVirtualQuoteReserves] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleCreateToken() {
    if (!publicKey) return;
    setCreateTokenStatus("Submitting...");
    try {
      const decimals = Number(tokenDecimals);
      const supplyRaw = BigInt(tokenSupplyHuman) * BigInt(10) ** BigInt(decimals);
      const mintKeypair = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const recipientAta = ata(mintKeypair.publicKey, publicKey);

      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(mintKeypair.publicKey, decimals, publicKey, null),
        createAssociatedTokenAccountInstruction(publicKey, recipientAta, publicKey, mintKeypair.publicKey),
        createMintToInstruction(mintKeypair.publicKey, recipientAta, publicKey, supplyRaw)
      );

      const sig = await provider.sendAndConfirm(tx, [mintKeypair]);
      setCreateTokenStatus(`Done: ${sig}`);
      setMint(mintKeypair.publicKey.toBase58());
      setTotalSupply(supplyRaw.toString());
      setRealTokenReserves(((supplyRaw * BigInt(80)) / BigInt(100)).toString());
    } catch (err) {
      setCreateTokenStatus(`Error: ${(err as Error).message}`);
    }
  }

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
    <div className="flex max-w-xl flex-col gap-8">
      <h1 className="text-2xl font-semibold">Create launch</h1>

      <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">1. Create a token (optional)</h2>
        <p className="text-xs text-zinc-500">
          Don&apos;t have a mint yet? This creates one with your wallet as mint
          authority and mints the full supply to you, then fills in the fields
          below.
        </p>
        <Field label="Decimals" value={tokenDecimals} onChange={setTokenDecimals} />
        <Field label="Total supply (human units)" value={tokenSupplyHuman} onChange={setTokenSupplyHuman} />
        <button
          onClick={handleCreateToken}
          className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Create token
        </button>
        {createTokenStatus && <p className="break-all text-xs text-zinc-500">{createTokenStatus}</p>}
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">2. Create the launch</h2>
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
      </section>
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
