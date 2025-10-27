import SpecialButton from "./SpecialButton";

const SpecialButtons = ({ onCellClick }) => {
  const buttons = [
    { id: "141", label: "CPHC" },
    { id: "142", label: "NHC" },
  ];

  return (
    <div className="mt-4 flex justify-evenly">
      {buttons.map((button) => (
        <SpecialButton
          key={button.id}
          id={button.id}
          label={button.label}
          onClick={() => onCellClick(button.id)}
        />
      ))}
    </div>
  );
};

export default SpecialButtons;
