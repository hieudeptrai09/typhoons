import { Empty } from "antd";

const FrownNotFound = () => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <Empty description="No typhoon names match your current filters. Try adjusting your search criteria." />
    </div>
  );
};

export default FrownNotFound;
