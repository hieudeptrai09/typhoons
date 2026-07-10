"use client";

import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { IntensityType } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { formatStormDateRange } from "@/lib/utils/fns";
import { Button, Modal } from "antd";
import { Waves } from "lucide-react";
import { useState } from "react";

interface ActiveStorm {
  name: string;
  intensity: IntensityType;
  position: number;
  year: number;
  monthStart: number;
  dateStart: number;
  monthEnd: number;
  dateEnd: number;
  isFromPrevYear: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const hasEndDate = (storm: ActiveStorm) => storm.monthEnd > 0 && storm.dateEnd > 0;

const getStormRange = (storm: ActiveStorm) => {
  const startYear = storm.isFromPrevYear ? storm.year - 1 : storm.year;
  const startDate = new Date(startYear, storm.monthStart - 1, storm.dateStart);
  if (!hasEndDate(storm)) return { startDate, endDate: null };

  const endYear = storm.monthEnd < storm.monthStart ? startYear + 1 : startYear;
  const endDate = new Date(endYear, storm.monthEnd - 1, storm.dateEnd);
  return { startDate, endDate };
};

const getDayProgress = (storm: ActiveStorm) => {
  const { startDate, endDate } = getStormRange(storm);
  const today = new Date();

  if (!endDate) {
    const dayOfStorm = Math.round((today.getTime() - startDate.getTime()) / MS_PER_DAY) + 1;
    return { dayOfStorm, totalDays: null };
  }

  const todayMonth = today.getMonth() + 1;
  const anniversaryYear =
    todayMonth >= storm.monthStart ? startDate.getFullYear() : endDate.getFullYear();
  const anniversaryDate = new Date(anniversaryYear, todayMonth - 1, today.getDate());

  const dayOfStorm = Math.round((anniversaryDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1;
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1;
  return { dayOfStorm, totalDays };
};

const ActiveStorms = () => {
  const [loading, setLoading] = useState(false);

  const fetchStorms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/active-on-this-day");
      const json = await res.json();
      const storms: ActiveStorm[] = json.data ?? [];

      if (storms.length === 0) {
        Modal.info({
          title: "Active on this day",
          icon: null,
          centered: true,
          okText: "Got it",
          content: <p className="text-muted">No storms were active on this date in past years.</p>,
        });
        return;
      }

      Modal.info({
        title: "Active on this day",
        icon: null,
        centered: true,
        okText: "Got it",
        content: (
          <div className="max-h-[70vh] overflow-y-auto">
            <p className="mb-3 text-sm font-semibold text-muted">
              Storms that were in progress on this date in past years
            </p>
            <ol className="m-0 list-decimal list-outside space-y-1.5 pl-5">
              {storms.map((storm, i) => {
                const label = INTENSITY_LABEL[storm.intensity];
                const color = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
                const range = formatStormDateRange(
                  storm.year,
                  storm.monthStart,
                  storm.dateStart,
                  storm.monthEnd,
                  storm.dateEnd,
                  storm.isFromPrevYear,
                );
                const { dayOfStorm, totalDays } = getDayProgress(storm);

                return (
                  <li key={i} className="text-sm leading-relaxed text-muted">
                    {label}{" "}
                    <a
                      href={`/info/${encodeURIComponent(storm.name.toLowerCase())}`}
                      className="font-bold"
                      style={{ color }}
                    >
                      {storm.name}
                    </a>
                    {range ? (
                      <>
                        <span className="text-muted"> ({range})</span>
                        <br />
                        <span className="text-sm text-muted">
                          Day{" "}
                          {totalDays !== null ? (
                            <>
                              <span className="font-semibold">{dayOfStorm}</span>/
                              <span className="font-semibold">{totalDays}</span>
                            </>
                          ) : (
                            <span className="font-semibold">{dayOfStorm}</span>
                          )}
                        </span>
                      </>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        ),
      });
    } catch {
      Modal.info({
        title: "Oops!",
        icon: null,
        centered: true,
        okText: "Close",
        content: <p className="text-muted">Could not load active storms.</p>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      icon={
        loading ? <TyphoonSpinner colorClass="text-amber-700" size="small" /> : <Waves size={16} />
      }
      onClick={fetchStorms}
      disabled={loading}
      className="w-full! justify-start! text-sm! font-semibold! text-amber-700! hover:text-amber-800!"
    >
      Active On This Day
    </Button>
  );
};

export default ActiveStorms;
