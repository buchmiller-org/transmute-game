# Transmute — Materials & Merge Trees

## 1. Overview & Mechanics
All materials in **Transmute** belong to defined elemental families and follow a strict **Merge-2** progression:
$$\text{Item}(\text{Tier } N) + \text{Item}(\text{Tier } N) \longrightarrow \text{Item}(\text{Tier } N+1)$$

### Tier Architecture
* Standard primary trees have **4 Tiers** (T1→T4).
* **T4 is the capstone** — items can only leave a primary board at T4.
* Synthesis tiers (T5+) are produced on synthesis equipment by combining capstones from different families (see §3).

```
Base Items Needed to Craft (Primary Boards):
Tier 1: 1 base item
Tier 2: 2 base items
Tier 3: 4 base items
Tier 4: 8 base items (capstone)
```

---

## 2. Foundational Material Trees

### Tree 1: Flora (Earth / Botanical)
*Processed on: Herbalist's Bench*
* **Tier 1:** Dormant Seed
* **Tier 2:** Tender Sprout
* **Tier 3:** Wild Herb
* **Tier 4:** Aromatic Bloom *(Capstone)*

### Tree 2: Aqua (Liquids & Distillates)
*Processed on: Alembic Condenser*
* **Tier 1:** Morning Dew
* **Tier 2:** Filtered Water
* **Tier 3:** Mineral Brine
* **Tier 4:** Condensed Steam Vial *(Capstone)*

### Tree 3: Minerals & Metallurgy (Fire / Earth)
*Processed on: Calcination Forge*
* **Tier 1:** Coarse Ash
* **Tier 2:** Anthracite Coal
* **Tier 3:** Raw Pyrite Chunk
* **Tier 4:** Smelted Copper Ingot *(Capstone)*

### Tree 4: Aether & Arcane (Air / Light)
*Processed on: Arcane Prism*
* **Tier 1:** Drifting Spore
* **Tier 2:** Luminescent Spark
* **Tier 3:** Whimsical Wisp
* **Tier 4:** Bottled Starlight *(Capstone)*

### Tree 5: Catalysts & Salts
*Processed on: Mortar Station*
* **Tier 1:** Calcite Shard
* **Tier 2:** Vitriol Salt
* **Tier 3:** Volatile Calx
* **Tier 4:** Philosopher's Reagent *(Capstone)*

---

## 3. Synthesis Tiers (T5+)

Synthesis items are produced on **synthesis boards** (Infusion Cauldron, Resonance Forge, Grand Opus Hearth) by combining imported T4 capstones from different families. They cannot be spawned from any base spawner — they must be deliberately crafted via cross-board logistics. Unwanted synthesis items can be processed in The Pulverizer for substantial Elemental Dust payouts (see §4).

### How Synthesis Merging Works

Synthesis boards use a **bridge merge** pattern that differs from primary boards:

1. **Cross-family bridge (T4 → T5):** One T4 capstone from Family A + one T4 capstone from Family B merge into a T5 hybrid item. This is the only step where items from different families combine.
2. **Standard merge-2 (T5 → T6):** Two identical T5 hybrids merge into a T6 hybrid, following the normal merge-2 rule.

```
Cost breakdown:
T5 hybrid: 1× Family A T4 + 1× Family B T4 = 16 base items (8 per family)
T6 hybrid: 2× T5 hybrids = 4× T4 capstones = 32 base items (16 per family)
```

### Infusion Cauldron — Flora + Aqua Synthesis (Room 2)

| Step | Input | Output |
|:---|:---|:---|
| Bridge | Flora T4 (Aromatic Bloom) + Aqua T4 (Condensed Steam Vial) | **T5 Herbal Tincture** |
| Merge-2 | T5 Herbal Tincture + T5 Herbal Tincture | **T6 Concentrated Elixir** |

### Resonance Forge — Mineral + Aether Synthesis (Room 3)

| Step | Input | Output |
|:---|:---|:---|
| Bridge | Mineral T4 (Smelted Copper Ingot) + Aether T4 (Bottled Starlight) | **T5 Enchanted Alloy** |
| Merge-2 | T5 Enchanted Alloy + T5 Enchanted Alloy | **T6 Astral Ingot** |

### Grand Opus Hearth — Multi-Family Grand Synthesis (Room 4)

The Grand Opus Hearth accepts capstones and synthesis outputs from all rooms. Its specific synthesis chains and Masterwork recipes are detailed in [`04_CODEX_AND_MASTERWORKS.md`](./04_CODEX_AND_MASTERWORKS.md). Future T7–T8 chains will be defined here as Grand Opus recipes are designed.

---

## 4. The Pulverizer Economy (Elemental Dust Math)

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
| **Tier 7** | 64 | 64 | **260 Dust** | 4.0× |
| **Tier 8** | 128 | 128 | **600 Dust** | 4.7× |

*Note: T5–T6 yields apply to synthesis items from the Infusion Cauldron and Resonance Forge. T7–T8 rows are reserved for future Grand Opus Hearth synthesis chains and endgame content.*

### Gameplay Strategy Emerging From This Curve
* **Emergency Cleanup:** Players with zero grid space can dump Tier 1 seeds for 1 Dust just to keep playing.
* **Greedy Merging:** If a player has just enough room to combine two Tier 3 items into Tier 4, their dust return jumps from 16 ($2 \times 8$) to 20, incentivizing tactical merges right before discarding.

---

## 5. Spawner Mechanics

Each primary equipment board has at least one **Spawner** — a widget the player taps to generate a base item on a random empty tile. Spawners have **no cooldown** (aligning with the "no timers" pillar); the only bottleneck is available board space. If the board is full, the spawner simply does nothing.

### Spawner Upgrade Tiers

Spawners can be upgraded using **Crowns** to occasionally produce higher-tier items, reducing the number of merges needed:

| Spawner Level | Upgrade Cost | Drop Table |
|:---:|:---|:---|
| **Level 1** (Default) | Free | 100% T1 |
| **Level 2** | 200 Crowns | 85% T1, 15% T2 |
| **Level 3** | 800 Crowns | 70% T1, 25% T2, 5% T3 |

*A T2 drop saves one merge step (skip a T1+T1 merge). A T3 drop saves two. On a tight board, this spatial advantage is meaningful but not game-breaking.*

### Design Exploration: Multi-Spawner Boards

A planned design direction is to equip boards with **multiple spawners** producing items from different material families. For example, the Herbalist's Bench might have a primary *Seed Planter* (Flora T1) and a secondary spawner that occasionally drops off-family items. These off-family items cannot reach their capstone on this board, creating spatial clutter that must be either:

* **Pulverized** for Elemental Dust (the intended pressure valve), or
* **Managed strategically** if the player can find a use for them on another board via the Service Cart.

This mechanic would amplify the core spatial pressure without adding timers or artificial difficulty. Detailed multi-spawner configurations and their impact on board design are TBD.

---

## 6. Tasks for Next AI Planning Session

- [ ] Define visual silhouettes and color hex schemes for all core tier icons (5 primary families × 4 tiers + synthesis items).
- [ ] Design Grand Opus Hearth synthesis chains (T7–T8) and define corresponding Masterwork recipes.
- [ ] Prototype multi-spawner board configurations and test spatial pressure on 3×3 and 4×4 grids.
- [ ] Explore flattening the Room hierarchy so equipment unlocks drive progression directly (rooms become organizational grouping rather than hard gates).
- [ ] Balance synthesis tier dust yields against expansion costs at each game stage.
