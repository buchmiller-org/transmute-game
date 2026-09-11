/**
 * Drag-and-drop controller — PointerEvent state machine.
 * Supports tap-to-select, drag-to-merge, grid unlocking, and pulverizing.
 */
import { Container, Graphics, Text } from 'pixi.js';
import { canMerge, executeMerge, playMergeAnimation } from './merge.js';
import { TILE_STATE } from './board.js';
import { getTierDef, getMaxTier } from './data/families.js';

const DRAG_THRESHOLD = 8;
const TOUCH_Y_OFFSET = -60;

const HL = {
  selected:   { c: 0xffd700, a: 0.45 },
  validMove:  { c: 0x4488aa, a: 0.15 },
  validMerge: { c: 0x88cc44, a: 0.25 },
  hoverMove:  { c: 0x66aacc, a: 0.35 },
  hoverMerge: { c: 0xaaee44, a: 0.45 },
  invalid:    { c: 0xff3333, a: 0.35 },
};

export class DragController {
  constructor({ app, board, hud, economy }) {
    this.app   = app;
    this.board = board;
    this.hud   = hud;
    this.economy = economy;

    this.state      = 'IDLE';
    this.sourceIdx  = -1;
    this.sourceItem = null;
    this.dragAvatar = null;
    this.startPos   = null;
    this.validTargets = new Set();
    this.selectedIdx = -1;

    this._attachEvents();
  }

  _attachEvents() {
    for (const tile of this.board.tiles) {
      tile.container.on('pointerdown', (e) => this._onTileDown(e, tile.container.tileIndex));
    }
    
    // Tap-to-pulverize support
    if (this.hud) {
      this.hud.pulverizerContainer.on('pointerdown', () => this._onPulverizerDown());
    }

    const stage = this.app.stage;
    stage.eventMode = 'static';
    stage.hitArea   = this.app.screen;
    stage.on('pointermove',      (e) => this._onMove(e));
    stage.on('pointerup',        (e) => this._onUp(e));
    stage.on('pointerupoutside', (e) => this._onUp(e));
    stage.on('pointercancel',    ()  => this._cancelDrag());
  }

  _onPulverizerDown() {
    // If an item is selected via tap-to-select, clicking the pulverizer destroys it
    if (this.selectedIdx >= 0) {
      this._executePulverize(this.selectedIdx);
    }
  }

  _executePulverize(tileIdx) {
    const item = this.board.getCell(tileIdx);
    if (!item) return false;

    const yieldAmt = getTierDef(item.family, item.tier).dustYield;

    this.board.clearCell(tileIdx);
    if (this.economy) this.economy.addDust(yieldAmt);
    this._clearSelection();
    return true;
  }

  _onTileDown(event, tileIdx) {
    const state = this.board.getTileState(tileIdx);

    // ── Unlock interactions ──
    if (state === TILE_STATE.COBWEB) {
      this.board.unlockCobweb(tileIdx);
      return;
    } else if (state === TILE_STATE.UNPURCHASED) {
      if (this.board.isAdjacentToActive(tileIdx)) {
        this.board.unlockExpansion(tileIdx);
      }
      return;
    }

    if (state !== TILE_STATE.ACTIVE) return;

    const item = this.board.getCell(tileIdx);

    if (this.selectedIdx >= 0) {
      if (tileIdx === this.selectedIdx) {
        this.state      = 'PRESSING';
        this.sourceIdx  = tileIdx;
        this.sourceItem = item;
        this.startPos   = { x: event.global.x, y: event.global.y };
        return;
      } else {
        this._executeSelection(tileIdx);
        return;
      }
    }

    if (!item) return;

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
      if (this.selectedIdx === this.sourceIdx) {
        this._clearSelection();
      } else {
        this._selectTile(this.sourceIdx);
      }
      this._resetPressState();
      return;
    }
    if (this.state === 'DRAGGING') {
      this._endDrag(event);
    }
  }

  _beginDrag(event) {
    this.state = 'DRAGGING';
    this._clearSelection();
    this._computeValidTargets();

    const src = this.board.tiles[this.sourceIdx];
    src.itemText.alpha = 0.3;
    src.tierText.alpha = 0.3;

    this._createAvatar(event);

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

    if (this.hud) {
      const isHoverPulverizer = this.hud.hitTestPulverizer(event.global.x, event.global.y);
      const yieldAmt = getTierDef(this.sourceItem.family, this.sourceItem.tier).dustYield;
      this.hud.setPulverizerActive(isHoverPulverizer, `🗑️ +${yieldAmt} Dust`);
    }

    const local    = this.board.container.toLocal(event.global);
    const hoverIdx = this.board.getTileAtLocal(local.x, local.y);

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
    // ── Pulverizer Check ──
    if (this.hud && this.hud.hitTestPulverizer(event.global.x, event.global.y)) {
      const pulverized = this._executePulverize(this.sourceIdx);
      if (!pulverized) {
        this._cancelDrag();
        return;
      }
      this._destroyAvatar();
      this._resetPressState();
      return;
    }

    const local     = this.board.container.toLocal(event.global);
    const targetIdx = this.board.getTileAtLocal(local.x, local.y);

    this._destroyAvatar();
    this.board.clearAllHighlights();
    this._restoreSourceTile();

    if (targetIdx >= 0 && targetIdx !== this.sourceIdx && this.validTargets.has(targetIdx)) {
      const targetCell = this.board.getCell(targetIdx);
      if (targetCell && canMerge(this.sourceItem, targetCell)) {
        const merged = executeMerge(this.board, this.sourceIdx, targetIdx);
        if (merged) playMergeAnimation(this.board, targetIdx);
      } else if (!targetCell) {
        this.board.clearCell(this.sourceIdx);
        this.board.setCell(targetIdx, this.sourceItem);
      }
    } else if (targetIdx >= 0 && targetIdx !== this.sourceIdx) {
      this.board.setTileHighlight(targetIdx, HL.invalid.c, HL.invalid.a);
      setTimeout(() => this.board.clearTileHighlight(targetIdx), 200);
    }
    
    this._resetPressState();
    if (this.hud) this.hud.setPulverizerActive(false);
  }

  _cancelDrag() {
    this._destroyAvatar();
    this.board.clearAllHighlights();
    this._restoreSourceTile();
    this._resetPressState();
    if (this.hud) this.hud.setPulverizerActive(false);
  }

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
      style: { fontSize: Math.floor(ts * 0.22), fill: 0xd4c4a8, fontFamily: 'Georgia, serif', fontWeight: 'bold' },
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

  _selectTile(idx) {
    this._clearSelection();
    const item = this.board.getCell(idx);
    if (!item) return;

    this.selectedIdx = idx;
    this.sourceIdx   = idx;
    this.sourceItem  = item;
    this.board.setTileHighlight(idx, HL.selected.c, HL.selected.a);

    // Show pulverizer +Dust yield hint
    if (this.hud) {
      const yieldAmt = getTierDef(item.family, item.tier).dustYield;
      this.hud.setPulverizerActive(true, `🗑️ +${yieldAmt} Dust`);
    }

    this._computeValidTargets();
    for (const ti of this.validTargets) {
      const cell = this.board.getCell(ti);
      const m    = cell && canMerge(item, cell);
      this.board.setTileHighlight(ti, m ? HL.validMerge.c : HL.validMove.c, m ? HL.validMerge.a : HL.validMove.a);
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
      if (this.board.getTileState(targetIdx) === TILE_STATE.ACTIVE) {
        this.board.clearCell(sourceIdx);
        this.board.setCell(targetIdx, sourceItem);
      }
    } else {
      this._selectTile(targetIdx);
    }
  }

  _clearSelection() {
    this.selectedIdx = -1;
    this.board.clearAllHighlights();
    this.validTargets.clear();
    if (this.hud) this.hud.setPulverizerActive(false);
  }

  _computeValidTargets() {
    this.validTargets.clear();
    for (let i = 0; i < this.board.cells.length; i++) {
      if (i === this.sourceIdx) continue;
      if (this.board.getTileState(i) !== TILE_STATE.ACTIVE) continue;
      
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
