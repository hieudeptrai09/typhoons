export const getPositionTitle = (position: number): string => {
  if (position === 141) return "CPHC";
  if (position === 142) return "NHC";
  if (position === 143) return "IMD";
  return `#${position}`;
};

export const normalizeParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || "";
  return param || "";
};

export const toArr = (val: string) => (val ? val.split(",").filter(Boolean) : []);

export const removeFromCommaString = (val: string, item: string) =>
  val
    .split(",")
    .filter((v) => v !== item)
    .join(",");

export const toStr = (val: string[] | undefined) => (val ?? []).join(",");

export const toOpts = (items: string[]) => items.map((v) => ({ label: v, value: v }));

export const fmt = (val: string) => toArr(val).join(", ");

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
