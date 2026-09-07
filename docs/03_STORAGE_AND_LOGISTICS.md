# Transmute — Storage & Logistics

## 1. Overview & Logistics Philosophy

Because **Transmute** separates gameplay across specialized equipment boards, moving items between workbenches and stockpiling reserves is a core strategic layer — not just a convenience feature.

**The Cart is the bottleneck. The Vault is the buffer.** The Service Cart's limited, non-stacking slots create moment-to-moment logistics tension: the player can only shuttle a few items at a time, forcing deliberate planning around Cart capacity. The Storage Vault provides breathing room for accumulation, but requires conscious stocking and retrieval. Together, they make cross-board logistics a genuine puzzle rather than a menu exercise.

Off-board inventory is divided into two systems:
1. **The Service Cart:** An always-visible, rapid-transit tray for items actively being moved between boards.
2. **The Storage Vault:** A high-capacity, stackable pantry for long-term reserves and order staging.

---

## 2. The Capstone Export Rule — UI Enforcement

On **primary boards** (Herbalist's Bench, Mortar Station, Alembic Condenser, Calcination Forge, Arcane Prism), items follow a T1→T4 merge chain and **cannot leave the board until they reach their T4 capstone** (see [`01_ROOMS_AND_EQUIPMENT.md`](./01_ROOMS_AND_EQUIPMENT.md) §3). This is enforced in the UI as follows:

**Sub-capstone items (T1–T3):**
* Can be moved freely between tiles on the same board.
* Can be dragged to **The Pulverizer** for Elemental Dust.
* **Cannot** be dragged to the Service Cart or Storage Vault. Attempting to do so shows a brief **red lock icon** on the item; the item snaps back to its tile. A tooltip reads: *"Reach Tier 4 to export."*

**Capstone items (T4):**
* Display a subtle **golden export arrow** overlay on their tile, indicating they are eligible for transfer off the board.
* Can be dragged to the Cart, the Vault (when open), or The Pulverizer.

**Synthesis board items (T5+):**
* Exportable synthesis products (e.g., T6 Concentrated Elixir, T6 Astral Ingot) follow the same golden-arrow convention.
* Intermediate synthesis items that are not yet at their chain's export tier are board-locked, using the same red-lock rejection behavior.

---

## 3. The Service Cart (Rapid Transit)

* **Physical Placement:** Anchored persistently at the bottom (mobile portrait) or right sidebar (desktop / mobile landscape) of the screen, visible across **all** equipment boards and overlay panels.
* **Function:** The Cart is the player's hands — the active conduit for moving items between boards, to and from the Vault, and to the Orders panel for Patron Order delivery. It is always accessible without opening a menu.

### Capacity & Upgrades

| Upgrade | Total Slots | Cost |
| :---: | :---: | :--- |
| Default | 2 | Free |
| Slot 3 | 3 | 200 Elemental Dust |
| Slot 4 | 4 | 750 Elemental Dust |
| Slot 5 | 5 | 2,000 Elemental Dust |

**Cumulative cost to max (5 slots): 2,950 Elemental Dust.**

**Stacking Rule:** **No stacking in the Cart.** Each slot holds exactly 1 item. This preserves the Cart's identity as an active transfer conduit and makes slot count a meaningful logistical constraint — the player must plan multi-item moves around their available capacity.

### Cart Interactions

| Action | Behavior |
| :--- | :--- |
| **Board → Cart** | Drag an exportable item from a board tile to an empty Cart slot. Non-exportable items are rejected (see §2). |
| **Cart → Board** | Drag from a Cart slot to an empty tile on the active board. Board family restrictions apply — incompatible items are rejected with a red-tint flash. |
| **Cart → Vault** | Open the Vault panel, then drag from a Cart slot to a Vault slot. Auto-stacks with a compatible existing stack if one exists. |
| **Cart → Pulverizer** | Drag from a Cart slot to The Pulverizer drop zone. Standard confirmation guard applies for T4+ items. |
| **Cart → Order Slot** | Open the Orders panel, then drag from a Cart slot to an order's requirement slot (see §6). |
| **Quick Store (▼)** | Tap the ▼ icon on a Cart slot to auto-deposit the item into the first compatible Vault stack (or first empty Vault slot). Provides a brief green check animation on success or a red shake if the Vault is full. |

---

## 4. The Storage Vault (Bulk Stockpile)

* **Physical Placement:** Accessed via the **"Vault"** drawer icon in the main navigation bar. Opens as a slide-in overlay panel — from the left on mobile portrait, or as a side drawer on desktop. **The Cart remains visible** while the Vault is open, enabling direct Cart ↔ Vault transfers without closing panels.
* **Function:** Long-term storage for capstones, synthesis products, and staging reserves for Masterwork assembly and Patron Order fulfillment. The Vault is where players accumulate the materials needed for complex recipes.

### Slot Capacity & Expansion

**Starting Slots:** 6  
**Maximum Slots:** 24  
**Expansion:** Purchased in increments of 2 slots.

| Expansion # | Slots After | Cost (Elemental Dust) | Cumulative Dust |
| :---: | :---: | ---: | ---: |
| — | 6 (starting) | — | — |
| 1st | 8 | 200 | 200 |
| 2nd | 10 | 350 | 550 |
| 3rd | 12 | 550 | 1,100 |
| 4th | 14 | 800 | 1,900 |
| 5th | 16 | 1,200 | 3,100 |
| 6th | 18 | 1,800 | 4,900 |
| 7th | 20 | 2,800 | 7,700 |
| 8th | 22 | 4,200 | 11,900 |
| 9th | 24 | 6,500 | 18,400 |

*Pacing note: Players will naturally need ~10 slots when Room 2 opens (Flora, Catalyst, Aqua capstones plus synthesis products), ~16 when Room 3 arrives (adding Mineral and Aether), and 20+ only for endgame Masterwork staging. The later expansions are a luxury Dust sink.*

### Stacking System

* Identical items of the **exact same type and tier** automatically stack when placed in the same Vault slot.
* If a stack reaches its capacity cap, adding another item of that type requires a new empty slot (or upgrading the stack capacity).
* **Empty slots** display a faint **"+"** icon to indicate availability.

### Stack Capacity Upgrades

| Level | Max Items Per Slot | Cost | Prerequisite |
| :---: | :---: | :--- | :--- |
| **Level 1** (Default) | 3 | Free | None |
| **Level 2** | 5 | 500 Dust | Room 1 Complete |
| **Level 3** | 10 | 1,500 Dust + 10 Insight | Room 2 Unlocked |
| **Level 4** | 20 | 4,000 Dust + 25 Insight | Room 3 Unlocked |

### Vault Management Tools

| Action | Behavior |
| :--- | :--- |
| **Cart → Vault** | Drag from Cart slot to Vault. Auto-stacks with a compatible existing stack; otherwise uses first empty slot. |
| **Vault → Cart** | Drag from Vault stack to empty Cart slot. Removes 1 item from the stack. |
| **Quick Retrieve (▲)** | Tap the ▲ icon on a Vault stack to send 1 item to the first empty Cart slot. Green check on success; red shake if Cart is full. |
| **Consolidate (⟐)** | Tap the ⟐ button in the Vault header to merge all partial stacks of the same type/tier into minimal slots, freeing empties. |
| **Sort** | Cycle through sort modes via the sort button: **by Family** → **by Tier** (descending) → **by Quantity** (descending). Active sort mode is displayed as a label. |

---

## 5. Transfer Flow Reference

All item movement in Transmute flows through the **Service Cart**. The Cart is the universal intermediary — items cannot teleport directly between boards, or from Vault to board, bypassing the Cart.

```
Primary Board ──(T4 export)──► Service Cart ──► Synthesis Board
                                    │   ▲
                                    ▼   │
                              Storage Vault
                                    │
                                    ▼
                         Patron Order Delivery
```

### Complete Transfer Routes

| From | To | Route | Notes |
| :--- | :--- | :--- | :--- |
| Primary Board | Synthesis Board | Board → Cart → (navigate) → Cart → Board | Board family restrictions apply on import |
| Primary Board | Storage Vault | Board → Cart → Vault *(or Quick Store)* | Only T4 capstones exportable |
| Storage Vault | Synthesis Board | Vault → Cart → (navigate) → Cart → Board | Requires empty Cart slot(s) |
| Storage Vault | Patron Order | Vault → Cart → Orders panel → Order slot | Items staged until delivery confirmed |
| Cart item | Pulverizer | Cart → Pulverizer *(direct drag)* | Confirmation guard for T4+ |
| Board item | Pulverizer | Board → Pulverizer *(direct drag)* | Available on same board view |
| Cart item | Another board | Cart → (navigate) → Cart → Board | Cart persists across navigation |

**Key constraint:** The Cart's limited slot count (2–5) means that complex operations — like stocking the Grand Opus Hearth with capstones from 5 families — require multiple trips between Vault and synthesis board. This is **intentional**: logistics complexity scales naturally with recipe complexity, without adding artificial timers or gates.

---

## 6. Order Fulfillment Logistics

Patron Orders (system details in [`04_CODEX_AND_MASTERWORKS.md`](./04_CODEX_AND_MASTERWORKS.md)) are fulfilled through the **Orders** panel using the same drag interaction as all other item movement.

### How Delivery Works

1. The player opens the **Orders** panel from the navigation bar. The Cart remains visible.
2. Each active order displays its required items as **empty recipe slots** showing silhouettes of the needed materials and quantities.
3. Items in the Cart that match an order requirement are highlighted with a **scroll badge** so the player can see at a glance which Cart items are needed.
4. The player **drags** matching items from Cart slots into the corresponding order requirement slots.
5. **Staged items** are committed to the order and shown with a green checkmark in the recipe slot. They can be **retrieved back to the Cart** (tap the staged item) before final confirmation — this allows the player to change their mind without losing materials.
6. Once all requirement slots are filled, a **"Complete Delivery"** button appears. Tapping it consumes the staged items, awards the order's **Crowns** reward, and clears the completed order.

### Convenience Features

* **Vault access during ordering:** The Vault drawer can be opened alongside the Orders panel, allowing the player to pull items from Vault → Cart → Order slot in a single combined view without closing panels.
* **Auto-Match indicator:** Items in the Vault that match an active order's requirements display a small **scroll badge** on their stack, so the player can identify order-relevant reserves without memorizing recipes.
* **Elemental Dust components:** Masterwork recipes and some high-tier orders that require Elemental Dust deduct it directly from the Alchemical Ledger (wallet). Dust is never a physical item in the Cart or Vault — it is consumed as a currency line-item when the delivery is confirmed.

---

## 7. Interaction Design (Desktop & Mobile)

All board, cart, vault, and order interactions support dual input modes for seamless cross-platform play.

### Desktop (Mouse)

* **Drag-and-Drop:** Primary method. Dragging an item lifts it from its tile, highlighting:
    * **Compatible merge targets** — amber glow
    * **Valid empty tiles** — faint green outline
    * **Invalid destinations** (wrong family, locked tile, full slot) — subtle red tint
* **Click-to-Move:** Clicking an item selects it (floating halo). Clicking a valid target (empty tile, Cart slot, merge partner, Pulverizer, order slot) completes the action. Clicking elsewhere or pressing `Escape` deselects.
* **Right-Click / Hover Tooltip:** Displays item name, tier, family, export eligibility, and Elemental Dust pulverization value.

### Mobile (Touch)

* **Touch Drag:** Touch-and-slide with an offset drag avatar positioned **above** the finger so the thumb does not obscure the target tile. Visual feedback matches desktop drag.
* **Tap-to-Select Fallback:** Tapping an item marks it with a pulsating selection border. Tapping a valid destination completes the move. Tapping elsewhere deselects.
* **Haptic Feedback** (Web Vibration API where supported):
    * **Successful merge:** Short double-pulse
    * **Pulverization:** Single medium pulse
    * **Order delivery completion:** Long satisfying pulse
    * **Rejected move:** Quick light buzz

### Rejection Feedback (Both Platforms)

| Scenario | Visual Feedback | Message |
| :--- | :--- | :--- |
| Sub-capstone (T1–T3) dragged toward Cart/Vault | Red lock icon flash on item, snap back | *"Reach Tier 4 to export"* |
| Wrong family dropped onto restricted board | Red tint flash on all board tiles, snap back | *"This board only accepts [Family] items"* |
| Cart is full when attempting to add | Cart slots pulse red | *"Cart full — store or place an item first"* |
| Vault is full when attempting to deposit | Vault border pulses red | *"Vault full — expand or consolidate"* |
| Spawner tapped on full board | Spawner widget shakes | *"No empty tiles — pulverize or export"* |
| Item dragged to locked/cobwebbed tile | Cobweb animation shakes | *"Clear this tile for 30 Elemental Dust"* |

---

## 8. Resolved Decisions & Remaining Tasks

### Decided
- [x] Two-system inventory: Service Cart (rapid transit, no stacking) + Storage Vault (bulk, stacking).
- [x] Cart starts at 2 slots, expands to 5 via Elemental Dust (200 / 750 / 2,000).
- [x] Vault starts at 6 slots, expands to 24 in increments of 2 (escalating Dust costs).
- [x] Stack capacity upgrades gated by room progression milestones (3 → 5 → 10 → 20 per slot).
- [x] Capstone export rule enforced visually: red lock + snap-back for sub-capstones, golden export arrow for T4.
- [x] Cart is the universal transfer intermediary — no direct board↔board or vault↔board teleportation.
- [x] Vault auto-stacks on deposit; manual Consolidate and Sort tools provided.
- [x] Quick Store (▼) and Quick Retrieve (▲) one-tap shortcuts for Cart↔Vault transfers.
- [x] Patron Orders fulfilled by dragging from Cart into order requirement slots, with staging and confirmation.
- [x] Rejection feedback: 6 specific edge-case scenarios with visual + message responses.

### Open Tasks
- [ ] Playtest and tune Vault slot expansion costs — current values are design estimates.
- [ ] Draft wireframes / ASCII layouts for mobile portrait showing Board + Cart + Pulverizer simultaneously.
- [ ] Design the split-panel layout for Vault + Orders simultaneous view on mobile (screen space is tight).
- [ ] Specify whether Vault sort preference persists across sessions or resets.
- [ ] Define Masterwork assembly logistics — are early Masterworks (#1, #2) assembled via a dedicated panel, or can synthesis boards also serve as assembly points? *(Cross-ref: Doc 04 design session.)*

### Design Explorations (Pending Dedicated Session)
- [ ] **Cart capacity scaling:** Should the Cart expand beyond 5 slots in the endgame, or does the 5-slot ceiling remain as a permanent logistics constraint?
- [ ] **Vault filtering / search:** As slot count grows to 20+, do we need a filter bar or family-tab UI for fast item lookup?
