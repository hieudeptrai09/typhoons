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
  X,
} from "lucide-react";
import type { BaseModalProps, DashboardParams } from "../../../../types";

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
  highlights: "strongest",
  average: "position",
  distance: "position",
  storms: "",
};

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const Section = ({ label, children }: SectionProps) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">{label}</span>
    {children}
  </div>
);

const DashboardModal = ({ isOpen, onClose, onApply, currentParams }: DashboardModalProps) => {
  const [view, setView] = useState(currentParams.view || "storms");
  const [filter, setFilter] = useState(currentParams.filter || "");
  const [mode, setMode] = useState(currentParams.mode || "table");

  const filterOptions = FILTER_OPTIONS[view] ?? [];
  const isGroupByDisabled = view === "storms";

  const isModeTableDisabled =
    (view === "average" && filter !== "position") || (view === "distance" && filter === "name");

  const handleViewChange = (newView: string) => {
    setView(newView);
    setFilter(DEFAULT_FILTER[newView] ?? "");
    if (newView === "distance") setMode("table");
    else if (
      newView === "average" &&
      (filter === "name" || filter === "country" || filter === "year")
    )
      setMode("list");
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (
      view === "average" &&
      (newFilter === "name" || newFilter === "country" || newFilter === "year")
    )
      setMode("list");
    if (view === "distance" && newFilter === "name") setMode("list");
    if (view === "distance" && newFilter === "position") setMode("table");
  };

  const handleReset = () => {
    setView("storms");
    setFilter("");
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
      title={<span className="text-xl font-bold text-gray-700">Dashboard View</span>}
      footer={[
        <Button key="reset" onClick={handleReset}>
          Reset
        </Button>,
        <Button key="apply" type="primary" onClick={() => onApply({ view, mode, filter })}>
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
          />
        </Section>

        <Section label="Group by">
          {isGroupByDisabled ? (
            <Segmented
              options={[{ label: icon(X, "Not available"), value: "__none__" }]}
              value="__none__"
              disabled
              block
            />
          ) : (
            <Segmented
              options={filterOptions}
              value={filter || filterOptions[0]?.value}
              onChange={(v) => handleFilterChange(String(v))}
              block
            />
          )}
        </Section>

        <Section label="Display as">
          <Segmented
            options={MODE_OPTIONS.map((opt) =>
              opt.value === "table" && isModeTableDisabled ? { ...opt, disabled: true } : opt,
            )}
            value={mode}
            onChange={(v) => setMode(String(v))}
            block
          />
        </Section>
      </div>
    </Modal>
  );
};

export default DashboardModal;
