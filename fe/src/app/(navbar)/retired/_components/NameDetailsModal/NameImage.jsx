const NameImage = ({ src, alt, description }) => {
  const hasImage = src;
  const hasDescription = description;

  // Determine image visibility: hidden if no src and no description, invisible if no src but has description
  const getImageVisibility = () => {
    if (!hasImage && !hasDescription) return "hidden";
    if (!hasImage && hasDescription) return "invisible";
    return "";
  };

  return (
    <div
      className={`shrink-0 flex flex-col gap-3 ${
        hasDescription ? "w-72 block" : "w-0 hidden"
      }`}
    >
      <div className="relative group">
        <img
          src={src || ""}
          alt={alt}
          className={`w-full h-36 object-cover rounded-xl shadow-lg border-2 border-white ring-2 ring-gray-100 ${getImageVisibility()}`}
        />
      </div>
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-xs text-gray-700 leading-relaxed text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NameImage;
