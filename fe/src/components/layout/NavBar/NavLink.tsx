import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, icon: Icon, label, isActive, onClick }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 rounded-lg px-4 py-1 text-white transition hover:bg-white/30 ${
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
