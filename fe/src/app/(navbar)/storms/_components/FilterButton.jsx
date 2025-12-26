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
} from "lucide-react";

const FilterButton = ({ onClick, params }) => {
  const renderViewIcons = () => {
    const iconSize = 20;
    const icons = [];

    const iconMap = {
      view: {
        storms: CloudLightning,
        highlights: Star,
        average: Activity,
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

    // Add view icon
    const ViewIcon = iconMap.view[params.view];
    if (ViewIcon) icons.push(<ViewIcon key="view" size={iconSize} />);

    // Add filter icon
    if (params.filter) {
      const FilterIcon = iconMap.filter[params.filter];
      if (FilterIcon) icons.push(<FilterIcon key="filter" size={iconSize} />);
    }

    // Add mode icon
    const ModeIcon = iconMap.mode[params.mode];
    if (ModeIcon) icons.push(<ModeIcon key="mode" size={iconSize} />);

    // Insert "/" separators between icons
    return icons.reduce((acc, icon, index) => {
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
      <button
        onClick={onClick}
        className="mx-auto flex items-center gap-2 rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-600"
      >
        {renderViewIcons()}
      </button>
    </div>
  );
};

export default FilterButton;
