"use client";

import FrownError from "@/lib/components/FrownError";
import { Button } from "antd";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100">
      <FrownError />
      <Button shape="round" size="large" onClick={reset} className="mt-4 font-semibold">
        Try again
      </Button>
    </div>
  );
}
