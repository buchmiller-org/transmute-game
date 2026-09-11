/**
 * Material family definitions for Transmute.
 * Phase 2: Flora & Fungi.
 */

export const FLORA = {
  id: 'flora',
  name: 'Flora',
  tiers: [
    { tier: 1, name: 'Dormant Seed',   emoji: '🌱', dustYield: 1 },
    { tier: 2, name: 'Tender Sprout',  emoji: '🌿', dustYield: 3 },
    { tier: 3, name: 'Wild Herb',      emoji: '🌾', dustYield: 8 },
    { tier: 4, name: 'Aromatic Bloom', emoji: '🌺', dustYield: 20 },
  ],
};

export const FUNGI = {
  id: 'fungi',
  name: 'Fungi',
  tiers: [
    { tier: 1, name: 'Fragile Spore',      emoji: '🍄', dustYield: 1 },
    { tier: 2, name: 'Pale Mycelium',      emoji: '🕸️', dustYield: 3 },
    { tier: 3, name: 'Luminescent Cap',    emoji: '💡', dustYield: 8 },
    { tier: 4, name: 'Truffle of Vitality', emoji: '🟤', dustYield: 20 },
  ],
};

/** All registered families, keyed by ID. */
export const FAMILIES = {
  flora: FLORA,
  fungi: FUNGI,
};

/** Look up a family definition by ID. */
export function getFamilyDef(familyId) {
  return FAMILIES[familyId] ?? null;
}

/** Look up a specific tier definition within a family. */
export function getTierDef(familyId, tier) {
  const family = FAMILIES[familyId];
  if (!family) return null;
  return family.tiers.find(t => t.tier === tier) ?? null;
}

/** Get the maximum (capstone) tier for a family. */
export function getMaxTier(familyId) {
  const family = FAMILIES[familyId];
  if (!family) return 0;
  return family.tiers[family.tiers.length - 1].tier;
}
