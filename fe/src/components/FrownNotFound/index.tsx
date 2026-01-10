import { Frown } from "lucide-react";

const FrownNotFound = () => {
  return (
    <div className="mx-auto max-w-4xl p-8 text-center">
      <Frown className="mx-auto mb-4 h-16 w-16 text-gray-400" />
      <h3 className="mb-2 text-xl font-semibold text-gray-700">No Results Found</h3>
      <p className="text-gray-500">
        No typhoon names match your current filters. Try adjusting your search criteria.
      </p>
    </div>
  );
};

export default FrownNotFound;
