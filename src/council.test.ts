import { describe, expect, it } from "vitest";

import { getConsensusLevel, scoreComplexity } from "./council.js";

describe("scoreComplexity", () => {
  it("defaults to medium score when no keywords match", () => {
    const r = scoreComplexity("hello world");
    expect(r.score).toBe(5);
    expect(r.factors).toEqual({});
    expect(r.recommendedMode).toBe("fast");
  });

  it("recommends single mode for low-complexity keywords", () => {
    const r = scoreComplexity("fix a typo in the label");
    expect(r.score).toBeLessThanOrEqual(3);
    expect(r.recommendedMode).toBe("single");
    expect(r.factors.typo).toBe(1);
  });

  it("recommends full council for high-complexity keywords", () => {
    const r = scoreComplexity("database migration security architecture");
    expect(r.score).toBeGreaterThanOrEqual(7);
    expect(r.recommendedMode).toBe("full");
    expect(r.factors.migration).toBe(9);
  });
});

describe("getConsensusLevel", () => {
  it("maps agreement counts to levels", () => {
    expect(getConsensusLevel(5)).toBe("unanimous");
    expect(getConsensusLevel(4)).toBe("strong-majority");
    expect(getConsensusLevel(3)).toBe("majority");
    expect(getConsensusLevel(2)).toBe("no-consensus");
    expect(getConsensusLevel(0)).toBe("no-consensus");
  });
});
