const NameInfo = ({ meaning, country, position, language }) => {
  return (
    <>
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
    </>
  );
};

export default NameInfo;
