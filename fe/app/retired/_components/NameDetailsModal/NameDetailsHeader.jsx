import NameTitle from "./NameTitle";
import NameInfo from "./NameInfo";
import NameImage from "./NameImage";

const NameDetailsHeader = ({ selectedName, onClose }) => {
  return (
    <div className="p-6 pb-4 border-b border-gray-300">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-6 flex-1">
          <div className="flex-1">
            <NameTitle
              name={selectedName.name}
              isLanguageProblem={selectedName.isLanguageProblem}
            />
            <NameInfo
              meaning={selectedName.meaning}
              country={selectedName.country}
            />
          </div>

          <NameImage src={selectedName.image} alt={selectedName.name} />
        </div>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NameDetailsHeader;
