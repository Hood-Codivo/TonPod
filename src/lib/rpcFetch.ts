// Wraps fetch with retry-on-429 backoff for the Solana RPC connection.
// Public RPC endpoints (e.g. api.devnet.solana.com) throttle aggressively;
// without this, a single rate-limited call surfaces as an uncaught error.
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(input, init);
    if (response.status !== 429 || attempt === MAX_RETRIES) {
      return response;
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : BASE_DELAY_MS * 2 ** attempt;
    await sleep(delay);
  }
  return fetch(input, init);
}
