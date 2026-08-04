import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import ImageCredit from "@/lib/components/ImageCredit";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import type { RetiredName, TyphoonName } from "@/lib/types";
import { capitalize } from "@/lib/utils/fns";
import { Inbox, Volume2 } from "lucide-react";

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
  const pronunciationFile = name.pronunciationFile?.trim();
  const crossRef = correctSpelling
    ? { label: "Correct spelling", value: correctSpelling }
    : replacementName
      ? { label: "Replaced by", value: replacementName }
      : undefined;

  // The same content renders in a narrow modal and on the wide /info page.
  // Container queries drive the layout off the actual width: a narrow container
  // stacks (image as a full-width banner on top, details below) so no space is
  // wasted, while a wide one uses the two-column layout.
  return (
    <div className="@container">
      <article className="flex flex-col gap-5 @md:flex-row @md:items-center @md:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header>
            {(name.originalText || name.ipa || pronunciationFile) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
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
                {pronunciationFile && (
                  <a
                    href={`https://www.typhooncommittee.org/tcsounds/${encodeURIComponent(pronunciationFile)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-slate-400! hover:text-teal-600!"
                    title={`Listen to the pronunciation of ${capitalize(name.name.toLowerCase())}`}
                    aria-label={`Listen to the pronunciation of ${capitalize(name.name.toLowerCase())}`}
                  >
                    <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
            <div className="mt-1 text-sm text-slate-500 italic">
              <span className="mr-2">
                {name.language}, from {name.country}
              </span>
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
          // order-first keeps the image on top when stacked (narrow modal); in the
          // two-column layout it returns to the right, sized so the shorter details
          // column sits centered beside it rather than leaving a tall empty gap.
          <figure className="order-first min-w-0 @md:order-none @md:w-2/5 @md:shrink-0">
            <div className="relative h-52 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 @md:aspect-[4/3] @md:h-auto">
              <ImageWithLoader
                src={name.image}
                alt={name.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <ImageCredit credit={name.imageCredit} />
          </figure>
        )}
      </article>
    </div>
  );
};

export default NameDetailsContent;
