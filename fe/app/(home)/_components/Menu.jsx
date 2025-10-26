import Link from "next/link";

const Menu = ({ href, icon, label }) => {
  return (
    <Link
      href={href}
      className="bg-yellow-300 rounded-2xl p-2 hover:bg-yellow-400 transform transition-all duration-300"
    >
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">
        <span className="text-4xl">{icon}</span> {label}
      </h2>
    </Link>
  );
};

export default Menu;
