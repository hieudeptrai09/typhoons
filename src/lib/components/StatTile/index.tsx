import type { ReactNode } from "react";

// A labelled dashboard figure: small caption on top, bold value underneath.

const StatTile = ({
  label,
  title,
  valueClassName = "text-lg",
  children,
}: {
  label: string;
  title?: string;
  valueClassName?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col rounded-md bg-slate-50 px-3 py-2" title={title}>
    <span className="text-xs text-foreground">{label}</span>
    <span className={`font-bold whitespace-nowrap tabular-nums ${valueClassName}`}>{children}</span>
  </div>
);

export default StatTile;
