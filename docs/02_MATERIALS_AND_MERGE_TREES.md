# Transmute — Materials & Merge Trees

## 1. Overview & Mechanics
All materials in **Transmute** belong to defined elemental families and follow a strict **Merge-2** progression:
$$\text{Item}(\text{Tier } N) + \text{Item}(\text{Tier } N) \longrightarrow \text{Item}(\text{Tier } N+1)$$

### Tier Architecture
* Standard primary trees have **4 Tiers** (T1→T4).
* **T4 is the capstone** — items can only leave a primary board at T4.
* Synthesis tiers (T5+) are produced on synthesis equipment by combining capstones from different families.

```text
Base Items Needed to Craft (Primary Boards):
Tier 1: 1 base item
Tier 2: 2 base items
Tier 3: 4 base items
Tier 4: 8 base items (capstone)
```

---

## 2. Foundational Material Trees

Primary boards are designed as **Multi-Tree Boards**, meaning they host two distinct material families. Both families merge up to T4 and produce their own exportable Capstones.

### 2.1 Herbalist's Bench Families
**Tree 1: Flora (Earth / Botanical)**
* **Tier 1:** Dormant Seed
* **Tier 2:** Tender Sprout
* **Tier 3:** Wild Herb
* **Tier 4:** Aromatic Bloom *(Capstone)*

**Tree 2: Fungi (Decay / Organic)**
* **Tier 1:** Fragile Spore
* **Tier 2:** Pale Mycelium
* **Tier 3:** Luminescent Cap
* **Tier 4:** Truffle of Vitality *(Capstone)*

### 2.2 Mortar Station Families
**Tree 3: Catalysts & Salts (Reactive)**
* **Tier 1:** Calcite Shard
* **Tier 2:** Vitriol Salt
* **Tier 3:** Volatile Calx
* **Tier 4:** Philosopher's Reagent *(Capstone)*

**Tree 4: Pigments (Powders)**
* **Tier 1:** Chalk Dust
* **Tier 2:** Ocher Paste
* **Tier 3:** Lapis Extract
* **Tier 4:** Prismatic Dye *(Capstone)*

### 2.3 The Alembic Condenser Families
**Tree 5: Aqua (Liquids & Distillates)**
* **Tier 1:** Morning Dew
* **Tier 2:** Filtered Water
* **Tier 3:** Mineral Brine
* **Tier 4:** Condensed Steam Vial *(Capstone)*

**Tree 6: Oils (Resins)**
* **Tier 1:** Sticky Sap
* **Tier 2:** Amber Resin
* **Tier 3:** Essential Oil
* **Tier 4:** Viscous Solvent *(Capstone)*

### 2.4 Calcination Forge Families
**Tree 7: Minerals & Metallurgy (Fire / Earth)**
* **Tier 1:** Copper Ore
* **Tier 2:** Slag Rock
* **Tier 3:** Raw Pyrite Chunk
* **Tier 4:** Smelted Copper Ingot *(Capstone)*

**Tree 8: Carbons (Heat / Fuel)**
* **Tier 1:** Coarse Ash
* **Tier 2:** Anthracite Coal
* **Tier 3:** Purified Coke
* **Tier 4:** Flawless Diamond *(Capstone)*

### 2.5 Arcane Prism Families
**Tree 9: Aether (Air / Light)**
* **Tier 1:** Drifting Mote
* **Tier 2:** Luminescent Spark
* **Tier 3:** Whimsical Wisp
* **Tier 4:** Bottled Starlight *(Capstone)*

**Tree 10: Void (Shadow)**
* **Tier 1:** Fleeting Mote
* **Tier 2:** Shadow Shard
* **Tier 3:** Abyssal Tear
* **Tier 4:** Sphere of Annihilation *(Capstone)*

---

## 3. Synthesis Tiers (T5+)

Synthesis items are produced on **synthesis boards** (Infusion Cauldron, Resonance Forge, Grand Opus Hearth) by combining imported T4 capstones from different families. Unwanted synthesis items can be processed in The Pulverizer for substantial Elemental Dust payouts.

### How Synthesis Merging Works

Synthesis boards use a **bridge merge** pattern:

1. **Cross-family bridge (T4 → T5):** One T4 capstone from Family A + one T4 capstone from Family B merge into a T5 hybrid item. This is the only step where items from different families combine.
2. **Standard merge-2 (T5 → T6):** Two identical T5 hybrids merge into a T6 hybrid, following the normal merge-2 rule.

### Infusion Cauldron (Junior Synthesis)
| Step | Input | Output |
|:---|:---|:---|
| Bridge | Flora T4 (Aromatic Bloom) + Aqua T4 (Condensed Steam Vial) | **T5 Herbal Tincture** |
| Merge-2 | T5 Herbal Tincture + T5 Herbal Tincture | **T6 Concentrated Elixir** |

### Resonance Forge (Mid Synthesis)
| Step | Input | Output |
|:---|:---|:---|
| Bridge | Mineral T4 (Smelted Copper Ingot) + Aether T4 (Bottled Starlight) | **T5 Enchanted Alloy** |
| Merge-2 | T5 Enchanted Alloy + T5 Enchanted Alloy | **T6 Astral Ingot** |

*(Additional hybrid chains, e.g., Fungi + Oils, can be added to the Cauldron and Forge in future expansions.)*

---

## 4. Spawner Mechanics & Board-Space Puzzles

Each material family has a corresponding **Spawner** on its primary board. Spawners have **no cooldown** (aligning with the "no timers" pillar); the only bottleneck is available board space. 

### Spawner Upgrades via Rare Drops
Instead of upgrading spawners by paying UI currency, spawner upgrades are a **spatial puzzle**. 

1. **The Drop:** Whenever you tap a spawner, there is a small chance (~2%) it will drop a **"Mechanism Gear"** instead of its standard T1 material.
2. **The Puzzle:** Mechanism Gears are merged exactly like regular items: T1 Gear + T1 Gear $\to$ T2 Gear $\to$ T3 Gear. 
3. **The Spatial Tension:** While you are collecting and merging these rare gears, they permanently occupy precious board tiles. If spatial pressure becomes too high, players can choose to pulverize their gears for Dust, sacrificing long-term upgrade progress for immediate board relief.
4. **The Upgrade:** Once a gear reaches **Tier 3 (Masterwork Mechanism)**, the player drags it directly onto the Spawner widget. This permanently upgrades the Spawner to Level 2.

### Upgrade Tiers

| Spawner Level | Upgrade Requirement | Drop Table |
|:---:|:---|:---|
| **Level 1** | Default | 100% T1 |
| **Level 2** | 1x Masterwork Mechanism (T3 Gear) | 85% T1, 15% T2 |
| **Level 3** | 2x Masterwork Mechanisms (T3 Gear) | 70% T1, 25% T2, 5% T3 |

*A T2 drop saves one merge step. A T3 drop saves two. On a tight board, this spatial advantage is highly rewarding.*

---

## 5. The Pulverizer Economy (Elemental Dust Math)

When an item is dragged into **The Pulverizer**, it is permanently destroyed and instantly awards **Elemental Dust**.

To reward thoughtful spatial play without causing degenerate hoarding, the dust yield features a **progressive value multiplier** for higher tiers.

| Tier | Raw Cost (Base Items) | Linear Value | **Actual Dust Yield** | Efficiency vs Base |
| :---: | :---: | :---: | :---: | :---: |
| **Tier 1** | 1 | 1 | **1 Dust** | 1.0× |
| **Tier 2** | 2 | 2 | **3 Dust** | 1.5× |
| **Tier 3** | 4 | 4 | **8 Dust** | 2.0× |
| **Tier 4** | 8 | 8 | **20 Dust** | 2.5× |
| **Tier 5** | 16 | 16 | **48 Dust** | 3.0× |
| **Tier 6** | 32 | 32 | **110 Dust** | 3.4× |

*(T7–T8 yields are reserved for Grand Opus Hearth synthesis chains and endgame content.)*

---

## 6. Resolved Decisions

### Decided
- [x] **Multi-Tree Boards:** Primary boards feature two distinct merge trees (Flora/Fungi, Salts/Pigments, etc.).
- [x] **Spawner Upgrades:** Upgrading spawners is a spatial puzzle. Spawners drop rare "Mechanism Gears" that must be merged to T3 and fed back into the spawner.
- [x] **No Cross-Contamination:** Boards only drop items they can merge to T4. Spatial pressure comes from juggling two full families + upgrade gears simultaneously.
- [x] **Synthesis Hierarchy:** Removed old "Room" dependencies from synthesis boards.

### Open Tasks
- [ ] Define visual silhouettes and color hex schemes for all 40 core tier icons (10 families × 4 tiers) + synthesis items.
- [ ] Design Grand Opus Hearth synthesis chains (T7–T8) and define corresponding Masterwork recipes for sandbox play.
- [ ] Balance synthesis tier dust yields against expansion costs at each game stage.
