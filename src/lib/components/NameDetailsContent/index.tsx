import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import ImageCredit from "@/lib/components/ImageCredit";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import PronunciationButton from "@/lib/components/PronunciationButton";
import type { RetiredName, TyphoonName } from "@/lib/types";
import { capitalize } from "@/lib/utils/format";
import {
  AudioLines,
  ExternalLink,
  History,
  Inbox,
  Languages,
  Replace,
  SpellCheck,
  Volume2,
} from "lucide-react";
import type { ReactNode } from "react";

export interface NameDetailsContentProps {
  name: TyphoonName | RetiredName | null;
  hideReplacedBy?: boolean;
  correctSpelling?: string;
}

const InfoRow = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className="flex items-center gap-2.5 text-sm text-foreground">
    <span className="flex w-6 shrink-0 justify-center text-slate-500" aria-hidden="true">
      {icon}
    </span>
    <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">{children}</span>
  </div>
);

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
  const lastYear = "lastYear" in name ? name.lastYear : undefined;
  const pronunciationFile = name.pronunciationFile?.trim();
  const displayName = capitalize(name.name.toLowerCase());
  const englishClip = `/pronunciations/en/${encodeURIComponent(name.name)}.mp3`;
  const crossRef = correctSpelling
    ? { icon: SpellCheck, label: "Correct spelling", value: correctSpelling }
    : replacementName
      ? { icon: Replace, label: "Replaced by", value: replacementName }
      : undefined;

  return (
    <div className="@container">
      <article className="flex flex-col gap-4">
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            name.isRetired ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${name.isRetired ? "bg-rose-500" : "bg-emerald-500"}`}
            aria-hidden="true"
          />
          {name.isRetired ? "Retired" : "Active"}
        </span>

        <header className="flex flex-col gap-1.5">
          <h3 className="text-lg leading-tight font-semibold text-foreground">{name.meaning}</h3>
          {name.description && (
            <p className="text-sm leading-relaxed text-slate-500">{name.description}</p>
          )}
        </header>

        <div className="flex flex-col gap-5 @md:flex-row @md:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <InfoRow icon={<CountryFlag country={name.country} className="h-4 w-6" />}>
              {name.country} · {name.language}
            </InfoRow>

            {(name.originalText || name.ipa) && (
              <InfoRow icon={<Languages className="h-4 w-4" />}>
                {name.originalText && <span className="font-medium">{name.originalText}</span>}
                {name.ipa && <span aria-label="Pronunciation">{name.ipa}</span>}
              </InfoRow>
            )}

            <InfoRow icon={<AudioLines className="h-4 w-4" />}>
              {pronunciationFile && (
                <a
                  href={`https://www.typhooncommittee.org/tcsounds/${encodeURIComponent(pronunciationFile)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600! transition-colors hover:border-teal-600 hover:text-teal-700! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                  title={`Open the native pronunciation of ${displayName} on typhooncommittee.org`}
                  aria-label={`Open the native pronunciation of ${displayName} on typhooncommittee.org`}
                >
                  <Volume2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Native
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
                </a>
              )}
              <PronunciationButton
                src={englishClip}
                label="English"
                title={`Play the English pronunciation of ${displayName}`}
              />
            </InfoRow>

            {lastYear !== undefined && lastYear !== 0 && (
              <InfoRow icon={<History className="h-4 w-4" />}>Last used {lastYear}</InfoRow>
            )}

            {crossRef && (
              <InfoRow icon={<crossRef.icon className="h-4 w-4" />}>
                {crossRef.label}{" "}
                <span className="font-semibold text-teal-600">{crossRef.value}</span>
              </InfoRow>
            )}
          </div>

          {name.image && (
            <figure className="min-w-0 shrink-0 @md:self-end">
              <div className="relative h-36 w-full overflow-hidden rounded-lg bg-slate-50 @md:h-36 @md:w-48">
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
        </div>
      </article>
    </div>
  );
};

export default NameDetailsContent;
