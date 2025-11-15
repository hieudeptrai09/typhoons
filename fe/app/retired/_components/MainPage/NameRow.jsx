const NameRow = ({ name, onClick }) => {
  const getNameColor = () => {
    if (Boolean(Number(name.isLanguageProblem))) return "text-green-600";
    if (name.name === "Vamei") return "text-purple-600";
    return "text-red-600";
  };

  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-6 py-4">
        <span className={`text-lg font-bold ${getNameColor()}`}>
          {name.name}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">{name.meaning}</td>
      <td className="px-6 py-4 text-gray-600">{name.country}</td>
      <td className="px-6 py-4 text-gray-600">{name.note || "-"}</td>
      <td className="px-6 py-4 text-gray-600">{name.lastYear}</td>
    </tr>
  );
};

export default NameRow;
