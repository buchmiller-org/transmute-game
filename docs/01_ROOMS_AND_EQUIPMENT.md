# Transmute — Rooms & Equipment Architecture

## 1. Overview & Principles
In **Transmute**, the laboratory is partitioned into distinct **Rooms**, each housing specialized **Equipment**. 

Each piece of equipment acts as its own **self-contained grid board**. Instead of managing one gigantic, cluttered 10×10 board with 50 disparate item types, the player navigates between focused workbenches designed for specific alchemical operations.

### Key Rules
1. **Equipment = Board:** Selecting an equipment station displays its active grid.
2. **Material Restrictions:** Most equipment can only hold and process specific elemental or mechanical categories (e.g., you cannot place raw water dew directly onto a dry herb milling board).
3. **Internal Spawners:** Equipment typically features 1 or 2 dedicated Spawner widgets (e.g., a *Herb Planter* or an *Essence Dripper*) that drop base ingredients onto empty tiles when tapped.
4. **Independent Board Expansion:** Each equipment board begins at a compact size (e.g., 3×3 or 4×4) and is upgraded tile-by-tile using **Alchemical Dust**.

---

## 2. Room & Equipment Hierarchy

```
The Grand Arcanum Laboratory
├── Room 1: The Preparation Parlor (Early Game)
│   ├── [Equip 1.1] Herbalist's Bench (Flora / Botanical line)
│   ├── [Equip 1.2] Milling & Grinding Table (Powders / Catalysts)
│   └── [Global Feature] The Dissolution Basin (Discard -> Alchemical Dust)
├── Room 2: The Distillation Annex (Mid Game - Unlockable)
│   ├── [Equip 2.1] The Alembic Condenser (Aqua / Distillate line)
│   └── [Equip 2.2] Infusion Cauldron (Flora + Aqua cross-processing)
├── Room 3: The High Crucible (Late Game - Unlockable)
│   ├── [Equip 3.1] Calcination Forge (Thermal / Mineral / Ash line)
│   └── [Equip 3.2] Crystal Lapidary (Gemstones / Prisms)
└── Room 4: The Transmutation Hearth (End Game / Capstone)
    └── [Equip 4.1] The Grand Opus Hearth (Composite Masterworks & Artifacts)
```

---

## 3. Equipment Specifications (Initial Baseline)

### Room 1: The Preparation Parlor

#### Equipment 1.1: Herbalist's Bench
* **Role:** The starting board for all botanical and organic ingredients.
* **Allowed Materials:** Flora family (Seeds, Sprouts, Herbs, Blossoms, Extracts).
* **Grid Dimensions:**
  * Starting Size: 4×4 (16 tiles total, with 4 tiles locked by cobwebs/calcification).
  * Effective Starting Playable Tiles: 12 tiles.
  * Maximum Expanded Size: 6×5 (30 tiles).
* **Spawner:** *Seed Planter* (Tapping produces Tier-1 Seeds; upgradable via Shillings to drop Tier-2 Sprouts).
* **Expansion Cost:** First tile: 50 Dust; scales exponentially ($50 \times 1.4^n$).

#### Equipment 1.2: Milling & Grinding Table
* **Unlock Requirement:** 500 Alchemical Dust + 3 Codex Botanica entries.
* **Role:** Crushes dried herbs and botanical extracts into reactive powders and pigments.
* **Grid Dimensions:** 3×3 starting size (expandable to 4×4).
* **Mechanic:** Drop a Tier-3+ botanical item here, tap the Pestle to grind it into powder bases.

---

### Room 2: The Distillation Annex

#### Equipment 2.1: The Alembic Condenser
* **Unlock Requirement:** Complete Milestone Masterwork #1 (*"Purified Phial"*) + 1,200 Dust.
* **Role:** Produces and refines liquid solutions, acids, and volatile waters.
* **Allowed Materials:** Aqua family (Dew, Distilled Water, Steam, Acid, Quicksilver).
* **Grid Dimensions:** 4×4 starting size (expandable to 5×5).
* **Spawner:** *Dew Collector* (spawns Tier-1 Morning Dew drops).

#### Equipment 2.2: Infusion Cauldron
* **Unlock Requirement:** 2,500 Dust + Room 2 unlocked.
* **Role:** Dual-input board that accepts 1 liquid and 1 herb/powder to brew hybrid tinctures.
* **Grid Dimensions:** 3×3 compact workspace.

---

### Room 3: The High Crucible
* **Theme:** Fire, earth, metals, calcified salts, and high-heat synthesis.
* **Equipment 3.1: Calcination Forge:** 4×4 board processing Coal, Ash, Ores, and Ingots.
* **Equipment 3.2: Crystal Lapidary:** 3×3 board processing Geodes, Quartzes, and Prismatic Crystals.

---

### Room 4: The Transmutation Hearth
* **Theme:** The focal point of the laboratory where the *Magnum Opus* is realized.
* **Equipment 4.1: Masterwork Crucible:** Does not generate raw materials. Accepts finished high-tier items from Rooms 1, 2, and 3 to assemble legendary Codex entries and Milestone Masterworks.

---

## 4. The Dissolution Basin (Global Discard)

* Present in every room header/footer as an accessible drop zone.
* **Behavior:** Dragging any item into the Basin permanently destroys it and instantly awards **Alchemical Dust** according to the formula detailed in `02_MATERIALS_AND_MERGE_TREES.md`.
* **Confirmation Guard:** Items of Tier 5 or higher show a quick 1-click confirmation warning to prevent accidental touch/drag deletions.

---

## 5. Tasks for Next AI Planning Session

- [ ] Finalize exact unlock costs (Dust and Insight) for all 7 equipment stations.
- [ ] Define the visual theme and UI representation of each board (color accents, frame style).
- [ ] Determine how locked tiles (cobwebs, rust, calcification) are cleared (e.g., flat dust cost vs. specific cleansing reagent).
- [ ] Balance tile expansion scaling curves so space feels tight but achievable.
