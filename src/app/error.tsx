"use client";

import FrownError from "@/lib/components/FrownError";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100">
      <FrownError />
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-gray-200 px-6 py-2 text-sm font-semibold text-muted hover:bg-gray-300 border border-gray-300"
      >
        Try again
      </button>
    </div>
  );
}
