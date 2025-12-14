import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Current Typhoon Names",
  description:
    "Browse the current list of 140 typhoon names used by the Western Pacific Tropical Cyclone Committee. Explore names from 14 countries including meanings, languages, and cultural significance.",
};

export default function StormnamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
