# Transmute — Phased Development Roadmap

This document defines the incremental build plan for Transmute. Each phase produces a **playable build** deployed to GitHub Pages (via push to `main`). The game must feel fun at each stage before the next layer is added.

---

## Design Decisions (Resolved)

| Decision | Resolution |
|:---|:---|
| **Item visuals** | Emoji/unicode placeholders with tier number overlays (e.g., 🌱₁, 🌿₂, 🌾₃, 🌺₄). Polished art comes later. |
| **Rendering library** | **PixiJS v8** via ESM import map — zero build step, GPU-accelerated canvas, smooth drag-and-drop, scales to full game complexity. |
| **Early unlock gates** | Simplified discovery gates for testing (e.g., "discover Flora T4" unlocks Mortar Station). Formal Masterwork costs added in Phase 5. |
| **Deployment** | GitHub Pages, triggered by pushing to `main` branch. Each phase is a playable live build. |

### PixiJS v8 Setup (No Build Step)

```html
<script type="importmap">
  {
    "imports": {
      "pixi.js": "https://esm.sh/pixi.js@8"
    }
  }
</script>
<script type="module" src="js/main.js"></script>
```

All game code uses ES6 modules with standard `import` statements. No Node.js, no bundler, no package.json required.

---

## Phase Summary

| Phase | Core Addition | Fun Question to Answer | Complexity |
|:---:|:---|:---|:---:|
| **1** | Single-family merge on one fixed board | Is merging satisfying? | Low |
| **2** | Dual family + Pulverizer + Dust economy | Is spatial pressure fun? | Low–Med |
| **3** | Capstone export + Cart + second board | Is the multi-board loop engaging? | Medium |
| **4** | Storage Vault + Patron Orders + Crowns | Do short-term goals pull you forward? | Medium |
| **5** | Codex + Insight + Blueprints + Masterworks | Does long-term progression motivate? | Med–High |
| **6** | Synthesis boards + all equipment + endgame | Does the full game hold together? | High |
| **7** | Polish, save/load, responsive layout, audio | Is it ready for real players? | Medium |

> **Phases 1–3 are the "prove it's fun" core.** If Phase 3 feels good, everything after is layering systems on a solid foundation. If Phase 3 doesn't click, iterate there before moving forward.

---

## Phase 1 — The Merge Sandbox

### Goal
Prove the core act of tapping a spawner, dragging items on a grid, and merging them is satisfying on both touch and desktop.

### What To Build

#### Board
- **Herbalist's Bench** only — fixed **5×4 grid** (20 tiles, all active)
- No locked/cobwebbed tiles (skip for Phase 1)
- No tile expansion (grid size is static)

#### Material Family
- **Flora only** (single family, single spawner)
  - **T1:** Dormant Seed — emoji: 🌱
  - **T2:** Tender Sprout — emoji: 🌿
  - **T3:** Wild Herb — emoji: 🌾
  - **T4:** Aromatic Bloom *(Capstone)* — emoji: 🌺
- Merge-2 rule: drag identical-tier items onto each other → produce next tier
- T4 capstones simply sit on the board as trophies (no export, no currency)

#### Spawner
- **Seed Planter** — tap/click a button to drop one T1 Dormant Seed onto a random empty tile
- If no empty tiles exist, spawner tap is rejected (button shakes, no item placed)
- No cooldown, no cost — purely space-gated

#### Item Display
- Each tile shows the item's emoji + tier number (e.g., `🌱₁`, `🌿₂`)
- Empty tiles are visually distinct (darker/outlined)
- T4 capstone tiles get a subtle golden border or glow to mark achievement

#### Interaction Model
- **Primary:** Drag-and-drop via unified `PointerEvent` (works for mouse + touch)
  - `pointerdown` on occupied tile: pick up item, show drag avatar
  - `pointermove`: drag avatar follows pointer (on mobile, offset above finger to avoid occlusion)
  - `pointerup` on another tile:
    - If target has same family + same tier → **merge** (play merge animation, place new tier item)
    - If target is empty → **move** item to that tile
    - If target has different tier or is occupied with non-matching → **snap back** to origin
  - `touch-action: none` on board container to prevent mobile scroll during drag
- **Fallback:** Tap-to-select, then tap destination (accessibility mode)

#### Visual Feedback
- Merge animation: brief scale-up pulse + color flash on the resulting item
- Drag avatar: semi-transparent copy of item following pointer
- Valid drop target: subtle highlight on compatible tiles during drag
- Invalid drop: snap-back with a brief red flash
- Board full: spawner button shakes when tapped with no empty tiles

### Technical Architecture (Phase 1 Foundations)

```text
index.html          — Shell HTML, import map, canvas container
js/
  main.js           — PixiJS app init, game loop setup
  board.js          — Board class: grid state, tile management, render
  item.js           — Item model: { id, family, tier, name, emoji }
  spawner.js        — Spawner: places T1 items on random empty tiles
  drag.js           — Drag-and-drop controller (PointerEvent state machine)
  merge.js          — Merge logic: validate match, execute merge, animate
  data/
    families.js     — Family/item definitions (Flora for Phase 1)
css/
  style.css         — Board grid styling, basic antique theme tokens
```

#### Data Model

```js
// Item definition (from families.js)
const FLORA = {
  id: 'flora',
  name: 'Flora',
  tiers: [
    { tier: 1, name: 'Dormant Seed',   emoji: '🌱' },
    { tier: 2, name: 'Tender Sprout',  emoji: '🌿' },
    { tier: 3, name: 'Wild Herb',      emoji: '🌾' },
    { tier: 4, name: 'Aromatic Bloom', emoji: '🌺' },
  ],
};

// Board state (from board.js)
// 1D array of length rows × cols, index = row * cols + col
// Each cell: null (empty) or { family: 'flora', tier: 1 }
```

#### PixiJS Setup Pattern

```js
// main.js
import { Application } from 'pixi.js';

const app = new Application();
await app.init({
  background: '#2a1f1a',   // Dark antique wood
  resizeTo: window,
  antialias: true,
});
document.getElementById('game-container').appendChild(app.canvas);

// Create board, spawner UI, attach to app.stage
```

### What Phase 1 Does NOT Include
- ❌ No Fungi family (single family only)
- ❌ No Pulverizer / Dust / currencies
- ❌ No locked tiles or board expansion
- ❌ No Service Cart or multi-board
- ❌ No save/load
- ❌ No Codex, Orders, Blueprints, Masterworks
- ❌ No audio or haptics
- ❌ No responsive mobile/desktop split layout (single layout is fine)

### Validation Criteria
Before moving to Phase 2, these questions must have positive answers:
1. Does drag-and-drop feel responsive on both mouse and touch?
2. Is the merge-2 chain length (4 tiers) satisfying for a single family?
3. Does the 5×4 grid fill up at a pace that creates interesting placement decisions?
4. Is creating a T4 Aromatic Bloom capstone a rewarding moment?
5. Does the player naturally develop spatial strategies (e.g., grouping same-tier items)?

---

## Phase 2 — Spatial Pressure & the Dust Economy

### Goal
Add the core tension loop: two families competing for space + the Pulverizer as a pressure valve.

### What To Add
- **Second family on the same board:** Fungi (Fragile Spore → Pale Mycelium → Luminescent Cap → Truffle of Vitality)
  - **T1:** 🍄, **T2:** 🕸️, **T3:** 💡, **T4:** 🟤
- **Second spawner:** Spore Log — same mechanics as Seed Planter, drops Fungi T1
- **The Pulverizer:** persistent drop zone on the board view
  - Drag any item onto it → item destroyed, Dust awarded immediately
  - Dust yields: T1 = 1, T2 = 3, T3 = 8, T4 = 20
  - Confirmation prompt for T4+ items (prevent accidental capstone destruction)
- **Elemental Dust wallet:** displayed in a HUD header, never occupies tiles
- **Locked tiles:** 6 cobwebbed tiles on the starting 5×4 grid (14 playable tiles at start)
  - Tap locked tile + pay 30 Dust to clear into active space
- **Board tile expansion:** grow grid toward 7×5 max
  - Cost formula: `Cost(n) = floor(50 × 1.4^n)` Dust (where n = tiles already expanded on this board)
  - Tile 1 = 50, Tile 2 = 70, Tile 3 = 98, Tile 4 = 137, Tile 5 = 192...

### Validation Criteria
1. Does dual-family crowding feel like a fun puzzle, not just frustration?
2. Is the pulverize-or-merge dilemma a real strategic choice?
3. Is the Dust earn-rate balanced against tile unlock/expansion costs?
4. Does unlocking cobwebbed tiles and expanding the grid feel rewarding?

---

## Phase 3 — The Multi-Board Loop *(Critical Gate)*

### Goal
Prove the spawn → merge → capstone → export → logistics → second board loop is engaging.

### What To Add
- **Capstone Export Rule:** only T4 items can leave a board
  - Sub-capstone drag to Cart → red lock icon, snap back, tooltip: *"Reach Tier 4 to export"*
  - T4 items show golden export arrow overlay on their tile
- **The Service Cart:** persistent 2-slot tray (always visible, all views)
  - Board → Cart → Board/Vault transfers (no direct board-to-board)
  - No stacking — 1 item per slot
  - Expansion: Slot 3 = 200 Dust, Slot 4 = 750 Dust, Slot 5 = 2,000 Dust
- **Second board — Mortar Station:** unlocked by discovering Flora T4 (simplified gate)
  - Salts/Catalysts: Calcite Shard 🧂₁ → Vitriol Salt 🧪₂ → Volatile Calx ⚗️₃ → Philosopher's Reagent 💎₄
  - Pigments: Chalk Dust 🤍₁ → Ocher Paste 🟠₂ → Lapis Extract 🔵₃ → Prismatic Dye 🌈₄
  - 5×4 grid, dual spawners (Salt Grinder + Pigment Mortar)
- **Board family restrictions:** dropping foreign-family items is rejected (red tint flash)
- **Tab UI:** switch between Herbalist's Bench and Mortar Station

> ⚠️ **This is the most critical validation gate.** If this loop isn't fun with two boards and a cart, more systems won't fix it. Iterate here as long as needed before proceeding.

### Validation Criteria
1. Is the capstone rule satisfying ("I earned this!") or annoying?
2. With only 2 Cart slots, does the logistics bottleneck feel strategic or tedious?
3. Does the second board opening feel like a genuine reward?
4. Is the core loop compelling enough to sustain repeated play?

---

## Phase 4 — Storage & Short-Term Goals

### Goal
Add inventory depth and directed objectives via the Vault and Patron Orders.

### What To Add
- **The Storage Vault:** slide-in overlay, 6 starting slots, auto-stacking identical items
  - Stack limit: 3 items/slot (Level 1)
  - Expansion: +2 slots at escalating Dust costs (200, 350, 550, 800, 1,200, 1,800, 2,800, 4,200, 6,500)
  - Stack limit L2: 5/slot for 500 Dust
  - Management tools: Quick Store (▼), Quick Retrieve (▲), Consolidate, Sort
- **Patron Orders:** 3 slots requesting capstone combinations
  - Slot 1 (Easy): 1–2 primary T4 capstones → 50–100 Crowns
  - Slot 2 (Medium): 3–4 mixed capstones → 150–300 Crowns
  - Slot 3 (Hard): locked for now (synthesis items come later)
- **Crowns currency:** earned from orders, shown in HUD
- **Order reroll:** 50 Dust per reroll to prevent free fishing
- **Item staging:** drag Cart items into order recipe slots; retrievable before confirmation

### Validation Criteria
1. Does the Vault feel like a useful buffer or just extra UI?
2. Do Patron Orders motivate targeting specific capstones?
3. Does earning Crowns feel satisfying (even with no sink yet)?
4. Does the Cart + Vault juggling create interesting logistics decisions?

---

## Phase 5 — Discovery & Progression Meta-Layer

### Goal
Add the long-term progression loop: Codex discovery, Insight milestones, formal Blueprints, and Masterwork construction.

### What To Add
- **The Grand Codex:** catalog of all discovered items, "New Discovery!" celebration on first creation
- **Insight currency:** awarded on first discovery (T1=1, T2=1, T3=2, T4=3)
- **Discovery perks:** permanent passive bonuses per Codex branch (e.g., Fungi complete → +15% Dust from Fungi)
- **Formal Blueprint system:** replace Phase 3 simple gates with Construction Panel
- **Masterwork construction:** stage capstones from Cart + pay Dust to build equipment
  - Mortar Station: 2× Flora T4 + 500 Dust
  - Alembic Condenser: 2× Fungi T4 + 2× Salts T4 + 1,200 Dust
- **Third and fourth boards:** Alembic Condenser (Aqua + Oils) via Salts T4 discovery
- **Crown Buy-Back:** spend Crowns in Codex for emergency item purchases (T1=10, T2=25, T3=75, T4=200 Crowns)
- **Vault stack-limit L3:** 10/slot, 1,500 Dust + 10 Insight

### Validation Criteria
1. Does the "first discovery" moment feel rewarding enough to chase?
2. Do Codex perks noticeably change gameplay?
3. Do Masterwork costs feel like worthy milestones or punishing grind walls?
4. With 3–4 boards, is Cart/Vault logistics still manageable?

---

## Phase 6 — Synthesis, Remaining Boards & Endgame

### Goal
Complete the full 8-board workshop with synthesis chains and endgame content.

### What To Add
- **Infusion Cauldron (Junior Synthesis):** 4×4 board, no spawners, imports only
  - Flora T4 + Aqua T4 → T5 Herbal Tincture; T5 + T5 → T6 Concentrated Elixir
- **Remaining primary boards:**
  - Calcination Forge (Minerals + Carbons) — unlocked by T5 Synthesis discovery
  - Arcane Prism (Aether + Void) — unlocked by Minerals T4
- **Resonance Forge (Mid Synthesis):** Minerals T4 + Aether T4 → T5 → T6
- **The Grand Opus Hearth (Grand Synthesis):** 6×6 board, endgame
- **Patron Order Slot 3:** Commission orders requiring T5/T6 → 500–1,000 Crowns
- **Spawner upgrades:** ~2% rare Mechanism Gear drops; T1→T2→T3 gear merge; drag T3 onto spawner to upgrade
  - L2: 85% T1 / 15% T2 | L3: 70% T1 / 25% T2 / 5% T3
- **Vault stack-limit L4:** 20/slot, 4,000 Dust + 25 Insight
- **Remaining Codex perks** for all families
- **Full Dust yields:** T5 = 48, T6 = 110

### Validation Criteria
1. Does synthesis feel like a genuine new dimension?
2. Does the full 8-board workshop feel cohesive, not overwhelming?
3. Are spawner upgrades worth the board-space investment?

---

## Phase 7 — Polish, Responsiveness & Persistence

### Goal
Make the game ready for real players.

### What To Add
- **Full responsive layout:** mobile portrait (<768px) and desktop widescreen (≥768px) per wireframes in [05_TECHNICAL_SPEC_AND_UX.md](./05_TECHNICAL_SPEC_AND_UX.md)
- **Save/Load:** `localStorage` JSON persistence (schema v1.1.0) with auto-save on every state change
- **Export/Import:** one-click JSON download/upload for cross-device transfer
- **Service Worker:** offline-first caching for full offline play
- **Haptic feedback:** Web Vibration API on merge, pulverize, export
- **Keyboard shortcuts:** `1`–`5` Cart slots, `Q`/`W` spawners, `Escape` cancel
- **Accessibility:** tap-to-select / click-to-move fallback mode
- **Audio:** merge sounds, pulverizer grinding, discovery fanfare
- **Replace emoji placeholders** with polished item art
- **Balance pass:** tune all economy numbers from playtesting data

---

## Cross-Reference to Other Docs

| Phase | Primary References |
|:---:|:---|
| 1 | [02 — Materials (Flora family, §2.1)](./02_MATERIALS_AND_MERGE_TREES.md), [05 — Tech Spec (input handling, §4)](./05_TECHNICAL_SPEC_AND_UX.md) |
| 2 | [02 — Materials (Fungi family, §2.1; Pulverizer, §5)](./02_MATERIALS_AND_MERGE_TREES.md), [01 — Rooms (locked tiles, expansion formula)](./01_ROOMS_AND_EQUIPMENT.md) |
| 3 | [01 — Rooms (Mortar Station, §primary boards)](./01_ROOMS_AND_EQUIPMENT.md), [03 — Storage (Cart, §Service Cart)](./03_STORAGE_AND_LOGISTICS.md) |
| 4 | [03 — Storage (Vault, §Storage Vault)](./03_STORAGE_AND_LOGISTICS.md), [04 — Codex (Patron Orders)](./04_CODEX_AND_MASTERWORKS.md) |
| 5 | [04 — Codex (Grand Codex, Blueprints, Masterworks)](./04_CODEX_AND_MASTERWORKS.md), [01 — Rooms (Alembic Condenser)](./01_ROOMS_AND_EQUIPMENT.md) |
| 6 | [01 — Rooms (all synthesis boards)](./01_ROOMS_AND_EQUIPMENT.md), [02 — Materials (synthesis tiers, spawner upgrades)](./02_MATERIALS_AND_MERGE_TREES.md) |
| 7 | [05 — Tech Spec (wireframes, save schema, input)](./05_TECHNICAL_SPEC_AND_UX.md) |
