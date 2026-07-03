import { Empty } from "antd";
import { FilterX } from "lucide-react";

const EmptyResults = ({
  description = "No typhoon names match your current filters. Try adjusting your search criteria.",
}: {
  description?: string;
}) => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <Empty
        image={<FilterX size={64} strokeWidth={1.5} className="text-gray-300" />}
        imageStyle={{ height: 64, display: "flex", justifyContent: "center" }}
        description={description}
      />
    </div>
  );
};

export default EmptyResults;
