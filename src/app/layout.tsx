import { TITLE_COMMON } from "@/lib/constants";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

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
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: `%s | ${TITLE_COMMON}`,
      default: TITLE_COMMON,
    },
    description: SITE_DESCRIPTION,
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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta
          name="google-site-verification"
          content="8LbzW8YtyO7c8biOK5LX8xyYBcU7IHuD7Je35ZNdgtc"
        />
      </head>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
