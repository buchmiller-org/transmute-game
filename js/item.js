/**
 * Item factory — creates item instances for the board.
 */
import { getTierDef } from './data/families.js';

let nextId = 1;

/**
 * Create a new item instance.
 * @param {string} familyId - Family identifier (e.g., 'flora')
 * @param {number} tier     - Tier level (1–4 for primary families)
 * @returns {{ id: number, family: string, tier: number, name: string, emoji: string }}
 */
export function createItem(familyId, tier) {
  const tierDef = getTierDef(familyId, tier);
  if (!tierDef) {
    throw new Error(`Unknown tier ${tier} for family "${familyId}"`);
  }
  return {
    id: nextId++,
    family: familyId,
    tier,
    name: tierDef.name,
    emoji: tierDef.emoji,
  };
}
