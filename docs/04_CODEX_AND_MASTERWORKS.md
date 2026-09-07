# Transmute — The Grand Codex & Milestone Masterworks

## 1. Overview & Long-Term Objectives

To avoid the dead-end feeling of *"I reached Tier 8, now what?"*, **Transmute** centers its macroscopic progression around two complementary systems:

1. **The Grand Codex:** An expansive, illustrated encyclopedia of all alchemical substances that rewards permanent passive perks, enables reagent buy-backs, and catalogs the player's discoveries.
2. **Milestone Masterworks:** Complex, multi-discipline capstone projects required to unlock new workshop rooms and advanced machinery (see [`01_ROOMS_AND_EQUIPMENT.md`](./01_ROOMS_AND_EQUIPMENT.md)).

Because the game lacks arbitrary character levels or XP, the Codex and Masterworks serve as the definitive measure of player progression.

---

## 2. Patron Orders (The Tactical Heartbeat)

While Masterworks provide long-term goals, **Patron Orders** provide short-term tactical direction. Orders are requests from merchants, scholars, and local nobles for specific alchemical goods, rewarding the player with **Crowns**.

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
  1. **Research / Insight Points:** Granted based on tier (Tier 1 = 1 pt $\to$ Tier 8 = 10 pts). Insight is a threshold currency required to expand the Vault and unlock advanced equipment.
  2. **Permanent Lab Perks:** Unlocking a full branch or specific milestone tiers activates passive laboratory perks.
  3. **Reagent Buy-Back:** Once an item is discovered, the player can purchase an emergency duplicate of it using **Crowns** directly from the Codex catalog (delivered instantly to an empty Cart slot).

### Sample Codex Branch Perks

| Branch | Milestone | Permanent Perk Granted |
| :--- | :--- | :--- |
| **Botany Line** | Discover Tier 4 (Aromatic Bloom) | Herbalist's Bench spawner has a 10% chance to drop Tier-2 Sprouts. |
| **Botany Line** | Complete full Flora branch | All Flora items yield +15% more Elemental Dust when pulverized. |
| **Aqua Line** | Discover Tier 4 (Condensed Steam Vial) | Alembic Condenser spawner has a 10% chance to drop Tier-2 Filtered Water. |
| **Metallurgy Line** | Discover Tier 4 (Smelted Copper Ingot) | Vault slot purchase price discounted by 15%. |
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

## 4. Milestone Masterworks (Multi-Equipment Projects)

Masterworks are monumental transmutations that mark major progression milestones. 

### Assembly Logistics (The Blueprint Panel)
Because early Masterworks (#1, #2, #3) are required to *unlock* advanced rooms, they cannot be assembled on a physical synthesis board. Instead, they are assembled in the **Blueprints** tab of the Codex. 
* Players drag required items from the Service Cart into the Blueprint's staging slots.
* Once all slots are filled, the player clicks **"Actualize Masterwork."** 
* The final Masterwork (#4) is the only one physically assembled on the Room 4 **Grand Opus Hearth**.

### Masterwork Recipes

```
+-----------------------------------------------------------------------+
| Milestone Masterwork #1: "The Distiller's Core"                       |
| Requires:                                                             |
|   - 2x Aromatic Bloom (Flora T4 capstone)                             |
|   - 2x Philosopher's Reagent (Catalyst T4 capstone)                   |
|   - 500 Elemental Dust                                                |
| Unlocks: Room 2 — The Distillation Annex & The Alembic Condenser      |
+-----------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------+
| Milestone Masterwork #2: "The Pyretic Crucible"                       |
| Requires:                                                             |
|   - 1x Concentrated Elixir (T6 synthesis from Infusion Cauldron)      |
|   - 2x Philosopher's Reagent (Catalyst T4 capstone)                   |
|   - 1,500 Elemental Dust                                              |
| Unlocks: Room 3 — The High Crucible & The Calcination Forge           |
+-----------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------+
| Milestone Masterwork #3: "The Astral Resonator"                       |
| Requires:                                                             |
|   - 2x Smelted Copper Ingot (Mineral T4 capstone)                     |
|   - 2x Bottled Starlight (Aether T4 capstone)                         |
|   - 1x Concentrated Elixir (T6 Infusion Cauldron hybrid)              |
|   - 3,000 Elemental Dust                                              |
| Unlocks: Room 4 — The Transmutation Hearth                            |
+-----------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------+
| Milestone Masterwork #4: "The Magnum Opus (Philosopher's Stone)"      |
| Requires:                                                             |
|   - 1x T4 capstone from EACH of the 5 families:                       |
|        (Flora, Catalyst, Aqua, Mineral, Aether)                       |
|   - 2x Concentrated Elixir (T6 Infusion Cauldron hybrid)              |
|   - 2x Astral Ingot (T6 Resonance Forge hybrid)                       |
|   - 5,000 Elemental Dust                                              |
| Unlocks: Game Completion / Endless Transmutation Mode & Master Relics |
+-----------------------------------------------------------------------+
```

---

## 5. Expansion Architecture for Future Updates

Because the Codex is designed as an open catalog, adding future content requires zero refactoring of core gameplay loops:
* **New Chapters:** Update 1.1 can add *Chapter II: The Subterranean Fungi* with new mushroom tiers and a new *Mycelium Incubator* equipment piece.
* **New Masterworks:** Higher-level masterworks can be appended to the list with unique cosmetic lab rewards or specialized sandbox modifiers.

---

## 6. Resolved Decisions & Remaining Tasks

### Decided
- [x] **Patron Orders:** 3 slots (Standard, Complex, Commission), instantly refreshed on completion. Rerolling costs 50 Elemental Dust to adhere to the "no timers" pillar.
- [x] **Masterwork Assembly:** Early Masterworks (#1-3) are assembled in the Codex "Blueprints" tab via Cart drag-and-drop.
- [x] **Naming Bug:** Fixed "Potent Catalyst" -> "Philosopher's Reagent" in MW #1 & #2.
- [x] **Perk Bug:** Fixed Aqua perk (spawners have no cooldown, so perk now adds 10% chance for T2 drops).
- [x] **Crown Buy-Back:** Defined escalating Crown costs per tier (10 → 1500).

### Open Tasks
- [ ] Complete the full catalog of all 32 core Codex lore entries and their flavor text.
- [ ] Design the UI layout for the Codex (grid view vs. flipbook grimoire view).
- [ ] Design Grand Opus Hearth synthesis recipes for post-game/sandbox Masterworks.
- [ ] Playtest Patron Order Crown payouts against Buy-Back costs.
