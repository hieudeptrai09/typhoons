import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Current Typhoon Names",
};

export default function StormnamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
