import type { DashboardParams } from "@/lib/types";
import { Button, ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { DASHBOARD_ICON_MAP } from "../../_utils/dashboardOptions";

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
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#9333ea", // purple-600
              colorPrimaryHover: "#7e22ce", // purple-700
              colorPrimaryActive: "#7e22ce",
            },
          }}
        >
          <Button
            type="primary"
            onClick={onClick}
            aria-label="Change dashboard view settings"
            className="!px-6 !py-5 !font-semibold"
          >
            <span className="flex items-center gap-2">{buildIconNodes()}</span>
          </Button>
        </ConfigProvider>
      </div>
      <div className="mt-2 hidden justify-center">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          Click the button above to change view
        </span>
      </div>
    </div>
  );
};

export default DashboardViewButton;
