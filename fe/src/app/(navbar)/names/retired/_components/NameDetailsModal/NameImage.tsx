import Image from "next/image";

interface NameImageProps {
  src?: string;
  alt: string;
  description?: string;
}

const NameImage = ({ src, alt, description }: NameImageProps) => {
  const hasDescription = !!description;

  return src ? (
    <div className={`flex flex-1 flex-col gap-2 ${!hasDescription && "self-end"}`}>
      <div
        className="relative flex max-h-3/4 justify-center rounded-lg bg-gray-50"
        style={{ aspectRatio: "4/3" }}
      >
        <Image src={src} alt={alt} fill className="object-contain" unoptimized />
      </div>
      {description && <p className="text-center text-xs text-gray-700 italic">{description}</p>}
    </div>
  ) : (
    <></>
  );
};

export default NameImage;
