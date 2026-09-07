# Transmute — Rooms & Equipment Architecture

## 1. Overview & Principles
In **Transmute**, the laboratory is partitioned into distinct **Rooms**, each housing specialized **Equipment**. 

Each piece of equipment acts as its own **self-contained grid board**. Instead of managing one gigantic, cluttered 10×10 board with 50 disparate item types, the player navigates between focused workbenches designed for specific alchemical operations.

### Key Rules
1. **Equipment = Board:** Selecting an equipment station displays its active grid.
2. **Material Restrictions:** Most equipment can only hold and process specific elemental or mechanical categories (e.g., you cannot place raw water dew directly onto a dry herb milling board).
3. **Internal Spawners:** Primary equipment typically features a dedicated Spawner widget (e.g., a *Seed Planter* or a *Dew Collector*) that drops base ingredients onto empty tiles when tapped. Synthesis boards have no spawner — they receive imports only.
4. **Tier-4 Capstone Export Rule:** Primary equipment boards run a 4-tier merge chain (T1 → T4). Items **cannot leave the board until they reach their Tier-4 capstone**. This keeps shared storage clean and gives each board a focused purpose.
5. **Independent Board Expansion:** Each equipment board begins at a compact size (e.g., 3×3 or 4×4) and is upgraded tile-by-tile using **Elemental Dust**.

---

## 2. Room & Equipment Hierarchy

```
The Grand Arcanum Laboratory
├── Room 1: The Preparation Parlor (Early Game)
│   ├── [Equip 1.1] Herbalist's Bench (Flora / Botanical line)
│   ├── [Equip 1.2] Mortar Station (Catalyst / Powder line)
│   └── [Global] The Pulverizer (Discard → Elemental Dust)
├── Room 2: The Distillation Annex (Mid Game — Unlockable)
│   ├── [Equip 2.1] The Alembic Condenser (Aqua / Distillate line)
│   └── [Equip 2.2] Infusion Cauldron (Flora + Aqua 2-family synthesis)
├── Room 3: The High Crucible (Late Game — Unlockable)
│   ├── [Equip 3.1] Calcination Forge (Mineral / Metallurgy line)
│   ├── [Equip 3.2] Arcane Prism (Aether / Arcane line)
│   └── [Equip 3.3] Resonance Forge (Mineral + Aether synthesis)
└── Room 4: The Transmutation Hearth (End Game — Capstone)
    └── [Equip 4.1] The Grand Opus Hearth (All-family Masterworks & Artifacts)
```

**Board type summary:**

| Board Type | Examples | Spawner? | Merge Chain | Export Rule |
| :--- | :--- | :---: | :--- | :--- |
| **Primary** | Herbalist's Bench, Mortar Station, Alembic Condenser, Calcination Forge, Arcane Prism | Yes | T1 → T4 (single family) | T4 capstone only |
| **Synthesis** | Infusion Cauldron, Resonance Forge, Grand Opus Hearth | No | Combines imported capstones → T5+ hybrid / Masterwork items | Varies by recipe |

---

## 3. Equipment Specifications

### Room 1: The Preparation Parlor

#### Equipment 1.1: Herbalist's Bench
* **Role:** The starting board for all botanical and organic ingredients. This is the first board the player interacts with.
* **Allowed Materials:** Flora family (T1 Dormant Seed → T4 Aromatic Bloom).
* **Capstone:** Tier 4 — *Aromatic Bloom*. Only T4 Flora items may be exported to the Service Cart or Storage Vault.
* **Grid Dimensions:**
  * Starting Size: 4×4 (16 tiles total, with 4 tiles locked by cobwebs).
  * Effective Starting Playable Tiles: **12 tiles.**
  * Maximum Expanded Size: 6×5 (30 tiles).
* **Spawner:** *Seed Planter* — tapping produces a Tier-1 Dormant Seed on a random empty tile. Upgradable via **Crowns** to occasionally drop Tier-2 Tender Sprouts.
* **Expansion Cost:** Standard formula (see §5).
* **Locked Tile Clearing:** 30 Elemental Dust per tile (flat cost).

#### Equipment 1.2: Mortar Station
* **Unlock Requirement:** 500 Elemental Dust + 3 Codex Botanica entries.
* **Role:** Processes raw mineral salts and calcium fragments into reactive catalysts used as inputs for synthesis equipment and Masterwork recipes.
* **Allowed Materials:** Catalyst family (T1 Calcite Shard → T4 Philosopher's Reagent). See [`02_MATERIALS_AND_MERGE_TREES.md`](./02_MATERIALS_AND_MERGE_TREES.md) for the full tree.
* **Capstone:** Tier 4 — *Philosopher's Reagent*. Only T4 Catalyst items may be exported.
* **Grid Dimensions:** 3×3 starting size (expandable to 4×4).
* **Spawner:** *Salt Grinder* — tapping produces a Tier-1 Calcite Shard on a random empty tile. Upgradable via **Crowns**.
* **Expansion Cost:** Standard formula (see §5).

---

### Room 2: The Distillation Annex

#### Equipment 2.1: The Alembic Condenser
* **Unlock Requirement:** Complete Milestone Masterwork #1 + 1,200 Elemental Dust.
* **Role:** Produces and refines liquid solutions, acids, and volatile waters.
* **Allowed Materials:** Aqua family (T1 Morning Dew → T4 Condensed Steam Vial).
* **Capstone:** Tier 4 — *Condensed Steam Vial*. Only T4 Aqua items may be exported.
* **Grid Dimensions:** 4×4 starting size (expandable to 5×5).
* **Spawner:** *Dew Collector* — spawns Tier-1 Morning Dew drops.
* **Expansion Cost:** Standard formula (see §5).

#### Equipment 2.2: Infusion Cauldron *(Synthesis Board)*
* **Unlock Requirement:** 2,500 Elemental Dust + Room 2 unlocked.
* **Role:** The first **synthesis board** the player encounters. Accepts **Flora capstones** (T4) and **Aqua capstones** (T4) from shared storage and combines them to produce hybrid compounds in the T5–T6 synthesis range.
* **No Spawner.** All items are imported via the Service Cart from Herbalist's Bench and Alembic Condenser.
* **Grid Dimensions:** 3×3 compact workspace.
* **Export:** T6 hybrid items may be exported for use in Patron Orders, Masterwork recipes, or further synthesis on the Grand Opus Hearth.
* **Design Intent:** This board teaches the cross-board logistics pattern (export capstone → cart → import to synthesis board → combine) before the player reaches the endgame Grand Opus Hearth. It is deliberately limited to two input families.

---

### Room 3: The High Crucible

#### Equipment 3.1: Calcination Forge
* **Unlock Requirement:** Complete Milestone Masterwork #2 + Elemental Dust cost (TBD).
* **Role:** Processes ores, coals, and mineral compounds through high-heat smelting.
* **Allowed Materials:** Mineral family (T1 Coarse Ash → T4 Smelted Copper Ingot).
* **Capstone:** Tier 4 — *Smelted Copper Ingot*. Only T4 Mineral items may be exported.
* **Grid Dimensions:** 4×4 starting size (expandable to 5×5).
* **Spawner:** *Coal Hopper* — spawns Tier-1 Coarse Ash.
* **Expansion Cost:** Standard formula (see §5).

#### Equipment 3.2: Arcane Prism
* **Unlock Requirement:** Elemental Dust + Insight cost (TBD, unlocks alongside or shortly after Calcination Forge).
* **Role:** Channels and refines volatile aetheric energies into stable arcane materials.
* **Allowed Materials:** Aether family (T1 Drifting Spore → T4 Bottled Starlight).
* **Capstone:** Tier 4 — *Bottled Starlight*. Only T4 Aether items may be exported.
* **Grid Dimensions:** 3×3 starting size (expandable to 4×4).
* **Spawner:** *Aether Siphon* — spawns Tier-1 Drifting Spore.
* **Expansion Cost:** Standard formula (see §5).

---

#### Equipment 3.3: Resonance Forge *(Synthesis Board)*
* **Unlock Requirement:** Elemental Dust cost (TBD) + both Calcination Forge and Arcane Prism unlocked.
* **Role:** The second synthesis board. Accepts **Mineral capstones** (T4) and **Aether capstones** (T4) from shared storage and fuses them via high-heat arcane resonance to produce enchanted compounds in the T5–T6 synthesis range.
* **No Spawner.** All items are imported via the Service Cart from Calcination Forge and Arcane Prism.
* **Grid Dimensions:** 3×3 compact workspace.
* **Export:** T6 Astral Ingots may be exported for use in Patron Orders, Masterwork recipes, or further synthesis on the Grand Opus Hearth.
* **Design Intent:** Mirrors the Infusion Cauldron's role in Room 2. Gives Mineral + Aether capstones an immediate synthesis destination rather than stockpiling until Room 4.

---

### Room 4: The Transmutation Hearth

#### Equipment 4.1: The Grand Opus Hearth *(Grand Synthesis Board)*
* **Unlock Requirement:** Complete Milestone Masterwork #3.
* **Role:** The ultimate synthesis board and focal point of the laboratory where the *Magnum Opus* is realized. Does not generate raw materials. Accepts finished capstones, hybrid synthesis products, and other high-tier items from **all** rooms to assemble legendary Codex entries and Milestone Masterworks.
* **No Spawner.** All items are imported via the Service Cart.
* **Grid Dimensions:** 4×4 starting size (expandable to 6×6).
* **Export:** Masterwork items are the outputs — each fulfills a specific recipe rather than following a linear merge chain.
* **Inputs may include:**
  * T4 capstones from any primary board (Flora, Catalyst, Aqua, Mineral, Aether)
  * T5–T6 hybrid items from the Infusion Cauldron
  * Elemental Dust (as a recipe ingredient for some Masterworks)

---

## 4. The Pulverizer (Global Discard)

* Present in every room as a persistent drop zone in the room header/footer UI.
* **Behavior:** Dragging any item onto the Pulverizer permanently destroys it and instantly awards **Elemental Dust** according to the tier-based yield formula detailed in [`02_MATERIALS_AND_MERGE_TREES.md`](./02_MATERIALS_AND_MERGE_TREES.md).
* **Confirmation Guard:** Capstone-tier items (T4 on primary boards, T5+ synthesis products) display a quick 1-tap confirmation warning to prevent accidental touch/drag deletions.
* **Always Accessible:** The Pulverizer is available from the moment the player starts the game. It is the primary relief valve for spatial pressure — when the board is full, grind something.

---

## 5. Board Expansion Reference

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

## 6. Resolved Decisions & Remaining Tasks

### Decided
- [x] Discard mechanic: **The Pulverizer** — room-level drop zone awarding Elemental Dust.
- [x] Expansion/discard currency: **Elemental Dust** — single untyped global currency stored in the Alchemical Ledger.
- [x] Patron/order currency: **Crowns** — earned from Patron Orders, spent on spawner upgrades, rare catalysts, and Codex buy-back.
- [x] Capstone model: **T4 on all primary boards.** Synthesis boards (Infusion Cauldron, Grand Opus Hearth) produce T5+ items from imported capstones.
- [x] Mortar Station: Proper equipment board with its own Catalyst/Powder merge tree (T1–T4).
- [x] Crystal Lapidary → **Arcane Prism** — processes the Aether family instead of minerals.
- [x] Synthesis board roles: Infusion Cauldron = 2-family junior synthesis; Grand Opus Hearth = all-family grand synthesis.
- [x] Locked tiles: Flat 30 Elemental Dust cost.
- [x] Expansion formula: Universal $50 \times 1.4^n$ per board.

### Open Tasks
- [ ] Finalize exact unlock costs (Dust + Insight) for Calcination Forge (3.1), Arcane Prism (3.2), Resonance Forge (3.3), and Grand Opus Hearth (4.1).
- [ ] Define the visual theme and UI representation of each board (color accents, frame style, room backgrounds).
- [ ] Design the Infusion Cauldron's specific synthesis recipes (which Flora T4 + Aqua T4 combinations → which Hybrid T5–T6 items).

### Design Explorations (Pending Dedicated Session)
- [ ] **Multi-spawner boards:** Equip primary boards with 2+ spawners producing different material families. Off-family items create spatial clutter that must be pulverized or managed, amplifying the core spatial puzzle. See design notes in [`02_MATERIALS_AND_MERGE_TREES.md`](./02_MATERIALS_AND_MERGE_TREES.md) §5.
- [ ] **Room hierarchy flattening:** Shift from "unlock Room → unlock equipment" to individual equipment unlocks as the primary progression. Rooms become organizational grouping (UI tabs) rather than hard gates. This would simplify progression and make equipment the star.

### Cascade Changes Required
These naming and structural changes must be propagated to the other docs:

| Doc | Status |
| :--- | :--- |
| **00 Overview** | ✅ Done — Elemental Dust, Crowns, Pulverizer, T4 capstone, economy table |
| **02 Materials** | ✅ Done — Trees split to T1–T4 primary + T5+ synthesis; Catalyst tree added; Arcane Prism; Pulverizer economy |
| **03 Storage** | ✅ Done — All currency names updated |
| **04 Codex** | ✅ Done — Masterwork recipes rewritten for T4 capstones; Crowns; Elemental Dust |
| **05 Tech Spec** | ✅ Done — Wireframes, JSON schema, currency names |
| **README** | ✅ Done — Currency names and doc descriptions updated |
