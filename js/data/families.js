/**
 * Material family definitions for Transmute.
 * Phase 1: Flora only.
 */

export const FLORA = {
  id: 'flora',
  name: 'Flora',
  tiers: [
    { tier: 1, name: 'Dormant Seed',   emoji: '🌱' },
    { tier: 2, name: 'Tender Sprout',  emoji: '🌿' },
    { tier: 3, name: 'Wild Herb',      emoji: '🌾' },
    { tier: 4, name: 'Aromatic Bloom', emoji: '🌺' },
  ],
};

/** All registered families, keyed by ID. */
export const FAMILIES = {
  flora: FLORA,
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
