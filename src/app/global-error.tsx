"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="max-w-md break-all px-6 text-sm text-zinc-500">{error.message}</p>
        <button
          onClick={() => unstable_retry()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
