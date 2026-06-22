"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-md break-all text-sm text-zinc-500">{error.message}</p>
      <p className="max-w-md text-xs text-zinc-500">
        If this is a 429 / rate-limit error, the RPC endpoint is throttling
        requests — try again in a moment or switch to a dedicated RPC provider
        in <code>.env.local</code>.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Try again
      </button>
    </div>
  );
}
