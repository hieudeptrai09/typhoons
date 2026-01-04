import { Menu, X } from "lucide-react";

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MenuToggle = ({ isOpen, onToggle }: MenuToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="z-50 flex items-center justify-center rounded-lg p-2 transition hover:bg-white/20 md:hidden"
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default MenuToggle;
