import { ImageOff } from "lucide-react";

/**
 * Neutral placeholder shown when an image is missing or fails to load, so a
 * broken source reads as "intentionally no image" rather than a broken page.
 * The caption only appears once the container is wide enough (container query),
 * so it stays clean on small thumbnails; an sr-only label is always present.
 */
const NoImage = ({ label = "No image available" }: { label?: string }) => (
  <div
    role="img"
    aria-label={label}
    className="@container flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-center text-gray-400"
  >
    <ImageOff className="h-1/4 w-1/4 min-h-6 min-w-6" strokeWidth={1.5} aria-hidden />
    <span aria-hidden className="hidden text-xs font-medium @[7rem]:block">
      {label}
    </span>
  </div>
);

export default NoImage;
