import { Badge, Button } from "antd";
import { Filter } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  count: number;
  color: string;
  hoverClassName: string;
}

const FilterButton = ({ onClick, count, color, hoverClassName }: FilterButtonProps) => {
  return (
    <div className="mx-auto mb-4 max-w-4xl">
      <div className="flex justify-center">
        <Badge count={count} color={color}>
          <Button
            type="primary"
            icon={<Filter size={16} />}
            onClick={onClick}
            aria-label={`Open filters${count > 0 ? `, ${count} active` : ""}`}
            style={{ backgroundColor: color, borderColor: color }}
            className={`!px-6 !py-5 !font-semibold ${hoverClassName}`}
          >
            Filters
          </Button>
        </Badge>
      </div>
    </div>
  );
};

export default FilterButton;
