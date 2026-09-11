/**
 * Spawner — drops T1 items onto random empty board tiles.
 * Renders a PixiJS button with hover/shake feedback.
 */
import { Container, Graphics, Text } from 'pixi.js';
import { createItem } from './item.js';
import { animate, easeOutBack } from './animations.js';

export class Spawner {
  /**
   * @param {object} opts
   * @param {Board}  opts.board
   * @param {string} opts.familyId
   * @param {string} [opts.emoji='🌱']
   * @param {string} [opts.label='Plant Seed']
   */
  constructor({ board, familyId, emoji = '🌱', label = 'Plant Seed' }) {
    this.board    = board;
    this.familyId = familyId;

    // Button dimensions
    this.buttonWidth  = 200;
    this.buttonHeight = 50;

    // ── Build PixiJS button ──
    this.container = new Container();
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';

    this.bg = new Graphics();
    this._drawButton(0x5c4f40);
    this.container.addChild(this.bg);

    this.label = new Text({
      text: `${emoji}  ${label}`,
      style: {
        fontSize: 19,
        fill: 0xf0e6d2,
        fontFamily: 'Georgia, serif',
      },
    });
    this.label.anchor.set(0.5);
    this.label.x = this.buttonWidth / 2;
    this.label.y = this.buttonHeight / 2;
    this.container.addChild(this.label);

    // Hover feedback
    this.container.on('pointerover', () => this._drawButton(0x6d5e4e));
    this.container.on('pointerout',  () => this._drawButton(0x5c4f40));
    this.container.on('pointerdown', () => this.spawn());
  }

  _drawButton(fill) {
    this.bg.clear();
    this.bg
      .roundRect(0, 0, this.buttonWidth, this.buttonHeight, 10)
      .fill(fill)
      .stroke({ color: 0x8a7a64, width: 2 });
  }

  /**
   * Attempt to spawn a T1 item on a random empty tile.
   * @returns {{ index: number, item: object } | null}
   */
  spawn() {
    const empties = this.board.getEmptyTiles();
    if (empties.length === 0) {
      this._shake();
      return null;
    }

    const idx  = empties[Math.floor(Math.random() * empties.length)];
    const item = createItem(this.familyId, 1);
    this.board.setCell(idx, item);

    // Pop-in animation on the new tile
    const tile = this.board.tiles[idx];
    animate({
      target: tile.container.scale,
      from: { x: 0.3, y: 0.3 },
      to:   { x: 1.0, y: 1.0 },
      duration: 280,
      easing: easeOutBack,
    });

    return { index: idx, item };
  }

  /** Shake the button when the board is full — quick x-oscillation. */
  _shake() {
    const origX   = this.container.x;
    const offsets  = [6, -6, 5, -5, 3, -3, 1, -1, 0];
    let step = 0;

    const tick = () => {
      if (step < offsets.length) {
        this.container.x = origX + offsets[step++];
        setTimeout(tick, 35);
      }
    };
    tick();
  }
}
