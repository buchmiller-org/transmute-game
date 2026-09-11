/**
 * Merge logic — validate, execute, and animate merge-2 operations.
 */
import { createItem } from './item.js';
import { getMaxTier } from './data/families.js';
import { animate, easeOutBack, easeOutQuad } from './animations.js';

/**
 * Check whether two items can merge.
 * Rules: same family, same tier, below capstone tier.
 */
export function canMerge(sourceItem, targetItem) {
  if (!sourceItem || !targetItem) return false;
  if (sourceItem.family !== targetItem.family) return false;
  if (sourceItem.tier   !== targetItem.tier)   return false;
  if (sourceItem.tier   >= getMaxTier(sourceItem.family)) return false;
  return true;
}

/**
 * Execute a merge: clear source cell, place upgraded item in target cell.
 * @returns {object|null} The newly created item, or null if merge is invalid.
 */
export function executeMerge(board, sourceIdx, targetIdx) {
  const src = board.getCell(sourceIdx);
  const tgt = board.getCell(targetIdx);
  if (!canMerge(src, tgt)) return null;

  const newItem = createItem(src.family, src.tier + 1);
  board.clearCell(sourceIdx);
  board.setCell(targetIdx, newItem);
  return newItem;
}

/**
 * Play the merge celebration animation on a tile.
 * • Scale pulse: shrink → overshoot → settle (easeOutBack)
 * • White flash overlay that fades out
 */
export function playMergeAnimation(board, tileIdx) {
  const tile = board.tiles[tileIdx];

  // Scale pulse
  animate({
    target: tile.container.scale,
    from: { x: 0.6, y: 0.6 },
    to:   { x: 1.0, y: 1.0 },
    duration: 350,
    easing: easeOutBack,
  });

  // White flash
  board.setTileHighlight(tileIdx, 0xffffff, 0.5);
  animate({
    target: tile.highlight,
    from: { alpha: 0.5 },
    to:   { alpha: 0 },
    duration: 350,
    easing: easeOutQuad,
    onComplete: () => board.clearTileHighlight(tileIdx),
  });
}
