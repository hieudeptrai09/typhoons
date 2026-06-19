import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children: ReactNode;
}

const PageHeader = ({ title, children }: PageHeaderProps) => {
  return (
    <div className="p-8 md:p-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">{title}</h1>
      {children}
    </div>
  );
};

export default PageHeader;
