import type { DashboardParams } from "@/lib/types";
import { Button } from "antd";
import type { ReactNode } from "react";
import { DASHBOARD_ICON_MAP } from "../_utils/dashboardOptions";

interface FilterButtonProps {
  onClick: () => void;
  params: DashboardParams;
}

const DashboardViewButton = ({ onClick, params }: FilterButtonProps) => {
  const iconSize = 20;
  const iconMap = DASHBOARD_ICON_MAP;

  const buildIconNodes = (): ReactNode[] => {
    const icons: ReactNode[] = [];

    const ViewIcon = iconMap.view[params.view];
    if (ViewIcon) icons.push(<ViewIcon key="view" size={iconSize} />);

    if (params.filter) {
      const FilterIcon = iconMap.filter[params.filter];
      if (FilterIcon) icons.push(<FilterIcon key="filter" size={iconSize} />);
    }

    const ModeIcon = iconMap.mode[params.mode];
    if (ModeIcon) icons.push(<ModeIcon key="mode" size={iconSize} />);

    return icons.reduce<ReactNode[]>((acc, icon, index) => {
      if (index > 0) {
        acc.push(
          <span key={`sep-${index}`} className="mx-1 text-white">
            /
          </span>,
        );
      }
      acc.push(icon);
      return acc;
    }, []);
  };

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <div className="flex justify-center">
        <Button
          type="primary"
          onClick={onClick}
          aria-label="Change dashboard view settings"
          style={{ backgroundColor: "#9333ea", borderColor: "#9333ea" }}
          className="!px-6 !py-5 !font-semibold hover:!border-purple-700 hover:!bg-purple-700"
        >
          <span className="flex items-center gap-2">{buildIconNodes()}</span>
        </Button>
      </div>
      <div className="mt-2 hidden justify-center">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
          Click the button above to change view
        </span>
      </div>
    </div>
  );
};

export default DashboardViewButton;
