/**
 * HUD — Heads Up Display.
 * Contains the Elemental Dust Wallet (top) and the Pulverizer drop zone (bottom).
 */
import { Container, Graphics, Text } from 'pixi.js';

export class HUD {
  constructor({ app, economy }) {
    this.app = app;
    this.economy = economy;

    this.container = new Container();

    // ── Wallet ──
    this.walletContainer = new Container();
    this.walletBg = new Graphics();
    this.walletText = new Text({
      text: '✨ 0  |  👑 0',
      style: { fontSize: 20, fill: 0xffdd44, fontFamily: 'Georgia, serif', fontWeight: 'bold' }
    });
    this.walletText.anchor.set(0.5);
    this.walletContainer.addChild(this.walletBg);
    this.walletContainer.addChild(this.walletText);
    this.container.addChild(this.walletContainer);

    // ── Overlay Toggle Buttons ──
    this.overlayBtnsContainer = new Container();
    
    this.btnVault = this._createBtn('📦 Vault', 100, 36, () => {
      if (this.onVaultClick) this.onVaultClick();
    });
    this.btnPatron = this._createBtn('📜 Orders', 100, 36, () => {
      if (this.onPatronClick) this.onPatronClick();
    });
    
    this.btnVault.x = -55;
    this.btnPatron.x = 55;
    this.overlayBtnsContainer.addChild(this.btnVault);
    this.overlayBtnsContainer.addChild(this.btnPatron);
    this.container.addChild(this.overlayBtnsContainer);

    // ── Pulverizer ──
    this.pulverizerContainer = new Container();
    this.pulverizerContainer.eventMode = 'static';
    this.pulverizerContainer.cursor = 'pointer';
    
    this.pulverizerBg = new Graphics();
    this.pulverizerText = new Text({
      text: '🗑️ Pulverizer',
      style: { fontSize: 20, fill: 0x8a7a64, fontFamily: 'Georgia, serif' }
    });
    this.pulverizerText.anchor.set(0.5);
    this.pulverizerContainer.addChild(this.pulverizerBg);
    this.pulverizerContainer.addChild(this.pulverizerText);
    this.container.addChild(this.pulverizerContainer);

    // ── Tabs ──
    this.tabContainer = new Container();
    this.activeTab = 0; // 0 = Herbalist, 1 = Mortar
    this.onTabChange = null;

    this.tabHerbalist = this._createTab('Herbalist\'s Bench', 0);
    this.tabMortar = this._createTab('Mortar Station', 1);
    
    this.tabContainer.addChild(this.tabHerbalist);
    this.tabContainer.addChild(this.tabMortar);
    this.container.addChild(this.tabContainer);

    // Subscribe to economy updates
    if (this.economy) {
      this.economy.onUpdate(() => {
        this.walletText.text = `✨ ${this.economy.dust}  |  👑 ${this.economy.crowns}`;
        this._drawWallet();
        this._updateTabs();
      });
    } else {
      this._updateTabs();
    }
  }

  _createBtn(label, w, h, onClick) {
    const btn = new Container();
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    
    const bg = new Graphics();
    bg.roundRect(-w/2, -h/2, w, h, 6).fill(0x3d3228).stroke({ color: 0x251a14, width: 2 });
    
    const text = new Text({
      text: label,
      style: { fontSize: 14, fill: 0xf0e6d2, fontFamily: 'sans-serif' }
    });
    text.anchor.set(0.5);
    
    btn.addChild(bg);
    btn.addChild(text);
    
    btn.on('pointerdown', onClick);
    btn.on('pointerover', () => { bg.clear().roundRect(-w/2, -h/2, w, h, 6).fill(0x4a3f35).stroke({ color: 0x251a14, width: 2 }); });
    btn.on('pointerout', () => { bg.clear().roundRect(-w/2, -h/2, w, h, 6).fill(0x3d3228).stroke({ color: 0x251a14, width: 2 }); });
    
    return btn;
  }

  _createTab(label, index) {
    const tab = new Container();
    tab.eventMode = 'static';
    tab.cursor = 'pointer';
    
    const bg = new Graphics();
    const text = new Text({
      text: label,
      style: { fontSize: 16, fill: 0x8a7a64, fontFamily: 'Georgia, serif' }
    });
    text.anchor.set(0.5);
    
    tab.addChild(bg);
    tab.addChild(text);
    tab.bg = bg;
    tab.text = text;
    
    tab.on('pointerdown', () => {
      if (index === 1 && !this.economy.discoveredFloraT4) return;
      if (this.activeTab !== index) {
        this.activeTab = index;
        this._updateTabs();
        if (this.onTabChange) this.onTabChange(index);
      }
    });
    
    return tab;
  }

  _updateTabs() {
    this._drawTab(this.tabHerbalist, 0, this.activeTab === 0);
    
    const mortarUnlocked = this.economy ? this.economy.discoveredFloraT4 : false;
    if (mortarUnlocked) {
      this.tabMortar.text.text = 'Mortar Station';
      this.tabMortar.cursor = 'pointer';
    } else {
      this.tabMortar.text.text = '🔒 Locked';
      this.tabMortar.cursor = 'default';
    }
    
    this._drawTab(this.tabMortar, 1, this.activeTab === 1, !mortarUnlocked);
  }

  _drawTab(tab, index, isActive, isLocked = false) {
    const w = 150;
    const h = 30;
    tab.bg.clear();
    const color = isActive ? 0x4a3f35 : (isLocked ? 0x1a1210 : 0x251a14);
    const stroke = isActive ? 0xd4c4a8 : 0x4a3f35;
    tab.bg.roundRect(-w/2, -h/2, w, h, 8).fill(color).stroke({ color: stroke, width: 2 });
    tab.text.style.fill = isActive ? 0xf0e6d2 : (isLocked ? 0x4a3f35 : 0x8a7a64);
  }

  _drawWallet() {
    const w = Math.max(120, this.walletText.width + 40);
    const h = 40;
    this.walletBg.clear();
    this.walletBg.roundRect(-w/2, -h/2, w, h, 20).fill(0x251a14).stroke({ color: 0x4a3f35, width: 2 });
  }

  _drawPulverizer() {
    const w = 220;
    const h = 60;
    this.pulverizerBg.clear();
    this.pulverizerBg.roundRect(-w/2, -h/2, w, h, 8).fill(0x251a14).stroke({ color: 0x8a7a64, width: 2, dash: [5, 5] });
    this.pulverizerBounds = { w, h };
  }

  /**
   * Layout the HUD based on current screen size.
   */
  layout(screenWidth, screenHeight) {
    const cx = screenWidth / 2;
    
    // Wallet top center
    this.walletContainer.x = cx;
    this.walletContainer.y = Math.max(20, screenHeight * 0.05);
    this._drawWallet();

    // Overlay buttons below wallet
    this.overlayBtnsContainer.x = cx;
    this.overlayBtnsContainer.y = this.walletContainer.y + 40;

    // Tabs below overlay buttons
    this.tabContainer.x = cx;
    this.tabContainer.y = this.overlayBtnsContainer.y + 45;
    this.tabHerbalist.x = -80;
    this.tabMortar.x = 80;

    // Pulverizer bottom center
    this.pulverizerContainer.x = cx;
    this.pulverizerContainer.y = screenHeight - Math.max(40, screenHeight * 0.08);
    this._drawPulverizer();
  }

  /**
   * Check if a global point (x,y) is inside the Pulverizer zone.
   */
  hitTestPulverizer(globalX, globalY) {
    if (!this.pulverizerBounds) return false;
    const local = this.pulverizerContainer.toLocal({ x: globalX, y: globalY });
    const w = this.pulverizerBounds.w;
    const h = this.pulverizerBounds.h;
    return local.x >= -w/2 && local.x <= w/2 && local.y >= -h/2 && local.y <= h/2;
  }

  /**
   * Highlight pulverizer during drag hover or tap-to-select.
   */
  setPulverizerActive(isActive, customText = null) {
    const w = this.pulverizerBounds.w;
    const h = this.pulverizerBounds.h;
    this.pulverizerBg.clear();
    if (isActive) {
      this.pulverizerBg.roundRect(-w/2, -h/2, w, h, 8).fill(0x3d3228).stroke({ color: 0xff3333, width: 3 });
      this.pulverizerText.style.fill = 0xff3333;
      this.pulverizerText.text = customText || '🗑️ Pulverizer';
    } else {
      this.pulverizerBg.roundRect(-w/2, -h/2, w, h, 8).fill(0x251a14).stroke({ color: 0x8a7a64, width: 2, dash: [5, 5] });
      this.pulverizerText.style.fill = 0x8a7a64;
      this.pulverizerText.text = '🗑️ Pulverizer';
    }
  }
}
