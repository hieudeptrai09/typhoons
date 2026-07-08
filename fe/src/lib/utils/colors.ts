import type { IntensityType } from "@/lib/types";

// AUDIT (WCAG contrast + semantic color review — see individual notes below).
// This file is the only centralized color source in the app, but several
// components re-implement the same red/green/amber logic locally instead of
// importing from here (see DUPLICATE notes at each site). Ratios computed
// against WCAG 2.1 formula; AA normal text needs >=4.5:1, AA large text/UI
// components need >=3:1.

// --- Intensity badge colors ---
// TEXT_COLOR_BADGE is meant to pair with BACKGROUND_BADGE (badge chip: colored
// bg + this text color). Measured per-key below (badge bg vs its own text):
//   TD:  #00CCFF bg / #FFFFFF text -> 1.90:1  WCAG FAIL (fails even 3:1 large-text/UI)
//   TS:  #00FF00 bg / #005500 text -> 6.66:1  PASS AA
//   STS: #C0FFC0 bg / #004D26 text -> 8.76:1  PASS AAA
//   1:   #FFFF00 bg / #666600 text -> 5.64:1  PASS AA
//   2:   #FFCC00 bg / #663300 text -> 6.81:1  PASS AA
//   3:   #FF6600 bg / #FFFFFF text -> 2.94:1  WCAG FAIL (fails even 3:1 large-text/UI)
//   4:   #FF0000 bg / #FFFFFF text -> 4.00:1  FAIL for normal text AA (passes 3:1 large-text/UI only)
//   5:   #CC00CC bg / #FFFFFF text -> 4.73:1  PASS AA (barely)
export const BACKGROUND_BADGE: Record<IntensityType, string> = {
  TD: "#00CCFF",
  TS: "#00FF00",
  STS: "#C0FFC0",
  1: "#FFFF00",
  2: "#FFCC00",
  3: "#FF6600",
  4: "#FF0000",
  5: "#CC00CC",
};

export const BACKGROUND_HOVER_BADGE: Record<IntensityType, string> = {
  TD: "#00B3E6",
  TS: "#00E600",
  STS: "#ADEBAD",
  1: "#EBEB00",
  2: "#EBB800",
  3: "#EB5C00",
  4: "#EB0000",
  5: "#B800B8",
};

export const TEXT_COLOR_BADGE: Record<IntensityType, string> = {
  TD: "#FFFFFF",
  TS: "#005500",
  STS: "#004D26",
  1: "#666600",
  2: "#663300",
  3: "#FFFFFF",
  4: "#FFFFFF",
  5: "#FFFFFF",
};

// TEXT_COLOR_WHITE_BACKGROUND: these hexes are used as plain text color on a
// white page background (StormGrid, SeasonView, PositionModal, AverageModal,
// InfoModal, etc. — see colors.ts consumers). Measured against #FFFFFF:
//   TD:  #0099CC -> 3.27:1  FAIL normal-text AA (passes 3:1 large-text/UI only)
//   TS:  #00BB00 -> 2.59:1  WCAG FAIL (fails even large-text/UI 3:1)
//   STS: #008844 -> 4.56:1  PASS AA (borderline)
//   1:   #CC9900 -> 2.58:1  WCAG FAIL (fails even large-text/UI 3:1)
//   2:   #FF9900 -> 2.14:1  WCAG FAIL (fails even large-text/UI 3:1)
//   3:   #FF5500 -> 3.21:1  FAIL normal-text AA (passes 3:1 large-text/UI only)
//   4:   #DD0000 -> 5.15:1  PASS AA
//   5:   #AA00AA -> 6.38:1  PASS AA
// Note the same intensity's badge-text variant above can pass while this
// white-background variant fails (e.g. category 1/2/TS/TD) — same hue family,
// different context, inconsistent accessibility outcome for the "same" color.
export const TEXT_COLOR_WHITE_BACKGROUND: Record<IntensityType, string> = {
  TD: "#0099CC",
  TS: "#00BB00",
  STS: "#008844",
  1: "#CC9900",
  2: "#FF9900",
  3: "#FF5500",
  4: "#DD0000",
  5: "#AA00AA",
};

// --- Distance colors ---
// Text-on-white usage (StormGrid, SpecialButtons, DistanceView):
//   <6y  #16a34a (green-600) on white -> 3.30:1  FAIL normal-text AA (passes 3:1 large-text/UI only)
//   ==6y #2563eb (blue-600)  on white -> 5.17:1  PASS AA
//   >6y  #dc2626 (red-600)   on white -> 4.83:1  PASS AA
// SEMANTIC NOTE: green here means "naming gap < 6 years" (a neutral/positive
// data fact), and red means "> 6 years" — this is a third, unrelated meaning
// for green/red beyond "active/retired name status" and "storm severity"
// (see getNameStatusColor and BACKGROUND_BADGE above). The same green-600
// hex (#16a34a) is also hardcoded independently in OnThisDay.tsx for a
// "storm formed/entered basin" icon — see DUPLICATE note there.
export const getDistanceColor = (years: number): string => {
  if (years < 6.0) return "#16a34a";
  if (years === 6.0) return "#2563eb";
  return "#dc2626";
};

// --- Name status colors ---

interface NameStatus {
  isRetired: boolean;
  isLanguageProblem: number;
}

// Text-on-white usage (inline style consumers: PositionModal, InfoModal):
//   language problem #f59e0b (amber-500) on white -> 2.15:1  WCAG FAIL (badly — fails even 3:1 large-text/UI)
//   retired           #dc2626 (red-600)   on white -> 4.83:1  PASS AA
//   active (default)  #16a34a (green-600) on white -> 3.30:1  FAIL normal-text AA (passes 3:1 large-text/UI only)
// SEMANTIC NOTE: "active name" reuses the exact same green as getDistanceColor's
// "<6 years" and is also re-implemented (not reused) as a 4th hue "teal" for
// the same "Active" concept in InfoPageContent.tsx's StatusBadge — see
// DUPLICATE/CONFLICT note there. "Retired" red-600 is also reused, unrelated,
// for "strongest storm" highlight cells in StormGrid.tsx.
export const getNameStatusColor = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "#f59e0b";
  if (Boolean(name.isRetired)) return "#dc2626";
  return "#16a34a";
};

// Tailwind-class twin of getNameStatusColor above (text-amber-500 / text-red-600
// / text-green-600 on white, same ratios as noted above). DUPLICATE: at least 3
// other places in the app re-implement this same 3-way branch locally instead
// of calling this function — see NamesView.tsx `getLetterConfig`,
// RetiredView.tsx `getLetterConfig`, and SearchPageContent.tsx's inline
// ternary (which uses amber-600 instead of amber-500, a shade mismatch for
// the identical "language problem" meaning).
export const getNameStatusColorClass = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "text-amber-500";
  if (Boolean(name.isRetired)) return "text-red-600";
  return "text-green-600";
};

// UNUSED: no component in the codebase currently imports getNameStatusBgClass.
// If ever paired with getNameStatusColorClass's text color as a badge
// (bg + text from the same status), contrast is bad across the board:
//   bg-amber-100 + text-amber-500 -> 1.93:1  WCAG FAIL (badly)
//   bg-red-100   + text-red-600   -> 3.95:1  FAIL normal-text AA (passes 3:1 large-text/UI only)
//   bg-emerald-100 + text-green-600 -> 2.91:1  WCAG FAIL (fails even large-text/UI 3:1)
// Also a hue mismatch: this function returns bg-emerald-100 for "active" while
// getNameStatusColorClass returns text-green-600 (emerald vs green) for the
// same status — inconsistent even before contrast is considered.
// InfoPageContent.tsx's local `StatusBadge` needed exactly this bg+text pill
// pattern and re-implemented it from scratch (with different hues/shades:
// amber-100/amber-600, red-100/red-600, teal-100/teal-600, slate-100/slate-500)
// rather than using this function — consolidation candidate.
export const getNameStatusBgClass = (name: NameStatus): string => {
  if (name.isLanguageProblem === 2) return "bg-amber-100";
  if (Boolean(name.isRetired)) return "bg-red-100";
  return "bg-emerald-100";
};

// SEMANTIC CONFLICT: case 1 ("Language Problem" retirement reason) returns
// the exact same class, text-green-600, as an *active* (non-retired) name in
// getNameStatusColorClass above. A retired name whose reason is "Language
// Problem" therefore renders in the identical color used elsewhere in the app
// to mean "this name is currently active" — visually indistinguishable
// status with opposite meaning depending on which table/view you're looking at.
export const getRetiredReasonColorClass = (isLanguageProblem: number): string => {
  switch (isLanguageProblem) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-green-600";
    case 2:
      return "text-amber-500";
    case 3:
      return "text-purple-600";
    default:
      return "text-red-600";
  }
};
