import Footer from "@/lib/layout/Footer";
import Navbar from "@/lib/layout/NavBar";
import type { ReactNode } from "react";

interface WithNavbarLayoutProps {
  children: ReactNode;
}

export default function WithNavbarLayout({ children }: WithNavbarLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
