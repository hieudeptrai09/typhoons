import { Menu, X } from "lucide-react";

const MenuToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/20 transition z-50"
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default MenuToggle;
