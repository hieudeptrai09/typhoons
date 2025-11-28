import Link from "next/link";

const Menu = ({ href, icon, label, color, hoverColor }) => {
  return (
    <Link
      href={href}
      className={`${color} ${hoverColor} rounded-2xl py-4 transform transition-all duration-300 shadow-lg flex items-center justify-center gap-3`}
    >
      <span className="text-5xl" role="img" aria-label={label}>
        {icon}
      </span>
      <h2 className="text-2xl font-bold text-white">{label}</h2>
    </Link>
  );
};

export default Menu;
