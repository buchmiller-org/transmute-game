import { Container, Graphics, Text } from 'pixi.js';
import { canMerge, executeMerge, playMergeAnimation } from './merge.js';
import { createItem } from './item.js';
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
  constructor({ app, boards, cart, vault, patron, hud, economy }) {
    this.app = app;
    this.boards = boards;
    this.cart = cart;
    this.vault = vault;
    this.patron = patron;
    this.hud = hud;
    this.economy = economy;

    this.state = 'IDLE';
    this.source = null; // { containerType: 'board'|'cart'|'vault'|'patron', obj: Board|Cart|Vault|PatronOrders, idx: number }
    this.sourceItem = null;
    this.dragAvatar = null;
    this.startPos = null;
    this.selected = null; // { containerType, obj, idx }
    
    this._attachEvents();
  }

  _attachEvents() {
    this.boards.forEach(board => {
      board.tiles.forEach(tile => {
        tile.container.on('pointerdown', (e) => this._onDown(e, 'board', board, tile.container.tileIndex));
      });
    });

    this.cart.tiles.forEach(tile => {
      tile.container.on('pointerdown', (e) => this._onDown(e, 'cart', this.cart, tile.container.cartIndex));
    });

    if (this.vault) {
      this.vault.tiles.forEach(tile => {
        tile.container.on('pointerdown', (e) => this._onDown(e, 'vault', this.vault, tile.container.vaultIndex));
      });
    }

    if (this.patron) {
      this.patron.onSlotDown = (e, idx) => this._onDown(e, 'patron', this.patron, idx);
    }

    if (this.hud) {
      this.hud.pulverizerContainer.on('pointerdown', () => this._onPulverizerDown());
    }

    const stage = this.app.stage;
    stage.eventMode = 'static';
    stage.hitArea = this.app.screen;
    stage.on('pointermove', e => this._onMove(e));
    stage.on('pointerup', e => this._onUp(e));
    stage.on('pointerupoutside', e => this._onUp(e));
    stage.on('pointercancel', () => this._cancelDrag());
  }

  _onPulverizerDown() {
    if (this.selected) {
      this._executePulverize(this.selected);
    }
  }

  _executePulverize(loc) {
    const item = loc.obj.getCell(loc.idx);
    if (!item) return false;

    const yieldAmt = getTierDef(item.family, item.tier).dustYield;
    loc.obj.clearCell(loc.idx);
    if (this.economy) this.economy.addDust(yieldAmt);
    this._clearSelection();
    return true;
  }

  _onDown(event, type, obj, idx) {
    if (type === 'board') {
      const state = obj.getTileState(idx);
      if (state === TILE_STATE.COBWEB) {
        obj.unlockCobweb(idx);
        return;
      } else if (state === TILE_STATE.UNPURCHASED) {
        if (obj.isAdjacentToActive(idx)) obj.unlockExpansion(idx);
        return;
      }
      if (state !== TILE_STATE.ACTIVE) return;
    } else if (type === 'cart') {
      if (!obj.isSlotActive(idx)) {
        obj.unlockSlot(idx);
        return;
      }
    } else if (type === 'vault') {
      if (!obj.isSlotActive(idx)) {
        obj.unlockSlot(idx);
        return;
      }
    }

    const item = obj.getCell(idx);

    if (this.selected) {
      if (this.selected.obj === obj && this.selected.idx === idx) {
        this._startPressing(event, type, obj, idx, item);
        return;
      } else {
        this._executeSelection(type, obj, idx);
        return;
      }
    }

    if (!item) return;
    this._startPressing(event, type, obj, idx, item);
  }

  _startPressing(event, type, obj, idx, item) {
    this.state = 'PRESSING';
    this.source = { containerType: type, obj, idx };
    this.sourceItem = item;
    this.startPos = { x: event.global.x, y: event.global.y };
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
      if (this.selected && this.selected.obj === this.source.obj && this.selected.idx === this.source.idx) {
        this._clearSelection();
      } else {
        this._selectTile(this.source);
      }
      this._resetPressState();
      return;
    }
    if (this.state === 'DRAGGING') {
      this._endDrag(event);
    }
  }

  _clearHighlights() {
    this.boards.forEach(b => b.clearAllHighlights());
    for(let i=0; i<this.cart.maxSlots; i++) this.cart.setHighlight(i, false);
    if (this.vault) for(let i=0; i<this.vault.maxTotalSlots; i++) this.vault.setHighlight(i, false);
    if (this.patron) for(let i=0; i<this.patron.slots.length; i++) this.patron.setHighlight(i, false);
  }

  _beginDrag(event) {
    this.state = 'DRAGGING';
    this._clearSelection();

    let srcTile = null;
    if (this.source.containerType === 'patron') {
      const map = this.patron.slots[this.source.idx];
      srcTile = this.patron.rowUIs[map.orderIdx].tiles[map.reqIdx];
    } else {
      srcTile = this.source.obj.tiles[this.source.idx];
    }

    if (srcTile) {
      srcTile.itemText.alpha = 0.3;
      if (srcTile.tierText) srcTile.tierText.alpha = 0.3;
    }

    this._createAvatar(event);
  }

  _updateDrag(event) {
    this._positionAvatar(event);
    this._clearHighlights();

    if (this.hud) {
      const isHoverPulverizer = this.hud.hitTestPulverizer(event.global.x, event.global.y);
      const yieldAmt = getTierDef(this.sourceItem.family, this.sourceItem.tier).dustYield;
      this.hud.setPulverizerActive(isHoverPulverizer, `🗑️ +${yieldAmt} Dust`);
    }

    const target = this._getHoverTarget(event.global);
    if (target) {
      this._highlightTarget(target);
    }
  }

  _getHoverTarget(globalPos) {
    // Check overlays first since they are on top
    if (this.patron && this.patron.container.visible) {
      for (let i = 0; i < this.patron.slots.length; i++) {
        const map = this.patron.slots[i];
        const tile = this.patron.rowUIs[map.orderIdx].tiles[map.reqIdx];
        if (!tile) continue;
        const local = tile.container.toLocal(globalPos);
        const half = this.patron.tileSize / 2;
        if (local.x >= -half && local.x <= half && local.y >= -half && local.y <= half) {
          return { type: 'patron', obj: this.patron, idx: i };
        }
      }
    }

    if (this.vault && this.vault.container.visible) {
      for (let i = 0; i < this.vault.maxTotalSlots; i++) {
        if (!this.vault.isSlotActive(i)) continue;
        const tile = this.vault.tiles[i];
        if (!tile) continue;
        const local = tile.container.toLocal(globalPos);
        const half = this.vault.tileSize / 2;
        if (local.x >= -half && local.x <= half && local.y >= -half && local.y <= half) {
          return { type: 'vault', obj: this.vault, idx: i };
        }
      }
    }

    // Check cart
    if (this.cart.container.visible) {
      const localCart = this.cart.container.toLocal(globalPos);
      if (localCart.y >= 0 && localCart.y <= this.cart.height && localCart.x >= 0 && localCart.x <= this.cart.width) {
        const step = this.cart.tileSize + this.cart.gap;
        const col = Math.floor(localCart.x / step);
        if (col >= 0 && col < this.cart.maxSlots && this.cart.isSlotActive(col)) {
          return { type: 'cart', obj: this.cart, idx: col };
        }
      }
    }

    // Check visible boards only if overlays are closed
    if ((!this.vault || !this.vault.container.visible) && (!this.patron || !this.patron.container.visible)) {
      for (const board of this.boards) {
        if (!board.container.visible) continue;
        const local = board.container.toLocal(globalPos);
        const idx = board.getTileAtLocal(local.x, local.y);
        if (idx >= 0 && board.getTileState(idx) === TILE_STATE.ACTIVE) {
          return { type: 'board', obj: board, idx };
        }
      }
    }
    return null;
  }

  _highlightTarget(target) {
    if (target.obj === this.source.obj && target.idx === this.source.idx) return;

    let valid = false;
    let merge = false;

    if (target.type === 'cart') {
      const cell = target.obj.getCell(target.idx);
      const isCapstone = this.sourceItem.tier === getMaxTier(this.sourceItem.family);
      if (!cell && (isCapstone || this.source.containerType === 'vault' || this.source.containerType === 'patron')) {
        valid = true;
      }
    } else if (target.type === 'board') {
      const board = target.obj;
      if (board.allowedFamilies.includes(this.sourceItem.family) && this.source.containerType !== 'patron') {
        const cell = board.getCell(target.idx);
        if (!cell) valid = true;
        else if (canMerge(this.sourceItem, cell)) {
          valid = true;
          merge = true;
        }
      }
    } else if (target.type === 'vault') {
      if (this.source.containerType === 'cart' || this.source.containerType === 'board' || this.source.containerType === 'vault') {
        const cellData = target.obj.getCellData(target.idx);
        if (!cellData) {
          valid = true;
        } else if (target.obj.canStack(target.idx, this.sourceItem)) {
          valid = true;
          merge = true; // Use merge highlight for stacking
        }
      }
    } else if (target.type === 'patron') {
      if (this.source.containerType === 'cart' || this.source.containerType === 'vault') {
        if (!target.obj.getCell(target.idx) && target.obj.isAcceptable(target.idx, this.sourceItem)) {
          valid = true;
        }
      }
    }

    const c = valid ? (merge ? HL.hoverMerge.c : HL.hoverMove.c) : HL.invalid.c;
    const a = valid ? (merge ? HL.hoverMerge.a : HL.hoverMove.a) : HL.invalid.a;
    
    if (target.type === 'board') {
      target.obj.setTileHighlight(target.idx, c, a);
    } else {
      target.obj.setHighlight(target.idx, true);
    }
  }

  _endDrag(event) {
    if (this.hud && this.hud.hitTestPulverizer(event.global.x, event.global.y)) {
      const pulverized = this._executePulverize(this.source);
      if (pulverized) {
        this._destroyAvatar();
        this._resetPressState();
        return;
      }
    }

    const target = this._getHoverTarget(event.global);
    this._destroyAvatar();
    this._clearHighlights();
    this._restoreSourceTile();

    if (target && (target.obj !== this.source.obj || target.idx !== this.source.idx)) {
      this._attemptDrop(target);
    }

    this._resetPressState();
    if (this.hud) this.hud.setPulverizerActive(false);
  }

  _attemptDrop(target) {
    const srcObj = this.source.obj;
    const srcIdx = this.source.idx;
    const tgtObj = target.obj;
    const tgtIdx = target.idx;
    const item = this.sourceItem;

    // Helper to safely extract 1 item from source
    const extractSource = () => {
      if (this.source.containerType === 'vault') {
        const cData = srcObj.getCellData(srcIdx);
        if (cData && cData.count > 1) {
          srcObj.addCount(srcIdx, -1);
        } else {
          srcObj.clearCell(srcIdx);
        }
      } else {
        srcObj.clearCell(srcIdx);
      }
    };

    if (target.type === 'cart') {
      const isCapstone = item.tier === getMaxTier(item.family);
      const tgtCell = tgtObj.getCell(tgtIdx);
      if ((!isCapstone && this.source.containerType === 'board') || tgtCell) {
        this._showInvalid(target);
        return;
      }
      extractSource();
      tgtObj.setCell(tgtIdx, item);
    } else if (target.type === 'board') {
      const board = tgtObj;
      if (!board.allowedFamilies.includes(item.family) || this.source.containerType === 'patron') {
        this._showInvalid(target);
        return;
      }
      const tgtCell = board.getCell(tgtIdx);
      if (tgtCell) {
        if (canMerge(item, tgtCell)) {
          extractSource();
          // Simulate merge directly inline
          const newItem = createItem(tgtCell.family, tgtCell.tier + 1);
          tgtObj.setCell(tgtIdx, newItem);
          playMergeAnimation(tgtObj, tgtIdx);
          if (newItem.family === 'flora' && newItem.tier === 4 && this.economy) {
            this.economy.unlockFloraT4();
          }
        } else {
          this._showInvalid(target);
        }
      } else {
        extractSource();
        tgtObj.setCell(tgtIdx, item);
      }
    } else if (target.type === 'vault') {
      if (this.source.containerType === 'patron') {
        this._showInvalid(target);
        return;
      }
      const tgtCellData = tgtObj.getCellData(tgtIdx);
      if (tgtCellData) {
        if (tgtObj.canStack(tgtIdx, item)) {
          extractSource();
          tgtObj.addCount(tgtIdx, 1);
        } else {
          this._showInvalid(target);
        }
      } else {
        extractSource();
        tgtObj.setCell(tgtIdx, item);
      }
    } else if (target.type === 'patron') {
      if (this.source.containerType !== 'cart' && this.source.containerType !== 'vault') {
        this._showInvalid(target);
        return;
      }
      if (!tgtObj.getCell(tgtIdx) && tgtObj.isAcceptable(tgtIdx, item)) {
        extractSource();
        tgtObj.setCell(tgtIdx, item);
      } else {
        this._showInvalid(target);
      }
    }
  }

  _executeMergeCross(srcObj, srcIdx, tgtObj, tgtIdx, srcItem, tgtItem) {
    srcObj.clearCell(srcIdx);
    
    // Simulate merge
    const newItem = createItem(tgtItem.family, tgtItem.tier + 1);
    tgtObj.setCell(tgtIdx, newItem);
    playMergeAnimation(tgtObj, tgtIdx);

    // Check unlocks
    if (newItem.family === 'flora' && newItem.tier === 4 && this.economy) {
      this.economy.unlockFloraT4();
    }
  }

  _showInvalid(target) {
    if (target.type === 'board') {
      target.obj.setTileHighlight(target.idx, HL.invalid.c, HL.invalid.a);
      setTimeout(() => target.obj.clearTileHighlight(target.idx), 200);
    }
  }

  _createAvatar(event) {
    const ts = 60; // Approximate
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

  _selectTile(loc) {
    this._clearSelection();
    const item = loc.obj.getCell(loc.idx);
    if (!item) return;

    this.selected = loc;
    this.source = loc;
    this.sourceItem = item;
    
    if (loc.type === 'board') loc.obj.setTileHighlight(loc.idx, HL.selected.c, HL.selected.a);
    else loc.obj.setHighlight(loc.idx, true);

    if (this.hud) {
      const yieldAmt = getTierDef(item.family, item.tier).dustYield;
      this.hud.setPulverizerActive(true, `🗑️ +${yieldAmt} Dust`);
    }
  }

  _executeSelection(type, tgtObj, tgtIdx) {
    const src = this.selected;
    const srcItem = src.obj.getCell(src.idx);
    this._clearSelection();

    if (!srcItem) return;

    this.source = src;
    this.sourceItem = srcItem;
    this._attemptDrop({ type, obj: tgtObj, idx: tgtIdx });
  }

  _clearSelection() {
    this.selected = null;
    this._clearHighlights();
    if (this.hud) this.hud.setPulverizerActive(false);
  }

  _restoreSourceTile() {
    if (this.source) {
      let t = null;
      if (this.source.containerType === 'patron') {
        const map = this.patron.slots[this.source.idx];
        t = this.patron.rowUIs[map.orderIdx].tiles[map.reqIdx];
      } else {
        t = this.source.obj.tiles[this.source.idx];
      }
      if (t) {
        t.itemText.alpha = 1;
        if (t.tierText) t.tierText.alpha = 1;
      }
    }
  }

  _resetPressState() {
    this.state = 'IDLE';
    this.source = null;
    this.sourceItem = null;
    this.startPos = null;
  }
}
