import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import type { RetiredName, TyphoonName } from "@/lib/types";
import { Inbox } from "lucide-react";

export interface NameDetailsContentProps {
  name: TyphoonName | RetiredName | null;
  hideReplacedBy?: boolean;
}

const NameDetailsContent = ({ name, hideReplacedBy = false }: NameDetailsContentProps) => {
  if (!name) {
    return (
      <EmptyResults icon={Inbox} description="No name details available for this external name." />
    );
  }

  const hasImage = !!name.image;
  const hasDescription = !!name.description;

  return (
    <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
      <div className="flex-1 space-y-4">
        <div>
          <div id="name-meaning-label" className="text-sm font-medium text-foreground">
            Meaning
          </div>
          <p
            className="mt-1 text-base leading-relaxed font-semibold text-teal-600 italic"
            aria-describedby="name-meaning-label"
          >
            {name.meaning}
          </p>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div id="name-origin-label" className="mb-2 text-sm font-medium text-foreground">
            Contributed by
          </div>
          <div className="flex items-center gap-3" aria-describedby="name-origin-label">
            <CountryFlag country={name.country} className="h-8 w-12" />
            <div className="text-base font-semibold text-foreground">{name.country}</div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div id="name-language-label" className="text-sm font-medium text-foreground">
            Language
          </div>
          <div className="mt-1 text-base text-foreground" aria-describedby="name-language-label">
            {name.language}
          </div>
        </div>

        {!hideReplacedBy && "replacementName" in name && name.replacementName && (
          <div className="border-t border-slate-200 pt-3">
            <div className="text-sm font-medium text-foreground">Replaced by</div>
            <div className="mt-1 text-base font-semibold text-teal-600">{name.replacementName}</div>
          </div>
        )}

        {!hasImage && hasDescription && (
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="mb-2 text-xs font-semibold tracking-wide text-foreground uppercase">
              Note
            </div>
            <p className="text-sm leading-relaxed text-foreground">{name.description}</p>
          </div>
        )}
      </div>

      {name.image && (
        <div className="min-w-0 flex-1">
          <div className="sticky top-0">
            <div
              className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              style={{ aspectRatio: "4/3" }}
            >
              <ImageWithLoader
                src={name.image}
                alt={name.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            {hasDescription && (
              <p className="mt-3 text-center text-xs leading-relaxed text-foreground italic">
                {name.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NameDetailsContent;
