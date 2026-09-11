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
      text: '✨ 0',
      style: { fontSize: 24, fill: 0xffdd44, fontFamily: 'Georgia, serif', fontWeight: 'bold' }
    });
    this.walletText.anchor.set(0.5);
    this.walletContainer.addChild(this.walletBg);
    this.walletContainer.addChild(this.walletText);
    this.container.addChild(this.walletContainer);

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

    // Subscribe to economy updates
    if (this.economy) {
      this.economy.onUpdate((dust) => {
        this.walletText.text = `✨ ${dust}`;
        this._drawWallet();
      });
    }
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
