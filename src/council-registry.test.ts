import { describe, expect, it } from "vitest";

import {
  COUNCIL_REGISTRY,
  getCouncilMembers,
  parseCouncilVariantId,
} from "./council-registry.js";

describe("parseCouncilVariantId", () => {
  it("accepts known ids case-insensitively", () => {
    expect(parseCouncilVariantId("standard")).toBe("standard");
    expect(parseCouncilVariantId("VC")).toBe("vc");
    expect(parseCouncilVariantId("Humanitarian")).toBe("humanitarian");
  });

  it("rejects unknown values", () => {
    expect(parseCouncilVariantId("")).toBe(null);
    expect(parseCouncilVariantId("other")).toBe(null);
    expect(parseCouncilVariantId(3)).toBe(null);
  });
});

describe("getCouncilMembers", () => {
  it("returns five members per preset", () => {
    expect(getCouncilMembers("standard").length).toBe(5);
    expect(getCouncilMembers("vc").length).toBe(5);
    expect(getCouncilMembers("humanitarian").length).toBe(5);
  });

  it("uses distinct member ids per variant", () => {
    expect(COUNCIL_REGISTRY.standard.members[0].id).not.toBe(
      COUNCIL_REGISTRY.vc.members[0].id,
    );
  });
});
