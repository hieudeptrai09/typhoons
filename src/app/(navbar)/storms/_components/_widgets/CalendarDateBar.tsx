import { shiftMonthDay, toMonthDay } from "@/lib/utils/date";
import { Button, DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

const REFERENCE_START = dayjs("2000-01-01");
const REFERENCE_END = dayjs("2000-12-31");

interface CalendarDateBarProps {
  monthDay: string; // "MM-DD"
  today: string; // "MM-DD"
  onChange: (monthDay: string) => void;
  // One line under the picker saying what the chosen date turned up.
  summary: ReactNode;
}

const CalendarDateBar = ({ monthDay, today, onChange, summary }: CalendarDateBarProps) => {
  const handlePick = (value: Dayjs | null) => {
    if (value) onChange(toMonthDay(value.month() + 1, value.date()));
  };

  return (
    <section
      aria-label="Calendar date"
      className="mx-auto mb-6 flex max-w-2xl flex-col items-center gap-2"
    >
      <div className="flex items-center gap-2">
        <Button
          aria-label="Previous day"
          icon={<ChevronLeft size={16} />}
          onClick={() => onChange(shiftMonthDay(monthDay, -1))}
        />

        <DatePicker
          value={dayjs(`${REFERENCE_START.year()}-${monthDay}`)}
          onChange={handlePick}
          minDate={REFERENCE_START}
          maxDate={REFERENCE_END}
          format="D MMMM"
          allowClear={false}
          inputReadOnly
          aria-label="Pick a day of the year"
          className="w-40!"
        />

        <Button
          aria-label="Next day"
          icon={<ChevronRight size={16} />}
          onClick={() => onChange(shiftMonthDay(monthDay, 1))}
        />

        <Button
          onClick={() => onChange(today)}
          disabled={monthDay === today}
          className="font-semibold!"
        >
          Today
        </Button>
      </div>

      <p className="m-0 text-center text-sm text-foreground">{summary}</p>
    </section>
  );
};

export default CalendarDateBar;
