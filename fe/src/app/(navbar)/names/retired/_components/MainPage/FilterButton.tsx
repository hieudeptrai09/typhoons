import { Badge, Button } from "antd";
import { Filter } from "lucide-react";
import type { RetiredFilterParams } from "../../../../../../types";

interface FilterButtonProps {
  onClick: () => void;
  params: RetiredFilterParams;
}

const FilterButton = ({ onClick, params }: FilterButtonProps) => {
  const count = [params.name, params.year, params.country, params.reason, params.position].filter(
    Boolean,
  ).length;

  return (
    <div className="mx-auto mb-4 max-w-4xl">
      <div className="flex justify-center">
        <Badge count={count} color="#f97316">
          <Button
            type="primary"
            icon={<Filter size={16} />}
            onClick={onClick}
            style={{ backgroundColor: "#f97316", borderColor: "#f97316" }}
            className="!px-6 !py-5 !font-semibold hover:!border-orange-600 hover:!bg-orange-600"
          >
            Filters
          </Button>
        </Badge>
      </div>
    </div>
  );
};

export default FilterButton;
