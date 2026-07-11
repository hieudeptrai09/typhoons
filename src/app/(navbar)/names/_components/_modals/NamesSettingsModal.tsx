import DefModal from "@/lib/components/DefModal";
import type { BaseModalProps } from "@/lib/types";
import { Button, Radio, Switch } from "antd";
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
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={400}
      bodyStyle={{}}
      afterOpenChange={(open) => {
        if (open) {
          setDraftMode(displayMode);
          setDraftSettings(settings);
        }
      }}
      title={<span className="text-xl font-bold text-muted">Display Settings</span>}
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
          <div className="mb-2 text-sm font-medium text-muted">Display Mode</div>
          <Radio.Group value={draftMode} onChange={(e) => setDraftMode(e.target.value)}>
            <Radio value="grid">Grid</Radio>
            <Radio value="list">List</Radio>
          </Radio.Group>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted">Letter Navigation</span>
          <Switch
            checked={draftSettings.showLetterNav}
            onChange={(v) => updateDraft({ showLetterNav: v })}
            aria-label="Letter Navigation"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted">Show History</span>
          <Switch
            checked={draftSettings.showHistory}
            onChange={(v) => updateDraft({ showHistory: v })}
            aria-label="Show History"
          />
        </div>

        <div className="space-y-5 border-t border-stone-200 pt-5">
          <div className="text-xs font-semibold tracking-wide text-muted uppercase">
            Grid Mode Options
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${isGrid ? "text-muted" : "text-disabled"}`}>
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
            <div>
              <span
                className={`flex items-center gap-1.5 text-sm font-semibold ${!colorfulDisabled ? "text-muted" : "text-disabled"}`}
              >
                <Paintbrush size={15} />
                Color by Reuse Count
              </span>
              <span
                className={`block text-xs text-muted ${isGrid && !draftSettings.showHistory ? "" : "invisible"}`}
              >
                Requires Show History
              </span>
            </div>
            <Switch
              checked={!colorfulDisabled && draftSettings.colorfulHistory}
              onChange={(v) => updateDraft({ colorfulHistory: v })}
              disabled={colorfulDisabled}
              aria-label="Color by Reuse Count"
            />
          </div>
        </div>

        <div className="space-y-5 border-t border-stone-200 pt-5">
          <div className="text-xs font-semibold tracking-wide text-muted uppercase">
            List Mode Options
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${isList ? "text-muted" : "text-disabled"}`}>
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
      </div>
    </DefModal>
  );
};

export default NamesSettingsModal;
