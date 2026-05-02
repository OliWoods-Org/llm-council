/**
 * All council presets in one place — standard (MAMA), VC deals, humanitarian impact.
 */

import { DEFAULT_COUNCIL } from "./councils/standard.js";
import { HUMANITARIAN_COUNCIL } from "./councils/humanitarian.js";
import { VC_DEALS_COUNCIL } from "./councils/vc-deals.js";
import type { CouncilMember } from "./index.js";

export const COUNCIL_VARIANT_IDS = ["standard", "vc", "humanitarian"] as const;
export type CouncilVariantId = (typeof COUNCIL_VARIANT_IDS)[number];

export type CouncilVariantMeta = {
  id: CouncilVariantId;
  label: string;
  description: string;
  members: CouncilMember[];
};

export const COUNCIL_REGISTRY: Record<CouncilVariantId, CouncilVariantMeta> = {
  standard: {
    id: "standard",
    label: "Standard / MAMA",
    description:
      "General product and engineering deliberation — default multi-model council.",
    members: DEFAULT_COUNCIL,
  },
  vc: {
    id: "vc",
    label: "VC deal analysis",
    description:
      "Diligence-oriented labels — terms, markets, data-room scale review (same models).",
    members: VC_DEALS_COUNCIL,
  },
  humanitarian: {
    id: "humanitarian",
    label: "Humanitarian & impact",
    description:
      "Ethics and field-impact framing for nonprofits, relief, and social programs (same models).",
    members: HUMANITARIAN_COUNCIL,
  },
};

export function getCouncilMembers(id: CouncilVariantId): CouncilMember[] {
  return COUNCIL_REGISTRY[id].members;
}

export function parseCouncilVariantId(raw: unknown): CouncilVariantId | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim().toLowerCase();
  if (s === "standard" || s === "vc" || s === "humanitarian") return s;
  return null;
}

export function listCouncilVariants(): Omit<CouncilVariantMeta, "members">[] {
  return COUNCIL_VARIANT_IDS.map((id) => {
    const { members: _m, ...rest } = COUNCIL_REGISTRY[id];
    return rest;
  });
}
