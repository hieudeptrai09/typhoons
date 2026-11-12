"use client";

import { durationFromDays, formatDayCount, formatDuration } from "@/lib/utils/date";
import { Popover } from "antd";
import { CalendarDays } from "lucide-react";

/** A calendar button whose popover gives the average recurrence in days and as years/months/days. */
const RecurrenceDaysPopover = ({ days }: { days: number }) => {
  // -1 is the "no gap" sentinel: a lone storm has nothing to measure.
  if (days < 0) return null;

  return (
    <Popover
      styles={{ container: { backgroundColor: "#f3f4f6" } }}
      content={
        <div className="text-sm tabular-nums text-foreground">
          <div>
            <span className="font-bold">{formatDayCount(days)}</span> on average
          </div>
          <div>≈ {formatDuration(durationFromDays(days))}</div>
        </div>
      }
      trigger={["hover", "click"]}
      placement="bottom"
    >
      <button
        type="button"
        className="flex cursor-pointer items-center text-gray-500 transition-colors hover:text-sky-700"
        aria-label="Average recurrence in days"
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
      </button>
    </Popover>
  );
};

export default RecurrenceDaysPopover;
