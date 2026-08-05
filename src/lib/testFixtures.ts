import type { Storm } from "@/lib/types";

export const storm = (overrides: Partial<Storm> = {}): Storm => ({
  name: "Yagi",
  year: 2024,
  intensity: "5",
  position: 19,
  country: "Japan",
  map: "",
  ...overrides,
});
