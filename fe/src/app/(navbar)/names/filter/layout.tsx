import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Filter Typhoon Names",
};

export default function FilterNamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return <>{children}</>;
}
