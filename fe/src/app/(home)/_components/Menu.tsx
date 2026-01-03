import Link from "next/link";

export interface MenuProps {
  href: string;
  label: string;
  color: string;
  hoverColor: string;
}

const Menu = ({ href, label, color, hoverColor }: MenuProps) => {
  return (
    <Link
      href={href}
      className={`${color} ${hoverColor} flex items-center justify-center gap-3 rounded-full py-3`}
    >
      <h2 className="text-2xl font-bold text-white">{label}</h2>
    </Link>
  );
};

export default Menu;
