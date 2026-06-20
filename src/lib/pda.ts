import { PublicKey } from "@solana/web3.js";
import {
  AMM_CONFIG_SEED,
  AMM_PROGRAM_ID,
  CURVE_SEED,
  GLOBAL_CONFIG_SEED,
  LAUNCHPAD_PROGRAM_ID,
  POOL_SEED,
} from "./constants";

export function getAmmConfigPda() {
  return PublicKey.findProgramAddressSync([AMM_CONFIG_SEED], AMM_PROGRAM_ID);
}

export function getGlobalConfigPda() {
  return PublicKey.findProgramAddressSync(
    [GLOBAL_CONFIG_SEED],
    LAUNCHPAD_PROGRAM_ID
  );
}

export function getCurvePda(mint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [CURVE_SEED, mint.toBuffer()],
    LAUNCHPAD_PROGRAM_ID
  );
}

export function getPoolPda(mintA: PublicKey, mintB: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [POOL_SEED, mintA.toBuffer(), mintB.toBuffer()],
    AMM_PROGRAM_ID
  );
}
