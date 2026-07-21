import type { ImageCredit as ImageCreditType } from "@/lib/types";
import { Image as ImageIcon, ScrollText } from "lucide-react";

interface ImageCreditProps {
  credit?: ImageCreditType;
  position?: "top" | "bottom";
}

const ImageCredit = ({ credit, position = "bottom" }: ImageCreditProps) => {
  if (!credit?.author) return null;

  const { author, license, licenseUrl, sourceUrl } = credit;
  const linkClass = "text-gray-400! hover:underline";
  const spacing = position === "top" ? "mb-1.5" : "mt-1.5";

  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] leading-relaxed text-gray-400 ${spacing} `}
    >
      <span className="inline-flex items-center gap-1">
        <ImageIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={linkClass}
          >
            {author}
          </a>
        ) : (
          author
        )}
      </span>
      {license && (
        <span className="inline-flex items-center gap-1">
          <ScrollText className="h-3 w-3 shrink-0" aria-hidden="true" />
          {licenseUrl ? (
            <a
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer nofollow license"
              className={linkClass}
            >
              {license}
            </a>
          ) : (
            license
          )}
        </span>
      )}
    </p>
  );
};

export default ImageCredit;
