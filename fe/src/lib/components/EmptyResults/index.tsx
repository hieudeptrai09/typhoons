import { Empty } from "antd";
import { FilterX } from "lucide-react";
import type { ComponentType } from "react";

const EmptyResults = ({
  description = "No typhoon names match your current filters. Try adjusting your search criteria.",
  icon: Icon = FilterX,
}: {
  description?: string;
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}) => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <Empty
        image={<Icon size={64} strokeWidth={1.5} className="text-gray-300" />}
        imageStyle={{ height: 64, display: "flex", justifyContent: "center" }}
        description={description}
      />
    </div>
  );
};

export default EmptyResults;
