import type { DashboardParams } from "@/lib/types";
import { Segmented } from "antd";
import Link from "next/link";
import {
  FILTER_OPTIONS,
  getFilterLabel,
  MODE_OPTIONS,
  TAB_OPTIONS,
  VIEW_OPTIONS,
} from "../../_utils/dashboardOptions";
import {
  getPanel,
  isGridOnly,
  isListOnly,
  paramsForFilter,
  paramsForTab,
  paramsForView,
  paramsToPath,
} from "../../_utils/routing";

interface DashboardControlBarProps {
  params: DashboardParams;
  onChange: (params: DashboardParams) => void;
}

const DashboardControlBar = ({ params, onChange }: DashboardControlBarProps) => {
  const { view, tab, filter, mode } = params;
  const panel = getPanel(params);
  const filterOptions = FILTER_OPTIONS[panel] ?? [];
  const tabOptions = TAB_OPTIONS[view] ?? [];

  return (
    <div className="mx-auto mb-6 flex max-w-4xl flex-col gap-4">
      <nav
        aria-label="Dashboard view"
        className="mx-auto grid w-full max-w-2xl grid-cols-4 border-b border-gray-200"
      >
        {VIEW_OPTIONS.map(({ key, label, icon: Icon }) => {
          const isActive = view === key;
          return (
            <Link
              key={key}
              href={paramsToPath(paramsForView(key))}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center justify-end gap-1 px-0.5 pb-2.5 text-center text-[11px] leading-tight font-semibold transition-colors sm:flex-row sm:justify-center sm:gap-1.5 sm:px-4 sm:pb-3 sm:text-sm ${
                isActive
                  ? "border-b-2 border-sky-700 text-sky-700"
                  : "text-foreground hover:text-highlight"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="sm:whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Records and Stats split into tabs; a lighter pill row keeps them a level below the views. */}
      {tabOptions.length > 0 && (
        <nav
          aria-label={`${VIEW_OPTIONS.find((option) => option.key === view)?.label} tabs`}
          className="flex flex-wrap justify-center gap-2"
        >
          {tabOptions.map(({ key, label, icon: Icon }) => {
            const isActive = tab === key;
            return (
              <Link
                key={key}
                href={paramsToPath(paramsForTab(view, key))}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  isActive
                    ? "border-sky-700 bg-sky-700 text-white"
                    : "border-slate-300 bg-white text-foreground hover:border-sky-700 hover:text-sky-700"
                }`}
              >
                <Icon size={14} className="shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
        <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-2.5">
          <span className="shrink-0 text-xs font-semibold tracking-widest text-foreground uppercase">
            {getFilterLabel(panel)}
          </span>
          <div className="max-w-full overflow-x-auto sm:min-w-0">
            <Segmented
              options={filterOptions}
              value={filter || filterOptions[0]?.value}
              onChange={(v) => onChange(paramsForFilter(params, String(v)))}
              aria-label="Select grouping option"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-2.5">
          <span className="shrink-0 text-xs font-semibold tracking-widest text-foreground uppercase">
            Display as
          </span>
          <div className="max-w-full overflow-x-auto sm:min-w-0">
            <Segmented
              options={MODE_OPTIONS.map((opt) => ({
                ...opt,
                disabled:
                  (opt.value === "table" && isListOnly(panel, filter)) ||
                  (opt.value === "list" && isGridOnly(panel, filter)),
              }))}
              value={mode}
              onChange={(v) => onChange({ ...params, mode: String(v) })}
              aria-label="Select display mode"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardControlBar;
