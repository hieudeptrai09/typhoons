import NameTitle from "./NameTitle";
import NameInfo from "./NameInfo";

const NameDetailsHeader = ({ selectedName, onClose }) => {
  return (
    <div className="p-6 pb-4 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div>
          <NameTitle
            name={selectedName.name}
            isLanguageProblem={selectedName.isLanguageProblem}
          />
          <NameInfo
            meaning={selectedName.meaning}
            country={selectedName.country}
          />
        </div>
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

export default NameDetailsHeader;
