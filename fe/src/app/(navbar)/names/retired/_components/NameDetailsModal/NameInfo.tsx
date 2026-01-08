interface NameInfoProps {
  meaning: string;
  country: string;
  position: number;
  language: string;
  replacementName: string;
}

const NameInfo = ({ meaning, country, position, language, replacementName }: NameInfoProps) => {
  return (
    <div className="flex-1">
      <p className="text-gray-700">
        <span className="font-semibold">Meaning:</span> {meaning}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Country:</span> {country}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Position:</span> {position}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Language:</span> {language}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Replacement:</span> {replacementName}
      </p>
    </div>
  );
};

export default NameInfo;
