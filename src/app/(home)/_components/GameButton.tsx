import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Full class strings so Tailwind sees them: fill, darker hover, and the darker bottom edge.
  colorClass: string;
  children: ReactNode;
}

// A chunky game-menu button with a thick darker bottom edge; it only darkens on hover, with no movement.
const GameButton = ({ colorClass, className = "", children, ...props }: GameButtonProps) => (
  <button
    type="button"
    className={`flex h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-b-4 px-6 text-xl font-extrabold tracking-wide shadow-md transition-colors disabled:cursor-wait ${colorClass} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default GameButton;
