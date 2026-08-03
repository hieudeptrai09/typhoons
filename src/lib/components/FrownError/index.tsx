import { Button, Empty } from "antd";
import { Frown } from "lucide-react";
import Link from "next/link";

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
        description={<span className="text-foreground">{description}</span>}
      >
        <div className="mt-2 flex flex-col items-center gap-3">
          {onRetry && (
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={onRetry}
              className="font-semibold"
            >
              Try again
            </Button>
          )}
          {/* Always offer a way out even when a retry won't help. */}
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="font-medium text-sky-700 hover:underline">
              Back to home
            </Link>
            <span className="text-gray-300" aria-hidden>
              ·
            </span>
            <Link href="/storms/all/name/" className="font-medium text-sky-700 hover:underline">
              Browse storms
            </Link>
          </div>
        </div>
      </Empty>
    </div>
  );
};

export default FrownError;
