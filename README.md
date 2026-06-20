# Ammverse frontend

Next.js (App Router) dApp for the `launchpad` and `amm` Anchor programs in this
repo. Uses Solana Wallet Adapter for wallet connections and `@coral-xyz/anchor`
to talk to the programs directly from the browser.

## Setup

```bash
yarn install
cp .env.local.example .env.local   # point NEXT_PUBLIC_RPC_ENDPOINT at your cluster
yarn dev
```

Defaults to `http://127.0.0.1:8899` (localnet). Run `anchor deploy` from the
repo root first so the program IDs in `src/idl/*.json` match what's on-chain.

## Pages

- `/admin` — one-time `initialize_amm_config` / `initialize_global_config` setup.
- `/launchpad`, `/launchpad/create`, `/launchpad/[mint]` — browse bonding
  curves, create a launch, buy/sell, and migrate a graduated curve to the AMM.
- `/amm`, `/amm/create`, `/amm/[pool]` — browse pools, create a pool, seed
  initial liquidity, add/remove liquidity, and swap.

## Notes

- `src/idl/*.json` are copied from `target/idl/` and `src/idl/*_type.ts` from
  `target/types/` after running `anchor build`; re-copy them if the on-chain
  programs change.
- Token/quote mints must already exist (e.g. via `spl-token create-token`)
  before creating a launch or pool — this UI doesn't mint new tokens.
- Amount inputs are raw base units (no decimal conversion) except where noted.
