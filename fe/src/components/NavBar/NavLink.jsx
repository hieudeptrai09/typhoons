import Link from "next/link";

const NavLink = ({ href, icon: Icon, label, isActive, onClick }) => {
  return (
    <Link
      href={href}
      className={`text-white flex items-center space-x-2 px-4 py-1 rounded-lg transition hover:bg-white/30 ${
        isActive && "font-semibold"
      }`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export default NavLink;
