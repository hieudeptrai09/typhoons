import Link from "next/link";
import type { ReactNode } from "react";
import { GAME_BUTTON_CLASS } from "./GameButton";

interface GameLinkProps {
  href: string;
  // Full class strings so Tailwind sees them: flat fill plus its darker hover.
  colorClass: string;
  children: ReactNode;
}

// The destination twin of GameButton: a real anchor, so the menu stays crawlable and middle-clickable.
const GameLink = ({ href, colorClass, children }: GameLinkProps) => (
  <Link href={href} className={`${GAME_BUTTON_CLASS} ${colorClass}`}>
    {children}
  </Link>
);

export default GameLink;
