import { TITLE_COMMON } from "../constants";
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://typhoons.vercel.app";
const SITE_DESCRIPTION =
  "Comprehensive typhoon database featuring storm tracking, intensity analysis, and the fascinating stories behind typhoon names";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${TITLE_COMMON}`,
    default: TITLE_COMMON,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: TITLE_COMMON,
    title: {
      template: `%s | ${TITLE_COMMON}`,
      default: TITLE_COMMON,
    },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/logo.png",
        width: 400,
        height: 134,
        alt: TITLE_COMMON,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: `%s | ${TITLE_COMMON}`,
      default: TITLE_COMMON,
    },
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "./",
  },
  keywords: [
    "typhoon",
    "typhoon names",
    "tropical storm",
    "Western Pacific",
    "storm tracking",
    "typhoon database",
    "typhoon intensity",
    "retired typhoon names",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: TITLE_COMMON,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Dataset",
      name: "Western Pacific Typhoon Database",
      description:
        "Comprehensive dataset of Western Pacific typhoons including storm names, intensities, positions, naming history, and retired names.",
      url: SITE_URL,
      keywords: [
        "typhoon",
        "tropical storm",
        "Western Pacific",
        "storm intensity",
        "typhoon names",
        "retired typhoon names",
      ],
      creator: {
        "@type": "Organization",
        name: "JEBI.SE Malakas",
      },
      temporalCoverage: "2000/..",
      spatialCoverage: {
        "@type": "Place",
        name: "Western Pacific Basin",
      },
      variableMeasured: ["Storm intensity", "Storm position", "Storm year", "Typhoon name origin"],
    },
  ],
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');`,
          }}
        />
      </body>
    </html>
  );
}
