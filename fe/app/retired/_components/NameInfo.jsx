const NameInfo = ({ meaning, country }) => {
  return (
    <>
      <p className="text-gray-700">
        <span className="font-semibold">Meaning:</span> {meaning}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Country:</span> {country}
      </p>
    </>
  );
};

export default NameInfo;
