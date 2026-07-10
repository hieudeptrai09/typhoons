import type { DashboardParams } from "@/lib/types";
import { Button, Segmented } from "antd";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  FILTER_LABELS,
  MODE_LABELS,
  VIEW_LABELS,
  VIEW_OPTIONS,
} from "../_utils/dashboardOptions";

interface DashboardViewButtonProps {
  onOpenSettings: () => void;
  onSelectView: (view: string) => void;
  params: DashboardParams;
}

const DashboardViewButton = ({
  onOpenSettings,
  onSelectView,
  params,
}: DashboardViewButtonProps) => {
  const { view, filter, mode } = params;

  const viewLabel = VIEW_LABELS[view] ?? view;
  const filterLabel = filter ? (FILTER_LABELS[filter] ?? filter) : "";
  const modeLabel = MODE_LABELS[mode] ?? "";
  const secondaryLabel = [filterLabel, modeLabel].filter(Boolean).join(" · ");
  const fullLabel = [viewLabel, secondaryLabel].filter(Boolean).join(" · ");

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      {/* Desktop: the primary View axis is always visible and one click */}
      <div className="mb-3 hidden justify-center md:flex">
        <Segmented
          options={VIEW_OPTIONS}
          value={view}
          onChange={(v) => onSelectView(String(v))}
          size="large"
          aria-label="Select dashboard view"
        />
      </div>

      {/* Labeled dropdown trigger — full switcher on mobile, refinements on desktop */}
      <div className="flex justify-center">
        <Button
          onClick={onOpenSettings}
          title={`Current view: ${fullLabel}. Click to change the view, grouping and layout.`}
          aria-label={`Change view options — current view: ${fullLabel}`}
          className="!inline-flex !h-auto !items-center !gap-2 !rounded-full !border-purple-300 !bg-purple-50 !px-4 !py-2 !font-semibold !text-purple-800 hover:!border-purple-400 hover:!bg-purple-100"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span>
            {/* view name only needed on mobile, where the Segmented bar is hidden */}
            <span className="md:hidden">
              {viewLabel}
              {secondaryLabel ? " · " : ""}
            </span>
            {secondaryLabel}
          </span>
          <ChevronDown size={16} className="opacity-70" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardViewButton;
