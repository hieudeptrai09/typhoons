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

const DEFAULT_MODE: DisplayMode = "grid";

const DEFAULT_SETTINGS: DisplaySettings = {
  showLetterNav: false,
  showName: true,
  showHistory: false,
  colorfulHistory: false,
  showImageAndDescription: false,
};

const NamesSettingsModal = ({
  isOpen,
  onClose,
  displayMode,
  settings,
  onApply,
}: NamesSettingsModalProps) => {
  const [draftMode, setDraftMode] = useState<DisplayMode>(displayMode);
  const [draftSettings, setDraftSettings] = useState<DisplaySettings>(settings);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setDraftMode(displayMode);
      setDraftSettings(settings);
    }
  }

  const updateDraft = (partial: Partial<DisplaySettings>) => {
    setDraftSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleApply = () => {
    onApply(draftMode, draftSettings);
  };

  const handleClear = () => {
    setDraftMode(DEFAULT_MODE);
    setDraftSettings(DEFAULT_SETTINGS);
  };

  const isGrid = draftMode === "grid";
  const isList = draftMode === "list";
  const colorfulDisabled = !isGrid || !draftSettings.showHistory;

  return (
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={400}
      title={<span className="text-xl font-bold text-foreground">Display Settings</span>}
      footer={[
        <Button key="clear" onClick={handleClear}>
          Clear
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply
        </Button>,
      ]}
    >
      <div className="space-y-5 py-4">
        <div>
          <div className="mb-2 text-sm font-medium text-foreground">Display Mode</div>
          <Radio.Group value={draftMode} onChange={(e) => setDraftMode(e.target.value)}>
            <Radio value="grid">Grid</Radio>
            <Radio value="list">List</Radio>
          </Radio.Group>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Letter Navigation</span>
          <Switch
            checked={draftSettings.showLetterNav}
            onChange={(v) => updateDraft({ showLetterNav: v })}
            aria-label="Letter Navigation"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Show History</span>
          <Switch
            checked={draftSettings.showHistory}
            onChange={(v) => updateDraft({ showHistory: v })}
            aria-label="Show History"
          />
        </div>

        <div className="space-y-5 border-t border-stone-200 pt-5">
          <div className="text-xs font-semibold tracking-wide text-foreground uppercase">
            Grid Mode Options
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${isGrid ? "text-foreground" : "text-disabled"}`}
            >
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
                className={`flex items-center gap-1.5 text-sm font-semibold ${!colorfulDisabled ? "text-foreground" : "text-disabled"}`}
              >
                <Paintbrush size={15} />
                Color by Reuse Count
              </span>
              <span
                className={`block text-xs text-foreground ${isGrid && !draftSettings.showHistory ? "" : "invisible"}`}
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
          <div className="text-xs font-semibold tracking-wide text-foreground uppercase">
            List Mode Options
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${isList ? "text-foreground" : "text-disabled"}`}
            >
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
