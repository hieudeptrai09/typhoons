import type { ReactNode } from "react";
import Navbar from "../../components/NavBar";

interface WithNavbarLayoutProps {
  children: ReactNode;
}

export default function WithNavbarLayout({ children }: WithNavbarLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      {children}
    </div>
  );
}
