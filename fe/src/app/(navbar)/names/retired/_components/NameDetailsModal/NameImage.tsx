import Image from "next/image";

interface NameImageProps {
  src?: string;
  alt: string;
  description?: string;
}

const NameImage = ({ src, alt, description }: NameImageProps) => {
  const hasImage = !!src;
  const hasDescription = !!description;

  // Determine image visibility: hidden if no src and no description, invisible if no src but has description
  const getImageVisibility = (): string => {
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
      <div className={`relative flex max-h-72 justify-center ${getImageVisibility()}`}>
        {hasImage && (
          <Image
            src={src}
            alt={alt}
            width={400}
            height={288}
            className="rounded-lg object-cover shadow-md"
            unoptimized
          />
        )}
      </div>
      <p className="text-center text-xs text-gray-700 italic">{description || ""}</p>
    </div>
  );
};

export default NameImage;
