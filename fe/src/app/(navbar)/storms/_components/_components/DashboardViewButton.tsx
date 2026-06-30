import type { ReactNode } from "react";
import { Button } from "antd";
import type { DashboardParams } from "../../../../../types";
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
          style={{ backgroundColor: "#a855f7", borderColor: "#a855f7" }}
          className="!px-6 !py-5 !font-semibold hover:!border-purple-600 hover:!bg-purple-600"
        >
          <span className="flex items-center gap-2">{buildIconNodes()}</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardViewButton;
