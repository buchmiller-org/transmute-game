import { Container, Graphics, Text } from 'pixi.js';
import { getTierDef } from './data/families.js';

const C = {
  cartBg:        0x2c221a,
  emptyTile:     0x3d3228,
  occupiedTile:  0x4a3f35,
  tileBorder:    0x2a2018,
  textPrimary:   0xf0e6d2,
  textSecondary: 0xd4c4a8,
  unpurchased:   0x1a1210,
  lockText:      0x8a7a64,
};

export class Cart {
  constructor({ economy, maxSlots = 5, tileSize = 60, gap = 4 }) {
    this.economy = economy;
    this.maxSlots = maxSlots;
    this.tileSize = tileSize;
    this.gap = gap;
    
    this.cells = new Array(maxSlots).fill(null);
    this.container = new Container();
    this.tiles = [];
    
    this._build();
    
    if (this.economy) {
      this.economy.onUpdate(() => this.renderAll());
    }
  }
  
  get width() { return this.maxSlots * this.tileSize + (this.maxSlots - 1) * this.gap; }
  get height() { return this.tileSize; }
  
  _build() {
    const pad = 10;
    const frame = new Graphics();
    frame.roundRect(-pad, -pad, this.width + pad * 2, this.height + pad * 2, 8).fill(C.cartBg);
    this.container.addChild(frame);
    
    for (let i = 0; i < this.maxSlots; i++) {
      this._buildTile(i);
    }
  }
  
  _buildTile(idx) {
    const ts = this.tileSize;
    const cx = idx * (ts + this.gap) + ts / 2;
    const cy = ts / 2;
    
    const tc = new Container();
    tc.x = cx;
    tc.y = cy;
    tc.pivot.set(ts / 2, ts / 2);
    tc.eventMode = 'static';
    tc.cursor = 'pointer';
    tc.cartIndex = idx;
    
    const bg = new Graphics();
    tc.addChild(bg);
    
    const highlight = new Graphics();
    highlight.visible = false;
    tc.addChild(highlight);
    
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
    this.tiles[idx] = { container: tc, bg, highlight, itemText, tierText, overlayText };
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
  
  getCell(idx) { return this.cells[idx]; }
  setCell(idx, item) { this.cells[idx] = item; this._renderTile(idx); }
  clearCell(idx) { this.cells[idx] = null; this._renderTile(idx); }
  
  isSlotActive(idx) {
    return idx < this.economy.getCartSlots();
  }
  
  unlockSlot(idx) {
    if (idx === this.economy.getCartSlots()) {
      if (this.economy.buyCartExpansion()) {
        return true;
      }
    }
    return false;
  }
  
  renderAll() {
    for (let i = 0; i < this.maxSlots; i++) {
      this._renderTile(i);
    }
  }
  
  _renderTile(idx) {
    const tile = this.tiles[idx];
    const cell = this.cells[idx];
    const ts = this.tileSize;
    
    tile.itemText.text = '';
    tile.tierText.text = '';
    tile.overlayText.text = '';
    
    if (!this.isSlotActive(idx)) {
      this._drawBg(tile.bg, C.unpurchased, true);
      const isNext = idx === this.economy.getCartSlots();
      if (isNext) {
        const cost = this.economy.getCartExpansionCost();
        tile.overlayText.text = cost ? `+${cost}D` : '';
      }
    } else if (cell) {
      this._drawBg(tile.bg, C.occupiedTile);
      const def = getTierDef(cell.family, cell.tier);
      if (def) {
        tile.itemText.text = def.emoji;
        tile.tierText.text = def.tier;
      }
    } else {
      this._drawBg(tile.bg, C.emptyTile);
    }
  }
  
  setHighlight(idx, active) {
    if (idx < 0 || idx >= this.maxSlots) return;
    const h = this.tiles[idx].highlight;
    if (active) {
      const ts = this.tileSize;
      h.clear();
      h.roundRect(0, 0, ts, ts, 6).fill({ color: 0xffffff, alpha: 0.1 });
      h.visible = true;
    } else {
      h.visible = false;
    }
  }
}
