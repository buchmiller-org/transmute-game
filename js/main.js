/**
 * Transmute — Phase 1: The Merge Sandbox
 * Entry point: initializes PixiJS, wires up board, spawner, and drag controller.
 */
import { Application, Text } from 'pixi.js';
import { Board } from './board.js';
import { Spawner } from './spawner.js';
import { DragController } from './drag.js';
import { updateAnimations } from './animations.js';

async function init() {
  // ───── PixiJS Application ─────
  const app = new Application();
  await app.init({
    background: 0x1a1210,
    resizeTo: window,
    antialias: true,
  });
  document.getElementById('game-container').appendChild(app.canvas);

  // ───── Compute tile size from viewport ─────
  const COLS = 5, ROWS = 4, GAP = 5;
  const maxBoardWidth = Math.min(app.screen.width * 0.88, 460);
  const tileSize = Math.floor((maxBoardWidth - (COLS - 1) * GAP) / COLS);

  // ───── Board ─────
  const board = new Board({ rows: ROWS, cols: COLS, tileSize, gap: GAP });
  app.stage.addChild(board.container);

  // ───── Spawner Button ─────
  const spawner = new Spawner({
    board,
    familyId: 'flora',
    emoji: '🌱',
    label: 'Plant Seed',
  });
  app.stage.addChild(spawner.container);

  // ───── Title ─────
  const title = new Text({
    text: 'TRANSMUTE',
    style: {
      fontSize: 28,
      fill: 0xd4c4a8,
      fontFamily: 'Georgia, serif',
      fontWeight: 'bold',
      letterSpacing: 6,
    },
  });
  title.anchor.set(0.5, 0);
  app.stage.addChild(title);

  // ───── Subtitle ─────
  const subtitle = new Text({
    text: "Herbalist's Bench  ·  5 × 4",
    style: {
      fontSize: 14,
      fill: 0x8a7a64,
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    },
  });
  subtitle.anchor.set(0.5, 0);
  app.stage.addChild(subtitle);

  // ───── Drag Controller ─────
  new DragController({ app, board });

  // ───── Layout (positions everything based on current screen size) ─────
  function layout() {
    const cx = app.screen.width / 2;

    // Vertical stack: title → subtitle → board → spawner
    const titleY = Math.max(16, app.screen.height * 0.06);

    title.x    = cx;
    title.y    = titleY;
    subtitle.x = cx;
    subtitle.y = titleY + 36;

    board.container.x = cx - board.width / 2;
    board.container.y = subtitle.y + 32;

    spawner.container.x = cx - spawner.buttonWidth / 2;
    spawner.container.y = board.container.y + board.height + 28;

    // Ensure stage hit area covers the full canvas (needed for drag events)
    app.stage.hitArea = app.screen;
  }

  // ───── Game Loop ─────
  let lastW = 0, lastH = 0;
  app.ticker.add((ticker) => {
    updateAnimations(ticker.deltaMS);

    // Re-layout on resize (checked every frame, cheap comparison)
    if (app.screen.width !== lastW || app.screen.height !== lastH) {
      lastW = app.screen.width;
      lastH = app.screen.height;
      layout();
    }
  });

  // Initial layout + render
  layout();
  board.renderAll();
}

// ───── Bootstrap ─────
init().catch((err) => {
  console.error('Transmute init failed:', err);
  document.body.innerHTML = `
    <div style="color:#d4c4a8; font-family:Georgia,serif; text-align:center; padding:2rem;">
      <h1>Transmute</h1>
      <p>Failed to initialize. Please use a modern browser with WebGL support.</p>
      <pre style="color:#ff6b6b; font-size:0.8rem; margin-top:1rem;">${err.message}</pre>
    </div>`;
});
