interface ModalActionsProps {
  onClearAll: () => void;
  onApply: () => void;
}

const ModalActions = ({ onClearAll, onApply }: ModalActionsProps) => {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={onClearAll}
        className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-400"
      >
        Clear All
      </button>
      <button
        onClick={onApply}
        className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
      >
        Apply
      </button>
    </div>
  );
};

export default ModalActions;
