import { COUNTRY_FLAG_COMPONENTS } from "../../../../../../constants";

interface NameInfoProps {
  name: string;
  meaning: string;
  country: string;
  position: number;
  language: string;
  replacementName: string;
  description: string;
  image: string;
}

const NameInfo = ({
  name,
  meaning,
  country,
  position,
  language,
  replacementName,
  description,
  image,
}: NameInfoProps) => {
  const FlagComponent = COUNTRY_FLAG_COMPONENTS[country];

  return (
    <div className="flex-1 space-y-4">
      <div className="border-b-2 border-gray-300 pb-3">
        <h2 className="text-2xl font-bold text-gray-900">{name}</h2>

        <div className="mt-2 flex items-center gap-2">
          {FlagComponent && (
            <div className="h-7 w-10 overflow-hidden rounded border border-gray-300 shadow-sm">
              <FlagComponent className="h-full w-full object-cover" />
            </div>
          )}
          <p className="text-sm text-gray-600">
            <span className="font-medium">{country}</span>
            <span className="mx-1">•</span>
            <span className="italic">{language}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Meaning</p>
          <p className="mt-1 text-base leading-relaxed text-gray-800 italic">{meaning}</p>
        </div>

        {description && !image && (
          <div>
            <p className="mt-1 text-base leading-relaxed text-gray-700">{description}</p>
          </div>
        )}

        <div className="space-y-1.5 border-t border-gray-200 pt-3 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Index Position:</span> #{position}
          </p>
          {replacementName && (
            <p className="text-gray-600">
              <span className="font-medium">Replaced by:</span>{" "}
              <span className="font-semibold text-teal-600">{replacementName}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameInfo;
