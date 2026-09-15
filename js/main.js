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
import { Cart } from './cart.js';
import { Vault } from './vault.js';
import { PatronOrders } from './patron.js';
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

  const board1 = new Board({ economy, allowedFamilies: ['flora', 'fungi'], rows: ROWS, cols: COLS, tileSize, gap: GAP });
  const board2 = new Board({ economy, allowedFamilies: ['salts', 'pigments'], rows: ROWS, cols: COLS, tileSize, gap: GAP });
  app.stage.addChild(board1.container);
  app.stage.addChild(board2.container);

  const cart = new Cart({ economy, maxSlots: 5, tileSize, gap: GAP });

  const vault = new Vault({ app, economy, cart });
  const patron = new PatronOrders({ app, economy });

  const hud = new HUD({ app, economy });
  hud.onVaultClick = () => {
    if (vault.container.visible) vault.hide();
    else { patron.hide(); vault.show(); }
  };
  hud.onPatronClick = () => {
    if (patron.container.visible) patron.hide();
    else { vault.hide(); patron.show(); }
  };

  // ───── Spawners ─────
  const floraSpawner = new Spawner({ board: board1, familyId: 'flora', emoji: '🌱', label: 'Plant Seed', buttonWidth: 170 });
  const fungiSpawner = new Spawner({ board: board1, familyId: 'fungi', emoji: '🍄', label: 'Spore Log', buttonWidth: 170 });
  app.stage.addChild(floraSpawner.container);
  app.stage.addChild(fungiSpawner.container);

  const saltSpawner = new Spawner({ board: board2, familyId: 'salts', emoji: '🧂', label: 'Salt Grinder', buttonWidth: 170 });
  const pigmentSpawner = new Spawner({ board: board2, familyId: 'pigments', emoji: '🤍', label: 'Pigment Mortar', buttonWidth: 170 });
  app.stage.addChild(saltSpawner.container);
  app.stage.addChild(pigmentSpawner.container);

  // Overlays
  app.stage.addChild(vault.container);
  app.stage.addChild(patron.container);

  // Cart and HUD should be on top of the overlays so they remain interactive
  app.stage.addChild(cart.container);
  app.stage.addChild(hud.container);

  // ───── Drag Controller ─────
  new DragController({ app, boards: [board1, board2], cart, vault, patron, hud, economy });

  hud.onTabChange = () => layout();

  // ───── Layout ─────
  function layout() {
    const cx = app.screen.width / 2;

    hud.layout(app.screen.width, app.screen.height);

    const activeBoard = hud.activeTab === 0 ? board1 : board2;
    board1.container.visible = hud.activeTab === 0;
    board2.container.visible = hud.activeTab === 1;

    floraSpawner.container.visible = hud.activeTab === 0;
    fungiSpawner.container.visible = hud.activeTab === 0;
    saltSpawner.container.visible = hud.activeTab === 1;
    pigmentSpawner.container.visible = hud.activeTab === 1;

    // Cart position: above pulverizer
    cart.container.x = cx - cart.width / 2;
    cart.container.y = hud.pulverizerContainer.y - hud.pulverizerBounds.h / 2 - cart.height - 20;

    // Board centered vertically between tabs and cart
    const topY = hud.tabContainer.y + 20;
    const bottomY = cart.container.y - 20;
    const availHeight = bottomY - topY;
    
    // Spawners below board
    const boardCenterY = topY + availHeight / 2 - 20;
    
    board1.container.x = cx - board1.width / 2;
    board1.container.y = boardCenterY - board1.height / 2;
    board2.container.x = cx - board2.width / 2;
    board2.container.y = boardCenterY - board2.height / 2;

    const spawnerY = board1.container.y + board1.height + 20;
    floraSpawner.container.x = cx - floraSpawner.buttonWidth - 10;
    floraSpawner.container.y = spawnerY;
    fungiSpawner.container.x = cx + 10;
    fungiSpawner.container.y = spawnerY;

    saltSpawner.container.x = cx - saltSpawner.buttonWidth - 10;
    saltSpawner.container.y = spawnerY;
    pigmentSpawner.container.x = cx + 10;
    pigmentSpawner.container.y = spawnerY;

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
      if (vault.container.visible) vault.layout(lastW, lastH);
      if (patron.container.visible) patron.layout(lastW, lastH);
    }
  });

  layout();
  board1.renderAll();
  board2.renderAll();
  cart.renderAll();
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
