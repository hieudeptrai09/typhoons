"use client";

import { Button, ConfigProvider } from "antd";
import Link from "next/link";

interface MenuProps {
  href: string;
  label: string;
  bgColor: string;
  hoverBgColor: string;
}

const Menu = ({ href, label, bgColor, hoverBgColor }: MenuProps) => {
  return (
    // Scope the primary color to this button so Ant Design drives the hover /
    // active states itself, instead of swapping inline styles via JS handlers.
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: bgColor,
          colorPrimaryHover: hoverBgColor,
          colorPrimaryActive: hoverBgColor,
        },
      }}
    >
      <Link href={href} className="block">
        <Button
          block
          type="primary"
          size="large"
          shape="round"
          className="!h-12 !text-xl !font-bold"
        >
          {label}
        </Button>
      </Link>
    </ConfigProvider>
  );
};

export default Menu;
