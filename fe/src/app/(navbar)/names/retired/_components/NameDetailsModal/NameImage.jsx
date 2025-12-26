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
      className={`flex flex-col gap-2 ${
        hasDescription || hasImage ? "flex-1" : "w-0"
      } ${!hasDescription && "self-end"}`}
    >
      <div className="flex justify-center">
        <img
          src={src || ""}
          alt={alt}
          className={`max-h-72 rounded-lg border border-gray-200 object-cover shadow-md ${getImageVisibility()}`}
        />
      </div>
      <p className="text-center text-xs text-gray-700 italic">{description || ""}</p>
    </div>
  );
};

export default NameImage;
