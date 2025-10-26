const ModalHeader = ({ onClose }) => {
  return (
    <div className="p-6 pb-4 border-b border-gray-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Filter Options</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;
