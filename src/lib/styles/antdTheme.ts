import type { ThemeConfig } from "antd";

const BRAND = {
  primary: "#0369a1", // sky-700 — the brand color for resting states
  primaryDark: "#075985", // sky-800 — hover / highlight (extreme states) only
  headerHover: "#155e75", // cyan-800 — table header hover;
  text: "#374151", // gray-700 (matches --foreground)
  textDisabled: "#9ca3af", // gray-400 (matches --text-disabled)
  segmentedTrack: "#d1d5db", // gray-300
} as const;

// Lives apart from the provider so scripts/extract-antd-css.ts can render with the exact
// same tokens. A drift between the two would ship a stylesheet for the wrong theme.
export const ANTD_THEME: ThemeConfig = {
  // Pinned so the CSS variable scope is `.css-var-typhoon` on every page. Left to itself
  // antd derives the key from a React useId, which differs per render and would keep the
  // variable block out of the extracted stylesheet.
  cssVar: { key: "typhoon" },
  token: {
    fontFamily: "var(--font-open-sans)",
    colorPrimary: BRAND.primary,
    colorLink: BRAND.primary,
    colorText: BRAND.text,
    colorTextDisabled: BRAND.textDisabled,
  },
  components: {
    Table: {
      headerBg: BRAND.primary,
      headerColor: "#ffffff",
      headerSortActiveBg: BRAND.primaryDark,
      headerSortHoverBg: BRAND.headerHover,
      fixedHeaderSortActiveBg: BRAND.headerHover,
    },
    Segmented: {
      trackBg: BRAND.segmentedTrack,
    },
  },
};
