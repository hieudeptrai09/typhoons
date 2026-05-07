import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History of Typhoon Names",
  description:
    "Browse the full historical list of all typhoon names used by the Western Pacific Tropical Cyclone Committee, organized by position. See every name that has ever occupied each slot, along with the storms that bore each name.",
};

export default function HistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
