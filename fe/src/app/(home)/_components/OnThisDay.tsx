"use client";

import { useState } from "react";
import { Button, Modal } from "antd";
import { Calendar } from "lucide-react";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../components/colors";
import TyphoonSpinner from "../../../components/components/TyphoonSpinner";
import { INTENSITY_LABEL } from "../../../constants";
import type { IntensityType } from "../../../types";

interface OnThisDayStorm {
  name: string;
  intensity: IntensityType;
  position: number;
  year: number;
  monthStart: number;
  monthEnd: number;
  isFromPrevYear: number;
  country: string;
  meaning: string | null;
  reason: "started" | "ended" | "both";
}

const EXTERNAL_POSITIONS = [141, 142, 143];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getVerb = (storm: OnThisDayStorm) => {
  const isExternal = EXTERNAL_POSITIONS.includes(storm.position);
  if (isExternal) {
    return storm.reason === "both"
      ? "entered and later exited the West Pacific basin or dissipated"
      : storm.reason === "started"
        ? "entered the West Pacific basin"
        : "exited the West Pacific basin or dissipated";
  }
  return storm.reason === "both"
    ? "formed and dissipated"
    : storm.reason === "started"
      ? "formed"
      : "dissipated";
};

const getEventYear = (storm: OnThisDayStorm) => {
  const spansYear = storm.monthEnd < storm.monthStart;
  if (storm.reason === "started") {
    return storm.isFromPrevYear ? storm.year - 1 : storm.year;
  }
  if (storm.reason === "ended") {
    return storm.isFromPrevYear ? storm.year : spansYear ? storm.year + 1 : storm.year;
  }
  return storm.year;
};

const OnThisDay = () => {
  const [loading, setLoading] = useState(false);

  const fetchStorms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/on-this-day`);
      const json = await res.json();
      const storms: OnThisDayStorm[] = json.data ?? [];

      if (storms.length === 0) {
        Modal.info({
          title: "On this day",
          icon: null,
          centered: true,
          okText: "Got it",
          content: <p className="text-gray-500">No storms formed or dissipated on this day.</p>,
        });
        return;
      }

      const today = new Date();
      const dateStr = `${MONTH_NAMES[today.getMonth() + 1]} ${today.getDate()}`;

      Modal.info({
        title: "On this day",
        icon: null,
        centered: true,
        okText: "Got it",
        content: (
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-800">{dateStr}</p>
            <ul className="m-0 list-none space-y-1.5 p-0">
              {storms.map((storm, i) => {
                const eventYear = getEventYear(storm);
                const label = INTENSITY_LABEL[storm.intensity];
                const color = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
                const verb = getVerb(storm);

                return (
                  <li key={i} className="text-sm leading-relaxed text-gray-600">
                    <span className="mr-1 text-gray-400">&bull;</span>
                    {eventYear}: {label}{" "}
                    <a
                      href={`/info/${encodeURIComponent(storm.name.toLowerCase())}`}
                      className="font-bold"
                      style={{ color }}
                    >
                      {storm.name}
                    </a>{" "}
                    {verb}
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
        content: <p className="text-gray-500">No storms formed or dissipated on this day.</p>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      icon={
        loading ? (
          <TyphoonSpinner colorClass="text-amber-600" size="small" />
        ) : (
          <Calendar size={16} />
        )
      }
      onClick={fetchStorms}
      disabled={loading}
      className="text-sm! font-semibold! text-amber-600! hover:text-amber-800!"
    >
      On this day
    </Button>
  );
};

export default OnThisDay;
