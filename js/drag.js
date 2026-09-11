/**
 * Drag-and-drop controller — PointerEvent state machine.
 * Supports two interaction modes:
 *   1. Drag-and-drop (press → move → release)
 *   2. Tap-to-select (tap source, tap destination)
 */
import { Container, Graphics, Text } from 'pixi.js';
import { canMerge, executeMerge, playMergeAnimation } from './merge.js';

const DRAG_THRESHOLD = 8;     // px movement before a press becomes a drag
const TOUCH_Y_OFFSET = -60;   // offset drag avatar above finger on touch

/** Highlight color/alpha presets */
const HL = {
  selected:   { c: 0xffd700, a: 0.45 }, // Increased alpha for clearer selection
  validMove:  { c: 0x4488aa, a: 0.15 },
  validMerge: { c: 0x88cc44, a: 0.25 },
  hoverMove:  { c: 0x66aacc, a: 0.35 },
  hoverMerge: { c: 0xaaee44, a: 0.45 },
  invalid:    { c: 0xff3333, a: 0.35 },
};

export class DragController {
  /**
   * @param {object} opts
   * @param {Application} opts.app   - PixiJS Application
   * @param {Board}       opts.board - The game board
   */
  constructor({ app, board }) {
    this.app   = app;
    this.board = board;

    // Drag state
    this.state      = 'IDLE';   // IDLE | PRESSING | DRAGGING
    this.sourceIdx  = -1;
    this.sourceItem = null;
    this.dragAvatar = null;
    this.startPos   = null;
    this.validTargets = new Set();

    // Tap-to-select state
    this.selectedIdx = -1;

    this._attachEvents();
  }

  // ═══════════════════ Event Wiring ═══════════════════

  _attachEvents() {
    // Per-tile pointerdown
    for (const tile of this.board.tiles) {
      tile.container.on('pointerdown', (e) =>
        this._onTileDown(e, tile.container.tileIndex));
    }

    // Stage-level events for move / up / cancel
    const stage = this.app.stage;
    stage.eventMode = 'static';
    stage.hitArea   = this.app.screen;

    stage.on('pointermove',      (e) => this._onMove(e));
    stage.on('pointerup',        (e) => this._onUp(e));
    stage.on('pointerupoutside', (e) => this._onUp(e));
    stage.on('pointercancel',    ()  => this._cancelDrag());
  }

  // ═══════════════════ Pointer Handlers ═══════════════════

  _onTileDown(event, tileIdx) {
    const item = this.board.getCell(tileIdx);

    // ── Active selection handling ──
    if (this.selectedIdx >= 0) {
      if (tileIdx === this.selectedIdx) {
        // Tapped the already-selected tile. Prepare to drag it.
        this.state      = 'PRESSING';
        this.sourceIdx  = tileIdx;
        this.sourceItem = item;
        this.startPos   = { x: event.global.x, y: event.global.y };
        return;
      } else {
        // Tapped a different tile: execute the selection action (move/merge)
        this._executeSelection(tileIdx);
        return;
      }
    }

    if (!item) return; // empty tile — ignore

    // ── Begin potential drag or new selection ──
    this.state      = 'PRESSING';
    this.sourceIdx  = tileIdx;
    this.sourceItem = item;
    this.startPos   = { x: event.global.x, y: event.global.y };
    this._computeValidTargets();
  }

  _onMove(event) {
    if (this.state === 'PRESSING') {
      const dx = event.global.x - this.startPos.x;
      const dy = event.global.y - this.startPos.y;
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
        this._beginDrag(event);
      }
    }
    if (this.state === 'DRAGGING') {
      this._updateDrag(event);
    }
  }

  _onUp(event) {
    if (this.state === 'PRESSING') {
      // Short press, no real movement -> Tap-to-select logic
      if (this.selectedIdx === this.sourceIdx) {
        // Tapped the currently selected tile again -> Deselect it
        this._clearSelection();
      } else {
        // Select the new tile
        this._selectTile(this.sourceIdx);
      }
      this._resetPressState();
      return;
    }
    if (this.state === 'DRAGGING') {
      this._endDrag(event);
    }
  }

  // ═══════════════════ Drag Lifecycle ═══════════════════

  _beginDrag(event) {
    this.state = 'DRAGGING';
    
    // Clear any existing tap-to-select state (this empties validTargets)
    this._clearSelection();

    // Re-compute valid targets specifically for this drag
    this._computeValidTargets();

    // Dim the source tile's item display
    const src = this.board.tiles[this.sourceIdx];
    src.itemText.alpha = 0.3;
    src.tierText.alpha = 0.3;

    // Create floating drag avatar
    this._createAvatar(event);

    // Highlight valid drop targets
    for (const idx of this.validTargets) {
      const cell = this.board.getCell(idx);
      const m    = cell && canMerge(this.sourceItem, cell);
      this.board.setTileHighlight(idx,
        m ? HL.validMerge.c : HL.validMove.c,
        m ? HL.validMerge.a : HL.validMove.a);
    }
  }

  _updateDrag(event) {
    this._positionAvatar(event);

    // Determine which tile the pointer is over
    const local    = this.board.container.toLocal(event.global);
    const hoverIdx = this.board.getTileAtLocal(local.x, local.y);

    // Update highlight intensity for hovered vs non-hovered targets
    for (const idx of this.validTargets) {
      const cell    = this.board.getCell(idx);
      const isMerge = cell && canMerge(this.sourceItem, cell);
      const hover   = idx === hoverIdx;
      this.board.setTileHighlight(idx,
        hover ? (isMerge ? HL.hoverMerge.c : HL.hoverMove.c)
              : (isMerge ? HL.validMerge.c : HL.validMove.c),
        hover ? (isMerge ? HL.hoverMerge.a : HL.hoverMove.a)
              : (isMerge ? HL.validMerge.a : HL.validMove.a));
    }
  }

  _endDrag(event) {
    const local     = this.board.container.toLocal(event.global);
    const targetIdx = this.board.getTileAtLocal(local.x, local.y);

    // Clean up visuals
    this._destroyAvatar();
    this.board.clearAllHighlights();
    this._restoreSourceTile();

    // ── Resolve drop ──
    if (targetIdx >= 0 && targetIdx !== this.sourceIdx && this.validTargets.has(targetIdx)) {
      const targetCell = this.board.getCell(targetIdx);

      if (targetCell && canMerge(this.sourceItem, targetCell)) {
        // Merge!
        const merged = executeMerge(this.board, this.sourceIdx, targetIdx);
        if (merged) playMergeAnimation(this.board, targetIdx);
      } else if (!targetCell) {
        // Move to empty tile
        this.board.clearCell(this.sourceIdx);
        this.board.setCell(targetIdx, this.sourceItem);
      }
    } else if (targetIdx >= 0 && targetIdx !== this.sourceIdx) {
      // Invalid target → brief red flash
      this.board.setTileHighlight(targetIdx, HL.invalid.c, HL.invalid.a);
      setTimeout(() => this.board.clearTileHighlight(targetIdx), 200);
    }

    this._resetPressState();
  }

  _cancelDrag() {
    this._destroyAvatar();
    this.board.clearAllHighlights();
    this._restoreSourceTile();
    this._resetPressState();
  }

  // ═══════════════════ Drag Avatar ═══════════════════

  _createAvatar(event) {
    const ts = this.board.tileSize;
    this.dragAvatar = new Container();

    const bg = new Graphics();
    bg.roundRect(0, 0, ts, ts, 6).fill({ color: 0x5c4f40, alpha: 0.85 });
    this.dragAvatar.addChild(bg);

    const emoji = new Text({
      text: this.sourceItem.emoji,
      style: { fontSize: Math.floor(ts * 0.45), fill: 0xffffff, fontFamily: 'serif' },
    });
    emoji.anchor.set(0.5);
    emoji.x = ts / 2;
    emoji.y = ts * 0.38;
    this.dragAvatar.addChild(emoji);

    const tier = new Text({
      text: `T${this.sourceItem.tier}`,
      style: {
        fontSize: Math.floor(ts * 0.22),
        fill: 0xd4c4a8,
        fontFamily: 'Georgia, serif',
        fontWeight: 'bold',
      },
    });
    tier.anchor.set(0.5);
    tier.x = ts / 2;
    tier.y = ts * 0.72;
    this.dragAvatar.addChild(tier);

    this.dragAvatar.pivot.set(ts / 2, ts / 2);
    this.dragAvatar.alpha = 0.9;
    this._positionAvatar(event);

    this.app.stage.addChild(this.dragAvatar);
  }

  _positionAvatar(event) {
    if (!this.dragAvatar) return;
    const yOff = event.pointerType === 'touch' ? TOUCH_Y_OFFSET : 0;
    this.dragAvatar.x = event.global.x;
    this.dragAvatar.y = event.global.y + yOff;
  }

  _destroyAvatar() {
    if (this.dragAvatar) {
      this.dragAvatar.destroy({ children: true });
      this.dragAvatar = null;
    }
  }

  // ═══════════════════ Tap-to-Select ═══════════════════

  _selectTile(idx) {
    this._clearSelection();
    const item = this.board.getCell(idx);
    if (!item) return;

    this.selectedIdx = idx;
    this.sourceItem  = item;
    this.board.setTileHighlight(idx, HL.selected.c, HL.selected.a);

    // Show valid target hints
    this._computeValidTargets();
    for (const ti of this.validTargets) {
      const cell = this.board.getCell(ti);
      const m    = cell && canMerge(item, cell);
      this.board.setTileHighlight(ti,
        m ? HL.validMerge.c : HL.validMove.c,
        m ? HL.validMerge.a : HL.validMove.a);
    }
  }

  _executeSelection(targetIdx) {
    const sourceIdx  = this.selectedIdx;
    const sourceItem = this.board.getCell(sourceIdx);
    this._clearSelection();

    if (!sourceItem || targetIdx === sourceIdx) return;

    const targetCell = this.board.getCell(targetIdx);

    if (targetCell && canMerge(sourceItem, targetCell)) {
      const merged = executeMerge(this.board, sourceIdx, targetIdx);
      if (merged) playMergeAnimation(this.board, targetIdx);
    } else if (!targetCell) {
      this.board.clearCell(sourceIdx);
      this.board.setCell(targetIdx, sourceItem);
    } else {
      // Can't merge → select the tapped tile instead
      this._selectTile(targetIdx);
    }
  }

  _clearSelection() {
    this.selectedIdx = -1;
    this.board.clearAllHighlights();
    this.validTargets.clear();
  }

  // ═══════════════════ Helpers ═══════════════════

  _computeValidTargets() {
    this.validTargets.clear();
    for (let i = 0; i < this.board.cells.length; i++) {
      if (i === this.sourceIdx) continue;
      const cell = this.board.getCell(i);
      if (cell === null || canMerge(this.sourceItem, cell)) {
        this.validTargets.add(i);
      }
    }
  }

  _restoreSourceTile() {
    if (this.sourceIdx >= 0) {
      const t = this.board.tiles[this.sourceIdx];
      t.itemText.alpha = 1;
      t.tierText.alpha = 1;
    }
  }

  _resetPressState() {
    this.state      = 'IDLE';
    this.sourceIdx  = -1;
    this.sourceItem = null;
    this.startPos   = null;
  }
}
