# Transmute — Equipment & Blueprints Architecture

## 1. Overview & Principles
In **Transmute**, the laboratory is built around specialized **Equipment**, each acting as its own **self-contained grid board**. Instead of managing one gigantic, cluttered 10×10 board, the player navigates between focused workbenches designed for specific alchemical operations.

### Key Rules
1. **Equipment = Board:** Selecting an equipment station displays its active grid. You switch between equipment via a minimal tab bar.
2. **Multi-Tree Boards:** Most primary equipment holds and processes **two distinct material families** (e.g., the Herbalist's Bench hosts both Flora and Fungi). This creates intersecting spatial puzzles as the player manages two merge trees on the same grid.
3. **Internal Spawners:** Primary equipment features dedicated Spawner widgets for each family (e.g., a *Seed Planter* for Flora, a *Spore Log* for Fungi) that drop base ingredients onto empty tiles when tapped.
4. **Tier-4 Capstone Export Rule:** Primary equipment boards run 4-tier merge chains (T1 → T4). Items **cannot leave the board until they reach their Tier-4 capstone**. This keeps shared storage clean.
5. **Blueprint Progression:** Progression is driven by building new equipment. Reaching Codex milestones unlocks **Blueprints**, which are constructed by paying a **Masterwork** material cost.
6. **Independent Board Expansion:** Each equipment board begins at a compact size (e.g., 5×4) and is upgraded tile-by-tile using **Elemental Dust**.

---

## 2. UI Grouping & Progression (The Sanctum)

We do not use "Rooms" as progression gates (e.g., unlocking a door to access three benches). Instead, all active equipment is organized into scrollable UI **Workspaces** (tabs). For the initial release, all core equipment belongs to the first workspace grouping: **The First Sanctum**.

```text
The First Sanctum (Workspace UI Tab)
 ├── [Equip 1] Herbalist's Bench (Flora & Fungi)
 ├── [Equip 2] Mortar Station (Catalysts & Pigments)
 ├── [Equip 3] The Alembic Condenser (Aqua & Oils)
 ├── [Equip 4] Calcination Forge (Minerals & Carbons)
 ├── [Equip 5] Arcane Prism (Aether & Void)
 ├── [Equip 6] Infusion Cauldron (Early Synthesis)
 ├── [Equip 7] Resonance Forge (Mid Synthesis)
 └── [Equip 8] The Grand Opus Hearth (Grand Synthesis)
```

*(Future expansions can introduce new Workspace groupings like "The Conservatory" or "The Subterranean Vault" to house new equipment without cluttering the main UI).*

---

## 3. Equipment Specifications

### 3.1 Herbalist's Bench
* **Role:** The starting board for all botanical, organic, and fungal ingredients. This is the first board the player interacts with.
* **Allowed Materials:** Flora family (T1 → T4) and Fungi family (T1 → T4).
* **Grid Dimensions:**
  * Starting Size: 5×4 (20 tiles total, with 6 tiles locked by cobwebs).
  * Effective Starting Playable Tiles: **14 tiles.**
  * Maximum Expanded Size: 7×5 (35 tiles).
* **Spawners:** 
  * *Seed Planter* (Flora T1 drops)
  * *Spore Log* (Fungi T1 drops)
* **Expansion Cost:** Standard formula (see §5).

### 3.2 Mortar Station
* **Blueprint Unlock:** Discover the Flora Tier 4 Capstone.
* **Masterwork (Construction Cost):** 2x Flora T4 Capstones + 500 Elemental Dust.
* **Role:** Processes raw mineral salts and pigmented compounds into reactive catalysts.
* **Allowed Materials:** Salts/Catalysts family (T1 → T4) and Pigments family (T1 → T4).
* **Grid Dimensions:** 5×4 starting size.
* **Spawners:** *Salt Grinder* and *Pigment Mortar*.

### 3.3 The Alembic Condenser
* **Blueprint Unlock:** Discover the Salts Tier 4 Capstone.
* **Masterwork Cost:** 2x Fungi T4 + 2x Salts T4 + 1,200 Elemental Dust.
* **Role:** Produces and refines liquid solutions, volatile waters, and thick oils.
* **Allowed Materials:** Aqua family (T1 → T4) and Oils family (T1 → T4).
* **Grid Dimensions:** 5×5 starting size.
* **Spawners:** *Dew Collector* and *Resin Tap*.

### 3.4 Calcination Forge
* **Blueprint Unlock:** Discover a Tier 5 Synthesis item in the Infusion Cauldron.
* **Masterwork Cost:** 1x Concentrated Elixir (T6 Synthesis) + 2x Salts T4 + 1,500 Elemental Dust.
  * *Design note: The Blueprint unlocks at T5 discovery but requires a T6 item to construct. This intentional gap lets the player see the Blueprint as a motivating "stretch goal" while they continue advancing their synthesis chains.*
* **Role:** Processes ores, coals, and mineral compounds through high-heat smelting.
* **Allowed Materials:** Minerals family (T1 → T4) and Carbons family (T1 → T4).
* **Grid Dimensions:** 5×5 starting size.
* **Spawners:** *Ore Chute* and *Coal Hopper*.

### 3.5 Arcane Prism
* **Blueprint Unlock:** Discover the Minerals Tier 4 Capstone.
* **Masterwork Cost:** 2x Minerals T4 + 2x Oils T4 + 2,000 Elemental Dust.
* **Role:** Channels and refines volatile energies into stable arcane materials.
* **Allowed Materials:** Aether family (T1 → T4) and Void family (T1 → T4).
* **Grid Dimensions:** 5×4 starting size.
* **Spawners:** *Aether Siphon* and *Void Rift*.

---

## 4. Synthesis Boards (No Spawners)

Synthesis boards do not generate raw materials. They accept imports only.

### 4.1 Infusion Cauldron (Junior Synthesis)
* **Blueprint Unlock:** Discover the Aqua Tier 4 Capstone.
* **Masterwork Cost:** 2x Aqua T4 + 2x Flora T4 + 1,500 Elemental Dust.
* **Role:** Accepts **Flora/Fungi capstones** (T4) and **Aqua/Oils capstones** (T4) from shared storage and combines them to produce hybrid compounds in the T5–T6 synthesis range.
* **Grid Dimensions:** 4×4 compact workspace.

### 4.2 Resonance Forge (Mid Synthesis)
* **Blueprint Unlock:** Discover the Aether Tier 4 Capstone.
* **Masterwork Cost:** 2x Minerals T4 + 2x Aether T4 + 3,000 Elemental Dust.
* **Role:** Accepts **Minerals/Carbons capstones** (T4) and **Aether/Void capstones** (T4) from shared storage and fuses them via high-heat arcane resonance.
* **Grid Dimensions:** 4×4 compact workspace.

### 4.3 The Grand Opus Hearth (Grand Synthesis)
* **Blueprint Unlock:** Complete a Tier 6 Synthesis on both the Cauldron and Resonance Forge.
* **Masterwork Cost:** 1x T6 Elixir + 1x T6 Astral Ingot + 5,000 Elemental Dust.
* **Role:** The ultimate synthesis board. Accepts finished capstones and hybrid synthesis products from **all** families to assemble legendary endgame Codex entries.
* **Grid Dimensions:** 6×6 expansive workspace.

---

## 5. The Pulverizer (Global Discard)

* Present on every board view as a persistent drop zone.
* **Behavior:** Dragging any item onto the Pulverizer permanently destroys it and instantly awards **Elemental Dust** according to the tier-based yield formula detailed in [`02_MATERIALS_AND_MERGE_TREES.md`](./02_MATERIALS_AND_MERGE_TREES.md).
* **Confirmation Guard:** Capstone-tier items (T4+ on primary boards, T5+ synthesis products) display a quick 1-tap confirmation warning to prevent accidental deletions.
* **Always Accessible:** It is the primary relief valve for spatial pressure — when the board is full and you need space for a different family, grind something.

---

## 6. Board Expansion Reference

All equipment boards use a universal tile-expansion cost formula:

$$\text{Cost}(n) = 50 \times 1.4^n \text{ Elemental Dust}$$

Where $n$ is the number of tiles already unlocked on that specific board (starting at $n = 0$ for the first expansion).

| Tile # | Cost (Dust) | Cumulative (Dust) |
| :---: | ---: | ---: |
| 1st | 50 | 50 |
| 2nd | 70 | 120 |
| 3rd | 98 | 218 |
| 4th | 137 | 355 |
| 5th | 192 | 547 |
| 6th | 269 | 816 |
| 7th | 376 | 1,192 |
| 8th | 527 | 1,719 |

### Locked Tiles
Some boards start with tiles blocked by cobwebs, rust, or calcification. These are cleared for a **flat cost of 30 Elemental Dust per tile** — cheaper than expansion to provide a gentle early on-ramp. Clearing a locked tile makes it immediately playable.

---

## 7. Resolved Decisions

### Decided
- [x] **Room Flattening:** "Rooms" are removed as progression gates. Equipment is unlocked sequentially via Blueprints. Masterwork projects are now the material costs required to build those Blueprints.
- [x] **UI Grouping:** All MVP equipment lives in a single scrollable UI tab group ("The First Sanctum").
- [x] **Multi-Tree Boards:** Primary boards hold 2 distinct material families (e.g. Flora + Fungi), each with its own spawner and T1-T4 tree.
- [x] **Board Sizing:** Starting grids increased to 5x4 or 5x5 to accommodate dual-tree spatial pressure.
- [x] **Locked tiles:** Flat 30 Elemental Dust cost.
- [x] **Expansion formula:** Universal $50 \times 1.4^n$ per board.
