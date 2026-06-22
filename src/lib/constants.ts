import { PublicKey } from "@solana/web3.js";
import ammIdl from "@/idl/amm.json";
import launchpadIdl from "@/idl/launchpad.json";

export const AMM_PROGRAM_ID = new PublicKey(ammIdl.address);
export const LAUNCHPAD_PROGRAM_ID = new PublicKey(launchpadIdl.address);

export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? "http://127.0.0.1:8899";

export const AMM_CONFIG_SEED = Buffer.from("amm-config");
export const GLOBAL_CONFIG_SEED = Buffer.from("global-config");
export const CURVE_SEED = Buffer.from("curve");
export const POOL_SEED = Buffer.from("pool");

export const BPS_DENOMINATOR = 10_000;

// Must match ADMIN_PUBKEY hardcoded in both on-chain programs.
export const ADMIN_PUBKEY = new PublicKey("7wmRRK7KypcW2anQKimiECM3adRRUpw9Pi2myDmV9DME");
