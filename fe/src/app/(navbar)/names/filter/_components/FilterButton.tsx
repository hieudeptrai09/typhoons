import { Badge, Button } from "antd";
import { Filter } from "lucide-react";
import type { FilterParams } from "../../../../../types";

interface FilterButtonProps {
  onClick: () => void;
  params: FilterParams;
}

const FilterButton = ({ onClick, params }: FilterButtonProps) => {
  const count = [params.name, params.country, params.language, params.position, params.tag].filter(
    Boolean,
  ).length;

  return (
    <div className="mx-auto mb-4 max-w-4xl">
      <div className="flex justify-center">
        <Badge count={count} color="#10b981">
          <Button
            type="primary"
            icon={<Filter size={16} />}
            onClick={onClick}
            style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
            className="!px-6 !py-5 !font-semibold hover:!border-emerald-600 hover:!bg-emerald-600"
          >
            Filters
          </Button>
        </Badge>
      </div>
    </div>
  );
};

export default FilterButton;
