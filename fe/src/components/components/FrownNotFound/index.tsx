import { Empty } from "antd";
import { Frown } from "lucide-react";

const FrownNotFound = () => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <Empty
        image={<Frown size={64} strokeWidth={1.5} className="text-gray-300" />}
        imageStyle={{ height: 64, display: "flex", justifyContent: "center" }}
        description="Something went wrong. Please try again later."
      />
    </div>
  );
};

export default FrownNotFound;
