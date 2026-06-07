import type { ReactNode } from "react";
import { Button } from "antd";
import {
  CloudLightning,
  Star,
  Activity,
  Zap,
  Medal,
  MapPin,
  Tag,
  Grid3x3,
  List,
  Globe,
  Calendar,
  ArrowDownToLine,
  Ruler,
} from "lucide-react";
import type { DashboardParams } from "../../../../../types";
import type { LucideIcon } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  params: DashboardParams;
}

const DashboardViewButton = ({ onClick, params }: FilterButtonProps) => {
  const iconSize = 16;

  const iconMap: Record<string, Record<string, LucideIcon>> = {
    view: {
      storms: CloudLightning,
      highlights: Star,
      average: Activity,
      distance: Ruler,
    },
    filter: {
      strongest: Zap,
      first: Medal,
      last: ArrowDownToLine,
      position: MapPin,
      name: Tag,
      country: Globe,
      year: Calendar,
    },
    mode: {
      table: Grid3x3,
      list: List,
    },
  };

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
          <span key={`sep-${index}`} className="mx-1 opacity-70">
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
          style={{ backgroundColor: "#a855f7", borderColor: "#a855f7" }}
          className="!px-6 !py-5 !font-semibold hover:!border-purple-600 hover:!bg-purple-600"
        >
          <span className="flex items-center gap-1">{buildIconNodes()}</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardViewButton;
