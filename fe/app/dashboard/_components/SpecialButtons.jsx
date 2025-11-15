export const SpecialButtons = ({ onCellClick }) => {
  const buttons = [
    { id: 141, label: "CPHC" },
    { id: 142, label: "NHC" },
  ];

  return (
    <div className="mt-6 flex justify-center gap-4">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => onCellClick(button.id, "position")}
          className="px-8 py-4 bg-sky-100 text-gray-800 font-semibold rounded-lg hover:bg-sky-200 transition-colors border border-sky-300"
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};
