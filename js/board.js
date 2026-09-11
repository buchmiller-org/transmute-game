/**
 * Board — manages the 5×4 grid state and PixiJS tile rendering.
 * Phase 1: Fixed grid, all tiles active, single family (Flora).
 */
import { Container, Graphics, Text } from 'pixi.js';
import { getMaxTier } from './data/families.js';

/** Color palette */
const C = {
  boardBg:        0x251a14,
  emptyTile:      0x3d3228,
  occupiedTile:   0x4a3f35,
  tileBorder:     0x2a2018,
  capstoneBorder: 0xffd700,
  textPrimary:    0xf0e6d2,
  textSecondary:  0xd4c4a8,
};

export class Board {
  /**
   * @param {object} opts
   * @param {number} opts.rows     - Grid row count
   * @param {number} opts.cols     - Grid column count
   * @param {number} opts.tileSize - Pixel size of each square tile
   * @param {number} [opts.gap=4]  - Pixel gap between tiles
   */
  constructor({ rows = 4, cols = 5, tileSize = 70, gap = 4 }) {
    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
    this.gap = gap;

    /** 1D array, length = rows × cols. Each cell: null | Item object */
    this.cells = new Array(rows * cols).fill(null);

    /** Root PixiJS container for the whole board */
    this.container = new Container();

    /**
     * Per-tile display objects.
     * @type {Array<{ container, bg, highlight, capstoneGlow, itemText, tierText }>}
     */
    this.tiles = [];

    this._build();
  }

  /** Total pixel width of the tile grid (no outer padding). */
  get width() {
    return this.cols * this.tileSize + (this.cols - 1) * this.gap;
  }

  /** Total pixel height of the tile grid (no outer padding). */
  get height() {
    return this.rows * this.tileSize + (this.rows - 1) * this.gap;
  }

  // ═══════════════════ Construction ═══════════════════

  _build() {
    // Board frame (slightly larger than the grid)
    const pad = 10;
    const frame = new Graphics();
    frame
      .roundRect(-pad, -pad, this.width + pad * 2, this.height + pad * 2, 8)
      .fill(C.boardBg);
    this.container.addChild(frame);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this._buildTile(r * this.cols + c, r, c);
      }
    }
  }

  _buildTile(idx, row, col) {
    const ts = this.tileSize;

    // Position at tile center (pivot is set to center for scale animations)
    const cx = col * (ts + this.gap) + ts / 2;
    const cy = row * (ts + this.gap) + ts / 2;

    const tc = new Container();
    tc.x = cx;
    tc.y = cy;
    tc.pivot.set(ts / 2, ts / 2);
    tc.eventMode = 'static';
    tc.cursor = 'pointer';
    tc.tileIndex = idx;  // custom prop for event handling

    // ── Tile background ──
    const bg = new Graphics();
    this._fillTileBg(bg, C.emptyTile);
    tc.addChild(bg);

    // ── Highlight overlay (hidden by default) ──
    const highlight = new Graphics();
    highlight.visible = false;
    tc.addChild(highlight);

    // ── Capstone golden glow border (hidden by default) ──
    const capstoneGlow = new Graphics();
    capstoneGlow
      .roundRect(1, 1, ts - 2, ts - 2, 5)
      .stroke({ color: C.capstoneBorder, width: 3, alpha: 0.85 });
    capstoneGlow.visible = false;
    tc.addChild(capstoneGlow);

    // ── Item emoji ──
    const itemText = new Text({
      text: '',
      style: {
        fontSize: Math.floor(ts * 0.45),
        fill: C.textPrimary,
        fontFamily: 'serif',
      },
    });
    itemText.anchor.set(0.5);
    itemText.x = ts / 2;
    itemText.y = ts * 0.38;
    tc.addChild(itemText);

    // ── Tier label ──
    const tierText = new Text({
      text: '',
      style: {
        fontSize: Math.floor(ts * 0.22),
        fill: C.textSecondary,
        fontFamily: 'Georgia, serif',
        fontWeight: 'bold',
      },
    });
    tierText.anchor.set(0.5);
    tierText.x = ts / 2;
    tierText.y = ts * 0.72;
    tc.addChild(tierText);

    this.container.addChild(tc);
    this.tiles[idx] = { container: tc, bg, highlight, capstoneGlow, itemText, tierText };
  }

  /** Draw (or redraw) a tile's background with a given fill color. */
  _fillTileBg(gfx, color) {
    const ts = this.tileSize;
    gfx.clear();
    gfx
      .roundRect(0, 0, ts, ts, 6)
      .fill(color)
      .stroke({ color: C.tileBorder, width: 1 });
  }

  // ═══════════════════ State ═══════════════════

  getCell(idx)        { return this.cells[idx]; }

  setCell(idx, item)  { this.cells[idx] = item;  this._renderTile(idx); }

  clearCell(idx)      { this.cells[idx] = null;   this._renderTile(idx); }

  /** Return array of indices for all empty cells. */
  getEmptyTiles() {
    return this.cells.reduce((acc, cell, i) => {
      if (cell === null) acc.push(i);
      return acc;
    }, []);
  }

  isFull() { return this.getEmptyTiles().length === 0; }

  // ═══════════════════ Coordinates ═══════════════════

  /** Center position of a tile in board-local coordinates. */
  getTileCenter(idx) {
    const r = Math.floor(idx / this.cols);
    const c = idx % this.cols;
    return {
      x: c * (this.tileSize + this.gap) + this.tileSize / 2,
      y: r * (this.tileSize + this.gap) + this.tileSize / 2,
    };
  }

  /**
   * Hit-test: given board-local coordinates, return the tile index or -1.
   * Returns -1 if the point falls in a gap or outside the grid.
   */
  getTileAtLocal(localX, localY) {
    const step = this.tileSize + this.gap;
    const col  = Math.floor(localX / step);
    const row  = Math.floor(localY / step);

    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return -1;

    // Check we're inside the tile, not in the inter-tile gap
    if (localX - col * step > this.tileSize) return -1;
    if (localY - row * step > this.tileSize) return -1;

    return row * this.cols + col;
  }

  // ═══════════════════ Rendering ═══════════════════

  _renderTile(idx) {
    const tile = this.tiles[idx];
    const item = this.cells[idx];

    if (item) {
      this._fillTileBg(tile.bg, C.occupiedTile);
      tile.itemText.text = item.emoji;
      tile.tierText.text = `T${item.tier}`;
      tile.capstoneGlow.visible = (item.tier === getMaxTier(item.family));
    } else {
      this._fillTileBg(tile.bg, C.emptyTile);
      tile.itemText.text = '';
      tile.tierText.text = '';
      tile.capstoneGlow.visible = false;
    }
  }

  /** Force-render every tile (call once after board construction). */
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

  clearTileHighlight(idx) {
    this.tiles[idx].highlight.visible = false;
  }

  clearAllHighlights() {
    for (const tile of this.tiles) tile.highlight.visible = false;
  }
}
