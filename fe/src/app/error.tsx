"use client";

import FrownNotFound from "@/common/components/FrownNotFound";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <FrownNotFound />
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-300"
      >
        Try again
      </button>
    </div>
  );
}
