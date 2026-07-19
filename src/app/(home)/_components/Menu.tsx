"use client";

import { Button } from "antd";
import Link from "next/link";

interface MenuProps {
  href: string;
  label: string;
  bgColor: string;
  hoverBgColor: string;
}

const Menu = ({ href, label, bgColor, hoverBgColor }: MenuProps) => {
  return (
    <Link href={href} className="block">
      <Button
        block
        size="large"
        shape="round"
        style={{ backgroundColor: bgColor, borderColor: bgColor }}
        className="!h-12 !text-xl !font-bold !text-white"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = hoverBgColor;
          (e.currentTarget as HTMLButtonElement).style.borderColor = hoverBgColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = bgColor;
          (e.currentTarget as HTMLButtonElement).style.borderColor = bgColor;
        }}
      >
        {label}
      </Button>
    </Link>
  );
};

export default Menu;
