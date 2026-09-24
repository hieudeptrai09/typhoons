import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface LinkCardProps {
  href: string;
  title: string;
  icon: ReactNode;
  // Full class string so Tailwind sees it: the tinted square behind the icon.
  iconClass: string;
  isExternal?: boolean;
  children: ReactNode;
}

// The link is the title alone, stretched over the card by its ::after: the whole card clicks,
// but only the title underlines on hover and the link's accessible name stays short.
const LINK_CLASS =
  "font-semibold text-slate-800 after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-sky-700";

const LinkCard = ({ href, title, icon, iconClass, isExternal, children }: LinkCardProps) => (
  <div className="relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconClass}`}>
        {icon}
      </span>
      {isExternal && <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />}
    </div>

    <h3 className="mt-4">
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {title}
        </a>
      ) : (
        <Link href={href} className={LINK_CLASS}>
          {title}
        </Link>
      )}
    </h3>
    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{children}</p>
  </div>
);

export default LinkCard;
