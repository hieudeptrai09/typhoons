import { TITLE_COMMON } from "../constants";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: `%s | ${TITLE_COMMON}`,
    default: TITLE_COMMON,
  },
  description:
    "Comprehensive typhoon database featuring storm tracking, intensity analysis, and the fascinating stories behind typhoon names",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>{children}</body>
    </html>
  );
}
