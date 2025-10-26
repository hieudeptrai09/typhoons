import Link from "next/link";
import { Home } from "lucide-react";

const NavbarLogo = ({ onClose }) => {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition"
      onClick={onClose}
    >
      <Home size={24} />
      <span className="font-semibold">Home</span>
    </Link>
  );
};

export default NavbarLogo;
