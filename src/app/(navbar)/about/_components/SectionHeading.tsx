import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

const SectionHeading = ({ eyebrow, title, children }: SectionHeadingProps) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">{title}</h2>
    {children && <p className="mt-3 leading-relaxed text-slate-600">{children}</p>}
  </div>
);

export default SectionHeading;
