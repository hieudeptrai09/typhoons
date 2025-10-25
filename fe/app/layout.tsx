import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Typhoons App",
  description: "Show you all the typhoons and the secret behind their names",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
