"use client";

import { AnchorProvider, Program, type Wallet } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import ammIdl from "@/idl/amm.json";
import launchpadIdl from "@/idl/launchpad.json";
import type { Ammverse } from "@/idl/amm_type";
import type { Launchpad } from "@/idl/launchpad_type";

const readonlyKeypair = Keypair.generate();
const READONLY_WALLET: Wallet = {
  publicKey: readonlyKeypair.publicKey,
  payer: readonlyKeypair,
  signTransaction: async () => {
    throw new Error("Connect a wallet to sign transactions");
  },
  signAllTransactions: async () => {
    throw new Error("Connect a wallet to sign transactions");
  },
};

// Falls back to a read-only wallet so account-listing pages work without a
// connected wallet; transaction-sending components must check `wallet.connected`.
export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return useMemo(() => {
    return new AnchorProvider(connection, wallet ?? READONLY_WALLET, {
      commitment: "confirmed",
    });
  }, [connection, wallet]);
}

export function useAmmProgram() {
  const provider = useAnchorProvider();
  return useMemo(
    () => new Program<Ammverse>(ammIdl as unknown as Ammverse, provider),
    [provider]
  );
}

export function useLaunchpadProgram() {
  const provider = useAnchorProvider();
  return useMemo(
    () => new Program<Launchpad>(launchpadIdl as unknown as Launchpad, provider),
    [provider]
  );
}
