"use client";

import { useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAmmProgram, useLaunchpadProgram } from "@/lib/programs";

export default function AdminPage() {
  const { connected, publicKey } = useWallet();
  const ammProgram = useAmmProgram();
  const launchpadProgram = useLaunchpadProgram();

  const [ammFeeRecipient, setAmmFeeRecipient] = useState("");
  const [tradeFeeBps, setTradeFeeBps] = useState("30");
  const [protocolFeeBps, setProtocolFeeBps] = useState("5");
  const [ammStatus, setAmmStatus] = useState<string | null>(null);

  const [lpFeeRecipient, setLpFeeRecipient] = useState("");
  const [platformFeeBps, setPlatformFeeBps] = useState("100");
  const [migrationFeeBps, setMigrationFeeBps] = useState("100");
  const [migrationMarketCap, setMigrationMarketCap] = useState("1000000000000");
  const [lpStatus, setLpStatus] = useState<string | null>(null);

  async function initAmmConfig() {
    if (!ammProgram || !publicKey) return;
    setAmmStatus("Submitting...");
    try {
      const sig = await ammProgram.methods
        .initializeAmmConfig(Number(tradeFeeBps), Number(protocolFeeBps))
        .accounts({
          admin: publicKey,
          feeRecipient: new PublicKey(ammFeeRecipient),
        })
        .rpc();
      setAmmStatus(`Done: ${sig}`);
    } catch (err) {
      setAmmStatus(`Error: ${(err as Error).message}`);
    }
  }

  async function initGlobalConfig() {
    if (!launchpadProgram || !publicKey) return;
    setLpStatus("Submitting...");
    try {
      const sig = await launchpadProgram.methods
        .initializeGlobalConfig(
          Number(platformFeeBps),
          Number(migrationFeeBps),
          new BN(migrationMarketCap)
        )
        .accounts({
          admin: publicKey,
          feeRecipient: new PublicKey(lpFeeRecipient),
        })
        .rpc();
      setLpStatus(`Done: ${sig}`);
    } catch (err) {
      setLpStatus(`Error: ${(err as Error).message}`);
    }
  }

  if (!connected) {
    return <p className="text-zinc-600 dark:text-zinc-400">Connect a wallet to manage program configuration.</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Initialize AMM config</h2>
        <p className="text-xs text-zinc-500">One-time setup. The connected wallet becomes the AMM admin.</p>
        <Field label="Fee recipient (pubkey)" value={ammFeeRecipient} onChange={setAmmFeeRecipient} />
        <Field label="Trade fee (bps)" value={tradeFeeBps} onChange={setTradeFeeBps} />
        <Field label="Protocol fee (bps)" value={protocolFeeBps} onChange={setProtocolFeeBps} />
        <button onClick={initAmmConfig} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
          Initialize
        </button>
        {ammStatus && <p className="break-all text-xs text-zinc-500">{ammStatus}</p>}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Initialize Launchpad global config</h2>
        <p className="text-xs text-zinc-500">One-time setup. The connected wallet becomes the launchpad admin.</p>
        <Field label="Fee recipient (pubkey)" value={lpFeeRecipient} onChange={setLpFeeRecipient} />
        <Field label="Platform fee (bps)" value={platformFeeBps} onChange={setPlatformFeeBps} />
        <Field label="Migration fee (bps)" value={migrationFeeBps} onChange={setMigrationFeeBps} />
        <Field label="Migration market cap (scaled, 1e9 = 1 quote unit per token)" value={migrationMarketCap} onChange={setMigrationMarketCap} />
        <button onClick={initGlobalConfig} className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
          Initialize
        </button>
        {lpStatus && <p className="break-all text-xs text-zinc-500">{lpStatus}</p>}
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
