import { useState } from "react";
import { Modal, Switch, Radio, Button } from "antd";
import { Paintbrush } from "lucide-react";
import type { BaseModalProps } from "../../../../../types";

type DisplayMode = "grid" | "list";

export interface DisplaySettings {
  showAll: boolean;
  showName: boolean;
  showHistory: boolean;
  colorfulHistory: boolean;
  showImageAndDescription: boolean;
}

interface NamesSettingsModalProps extends BaseModalProps {
  displayMode: DisplayMode;
  settings: DisplaySettings;
  hasActiveFilters: boolean;
  onApply: (mode: DisplayMode, settings: DisplaySettings) => void;
}

const NamesSettingsModal = ({
  isOpen,
  onClose,
  displayMode,
  settings,
  hasActiveFilters,
  onApply,
}: NamesSettingsModalProps) => {
  const [draftMode, setDraftMode] = useState<DisplayMode>(displayMode);
  const [draftSettings, setDraftSettings] = useState<DisplaySettings>(settings);

  const updateDraft = (partial: Partial<DisplaySettings>) => {
    setDraftSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleApply = () => {
    onApply(draftMode, draftSettings);
  };

  const isGrid = draftMode === "grid";
  const isList = draftMode === "list";
  const showHistoryDisabled = !isGrid || !draftSettings.showAll || hasActiveFilters;
  const colorfulDisabled = showHistoryDisabled || !draftSettings.showHistory;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={400}
      centered
      destroyOnHidden
      afterOpenChange={(open) => {
        if (open) {
          setDraftMode(displayMode);
          setDraftSettings(settings);
        }
      }}
      title={<span className="text-xl font-bold text-gray-700">Display Settings</span>}
      styles={{
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
      }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply
        </Button>,
      ]}
    >
      <div className="space-y-5 py-4">
        <div>
          <div className="mb-2 text-sm font-medium text-slate-500">Display Mode</div>
          <Radio.Group value={draftMode} onChange={(e) => setDraftMode(e.target.value)}>
            <Radio value="grid">Grid</Radio>
            <Radio value="list">List</Radio>
          </Radio.Group>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${isGrid ? "text-gray-700" : "text-gray-400"}`}>
            Show All
          </span>
          <Switch
            checked={isGrid && draftSettings.showAll}
            onChange={(v) => updateDraft({ showAll: v })}
            disabled={!isGrid}
            aria-label="Show All"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${isGrid ? "text-gray-700" : "text-gray-400"}`}>
            Show Name
          </span>
          <Switch
            checked={isGrid && draftSettings.showName}
            onChange={(v) => updateDraft({ showName: v })}
            disabled={!isGrid}
            aria-label="Show Name"
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-semibold ${!showHistoryDisabled ? "text-gray-700" : "text-gray-400"}`}
          >
            Show History
          </span>
          <Switch
            checked={!showHistoryDisabled && draftSettings.showHistory}
            onChange={(v) => updateDraft({ showHistory: v })}
            disabled={showHistoryDisabled}
            aria-label="Show History"
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`flex items-center gap-1.5 text-sm font-semibold ${!colorfulDisabled ? "text-gray-700" : "text-gray-400"}`}
          >
            <Paintbrush size={15} />
            Colorful
          </span>
          <Switch
            checked={!colorfulDisabled && draftSettings.colorfulHistory}
            onChange={(v) => updateDraft({ colorfulHistory: v })}
            disabled={colorfulDisabled}
            aria-label="Colorful History"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${isList ? "text-gray-700" : "text-gray-400"}`}>
            Show Images & Descriptions
          </span>
          <Switch
            checked={isList && draftSettings.showImageAndDescription}
            onChange={(v) => updateDraft({ showImageAndDescription: v })}
            disabled={!isList}
            aria-label="Show Images and Descriptions"
          />
        </div>
      </div>
    </Modal>
  );
};

export default NamesSettingsModal;
