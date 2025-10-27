import Link from "next/link";

const Menu = ({ href, icon, label }) => {
  return (
    <Link
      href={href}
      className="bg-purple-800 rounded-2xl p-2 hover:bg-purple-900 transform transition-all duration-300"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-2">
        <span className="text-4xl">{icon}</span> {label}
      </h2>
    </Link>
  );
};

export default Menu;
