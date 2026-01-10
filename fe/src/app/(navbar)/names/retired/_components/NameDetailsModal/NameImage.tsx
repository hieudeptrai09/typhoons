import Image from "next/image";

interface NameImageProps {
  src?: string;
  alt: string;
  description?: string;
}

const NameImage = ({ src, alt, description }: NameImageProps) => {
  const hasDescription = !!description;

  return src ? (
    <div className="flex flex-1 flex-col gap-3">
      <div
        className="relative flex justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 shadow-sm"
        style={{ aspectRatio: "4/3" }}
      >
        <Image src={src} alt={alt} fill className="object-contain" unoptimized />
      </div>
      {hasDescription && (
        <p className="text-center text-xs leading-relaxed text-gray-600 italic">{description}</p>
      )}
    </div>
  ) : null;
};

export default NameImage;
