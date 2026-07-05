import { Button } from "antd";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, icon: Icon, label, isActive, onClick }: NavLinkProps) => {
  return (
    <Link href={href} onClick={onClick} aria-label={label}>
      <Button
        type="text"
        icon={<Icon size={20} />}
        aria-label={label}
        className={`!text-white hover:!bg-white/30 hover:!text-white ${isActive ? "!font-bold" : ""}`}
      >
        {label}
      </Button>
    </Link>
  );
};

export default NavLink;
