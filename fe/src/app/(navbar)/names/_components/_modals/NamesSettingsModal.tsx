import type { BaseModalProps } from "@/lib/types";
import { Button, Modal, Radio, Switch } from "antd";
import { Paintbrush } from "lucide-react";
import { useState } from "react";

type DisplayMode = "grid" | "list";

export interface DisplaySettings {
  showLetterNav: boolean;
  showName: boolean;
  showHistory: boolean;
  colorfulHistory: boolean;
  showImageAndDescription: boolean;
}

interface NamesSettingsModalProps extends BaseModalProps {
  displayMode: DisplayMode;
  settings: DisplaySettings;
  onApply: (mode: DisplayMode, settings: DisplaySettings) => void;
}

const NamesSettingsModal = ({
  isOpen,
  onClose,
  displayMode,
  settings,
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
  const colorfulDisabled = !isGrid || !draftSettings.showHistory;

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
        // CONSOLIDATION: duplicated modal-header style, see InfoModal.tsx note.
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
          <span className="text-sm font-semibold text-gray-700">Letter Navigation</span>
          <Switch
            checked={draftSettings.showLetterNav}
            onChange={(v) => updateDraft({ showLetterNav: v })}
            aria-label="Letter Navigation"
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
          <span className="text-sm font-semibold text-gray-700">Show History</span>
          <Switch
            checked={draftSettings.showHistory}
            onChange={(v) => updateDraft({ showHistory: v })}
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
