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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const ActiveStorms = () => {
  const [loading, setLoading] = useState(false);

  const fetchStorms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/active-on-this-day`);
      const json = await res.json();
      const storms: ActiveStorm[] = json.data ?? [];

      if (storms.length === 0) {
        Modal.info({
          title: "Active on this day",
          icon: null,
          centered: true,
          okText: "Got it",
          content: (
            <p className="text-gray-500">No storms were active on this date in past years.</p>
          ),
        });
        return;
      }

      Modal.info({
        title: "Active on this day",
        icon: null,
        centered: true,
        okText: "Got it",
        content: (
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-800">
              Storms that were in progress on this date in past years
            </p>
            <ul className="m-0 list-none space-y-1.5 p-0">
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

                return (
                  <li key={i} className="text-sm leading-relaxed text-gray-600">
                    {label}{" "}
                    <a
                      href={`/info/${encodeURIComponent(storm.name.toLowerCase())}`}
                      className="font-bold"
                      style={{ color }}
                    >
                      {storm.name}
                    </a>
                    {range ? <span className="text-gray-500"> ({range})</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ),
      });
    } catch {
      Modal.info({
        title: "Oops!",
        icon: null,
        centered: true,
        okText: "Close",
        content: <p className="text-gray-500">Could not load active storms.</p>,
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
