/**
 * Transmute — Phase 2: Spatial Pressure & the Dust Economy
 * Entry point: initializes PixiJS, Economy, Board, HUD, Spawners, and DragController.
 */
import { Application, Text } from 'pixi.js';
import { Board } from './board.js';
import { Spawner } from './spawner.js';
import { DragController } from './drag.js';
import { Economy } from './economy.js';
import { HUD } from './hud.js';
import { updateAnimations } from './animations.js';

async function init() {
  const app = new Application();
  await app.init({
    background: 0x1a1210,
    resizeTo: window,
    antialias: true,
  });
  document.getElementById('game-container').appendChild(app.canvas);

  // ───── Core Systems ─────
  const economy = new Economy();

  // Compute tile size from viewport for a 7x5 board
  const COLS = 7, ROWS = 5, GAP = 5;
  const maxBoardWidth = Math.min(app.screen.width * 0.95, 520);
  const tileSize = Math.floor((maxBoardWidth - (COLS - 1) * GAP) / COLS);

  const board = new Board({ economy, rows: ROWS, cols: COLS, tileSize, gap: GAP });
  app.stage.addChild(board.container);

  const hud = new HUD({ app, economy });
  app.stage.addChild(hud.container);

  // ───── Spawners ─────
  const floraSpawner = new Spawner({ board, familyId: 'flora', emoji: '🌱', label: 'Plant Seed', buttonWidth: 140 });
  app.stage.addChild(floraSpawner.container);

  const fungiSpawner = new Spawner({ board, familyId: 'fungi', emoji: '🍄', label: 'Spore Log', buttonWidth: 140 });
  app.stage.addChild(fungiSpawner.container);

  // ───── Drag Controller ─────
  new DragController({ app, board, hud, economy });

  // ───── Layout ─────
  function layout() {
    const cx = app.screen.width / 2;

    hud.layout(app.screen.width, app.screen.height);

    // Board centered vertically between wallet and pulverizer
    const availHeight = hud.pulverizerContainer.y - hud.walletContainer.y - 60;
    const boardCenterY = hud.walletContainer.y + 40 + (availHeight / 2);

    board.container.x = cx - board.width / 2;
    board.container.y = boardCenterY - board.height / 2 - 20;

    // Spawners below board
    const spawnerY = board.container.y + board.height + 24;
    floraSpawner.container.x = cx - floraSpawner.buttonWidth - 10;
    floraSpawner.container.y = spawnerY;
    
    fungiSpawner.container.x = cx + 10;
    fungiSpawner.container.y = spawnerY;

    app.stage.hitArea = app.screen;
  }

  // ───── Game Loop ─────
  let lastW = 0, lastH = 0;
  app.ticker.add((ticker) => {
    updateAnimations(ticker.deltaMS);
    if (app.screen.width !== lastW || app.screen.height !== lastH) {
      lastW = app.screen.width;
      lastH = app.screen.height;
      layout();
    }
  });

  layout();
  board.renderAll();
}

init().catch((err) => {
  console.error('Transmute init failed:', err);
  document.body.innerHTML = `
    <div style="color:#d4c4a8; font-family:Georgia,serif; text-align:center; padding:2rem;">
      <h1>Transmute</h1>
      <p>Failed to initialize. Please use a modern browser with WebGL support.</p>
      <pre style="color:#ff6b6b; font-size:0.8rem; margin-top:1rem;">${err.message}</pre>
    </div>`;
});
