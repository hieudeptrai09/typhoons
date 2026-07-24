import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import ImageCredit from "@/lib/components/ImageCredit";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import type { RetiredName, TyphoonName } from "@/lib/types";
import { Inbox } from "lucide-react";

export interface NameDetailsContentProps {
  name: TyphoonName | RetiredName | null;
  hideReplacedBy?: boolean;
  correctSpelling?: string;
}

const NameDetailsContent = ({
  name,
  hideReplacedBy = false,
  correctSpelling,
}: NameDetailsContentProps) => {
  if (!name) {
    return (
      <EmptyResults icon={Inbox} description="No name details available for this external name." />
    );
  }

  const replacementName =
    !hideReplacedBy && "replacementName" in name ? name.replacementName : undefined;
  const crossRef = correctSpelling
    ? { label: "Correct spelling", value: correctSpelling }
    : replacementName
      ? { label: "Replaced by", value: replacementName }
      : undefined;

  return (
    <article className={`flex gap-6 ${name.image ? "flex-col sm:flex-row" : "flex-col"}`}>
      <div className="min-w-0 flex-1 space-y-4">
        <header>
          {(name.originalText || name.ipa) && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {name.originalText && (
                <span className="text-2xl leading-tight font-semibold text-foreground">
                  {name.originalText}
                </span>
              )}
              {name.ipa && (
                <span className="font-mono text-sm text-slate-500" aria-label="Pronunciation">
                  {name.ipa}
                </span>
              )}
            </div>
          )}
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 italic">
            {name.language}, from {name.country}
            <CountryFlag country={name.country} className="h-4 w-6 not-italic" />
          </div>
        </header>

        <p className="text-lg leading-relaxed font-semibold text-teal-600">{name.meaning}</p>

        {name.description && (
          <p className="text-sm leading-relaxed text-foreground">{name.description}</p>
        )}

        {crossRef && (
          <footer className="border-t border-slate-200 pt-3 text-sm text-foreground">
            {crossRef.label} <span className="font-semibold text-teal-600">{crossRef.value}</span>
          </footer>
        )}
      </div>

      {name.image && (
        <figure className="min-w-0 flex-1">
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
            <ImageCredit credit={name.imageCredit} />
          </div>
        </figure>
      )}
    </article>
  );
};

export default NameDetailsContent;
