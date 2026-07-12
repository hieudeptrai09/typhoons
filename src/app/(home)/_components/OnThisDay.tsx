"use client";

import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { INTENSITY_LABEL } from "@/lib/constants";
import type { IntensityType } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { Button, Modal } from "antd";
import { Calendar, LogIn, LogOut, Play, RefreshCw, Square } from "lucide-react";
import { useState } from "react";

interface OnThisDayStorm {
  name: string;
  intensity: IntensityType;
  position: number;
  year: number;
  monthStart: number;
  monthEnd: number;
  isFromPrevYear: number;
  reason: "started" | "ended" | "both";
}

const EXTERNAL_POSITIONS = [141, 142, 143];

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

const getReasonIcon = (
  storm: OnThisDayStorm,
): { Icon: typeof Play; color: string; label: string } => {
  const isExternal = EXTERNAL_POSITIONS.includes(storm.position);
  if (isExternal) {
    if (storm.reason === "both") {
      return {
        Icon: RefreshCw,
        color: "#d97706",
        label: "Entered and exited the West Pacific basin",
      };
    }
    return storm.reason === "started"
      ? { Icon: LogIn, color: "#16a34a", label: "Entered the West Pacific basin" }
      : { Icon: LogOut, color: "#dc2626", label: "Exited the West Pacific basin" };
  }
  if (storm.reason === "both") {
    return { Icon: RefreshCw, color: "#d97706", label: "Formed and dissipated" };
  }
  return storm.reason === "started"
    ? { Icon: Play, color: "#16a34a", label: "Formed" }
    : { Icon: Square, color: "#dc2626", label: "Dissipated" };
};

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
      const res = await fetch("/api/on-this-day");
      const json = await res.json();
      const storms: OnThisDayStorm[] = json.data ?? [];

      if (storms.length === 0) {
        Modal.info({
          title: "On this day",
          icon: null,
          centered: true,
          okText: "Got it",
          content: <p className="text-muted">No storms formed or dissipated on this day.</p>,
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
            <p className="mb-3 text-sm font-semibold text-muted">{dateStr}</p>
            <ul className="m-0 list-none space-y-1.5 p-0">
              {storms.map((storm, i) => {
                const eventYear = getEventYear(storm);
                const label = INTENSITY_LABEL[storm.intensity];
                const color = TEXT_COLOR_WHITE_BACKGROUND[storm.intensity];
                const verb = getVerb(storm);
                const { Icon, color: reasonColor, label: reasonLabel } = getReasonIcon(storm);

                return (
                  <li
                    key={i}
                    className="flex items-baseline gap-1.5 text-sm leading-relaxed text-muted"
                  >
                    <Icon
                      size={14}
                      className="shrink-0"
                      style={{ color: reasonColor }}
                      aria-label={reasonLabel}
                    >
                      <title>{reasonLabel}</title>
                    </Icon>
                    <span>
                      {eventYear}: {label}{" "}
                      <a
                        href={`/info/${encodeURIComponent(storm.name.toLowerCase())}`}
                        className="font-bold"
                        style={{ color }}
                      >
                        {storm.name}
                      </a>{" "}
                      {verb}
                    </span>
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
        content: <p className="text-muted">Could not load storms for this day.</p>,
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
          <TyphoonSpinner colorClass="text-amber-700" size="small" />
        ) : (
          <Calendar size={16} />
        )
      }
      onClick={fetchStorms}
      disabled={loading}
      className="w-full! justify-start! text-sm! font-semibold! text-amber-700! hover:text-amber-800!"
    >
      On this day
    </Button>
  );
};

export default OnThisDay;
