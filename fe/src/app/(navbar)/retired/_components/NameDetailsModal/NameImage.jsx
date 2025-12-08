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
      className={`flex flex-col gap-2 ${!hasDescription ? "flex-1" : "w-0"}`}
    >
      <div className="flex justify-center">
        <img
          src={src || ""}
          alt={alt}
          className={`object-cover rounded-lg shadow-md border border-gray-200 ${getImageVisibility()}`}
        />
      </div>
      <p className="text-xs text-gray-700 italic text-center">
        {description || ""}
      </p>
    </div>
  );
};

export default NameImage;
