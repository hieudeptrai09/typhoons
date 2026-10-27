"use client";

import { INTENSITY_RANK } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { calculateAverage, getIntensityGroups } from "@/lib/utils/storms";
import { Popover } from "antd";
import { Info } from "lucide-react";

// Negative ranks need the parentheses to stay readable next to the × sign.
const formatRank = (rank: number) => (rank < 0 ? `(−${Math.abs(rank)})` : String(rank));

// (2×5 + 1×2 + 3×0) ÷ 6 = 12 ÷ 6 = 2.00 — one term per intensity group.
const AverageFormula = ({ storms }: { storms: Storm[] }) => {
  const groups = getIntensityGroups(storms);
  const total = storms.length;
  const rankSum = groups.reduce(
    (sum, group) => sum + group.storms.length * INTENSITY_RANK[group.intensity],
    0,
  );

  return (
    <div className="max-w-[288px] text-sm tabular-nums text-foreground">
      <span>
        <span>(</span>
        {groups.map((group, idx) => (
          <span key={group.intensity}>
            {idx > 0 && " + "}
            {group.storms.length}×{formatRank(INTENSITY_RANK[group.intensity])}
          </span>
        ))}
        <span>
          ) ÷ {total} = {formatRank(rankSum)} ÷ {total} ={" "}
          <span className="font-bold">{calculateAverage(storms).toFixed(2)}</span>
        </span>
      </span>
    </div>
  );
};

/** An info button whose popover shows how the average intensity of `storms` is calculated. */
const AverageFormulaPopover = ({ storms }: { storms: Storm[] }) => {
  if (storms.length === 0) return null;

  return (
    <Popover
      styles={{ container: { backgroundColor: "#f3f4f6" } }}
      content={<AverageFormula storms={storms} />}
      trigger={["hover", "click"]}
      placement="bottom"
    >
      <button
        type="button"
        className="flex cursor-pointer items-center text-gray-500 transition-colors hover:text-sky-700"
        aria-label="How the average intensity is calculated"
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>
    </Popover>
  );
};

export default AverageFormulaPopover;
