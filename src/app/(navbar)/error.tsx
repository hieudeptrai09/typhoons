"use client";

import FrownError from "@/lib/components/FrownError";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  // In-flow (not a fixed overlay) so the layout's Navbar and Footer stay
  // visible — the user always has the persistent header to navigate from.
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <FrownError onRetry={reset} />
    </div>
  );
}
