import Link from "next/link";

const NavLink = ({ href, icon: Icon, label, isActive, onClick }) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
        isActive ? "bg-white/30" : "hover:bg-white/20"
      }`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export default NavLink;
