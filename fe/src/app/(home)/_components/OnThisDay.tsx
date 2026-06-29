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

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const OnThisDay = () => {
  const [loading, setLoading] = useState(false);

  const fetchStorm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/on-this-day`);
      const json = await res.json();
      const storm: OnThisDayStorm | null = json.data ?? null;

      if (!storm) {
        Modal.info({
          icon: null,
          centered: true,
          okText: "Got it",
          content: <p className="text-gray-500">No storms formed or dissipated on this day.</p>,
        });
        return;
      }

      const today = new Date();
      const dateStr = `${MONTH_NAMES[today.getMonth() + 1]} ${ordinal(today.getDate())}`;

      const spansYear = storm.monthEnd < storm.monthStart;
      let eventYear: number;
      if (storm.reason === "started") {
        eventYear = storm.isFromPrevYear ? storm.year - 1 : storm.year;
      } else if (storm.reason === "ended") {
        eventYear = storm.isFromPrevYear ? storm.year : spansYear ? storm.year + 1 : storm.year;
      } else {
        eventYear = storm.year;
      }
      const yearsAgo = today.getFullYear() - eventYear;
      const label = INTENSITY_LABEL[storm.intensity];
      const color = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
      const isExternal = EXTERNAL_POSITIONS.includes(storm.position);

      const verb = isExternal
        ? storm.reason === "both"
          ? "entered and later exited the West Pacific basin or dissipated"
          : storm.reason === "started"
            ? "entered the West Pacific basin"
            : "exited the West Pacific basin or dissipated"
        : storm.reason === "both"
          ? "formed and dissipated"
          : storm.reason === "started"
            ? "formed"
            : "dissipated";

      Modal.info({
        icon: null,
        centered: true,
        okText: "Got it",
        content: (
          <p className="leading-relaxed text-gray-600">
            It was {yearsAgo} year{yearsAgo !== 1 ? "s" : ""} ago, on {dateStr}, {eventYear}, that{" "}
            <a
              href={`/info/${encodeURIComponent(storm.name.toLowerCase())}`}
              className="font-bold"
              style={{ color }}
            >
              {label} {storm.name}
            </a>{" "}
            {verb}. The name{" "}
            {isExternal ? (
              <>was named by {storm.country}.</>
            ) : (
              <>
                was contributed by {storm.country}
                {storm.meaning && <> and means &lsquo;{storm.meaning}&rsquo;</>}.
              </>
            )}
          </p>
        ),
      });
    } catch {
      Modal.info({
        icon: null,
        centered: true,
        okText: "Got it",
        content: <p className="text-gray-500">No storms formed or dissipated on this day.</p>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      icon={loading ? <TyphoonSpinner size="small" /> : <Calendar size={16} />}
      onClick={fetchStorm}
      disabled={loading}
      className="text-sm! font-semibold! text-amber-600! hover:text-amber-800!"
    >
      On this day
    </Button>
  );
};

export default OnThisDay;
