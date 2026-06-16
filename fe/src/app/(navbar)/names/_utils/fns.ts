import type { RetiredName } from "../../../../types";

export const REASON_OPTIONS = [
  { value: "0", label: "Destructive Storm" },
  { value: "1", label: "Language Problem" },
  { value: "2", label: "Misspelling" },
  { value: "3", label: "Special Storm" },
];

export const getCellBg = (name: RetiredName): string => {
  if (name.isLanguageProblem === 2) return "bg-amber-100";
  if (Boolean(name.isRetired)) return "bg-red-100";
  return "bg-emerald-100";
};
