import { Empty } from "antd";
import { FilterX } from "lucide-react";

const EmptyResults = () => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <Empty
        image={<FilterX size={64} strokeWidth={1.5} className="text-gray-300" />}
        imageStyle={{ height: 64, display: "flex", justifyContent: "center" }}
        description="No typhoon names match your current filters. Try adjusting your search criteria."
      />
    </div>
  );
};

export default EmptyResults;
