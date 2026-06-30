import { useState } from "react";
import { Modal, Button, Segmented } from "antd";
import {
  CloudLightning,
  Star,
  Activity,
  Ruler,
  Grid3x3,
  List,
  Zap,
  Medal,
  ArrowDownToLine,
  MapPin,
  Tag,
  Globe,
  Calendar,
} from "lucide-react";
import { isListOnly } from "../../_utils/fns";
import type { BaseModalProps, DashboardParams } from "../../../../../types";

interface DashboardModalProps extends BaseModalProps {
  onApply: (params: DashboardParams) => void;
  currentParams: DashboardParams;
}

const icon = (Icon: React.ElementType, label: string) => (
  <span className="flex items-center justify-center gap-1.5">
    <Icon size={13} />
    {label}
  </span>
);

const VIEW_OPTIONS = [
  { label: icon(CloudLightning, "Storms"), value: "storms" },
  { label: icon(Star, "Highlights"), value: "highlights" },
  { label: icon(Activity, "Average"), value: "average" },
  { label: icon(Ruler, "Distance"), value: "distance" },
];

const MODE_OPTIONS = [
  { label: icon(Grid3x3, "Table"), value: "table" },
  { label: icon(List, "List"), value: "list" },
];

const FILTER_OPTIONS: Record<string, { label: React.ReactNode; value: string }[]> = {
  storms: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
  ],
  highlights: [
    { label: icon(Zap, "Strongest"), value: "strongest" },
    { label: icon(Medal, "First"), value: "first" },
    { label: icon(ArrowDownToLine, "Last"), value: "last" },
  ],
  average: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
    { label: icon(Globe, "Country"), value: "country" },
    { label: icon(Calendar, "Year"), value: "year" },
  ],
  distance: [
    { label: icon(MapPin, "Position"), value: "position" },
    { label: icon(Tag, "Name"), value: "name" },
  ],
};

const DEFAULT_FILTER: Record<string, string> = {
  storms: "position",
  highlights: "strongest",
  average: "position",
  distance: "position",
};

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const Section = ({ label, children }: SectionProps) => {
  const sectionId = `dashboard-section-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-2">
      <span
        id={sectionId}
        className="text-xs font-semibold tracking-widest text-gray-600 uppercase"
      >
        {label}
      </span>
      {children}
    </div>
  );
};

const isListModeDisabled = (view: string, filter: string): boolean => {
  if (view === "storms" && filter === "position") return true;
  return false;
};

const DashboardModal = ({ isOpen, onClose, onApply, currentParams }: DashboardModalProps) => {
  const [view, setView] = useState(currentParams.view || "storms");
  const [filter, setFilter] = useState(currentParams.filter || "position");
  const [mode, setMode] = useState(currentParams.mode || "table");

  const filterOptions = FILTER_OPTIONS[view] ?? [];

  const handleViewChange = (newView: string) => {
    const defaultFilter = DEFAULT_FILTER[newView] ?? "";
    setView(newView);
    setFilter(defaultFilter);

    if (newView === "distance" && defaultFilter === "name") {
      setMode("list");
    } else if (newView === "average" && defaultFilter === "country") {
      setMode("list");
    } else {
      setMode("table");
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (view === "storms" && newFilter === "position") {
      setMode("table");
    } else if (view === "average" && newFilter === "country") {
      setMode("list");
    } else if (view === "distance" && newFilter === "name") {
      setMode("list");
    } else if (view === "distance" && newFilter === "position") {
      setMode("table");
    }
  };

  const handleReset = () => {
    setView("storms");
    setFilter("position");
    setMode("table");
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={480}
      centered
      destroyOnHidden
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={<span className="text-xl font-bold text-gray-700">Dashboard View</span>}
      footer={[
        <Button key="reset" onClick={handleReset} aria-label="Reset dashboard view settings">
          Reset
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={() => onApply({ view, mode, filter })}
          aria-label="Apply dashboard view settings"
        >
          Apply
        </Button>,
      ]}
    >
      <div className="space-y-5 py-4">
        <Section label="View">
          <Segmented
            options={VIEW_OPTIONS}
            value={view}
            onChange={(v) => handleViewChange(String(v))}
            block
            aria-label="Select view type"
            aria-describedby="dashboard-section-view"
          />
        </Section>

        <Section label="Group by">
          <Segmented
            options={filterOptions}
            value={filter || filterOptions[0]?.value}
            onChange={(v) => handleFilterChange(String(v))}
            block
            aria-label="Select grouping option"
            aria-describedby="dashboard-section-group-by"
          />
        </Section>

        <Section label="Display as">
          <Segmented
            options={MODE_OPTIONS.map((opt) => ({
              ...opt,
              disabled:
                (opt.value === "table" && isListOnly(view, filter)) ||
                (opt.value === "list" && isListModeDisabled(view, filter)),
            }))}
            value={mode}
            onChange={(v) => setMode(String(v))}
            block
            aria-label="Select display mode"
            aria-describedby="dashboard-section-display-as"
          />
        </Section>
      </div>
    </Modal>
  );
};

export default DashboardModal;
