import { capitalize } from "./format";

describe("capitalize", () => {
  it("uppercases the first character only", () => {
    expect(capitalize("strongest")).toBe("Strongest");
    expect(capitalize("avgdate")).toBe("Avgdate");
  });

  it("tolerates an empty string", () => {
    expect(capitalize("")).toBe("");
  });
});
