const SpecialButton = ({ id, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-24 h-24 border-2 border-sky-200 hover:bg-sky-200 cursor-pointer text-center text-xs font-semibold text-gray-600"
    >
      {label}
    </button>
  );
};

export default SpecialButton;
