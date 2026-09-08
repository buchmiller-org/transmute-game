# Transmute — The Grand Codex & Equipment Blueprints

## 1. Overview & Long-Term Objectives

To avoid the dead-end feeling of *"I reached Tier 8, now what?"*, **Transmute** centers its macroscopic progression around two complementary systems:

1. **The Grand Codex:** An expansive, illustrated encyclopedia of all alchemical substances that rewards permanent passive perks, enables reagent buy-backs, and catalogs the player's discoveries.
2. **Equipment Blueprints (Masterworks):** Instead of abstract room gates, progression is driven by constructing new equipment from Blueprints. Reaching milestones in the Codex unlocks these Blueprints, and paying their material cost (the **Masterwork**) builds them.

Because the game lacks arbitrary character levels or XP, the Codex and Blueprints serve as the definitive measure of player progression.

---

## 2. Patron Orders (The Tactical Heartbeat)

While Equipment Blueprints provide long-term goals, **Patron Orders** provide short-term tactical direction. Orders are requests from merchants, scholars, and local nobles for specific alchemical goods, rewarding the player with **Crowns**.

### Order Board Mechanics
To strictly adhere to the "no timers" design pillar, Patron Orders do not refresh on a real-time clock. The Orders panel maintains **3 active slots** at all times:

| Slot | Difficulty | Typical Requirement | Reward Range |
| :--- | :--- | :--- | :--- |
| **Slot 1: Standard** | Easy | 1–2 Primary Capstones (T4) | 50 – 100 Crowns |
| **Slot 2: Complex** | Medium | 3–4 Capstones from mixed families | 150 – 300 Crowns |
| **Slot 3: Commission** | Hard | Synthesis items (T5/T6) + Dust | 500 – 1,000 Crowns |

### Fulfillment & Rerolling
* **Fulfillment:** Players fulfill orders by dragging items from their Service Cart into the order's requirement slots (detailed in [`03_STORAGE_AND_LOGISTICS.md`](./03_STORAGE_AND_LOGISTICS.md)). Completing an order instantly generates a new one in that slot.
* **Rejecting / Rerolling:** If a player is stuck on a difficult order, they can click **"Reject Order"** to instantly generate a new one. This costs a flat fee of **50 Elemental Dust**, ensuring players can always cycle their board but at a slight economic cost, preventing infinite free rerolls to hunt for easy orders.

---

## 3. The Grand Codex System

### Discovery Mechanics
* The first time a player merges or synthesizes a new item tier, a **"New Discovery!"** banner appears.
* The item’s entry is permanently inked into the Codex.
* **Codex Rewards:**
  1. **Insight Points:** Granted based on tier. Insight is a threshold currency required to expand the Vault and construct advanced equipment.

| Tier | Insight Awarded |
| :---: | :---: |
| T1 | 1 |
| T2 | 1 |
| T3 | 2 |
| T4 | 3 |
| T5 | 5 |
| T6 | 7 |
| T7 | 8 |
| T8 | 10 |

*Total Insight from discovering all 40 primary items (T1–T4): 70. Total from all 48 items including synthesis (T5–T8): 100.*

  2. **Blueprint Unlocks:** Discovering specific Capstones (e.g., Flora T4) automatically unlocks the Blueprint for the next tier of equipment (see §4).
  3. **Permanent Lab Perks:** Unlocking a full branch or specific milestone tiers activates passive laboratory perks.
  4. **Reagent Buy-Back:** Once an item is discovered, the player can purchase an emergency duplicate of it using **Crowns** directly from the Codex catalog (delivered instantly to an empty Cart slot).

### Sample Codex Branch Perks

| Branch | Milestone | Permanent Perk Granted |
| :--- | :--- | :--- |
| **Flora Line** | Discover Tier 4 (Aromatic Bloom) | Unlocks Mortar Station Blueprint. |
| **Fungi Line** | Complete full Fungi branch | All Fungi items yield +15% more Elemental Dust when pulverized. |
| **Aqua Line** | Discover Tier 4 (Condensed Steam Vial) | Alembic Condenser spawner has a 10% chance to drop Tier-2 Filtered Water. |
| **Minerals Line** | Discover Tier 4 (Smelted Copper Ingot) | Unlocks Arcane Prism Blueprint. |
| **Infusion Line** | Complete full synthesis branch | Herbal Tincture (T5) yields +20% more Dust when pulverized. |

### Crown Buy-Back Pricing
The buy-back system is a pressure valve, allowing players to spend Crowns to skip tedious early-tier merging when they need one specific item to finish a complex recipe. 

| Tier | Buy-Back Cost | Note |
| :---: | ---: | :--- |
| **T1** | 10 Crowns | Trivial cost for quick board seeding |
| **T2** | 25 Crowns | |
| **T3** | 75 Crowns | |
| **T4** | 200 Crowns | A standard Patron Order pays ~100 Crowns; buying a T4 requires the profits of 2 orders. |
| **T5** | 600 Crowns | Synthesis items carry a steep premium. |
| **T6** | 1,500 Crowns | End-game luxury shortcut. |

*(Note: Items cannot be bought back unless they have been discovered naturally first.)*

---

## 4. Equipment Blueprints & Masterwork Costs

We have replaced arbitrary "Room" progression with **Equipment Blueprints**. When a player unlocks a Blueprint in the Codex, it appears in their **Construction Panel**. 

To build the equipment and add it to their UI tabs, the player must pay its **Masterwork** material cost. This involves dragging required capstones from the Cart into the Blueprint's staging slots. Once all items are staged, the player clicks **"Construct Equipment."**

### Blueprint Recipes

```text
+-----------------------------------------------------------------------+
| Blueprint: Mortar Station (Catalysts & Pigments)                      |
| Unlocked by: Discovering Flora T4 Capstone                            |
| Masterwork Cost:                                                      |
|   - 2x Aromatic Bloom (Flora T4 capstone)                             |
|   - 500 Elemental Dust                                                |
| Unlocks: Adds the Mortar Station to your workspace tabs.              |
+-----------------------------------------------------------------------+
```

```text
+-----------------------------------------------------------------------+
| Blueprint: The Alembic Condenser (Aqua & Oils)                        |
| Unlocked by: Discovering Salts T4 Capstone (Philosopher's Reagent)    |
| Masterwork Cost:                                                      |
|   - 2x Truffle of Vitality (Fungi T4 capstone)                        |
|   - 2x Philosopher's Reagent (Salts T4 capstone)                      |
|   - 1,200 Elemental Dust                                              |
| Unlocks: Adds the Alembic Condenser to your workspace tabs.           |
+-----------------------------------------------------------------------+
```

```text
+-----------------------------------------------------------------------+
| Blueprint: Infusion Cauldron (Junior Synthesis)                        |
| Unlocked by: Discovering Aqua T4 Capstone (Condensed Steam Vial)      |
| Masterwork Cost:                                                      |
|   - 2x Condensed Steam Vial (Aqua T4 capstone)                       |
|   - 2x Aromatic Bloom (Flora T4 capstone)                             |
|   - 1,500 Elemental Dust                                              |
| Unlocks: Adds the Infusion Cauldron (4x4 synthesis board).            |
+-----------------------------------------------------------------------+
```

```text
+-----------------------------------------------------------------------+
| Blueprint: Arcane Prism (Aether & Void)                               |
| Unlocked by: Discovering Minerals T4 Capstone (Smelted Copper Ingot)  |
| Masterwork Cost:                                                      |
|   - 2x Smelted Copper Ingot (Minerals T4 capstone)                   |
|   - 2x Viscous Solvent (Oils T4 capstone)                             |
|   - 2,000 Elemental Dust                                              |
| Unlocks: Adds the Arcane Prism to your workspace tabs.                |
+-----------------------------------------------------------------------+
```

```text
+-----------------------------------------------------------------------+
| Blueprint: Calcination Forge (Minerals & Carbons)                     |
| Unlocked by: Discovering a Tier 5 Synthesis item (Infusion Cauldron)  |
| Masterwork Cost:                                                      |
|   - 1x Concentrated Elixir (T6 synthesis from Cauldron)               |
|   - 2x Philosopher's Reagent (Salts T4 capstone)                      |
|   - 1,500 Elemental Dust                                              |
| Unlocks: Adds the Calcination Forge to your workspace tabs.           |
+-----------------------------------------------------------------------+
```

```text
+-----------------------------------------------------------------------+
| Blueprint: Resonance Forge (Mid Synthesis)                            |
| Unlocked by: Discovering Aether T4 Capstone (Bottled Starlight)       |
| Masterwork Cost:                                                      |
|   - 2x Smelted Copper Ingot (Minerals T4 capstone)                   |
|   - 2x Bottled Starlight (Aether T4 capstone)                        |
|   - 3,000 Elemental Dust                                              |
| Unlocks: Adds the Resonance Forge (4x4 synthesis board).              |
+-----------------------------------------------------------------------+
```

```text
+-----------------------------------------------------------------------+
| Blueprint: The Grand Opus Hearth (Grand Synthesis)                    |
| Unlocked by: Discovering Tier 6 Synthesis on both Cauldron and Forge  |
| Masterwork Cost:                                                      |
|   - 1x Concentrated Elixir (T6 Infusion Cauldron hybrid)              |
|   - 1x Astral Ingot (T6 Resonance Forge hybrid)                       |
|   - 5,000 Elemental Dust                                              |
| Unlocks: Adds the ultimate 6x6 Synthesis board.                       |
+-----------------------------------------------------------------------+
```

---

## 5. Expansion Architecture for Future Updates

Because the Codex is designed as an open catalog, adding future content requires zero refactoring of core gameplay loops:
* **New Chapters:** Update 1.1 can add *Chapter II: The Celestial Metals* with new stellar ores and a new *Astrolabe Crucible* equipment piece.
* **New Blueprints:** Higher-level masterworks can be appended to the list with unique cosmetic lab rewards or specialized sandbox modifiers.

---

## 6. Resolved Decisions & Remaining Tasks

### Decided
- [x] **Patron Orders:** 3 slots (Standard, Complex, Commission), instantly refreshed on completion. Rerolling costs 50 Elemental Dust to adhere to the "no timers" pillar.
- [x] **Blueprint Progression:** "Rooms" are gone. Reaching Codex milestones unlocks Blueprints. "Masterworks" are the material costs required to build them via the Construction Panel.
- [x] **Crown Buy-Back:** Defined escalating Crown costs per tier (10 → 1500).

### Open Tasks
- [ ] Complete the full catalog of all 40 core Codex lore entries and their flavor text (10 families × 4 tiers).
- [ ] Design the UI layout for the Codex (grid view vs. flipbook grimoire view).
- [ ] Playtest Patron Order Crown payouts against Buy-Back costs.
