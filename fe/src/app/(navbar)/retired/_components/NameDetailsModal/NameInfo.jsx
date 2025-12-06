const NameInfo = ({ meaning, country, position, language }) => {
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 group">
      <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-base text-gray-800 font-medium leading-relaxed break-words">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <InfoItem icon="✨" label="Meaning" value={meaning} />
      <InfoItem icon="🌍" label="Country" value={country} />
      <InfoItem icon="📍" label="Position" value={position} />
      <InfoItem icon="🗣️" label="Language" value={language} />
    </div>
  );
};

export default NameInfo;
