/**
 * Board — manages the 7×5 grid state and PixiJS tile rendering.
 * Phase 2: Supports Tile States (ACTIVE, COBWEB, UNPURCHASED) and Expansion.
 */
import { Container, Graphics, Text } from 'pixi.js';
import { getMaxTier } from './data/families.js';

export const TILE_STATE = {
  ACTIVE: 0,
  COBWEB: 1,
  UNPURCHASED: 2,
};

const C = {
  boardBg:        0x251a14,
  emptyTile:      0x3d3228,
  occupiedTile:   0x4a3f35,
  tileBorder:     0x2a2018,
  capstoneBorder: 0xffd700,
  textPrimary:    0xf0e6d2,
  textSecondary:  0xd4c4a8,
  cobwebOverlay:  0xffffff,
  unpurchased:    0x1a1210,
  lockText:       0x8a7a64,
};

export class Board {
  constructor({ economy, rows = 5, cols = 7, tileSize = 60, gap = 4 }) {
    this.economy = economy;
    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
    this.gap = gap;

    this.cells = new Array(rows * cols).fill(null);
    this.tileStates = new Array(rows * cols).fill(TILE_STATE.UNPURCHASED);
    this.container = new Container();
    this.tiles = [];

    this._initLayout();
    this._build();

    // Listen to economy changes to update unlock costs
    if (this.economy) {
      this.economy.onUpdate(() => this.renderAll());
    }
  }

  get width() { return this.cols * this.tileSize + (this.cols - 1) * this.gap; }
  get height() { return this.rows * this.tileSize + (this.rows - 1) * this.gap; }

  // ═══════════════════ Construction ═══════════════════

  _initLayout() {
    // Phase 2 start: center 5x4 is active/cobwebbed
    // rows 1-4, cols 1-5
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 5; c++) {
        this.tileStates[r * this.cols + c] = TILE_STATE.ACTIVE;
      }
    }

    // 6 fixed cobweb tiles for the starting puzzle
    const cobwebs = [
      1 * this.cols + 1, 1 * this.cols + 5, // Top corners of 5x4
      4 * this.cols + 1, 4 * this.cols + 5, // Bottom corners of 5x4
      2 * this.cols + 3, 3 * this.cols + 3  // Middle column
    ];
    for (const idx of cobwebs) {
      this.tileStates[idx] = TILE_STATE.COBWEB;
    }
  }

  _build() {
    const pad = 10;
    const frame = new Graphics();
    frame.roundRect(-pad, -pad, this.width + pad * 2, this.height + pad * 2, 8).fill(C.boardBg);
    this.container.addChild(frame);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this._buildTile(r * this.cols + c, r, c);
      }
    }
  }

  _buildTile(idx, row, col) {
    const ts = this.tileSize;
    const cx = col * (ts + this.gap) + ts / 2;
    const cy = row * (ts + this.gap) + ts / 2;

    const tc = new Container();
    tc.x = cx;
    tc.y = cy;
    tc.pivot.set(ts / 2, ts / 2);
    tc.eventMode = 'static';
    tc.cursor = 'pointer';
    tc.tileIndex = idx;

    const bg = new Graphics();
    tc.addChild(bg);

    const highlight = new Graphics();
    highlight.visible = false;
    tc.addChild(highlight);

    const capstoneGlow = new Graphics();
    capstoneGlow.roundRect(1, 1, ts - 2, ts - 2, 5).stroke({ color: C.capstoneBorder, width: 3, alpha: 0.85 });
    capstoneGlow.visible = false;
    tc.addChild(capstoneGlow);

    const itemText = new Text({ text: '', style: { fontSize: Math.floor(ts * 0.45), fill: C.textPrimary, fontFamily: 'serif' } });
    itemText.anchor.set(0.5);
    itemText.x = ts / 2;
    itemText.y = ts * 0.38;
    tc.addChild(itemText);

    const tierText = new Text({ text: '', style: { fontSize: Math.floor(ts * 0.22), fill: C.textSecondary, fontFamily: 'Georgia, serif', fontWeight: 'bold' } });
    tierText.anchor.set(0.5);
    tierText.x = ts / 2;
    tierText.y = ts * 0.72;
    tc.addChild(tierText);

    const overlayText = new Text({ text: '', style: { fontSize: Math.floor(ts * 0.25), fill: C.lockText, fontFamily: 'Georgia, serif' } });
    overlayText.anchor.set(0.5);
    overlayText.x = ts / 2;
    overlayText.y = ts / 2;
    tc.addChild(overlayText);

    this.container.addChild(tc);
    this.tiles[idx] = { container: tc, bg, highlight, capstoneGlow, itemText, tierText, overlayText };
  }

  _drawBg(gfx, color, dash = false) {
    const ts = this.tileSize;
    gfx.clear();
    gfx.roundRect(0, 0, ts, ts, 6).fill(color);
    if (dash) {
      gfx.stroke({ color: C.tileBorder, width: 1, alpha: 0.5 });
    } else {
      gfx.stroke({ color: C.tileBorder, width: 1 });
    }
  }

  // ═══════════════════ State ═══════════════════

  getCell(idx)       { return this.cells[idx]; }
  setCell(idx, item) { this.cells[idx] = item; this._renderTile(idx); }
  clearCell(idx)     { this.cells[idx] = null; this._renderTile(idx); }
  getTileState(idx)  { return this.tileStates[idx]; }

  unlockCobweb(idx) {
    if (this.economy.spendDust(this.economy.getCobwebCost())) {
      this.tileStates[idx] = TILE_STATE.ACTIVE;
      this._renderTile(idx);
      return true;
    }
    return false;
  }

  unlockExpansion(idx) {
    if (this.economy.buyExpansion()) {
      this.tileStates[idx] = TILE_STATE.ACTIVE;
      this._renderTile(idx); // economy notify will also trigger renderAll
      return true;
    }
    return false;
  }

  isAdjacentToActive(idx) {
    const r = Math.floor(idx / this.cols);
    const c = idx % this.cols;
    
    // Check cardinal neighbors
    const neighbors = [
      { r: r - 1, c }, { r: r + 1, c },
      { r, c: c - 1 }, { r, c: c + 1 }
    ];

    for (const n of neighbors) {
      if (n.r >= 0 && n.r < this.rows && n.c >= 0 && n.c < this.cols) {
        const nIdx = n.r * this.cols + n.c;
        if (this.tileStates[nIdx] === TILE_STATE.ACTIVE || this.tileStates[nIdx] === TILE_STATE.COBWEB) {
          return true;
        }
      }
    }
    return false;
  }

  getEmptyTiles() {
    return this.cells.reduce((acc, cell, i) => {
      if (cell === null && this.tileStates[i] === TILE_STATE.ACTIVE) acc.push(i);
      return acc;
    }, []);
  }

  isFull() { return this.getEmptyTiles().length === 0; }

  // ═══════════════════ Coordinates ═══════════════════

  getTileCenter(idx) {
    const r = Math.floor(idx / this.cols);
    const c = idx % this.cols;
    return {
      x: c * (this.tileSize + this.gap) + this.tileSize / 2,
      y: r * (this.tileSize + this.gap) + this.tileSize / 2,
    };
  }

  getTileAtLocal(localX, localY) {
    const step = this.tileSize + this.gap;
    const col  = Math.floor(localX / step);
    const row  = Math.floor(localY / step);

    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return -1;
    if (localX - col * step > this.tileSize) return -1;
    if (localY - row * step > this.tileSize) return -1;

    return row * this.cols + col;
  }

  // ═══════════════════ Rendering ═══════════════════

  _renderTile(idx) {
    const tile  = this.tiles[idx];
    const item  = this.cells[idx];
    const state = this.tileStates[idx];

    tile.itemText.text = '';
    tile.tierText.text = '';
    tile.overlayText.text = '';
    tile.capstoneGlow.visible = false;
    tile.container.alpha = 1.0;
    tile.itemText.alpha = 1.0;
    tile.tierText.alpha = 1.0;

    if (state === TILE_STATE.ACTIVE) {
      if (item) {
        this._drawBg(tile.bg, C.occupiedTile);
        tile.itemText.text = item.emoji;
        tile.tierText.text = `T${item.tier}`;
        tile.capstoneGlow.visible = (item.tier === getMaxTier(item.family));
      } else {
        this._drawBg(tile.bg, C.emptyTile);
      }
    } 
    else if (state === TILE_STATE.COBWEB) {
      this._drawBg(tile.bg, C.emptyTile);
      tile.overlayText.text = `🕸️\n${this.economy ? this.economy.getCobwebCost() : 30}`;
      tile.container.alpha = 0.6;
    }
    else if (state === TILE_STATE.UNPURCHASED) {
      this._drawBg(tile.bg, C.unpurchased, true);
      if (this.isAdjacentToActive(idx)) {
        tile.overlayText.text = `➕\n${this.economy ? this.economy.getExpansionCost() : 50}`;
        tile.container.alpha = 0.5;
      } else {
        tile.container.alpha = 0.1;
      }
    }
  }

  renderAll() {
    for (let i = 0; i < this.cells.length; i++) this._renderTile(i);
  }

  // ═══════════════════ Highlights ═══════════════════

  setTileHighlight(idx, color, alpha = 0.2) {
    const tile = this.tiles[idx];
    const ts   = this.tileSize;
    tile.highlight.alpha = 1;
    tile.highlight.clear();
    tile.highlight.roundRect(0, 0, ts, ts, 6).fill({ color, alpha });
    tile.highlight.visible = true;
  }

  clearTileHighlight(idx) { this.tiles[idx].highlight.visible = false; }
  clearAllHighlights()    { for (const tile of this.tiles) tile.highlight.visible = false; }
}
