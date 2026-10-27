import type { ButtonHTMLAttributes, ReactNode } from "react";

// Shared by GameButton and GameLink so an action and a destination look identical on the menu.
export const GAME_BUTTON_CLASS =
  "flex h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl px-6 text-xl font-extrabold tracking-wide transition-colors disabled:cursor-wait";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Full class strings so Tailwind sees them: flat fill plus its darker hover.
  colorClass: string;
  children: ReactNode;
}

// A chunky game-menu button, flat: no shadow or raised edge, and it only darkens on hover, with no movement.
const GameButton = ({ colorClass, className = "", children, ...props }: GameButtonProps) => (
  <button type="button" className={`${GAME_BUTTON_CLASS} ${colorClass} ${className}`} {...props}>
    {children}
  </button>
);

export default GameButton;
