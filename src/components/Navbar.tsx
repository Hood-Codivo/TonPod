"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { ADMIN_PUBKEY } from "@/lib/constants";

export function Navbar() {
  const { publicKey } = useWallet();
  const isAdmin = publicKey?.equals(ADMIN_PUBKEY) ?? false;

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Ammverse
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/launchpad" className="hover:text-zinc-950 dark:hover:text-white">
            Launchpad
          </Link>
          <Link href="/amm" className="hover:text-zinc-950 dark:hover:text-white">
            AMM
          </Link>
          {isAdmin && (
            <Link href="/admin" className="hover:text-zinc-950 dark:hover:text-white">
              Admin
            </Link>
          )}
        </nav>
        <WalletMultiButton />
      </div>
    </header>
  );
}
