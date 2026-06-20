import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Ammverse</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Bonding-curve token launches that graduate into a real constant-product
          AMM pool once they hit their market cap target.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/launchpad"
          className="rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="text-xl font-medium">Launchpad</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Browse bonding-curve launches, create a new one, or buy/sell into an
            existing curve.
          </p>
        </Link>
        <Link
          href="/amm"
          className="rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h2 className="text-xl font-medium">AMM</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Browse liquidity pools, swap tokens, or add/remove liquidity.
          </p>
        </Link>
      </div>
    </div>
  );
}
