import { X } from "lucide-react";

const TyphoonNameModal = ({ selectedName, onClose }) => {
  if (!selectedName) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            {selectedName.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Meaning:</span>
            <span className="text-gray-600 ml-2">{selectedName.meaning}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Country:</span>
            <span className="text-gray-600 ml-2">{selectedName.country}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Language:</span>
            <span className="text-gray-600 ml-2">{selectedName.language}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TyphoonNameModal;
