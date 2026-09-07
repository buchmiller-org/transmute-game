# Transmute — Materials & Merge Trees

## 1. Overview & Mechanics
All materials in **Transmute** belong to defined elemental families and follow a strict **Merge-2** progression:
$$\text{Item}(\text{Tier } N) + \text{Item}(\text{Tier } N) \longrightarrow \text{Item}(\text{Tier } N+1)$$

### Tier Architecture
* Standard trees have **7 to 8 Tiers**. 
* Tier 8 represents the pinnacle of an isolated material tree.
* Tier 8 items are primarily used as components for **Milestone Masterworks** or dissolved for massive Dust payouts.

```
Base Items Needed to Craft:
Tier 1: 1 base item
Tier 2: 2 base items
Tier 3: 4 base items
Tier 4: 8 base items
Tier 5: 16 base items
Tier 6: 32 base items
Tier 7: 64 base items
Tier 8: 128 base items
```

---

## 2. Foundational Material Trees

### Tree 1: Flora (Earth / Botanical)
*Processed on: Herbalist's Bench*
* **Tier 1:** Dormant Seed
* **Tier 2:** Tender Sprout
* **Tier 3:** Wild Herb
* **Tier 4:** Aromatic Bloom
* **Tier 5:** Concentrated Resin
* **Tier 6:** Distilled Botanical Extract
* **Tier 7:** Golden Sun-Blossom
* **Tier 8:** Elder Mandrake Root (Pinnacle)

### Tree 2: Aqua (Liquids & Distillates)
*Processed on: Alembic Condenser*
* **Tier 1:** Morning Dew
* **Tier 2:** Filtered Water
* **Tier 3:** Mineral Brine
* **Tier 4:** Condensed Steam Vial
* **Tier 5:** Caustic Acid
* **Tier 6:** Purified Quicksilver
* **Tier 7:** Volatile Moon-Tear
* **Tier 8:** Universal Alkahest (Pinnacle Solvent)

### Tree 3: Minerals & Metallurgy (Fire / Earth)
*Processed on: Calcination Forge*
* **Tier 1:** Coarse Ash
* **Tier 2:** Anthracite Coal
* **Tier 3:** Raw Pyrite Chunk
* **Tier 4:** Smelted Copper Ingot
* **Tier 5:** Hardened Mithril Slag
* **Tier 6:** Raw Geode Shard
* **Tier 7:** Polished Star-Ruby
* **Tier 8:** Philosopher's Cinder (Pinnacle)

### Tree 4: Aether & Arcane (Air / Light)
*Processed on: Crystal Lapidary & Transmutation Hearth*
* **Tier 1:** Drifting Spore
* **Tier 2:** Luminescent Spark
* **Tier 3:** Whimsical Wisp
* **Tier 4:** Bottled Starlight
* **Tier 5:** Harmonic Tuning Crystal
* **Tier 6:** Astral Vapor
* **Tier 7:** Chrono-Dust
* **Tier 8:** Primordial Quintessence (Pinnacle)

---

## 3. The Dissolution Economy (Dust Math)

When an item is dragged into the **Dissolution Basin**, it dissolves into **Alchemical Dust**. 

To reward thoughtful spatial play without causing degenerate hoarding, the dust yield features a **progressive value multiplier** for higher tiers:

| Tier | Raw Cost (Base Items) | Linear Value | **Actual Dust Yield** | Efficiency vs Base |
| :---: | :---: | :---: | :---: | :---: |
| **Tier 1** | 1 | 1 | **1 Dust** | 1.0x |
| **Tier 2** | 2 | 2 | **3 Dust** | 1.5x |
| **Tier 3** | 4 | 4 | **8 Dust** | 2.0x |
| **Tier 4** | 8 | 8 | **20 Dust** | 2.5x |
| **Tier 5** | 16 | 16 | **48 Dust** | 3.0x |
| **Tier 6** | 32 | 32 | **110 Dust** | 3.4x |
| **Tier 7** | 64 | 64 | **260 Dust** | 4.0x |
| **Tier 8** | 128 | 128 | **600 Dust** | 4.7x |

### Gameplay Strategy Emerging From This Curve
* **Emergency Cleanup:** Players with zero grid space can dump Tier 1 seeds for 1 dust just to keep playing.
* **Greedy Merging:** If a player has just enough room to combine two Tier 3 items into Tier 4, their dust return jumps from 16 ($2 \times 8$) to 20, incentivizing tactical merges right before discarding.

---

## 4. Cross-Tree Transmutations (Hybrids)

Certain recipes do not progress strictly linearly. Instead, placing items into hybrid processors (like the *Infusion Cauldron*) produces cross-tree compounds:

* Example:
  $$\text{Tier 4 Bloom (Flora)} + \text{Tier 4 Steam Vial (Aqua)} \longrightarrow \text{Essence of Dew-Petal (Hybrid)}$$
* These hybrid materials cannot be spawned from any base tap; they must be deliberately synthesized to satisfy high-tier Codex recipes.

---

## 5. Tasks for Next AI Planning Session

- [ ] Define visual silhouettes and color hex schemes for all 32 core tier icons.
- [ ] Detail the exact drop-probability table for Spawner upgrades (e.g., Level 1 Spawner: 100% T1; Level 2 Spawner: 85% T1, 15% T2).
- [ ] Map out 10 specific Cross-Tree Hybrid recipes and their equipment requirements.
