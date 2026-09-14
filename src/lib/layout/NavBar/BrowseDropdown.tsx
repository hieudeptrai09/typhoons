import { BROWSE_LINKS, isBrowseLinkActive, isBrowsePath } from "@/lib/layout/browseLinks";
import { Button, Dropdown, type MenuProps } from "antd";
import { ChevronDown, Compass } from "lucide-react";
import Link from "next/link";

interface BrowseDropdownProps {
  currentPath: string;
}

const BrowseDropdown = ({ currentPath }: BrowseDropdownProps) => {
  const items: MenuProps["items"] = BROWSE_LINKS.map(({ href, label, icon: Icon }) => ({
    key: href,
    icon: <Icon size={16} />,
    label: <Link href={href}>{label}</Link>,
  }));

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: BROWSE_LINKS.filter((link) => isBrowseLinkActive(link, currentPath)).map(
          (link) => link.href,
        ),
      }}
      trigger={["hover", "click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={<Compass size={20} />}
        className={`text-white! hover:bg-white/30! hover:text-white! ${isBrowsePath(currentPath) ? "font-bold!" : ""}`}
      >
        Browse
        <ChevronDown size={16} aria-hidden="true" />
      </Button>
    </Dropdown>
  );
};

export default BrowseDropdown;
