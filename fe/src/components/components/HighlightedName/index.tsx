const HighlightedName = ({
  name,
  query,
  className,
}: {
  name: string;
  query: string;
  className?: string;
}) => {
  const idx = query.trim() ? name.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (idx === -1) return <span className={className}>{name}</span>;
  return (
    <span className={className}>
      {name.slice(0, idx)}
      <span className="bg-yellow-200 text-gray-900">{name.slice(idx, idx + query.length)}</span>
      {name.slice(idx + query.length)}
    </span>
  );
};

export default HighlightedName;
