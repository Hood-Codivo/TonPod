import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-24 pb-10">
      <section className="flex flex-col gap-6 pt-6 text-center sm:pt-12">
        <span className="mx-auto rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Built on Solana
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Launch a token with zero liquidity.
          <br />
          Graduate into a real market.
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-zinc-600 dark:text-zinc-400">
          Ammverse is a bonding-curve launchpad that automatically migrates every
          token into a permanent, constant-product AMM pool once it earns it —
          no upfront capital, no rug risk, no one in control of the fine print.
        </p>
        <div className="mx-auto flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/launchpad/create"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Launch a token
          </Link>
          <Link
            href="/launchpad"
            className="rounded-md border border-zinc-200 px-5 py-2.5 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            Browse launches
          </Link>
        </div>
      </section>

      <section className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            The problem
          </h2>
          <p className="mt-3 text-lg font-medium">
            Launching a token today means choosing between two bad options.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Seed your own liquidity
            </span>{" "}
            and you need real capital upfront, plus traders have to trust you
            won&apos;t ever pull it back out.
          </p>
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Use a bonding-curve launchpad
            </span>{" "}
            and you avoid the capital problem, but most platforms either never
            graduate the token into a real market, or leave the migration step
            permissionless with no rule over who sets the new pool&apos;s fee —
            whoever clicks first locks in the terms for everyone, forever.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            How Ammverse solves it
          </h2>
          <p className="mt-3 text-lg font-medium">
            One curve, one graduation, one set of rules — fixed in advance.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Feature
            title="Zero-liquidity launch"
            body="Every token starts on a bonding curve. Price is set algorithmically by buy and sell pressure alone — no pool to seed, no capital required to go live."
          />
          <Feature
            title="Liquidity locked forever"
            body="Once a curve hits its market-cap target, its full reserves migrate into a real AMM pool and the LP position is permanently owned by the program itself. No wallet — not even the creator's — can ever withdraw it."
          />
          <Feature
            title="Fees fixed by the platform, not the first click"
            body="Migration is open for anyone to trigger, but the resulting pool's trade fee comes from the platform's own configuration, set once in advance — never from whoever happens to submit the transaction first."
          />
          <Feature
            title="Fully on-chain history"
            body="Every buy, sell, and swap emits an on-chain event. Price charts are reconstructed straight from the blockchain's transaction history — there's no centralized indexer in between."
          />
        </div>
      </section>

      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            How it works
          </h2>
          <p className="mt-3 text-lg font-medium">From first trade to permanent market, in three steps.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <Step
            number="1"
            title="Launch"
            body="Create a token and its bonding curve. Anyone can start buying and selling against it immediately — no liquidity pool needed yet."
          />
          <Step
            number="2"
            title="Trade"
            body="Price moves algorithmically with every buy and sell. The curve accumulates real reserves as the market cap climbs toward the graduation target."
          />
          <Step
            number="3"
            title="Graduate"
            body="Once the threshold is reached, the curve's reserves migrate into a brand-new AMM pool with a platform-fixed fee, and that liquidity is locked there for good."
          />
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
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
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
        {number}
      </span>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
    </div>
  );
}
