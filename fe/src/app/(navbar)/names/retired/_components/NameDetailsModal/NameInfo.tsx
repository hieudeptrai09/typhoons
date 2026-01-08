interface NameInfoProps {
  meaning: string;
  country: string;
  position: number;
  language: string;
  replacementName: string;
  description: string;
  image: string;
}

const NameInfo = ({
  meaning,
  country,
  position,
  language,
  replacementName,
  description,
  image,
}: NameInfoProps) => {
  const fields = [
    { label: "Meaning", value: meaning, className: "italic" },
    { label: "Country", value: country },
    { label: "Language", value: language },
    { label: "Index", value: position },
    { label: "Replacement", value: replacementName, className: "font-semibold text-teal-600" },
  ];

  if (!!image) {
    fields.push({ label: "Description", value: description });
  }

  return (
    <div className="flex-1">
      {fields.map(({ label, value, className }) => {
        return (
          value && (
            <p key={label} className="pb-1 text-gray-700">
              <span className="rounded-sm bg-blue-50 p-1 font-semibold">{label}:</span>{" "}
              <span className={className}>{value}</span>
            </p>
          )
        );
      })}
    </div>
  );
};

export default NameInfo;
