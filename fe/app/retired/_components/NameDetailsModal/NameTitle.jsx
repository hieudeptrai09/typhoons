const NameTitle = ({ name, isLanguageProblem }) => {
  const getNameColor = () => {
    if (Border(Number(isLanguageProblem))) return "text-green-600";
    if (name === "Vamei") return "text-purple-600";
    return "text-red-600";
  };

  return (
    <h2 className={`text-3xl font-bold mb-2 ${getNameColor()}`}>{name}</h2>
  );
};

export default NameTitle;
