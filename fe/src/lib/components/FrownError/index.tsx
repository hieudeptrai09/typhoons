import { Button, Empty } from "antd";
import { Frown } from "lucide-react";

const FrownError = ({
  description = "Something went wrong. Please try again later.",
  onRetry,
}: {
  description?: string;
  onRetry?: () => void;
} = {}) => {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <Empty
        image={<Frown size={64} strokeWidth={1.5} className="text-gray-400" />}
        imageStyle={{ height: 64, display: "flex", justifyContent: "center" }}
        description={<span className="text-gray-600">{description}</span>}
      >
        {onRetry && (
          <Button type="primary" onClick={onRetry}>
            Retry
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default FrownError;
