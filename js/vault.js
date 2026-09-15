import { Container, Graphics, Text } from 'pixi.js';
import { getTierDef } from './data/families.js';

const C = {
  bgOverlay:     0x000000,
  panelBg:       0x1f1612,
  panelBorder:   0x3d3228,
  btnBg:         0x3d3228,
  btnHover:      0x4a3f35,
  textPrimary:   0xf0e6d2,
  textSecondary: 0xd4c4a8,
  tileEmpty:     0x251a14,
  tileOccupied:  0x3d3228,
  tileBorder:    0x1a1210,
  lockedText:    0x8a7a64,
};

export class Vault {
  constructor({ app, economy, cart }) {
    this.app = app;
    this.economy = economy;
    this.cart = cart;
    this.cells = []; // Array of { item, count } or null
    
    // UI parameters
    this.maxCols = 6;
    this.maxRows = 4;
    this.maxTotalSlots = this.maxCols * this.maxRows;
    for (let i = 0; i < this.maxTotalSlots; i++) {
      this.cells.push(null);
    }
    
    this.tileSize = 60;
    this.gap = 8;
    
    this.container = new Container();
    this.container.visible = false;
    
    this._buildUI();
    
    // Subscribe at the end!
    if (this.economy) {
      this.economy.onUpdate(() => this.renderAll());
    }
  }
  
  _buildUI() {
    // Semi-transparent overlay to dim the game behind it
    this.overlay = new Graphics();
    this.overlay.eventMode = 'static'; // Block clicks from passing through
    this.overlay.on('pointerdown', () => { this.hide(); });
    this.container.addChild(this.overlay);
    
    // Main Panel
    this.panel = new Container();
    this.panelBg = new Graphics();
    this.panel.addChild(this.panelBg);
    
    // Title
    this.titleText = new Text({
      text: '📦 Storage Vault',
      style: { fontSize: 24, fill: C.textPrimary, fontFamily: 'Georgia, serif', fontWeight: 'bold' }
    });
    this.titleText.anchor.set(0.5, 0);
    this.panel.addChild(this.titleText);
    
    // Close button
    this.closeBtn = this._createBtn('X', 40, 40, () => this.hide());
    this.panel.addChild(this.closeBtn);
    
    // Tiles container
    this.tilesContainer = new Container();
    this.tiles = [];
    for (let i = 0; i < this.maxTotalSlots; i++) {
      this._buildTile(i);
    }
    this.panel.addChild(this.tilesContainer);
    
    // Controls
    this.controlsContainer = new Container();
    this.btnStore = this._createBtn('▼ Store', 100, 36, () => this.quickStore());
    this.btnRetrieve = this._createBtn('▲ Retrieve', 100, 36, () => this.quickRetrieve());
    this.btnConsolidate = this._createBtn('🔄 Consolidate', 130, 36, () => this.consolidate());
    this.btnSort = this._createBtn('📋 Sort', 80, 36, () => this.sort());
    
    this.controlsContainer.addChild(this.btnStore);
    this.controlsContainer.addChild(this.btnRetrieve);
    this.controlsContainer.addChild(this.btnConsolidate);
    this.controlsContainer.addChild(this.btnSort);
    this.panel.addChild(this.controlsContainer);
    
    // Upgrade Stack Button
    this.btnUpgradeStack = this._createBtn('Upgrade Stack (500D)', 220, 36, () => this._buyStackUpgrade());
    this.panel.addChild(this.btnUpgradeStack);
    
    this.container.addChild(this.panel);
  }
  
  _createBtn(label, w, h, onClick) {
    const btn = new Container();
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    
    const bg = new Graphics();
    bg.roundRect(-w/2, -h/2, w, h, 6).fill(C.btnBg).stroke({ color: C.panelBorder, width: 2 });
    
    const text = new Text({
      text: label,
      style: { fontSize: 14, fill: C.textPrimary, fontFamily: 'sans-serif' }
    });
    text.anchor.set(0.5);
    
    btn.addChild(bg);
    btn.addChild(text);
    
    btn.on('pointerdown', onClick);
    btn.on('pointerover', () => { bg.clear().roundRect(-w/2, -h/2, w, h, 6).fill(C.btnHover).stroke({ color: C.panelBorder, width: 2 }); });
    btn.on('pointerout', () => { bg.clear().roundRect(-w/2, -h/2, w, h, 6).fill(C.btnBg).stroke({ color: C.panelBorder, width: 2 }); });
    
    btn.bg = bg;
    btn.text = text;
    btn.w = w;
    btn.h = h;
    return btn;
  }
  
  _buildTile(idx) {
    const ts = this.tileSize;
    const col = idx % this.maxCols;
    const row = Math.floor(idx / this.maxCols);
    
    const tc = new Container();
    tc.x = col * (ts + this.gap) + ts / 2;
    tc.y = row * (ts + this.gap) + ts / 2;
    tc.pivot.set(ts / 2, ts / 2);
    tc.eventMode = 'static';
    tc.cursor = 'pointer';
    tc.vaultIndex = idx;
    
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
    
    const countText = new Text({ text: '', style: { fontSize: Math.floor(ts * 0.25), fill: 0xffffff, fontFamily: 'sans-serif', fontWeight: 'bold' } });
    countText.anchor.set(1, 1);
    countText.x = ts - 4;
    countText.y = ts - 4;
    tc.addChild(countText);
    
    const overlayText = new Text({ text: '', style: { fontSize: Math.floor(ts * 0.25), fill: C.lockedText, fontFamily: 'Georgia, serif' } });
    overlayText.anchor.set(0.5);
    overlayText.x = ts / 2;
    overlayText.y = ts / 2;
    tc.addChild(overlayText);
    
    this.tilesContainer.addChild(tc);
    this.tiles[idx] = { container: tc, bg, highlight, itemText, countText, overlayText };
  }
  
  _buyStackUpgrade() {
    if (this.economy.buyVaultStackUpgrade()) {
      this.renderAll();
    }
  }
  
  show() {
    this.container.visible = true;
    this.layout(this.app.screen.width, this.app.screen.height);
    this.renderAll();
  }
  
  hide() {
    this.container.visible = false;
  }
  
  layout(sw, sh) {
    this.overlay.clear().rect(0, 0, sw, sh).fill({ color: C.bgOverlay, alpha: 0.7 });
    
    const activeSlots = this.economy ? this.economy.getVaultSlots() : 6;
    const cols = Math.min(this.maxCols, activeSlots);
    const rows = Math.ceil(activeSlots / this.maxCols);
    
    // We will render up to maxTotalSlots to show next unlock
    const displayCols = this.maxCols;
    const displayRows = this.maxRows;
    
    const gridW = displayCols * this.tileSize + (displayCols - 1) * this.gap;
    const gridH = displayRows * this.tileSize + (displayRows - 1) * this.gap;
    
    const pad = 20;
    const panelW = gridW + pad * 2;
    const panelH = gridH + 180; // space for title, grid, controls
    
    this.panel.x = sw / 2 - panelW / 2;
    this.panel.y = sh / 2 - panelH / 2;
    
    this.panelBg.clear();
    this.panelBg.roundRect(0, 0, panelW, panelH, 12).fill(C.panelBg).stroke({ color: C.panelBorder, width: 3 });
    
    this.titleText.x = panelW / 2;
    this.titleText.y = pad;
    
    this.closeBtn.x = panelW - pad - 20;
    this.closeBtn.y = pad + 20;
    
    this.tilesContainer.x = pad;
    this.tilesContainer.y = pad + 40;
    
    this.controlsContainer.x = panelW / 2;
    this.controlsContainer.y = this.tilesContainer.y + gridH + 30;
    
    this.btnStore.x = -170;
    this.btnRetrieve.x = -50;
    this.btnConsolidate.x = 80;
    this.btnSort.x = 200;
    
    this.btnUpgradeStack.x = panelW / 2;
    this.btnUpgradeStack.y = panelH - 30;
  }
  
  renderAll() {
    if (!this.economy) return;
    const activeSlots = this.economy.getVaultSlots();
    const limit = this.economy.getVaultStackLimit();
    const ts = this.tileSize;
    
    for (let i = 0; i < this.maxTotalSlots; i++) {
      const tile = this.tiles[i];
      const cellData = this.cells[i];
      
      tile.itemText.text = '';
      tile.countText.text = '';
      tile.overlayText.text = '';
      
      if (i < activeSlots) {
        if (cellData && cellData.count > 0) {
          tile.bg.clear().roundRect(0, 0, ts, ts, 6).fill(C.tileOccupied).stroke({ color: C.tileBorder, width: 1 });
          const def = getTierDef(cellData.item.family, cellData.item.tier);
          tile.itemText.text = def ? def.emoji : '?';
          tile.countText.text = cellData.count > 1 ? `x${cellData.count}` : '';
        } else {
          tile.bg.clear().roundRect(0, 0, ts, ts, 6).fill(C.tileEmpty).stroke({ color: C.tileBorder, width: 1 });
        }
      } else {
        tile.bg.clear().roundRect(0, 0, ts, ts, 6).fill({ color: C.tileEmpty, alpha: 0.5 }).stroke({ color: C.tileBorder, width: 1, alpha: 0.5 });
        if (i === activeSlots) {
          const cost = this.economy.getVaultExpansionCost();
          tile.overlayText.text = cost ? `+${cost}D` : '';
        }
      }
    }
    
    // Update upgrade stack button
    if (this.economy.vaultStackLevel >= 2) {
      this.btnUpgradeStack.visible = false;
    } else {
      this.btnUpgradeStack.visible = true;
      const cost = this.economy.getVaultStackUpgradeCost();
      this.btnUpgradeStack.text.text = `Upgrade Stack (${cost}D)`;
    }
  }
  
  isSlotActive(idx) {
    return idx < this.economy.getVaultSlots();
  }
  
  unlockSlot(idx) {
    if (idx === this.economy.getVaultSlots()) {
      return this.economy.buyVaultExpansion();
    }
    return false;
  }
  
  setHighlight(idx, active) {
    if (idx < 0 || idx >= this.maxTotalSlots) return;
    const h = this.tiles[idx].highlight;
    if (active) {
      const ts = this.tileSize;
      h.clear().roundRect(0, 0, ts, ts, 6).fill({ color: 0xffffff, alpha: 0.15 });
      h.visible = true;
    } else {
      h.visible = false;
    }
  }
  
  // Drag-and-drop integration methods
  getCell(idx) {
    // For drag.js validation, we return the item itself if present
    const c = this.cells[idx];
    return c && c.count > 0 ? c.item : null;
  }
  
  getCellData(idx) {
    return this.cells[idx];
  }
  
  setCell(idx, item) {
    if (!item) {
      this.cells[idx] = null;
    } else {
      this.cells[idx] = { item, count: 1 };
    }
    this.renderAll();
  }
  
  clearCell(idx) {
    this.cells[idx] = null;
    this.renderAll();
  }
  
  addCount(idx, amount) {
    if (this.cells[idx]) {
      this.cells[idx].count += amount;
      if (this.cells[idx].count <= 0) this.cells[idx] = null;
      this.renderAll();
    }
  }
  
  canStack(idx, item) {
    const limit = this.economy.getVaultStackLimit();
    const c = this.cells[idx];
    if (!c || c.count >= limit) return false;
    return c.item.family === item.family && c.item.tier === item.tier;
  }
  
  // Management Actions
  quickStore() {
    if (!this.cart) return;
    let limit = this.economy.getVaultStackLimit();
    let slots = this.economy.getVaultSlots();
    
    for (let cIdx = 0; cIdx < this.cart.maxSlots; cIdx++) {
      const item = this.cart.getCell(cIdx);
      if (!item) continue;
      
      // Try to stack first
      let stored = false;
      for (let vIdx = 0; vIdx < slots; vIdx++) {
        if (this.canStack(vIdx, item)) {
          this.cells[vIdx].count++;
          this.cart.clearCell(cIdx);
          stored = true;
          break;
        }
      }
      
      // If not stacked, find empty
      if (!stored) {
        for (let vIdx = 0; vIdx < slots; vIdx++) {
          if (!this.cells[vIdx]) {
            this.cells[vIdx] = { item, count: 1 };
            this.cart.clearCell(cIdx);
            break;
          }
        }
      }
    }
    this.renderAll();
  }
  
  quickRetrieve() {
    if (!this.cart) return;
    let slots = this.economy.getVaultSlots();
    
    // Find items in vault to move to cart
    for (let vIdx = 0; vIdx < slots; vIdx++) {
      let cData = this.cells[vIdx];
      if (!cData || cData.count <= 0) continue;
      
      while (cData.count > 0) {
        let emptyCartIdx = -1;
        for (let cIdx = 0; cIdx < this.cart.maxSlots; cIdx++) {
          if (this.cart.isSlotActive(cIdx) && !this.cart.getCell(cIdx)) {
            emptyCartIdx = cIdx;
            break;
          }
        }
        
        if (emptyCartIdx !== -1) {
          this.cart.setCell(emptyCartIdx, cData.item);
          cData.count--;
        } else {
          break; // cart full
        }
      }
      
      if (cData.count <= 0) {
        this.cells[vIdx] = null;
      }
    }
    this.renderAll();
  }
  
  consolidate() {
    let limit = this.economy.getVaultStackLimit();
    let slots = this.economy.getVaultSlots();
    
    for (let i = 0; i < slots; i++) {
      const src = this.cells[i];
      if (!src || src.count >= limit) continue;
      
      for (let j = i + 1; j < slots; j++) {
        const tgt = this.cells[j];
        if (tgt && tgt.item.family === src.item.family && tgt.item.tier === src.item.tier) {
          const space = limit - src.count;
          const transfer = Math.min(space, tgt.count);
          src.count += transfer;
          tgt.count -= transfer;
          
          if (tgt.count <= 0) this.cells[j] = null;
          if (src.count >= limit) break;
        }
      }
    }
    
    // Shift empties
    let writeIdx = 0;
    for (let readIdx = 0; readIdx < slots; readIdx++) {
      if (this.cells[readIdx]) {
        if (readIdx !== writeIdx) {
          this.cells[writeIdx] = this.cells[readIdx];
          this.cells[readIdx] = null;
        }
        writeIdx++;
      }
    }
    
    this.renderAll();
  }
  
  sort() {
    this.consolidate();
    
    let slots = this.economy.getVaultSlots();
    let activeCells = [];
    for (let i = 0; i < slots; i++) {
      if (this.cells[i]) activeCells.push(this.cells[i]);
      this.cells[i] = null;
    }
    
    activeCells.sort((a, b) => {
      if (a.item.family !== b.item.family) return a.item.family.localeCompare(b.item.family);
      if (a.item.tier !== b.item.tier) return b.item.tier - a.item.tier; // descending tier
      return b.count - a.count;
    });
    
    for (let i = 0; i < activeCells.length; i++) {
      this.cells[i] = activeCells[i];
    }
    this.renderAll();
  }
}
