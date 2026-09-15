import { Container, Graphics, Text } from 'pixi.js';
import { getTierDef, FAMILIES } from './data/families.js';

const C = {
  bgOverlay:     0x000000,
  panelBg:       0x1f1612,
  panelBorder:   0x3d3228,
  rowBg:         0x251a14,
  rowBorder:     0x3d3228,
  btnBg:         0x3d3228,
  btnHover:      0x4a3f35,
  btnDisabled:   0x1a1210,
  textPrimary:   0xf0e6d2,
  textSecondary: 0xd4c4a8,
  textCrowns:    0xffd700,
  textDust:      0xffdd44,
  tileEmpty:     0x1a1210,
  tileOccupied:  0x3d3228,
  tileBorder:    0x0f0a08,
  lockedText:    0x8a7a64,
};

export class PatronOrders {
  constructor({ app, economy }) {
    this.app = app;
    this.economy = economy;
    
    this.orders = [
      this._generateOrder('easy'),
      this._generateOrder('medium'),
      { locked: true }
    ];
    
    this.container = new Container();
    this.container.visible = false;
    
    this.tileSize = 50;
    this.gap = 8;
    
    this.slots = []; // Array to map flattened slot indices to { orderIdx, reqIdx } for drag.js
    
    this._buildUI();
    
    if (this.economy) {
      this.economy.onUpdate(() => this.renderAll());
    }
  }
  
  _generateOrder(difficulty) {
    const families = Object.keys(FAMILIES);
    let numItems = 0;
    let minCrowns = 0, maxCrowns = 0;
    
    if (difficulty === 'easy') {
      numItems = Math.random() > 0.5 ? 2 : 1;
      minCrowns = 50; maxCrowns = 100;
    } else if (difficulty === 'medium') {
      numItems = Math.random() > 0.5 ? 4 : 3;
      minCrowns = 150; maxCrowns = 300;
    }
    
    const requirements = [];
    const stagedItems = [];
    for (let i = 0; i < numItems; i++) {
      const fam = families[Math.floor(Math.random() * families.length)];
      requirements.push({ family: fam, tier: 4 });
      stagedItems.push(null);
    }
    
    const reward = Math.floor(Math.random() * (maxCrowns - minCrowns + 1)) + minCrowns;
    
    return {
      locked: false,
      difficulty,
      requirements,
      stagedItems,
      reward
    };
  }
  
  _buildUI() {
    this.overlay = new Graphics();
    this.overlay.eventMode = 'static';
    this.overlay.on('pointerdown', () => { this.hide(); });
    this.container.addChild(this.overlay);
    
    this.panel = new Container();
    this.panelBg = new Graphics();
    this.panel.addChild(this.panelBg);
    
    this.titleText = new Text({
      text: '📜 Patron Orders',
      style: { fontSize: 24, fill: C.textPrimary, fontFamily: 'Georgia, serif', fontWeight: 'bold' }
    });
    this.titleText.anchor.set(0.5, 0);
    this.panel.addChild(this.titleText);
    
    this.closeBtn = this._createBtn('X', 40, 40, () => this.hide());
    this.panel.addChild(this.closeBtn);
    
    this.rowsContainer = new Container();
    this.panel.addChild(this.rowsContainer);
    
    this.rowUIs = [];
    for (let i = 0; i < 3; i++) {
      this._buildRow(i);
    }
    
    this.container.addChild(this.panel);
  }
  
  _createBtn(label, w, h, onClick, textFill = C.textPrimary) {
    const btn = new Container();
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    
    const bg = new Graphics();
    
    const text = new Text({
      text: label,
      style: { fontSize: 14, fill: textFill, fontFamily: 'sans-serif', fontWeight: 'bold' }
    });
    text.anchor.set(0.5);
    
    btn.addChild(bg);
    btn.addChild(text);
    
    btn.updateState = (enabled) => {
      btn.eventMode = enabled ? 'static' : 'none';
      btn.cursor = enabled ? 'pointer' : 'default';
      bg.clear().roundRect(-w/2, -h/2, w, h, 6).fill(enabled ? C.btnBg : C.btnDisabled).stroke({ color: C.panelBorder, width: 2 });
      text.alpha = enabled ? 1 : 0.5;
    };
    
    btn.on('pointerdown', onClick);
    btn.on('pointerover', () => { if (btn.eventMode === 'static') bg.clear().roundRect(-w/2, -h/2, w, h, 6).fill(C.btnHover).stroke({ color: C.panelBorder, width: 2 }); });
    btn.on('pointerout', () => { if (btn.eventMode === 'static') bg.clear().roundRect(-w/2, -h/2, w, h, 6).fill(C.btnBg).stroke({ color: C.panelBorder, width: 2 }); });
    
    btn.bg = bg;
    btn.text = text;
    btn.w = w;
    btn.h = h;
    btn.updateState(true);
    return btn;
  }
  
  _buildRow(idx) {
    const rowC = new Container();
    const bg = new Graphics();
    rowC.addChild(bg);
    
    const titleText = new Text({ text: '', style: { fontSize: 16, fill: C.textSecondary, fontFamily: 'Georgia, serif' }});
    titleText.x = 10;
    titleText.y = 10;
    rowC.addChild(titleText);
    
    const rewardText = new Text({ text: '', style: { fontSize: 18, fill: C.textCrowns, fontFamily: 'Georgia, serif', fontWeight: 'bold' }});
    rowC.addChild(rewardText);
    
    const tilesC = new Container();
    rowC.addChild(tilesC);
    
    const btnFulfill = this._createBtn('Fulfill', 80, 36, () => this.fulfillOrder(idx));
    rowC.addChild(btnFulfill);
    
    const btnReroll = this._createBtn('Reroll (50D)', 100, 36, () => this.rerollOrder(idx), C.textDust);
    rowC.addChild(btnReroll);
    
    const lockedText = new Text({ text: '🔒 Commission Orders Locked', style: { fontSize: 18, fill: C.lockedText, fontFamily: 'Georgia, serif' }});
    lockedText.anchor.set(0.5);
    rowC.addChild(lockedText);
    
    this.rowsContainer.addChild(rowC);
    
    this.rowUIs.push({
      container: rowC, bg, titleText, rewardText, tilesC, btnFulfill, btnReroll, lockedText, tiles: []
    });
  }
  
  _buildRowTiles(rowIdx, order) {
    const rowUI = this.rowUIs[rowIdx];
    rowUI.tilesC.removeChildren();
    rowUI.tiles = [];
    
    if (order.locked) return;
    
    for (let reqIdx = 0; reqIdx < order.requirements.length; reqIdx++) {
      const tc = new Container();
      tc.eventMode = 'static';
      tc.cursor = 'pointer';
      
      const flatIdx = this.slots.length;
      this.slots.push({ orderIdx: rowIdx, reqIdx });
      tc.patronIndex = flatIdx;
      
      tc.on('pointerdown', (e) => {
        if (this.onSlotDown) this.onSlotDown(e, flatIdx);
      });
      
      const bg = new Graphics();
      tc.addChild(bg);
      
      const highlight = new Graphics();
      highlight.visible = false;
      tc.addChild(highlight);
      
      const reqText = new Text({ text: '', style: { fontSize: Math.floor(this.tileSize * 0.45), alpha: 0.3 }});
      reqText.anchor.set(0.5);
      reqText.x = this.tileSize / 2;
      reqText.y = this.tileSize / 2;
      tc.addChild(reqText);
      
      const itemText = new Text({ text: '', style: { fontSize: Math.floor(this.tileSize * 0.45) }});
      itemText.anchor.set(0.5);
      itemText.x = this.tileSize / 2;
      itemText.y = this.tileSize / 2;
      tc.addChild(itemText);
      
      tc.x = reqIdx * (this.tileSize + this.gap);
      
      rowUI.tilesC.addChild(tc);
      rowUI.tiles.push({ container: tc, bg, highlight, reqText, itemText });
    }
  }
  
  show() {
    this.container.visible = true;
    this.slots = [];
    for (let i = 0; i < 3; i++) {
      this._buildRowTiles(i, this.orders[i]);
    }
    this.layout(this.app.screen.width, this.app.screen.height);
    this.renderAll();
  }
  
  hide() {
    this.container.visible = false;
    
    // Return staged items to cart or drop if full (for simplicity, we should ideally not hide if staging, or return them)
    // Actually, it's a persistent UI, so staging can remain while hidden!
  }
  
  layout(sw, sh) {
    this.overlay.clear().rect(0, 0, sw, sh).fill({ color: C.bgOverlay, alpha: 0.7 });
    
    const panelW = 500;
    const rowH = 90;
    const pad = 20;
    const panelH = pad * 2 + 40 + 3 * (rowH + pad); // Title + 3 rows
    
    this.panel.x = sw / 2 - panelW / 2;
    this.panel.y = sh / 2 - panelH / 2;
    
    this.panelBg.clear().roundRect(0, 0, panelW, panelH, 12).fill(C.panelBg).stroke({ color: C.panelBorder, width: 3 });
    
    this.titleText.x = panelW / 2;
    this.titleText.y = pad;
    
    this.closeBtn.x = panelW - pad - 20;
    this.closeBtn.y = pad + 20;
    
    this.rowsContainer.x = pad;
    this.rowsContainer.y = pad + 50;
    
    for (let i = 0; i < 3; i++) {
      const rowUI = this.rowUIs[i];
      rowUI.container.y = i * (rowH + pad);
      
      rowUI.bg.clear().roundRect(0, 0, panelW - pad*2, rowH, 8).fill(C.rowBg).stroke({ color: C.rowBorder, width: 2 });
      
      if (this.orders[i].locked) {
        rowUI.titleText.visible = false;
        rowUI.rewardText.visible = false;
        rowUI.tilesC.visible = false;
        rowUI.btnFulfill.visible = false;
        rowUI.btnReroll.visible = false;
        rowUI.lockedText.visible = true;
        rowUI.lockedText.x = (panelW - pad*2) / 2;
        rowUI.lockedText.y = rowH / 2;
      } else {
        rowUI.titleText.visible = true;
        rowUI.rewardText.visible = true;
        rowUI.tilesC.visible = true;
        rowUI.btnFulfill.visible = true;
        rowUI.btnReroll.visible = true;
        rowUI.lockedText.visible = false;
        
        rowUI.titleText.text = i === 0 ? 'Easy Order' : 'Medium Order';
        
        rowUI.rewardText.text = `👑 ${this.orders[i].reward}`;
        rowUI.rewardText.x = panelW - pad*2 - rowUI.rewardText.width - 20;
        rowUI.rewardText.y = 10;
        
        rowUI.tilesC.x = 10;
        rowUI.tilesC.y = 35;
        
        rowUI.btnFulfill.x = panelW - pad*2 - rowUI.btnFulfill.w/2 - 10;
        rowUI.btnFulfill.y = rowH - rowUI.btnFulfill.h/2 - 10;
        
        rowUI.btnReroll.x = rowUI.btnFulfill.x - rowUI.btnFulfill.w/2 - rowUI.btnReroll.w/2 - 10;
        rowUI.btnReroll.y = rowUI.btnFulfill.y;
      }
    }
  }
  
  renderAll() {
    if (!this.economy) return;
    
    for (let i = 0; i < 3; i++) {
      const order = this.orders[i];
      if (order.locked) continue;
      
      const rowUI = this.rowUIs[i];
      let isReady = true;
      
      for (let j = 0; j < order.requirements.length; j++) {
        const req = order.requirements[j];
        const staged = order.stagedItems[j];
        const tile = rowUI.tiles[j];
        if (!tile) continue;
        
        const reqDef = getTierDef(req.family, req.tier);
        tile.reqText.text = reqDef ? reqDef.emoji : '?';
        
        if (staged) {
          tile.bg.clear().roundRect(0, 0, this.tileSize, this.tileSize, 6).fill(C.tileOccupied).stroke({ color: C.tileBorder, width: 1 });
          const def = getTierDef(staged.family, staged.tier);
          tile.itemText.text = def ? def.emoji : '?';
          tile.reqText.visible = false;
        } else {
          tile.bg.clear().roundRect(0, 0, this.tileSize, this.tileSize, 6).fill(C.tileEmpty).stroke({ color: C.tileBorder, width: 1 });
          tile.itemText.text = '';
          tile.reqText.visible = true;
          isReady = false;
        }
      }
      
      rowUI.btnFulfill.updateState(isReady);
      rowUI.btnReroll.updateState(this.economy.dust >= 50);
    }
  }
  
  rerollOrder(idx) {
    if (this.orders[idx].locked) return;
    
    // Check if there are staged items; if so, we shouldn't allow reroll or they are lost.
    // Let's just prevent reroll if items are staged to be safe, or return them to cart.
    const hasStaged = this.orders[idx].stagedItems.some(i => i !== null);
    if (hasStaged) return; // Ignore if items are staged
    
    if (this.economy.spendDust(50)) {
      this.orders[idx] = this._generateOrder(this.orders[idx].difficulty);
      this._buildRowTiles(idx, this.orders[idx]);
      this.layout(this.app.screen.width, this.app.screen.height);
      this.renderAll();
    }
  }
  
  fulfillOrder(idx) {
    const order = this.orders[idx];
    if (order.locked) return;
    
    const isReady = order.requirements.every((req, j) => {
      const staged = order.stagedItems[j];
      return staged && staged.family === req.family && staged.tier === req.tier;
    });
    
    if (isReady) {
      this.economy.addCrowns(order.reward);
      this.orders[idx] = this._generateOrder(order.difficulty);
      this._buildRowTiles(idx, this.orders[idx]);
      this.layout(this.app.screen.width, this.app.screen.height);
      this.renderAll();
    }
  }
  
  // Drag integration
  getCell(flatIdx) {
    const map = this.slots[flatIdx];
    if (!map) return null;
    return this.orders[map.orderIdx].stagedItems[map.reqIdx];
  }
  
  setCell(flatIdx, item) {
    const map = this.slots[flatIdx];
    if (map) {
      this.orders[map.orderIdx].stagedItems[map.reqIdx] = item;
      this.renderAll();
    }
  }
  
  clearCell(flatIdx) {
    const map = this.slots[flatIdx];
    if (map) {
      this.orders[map.orderIdx].stagedItems[map.reqIdx] = null;
      this.renderAll();
    }
  }
  
  isAcceptable(flatIdx, item) {
    const map = this.slots[flatIdx];
    if (!map) return false;
    const req = this.orders[map.orderIdx].requirements[map.reqIdx];
    return req.family === item.family && req.tier === item.tier;
  }
  
  setHighlight(flatIdx, active) {
    const map = this.slots[flatIdx];
    if (!map) return;
    const tile = this.rowUIs[map.orderIdx].tiles[map.reqIdx];
    if (active) {
      tile.highlight.clear().roundRect(0, 0, this.tileSize, this.tileSize, 6).fill({ color: 0xffffff, alpha: 0.15 });
      tile.highlight.visible = true;
    } else {
      tile.highlight.visible = false;
    }
  }
}
