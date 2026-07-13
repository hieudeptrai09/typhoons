"use client";

import type { StormHighlight } from "@/lib/types";
import { capitalize, getPositionTitle } from "@/lib/utils/fns";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StormHighlightBadgeProps {
  fallback: StormHighlight;
}

const StormHighlightBadge = ({ fallback }: StormHighlightBadgeProps) => {
  const [highlight, setHighlight] = useState<StormHighlight>(fallback);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/storm-highlight")
      .then((res) => res.json())
      .then((json: { data: StormHighlight | null }) => {
        if (!cancelled && json.data) {
          setHighlight(json.data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const isActive = highlight.status === "active";

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 shadow-sm ${
          isActive ? "text-red-600" : "text-blue-600"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${isActive ? "bg-red-500" : "bg-blue-500"}`}
          aria-hidden="true"
        />
        {isActive ? "Active now" : "Up next"}
      </span>

      {/* Plain <a> forces a hard navigation, bypassing the @modal/(.)info interceptor */}
      <a
        href={`/info/${encodeURIComponent(highlight.name.toLowerCase())}`}
        className="font-semibold text-purple-700 transition-colors hover:text-purple-800"
      >
        {capitalize(highlight.name.toLowerCase())}
      </a>

      <Link
        href={`/positions/${highlight.position}`}
        className="text-teal-700 transition-colors hover:text-teal-800"
      >
        {getPositionTitle(highlight.position)}
      </Link>
    </div>
  );
};

export default StormHighlightBadge;
