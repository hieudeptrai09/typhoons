import { COUNTRY_FLAG_COMPONENTS } from "../../../constants";

interface CountryFlagProps {
  country: string;
  className?: string;
}

const CountryFlag = ({ country, className = "h-7 w-10" }: CountryFlagProps) => {
  const FlagComponent = COUNTRY_FLAG_COMPONENTS[country];
  if (!FlagComponent) return <span className="text-gray-700">{country}</span>;

  return (
    <div
      className={`overflow-hidden rounded border border-gray-300 shadow-sm ${className}`}
      title={country}
    >
      <FlagComponent className="h-full w-full object-cover" />
    </div>
  );
};

export default CountryFlag;
