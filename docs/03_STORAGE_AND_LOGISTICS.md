# Transmute — Storage & Logistics

## 1. Overview & Logistics Philosophy
Because **Transmute** separates gameplay across specialized equipment boards, moving items between workbenches and stockpiling intermediate reagents is a core pillar of the spatial puzzle.

To balance convenience with meaningful spatial constraints, inventory is divided into two systems:
1. **The Service Cart:** An always-accessible, rapid-transit tray.
2. **The Storage Vault:** A high-capacity, stackable storage closet for long-term reserves.

---

## 2. The Service Cart (Rapid Transit)

* **Physical Placement:** Anchored persistently at the bottom (mobile) or right side (desktop) of the screen across **all** equipment boards.
* **Function:** Used to carry items between rooms and workbenches without opening menus.
* **Capacity & Upgrades:**
  * **Starting Capacity:** 2 single-item slots.
  * **Maximum Capacity:** 5 slots.
  * **Expansion Costs:**
    * Slot 3: 200 Dust
    * Slot 4: 750 Dust
    * Slot 5: 2,000 Dust
* **Stacking Rule:** **No stacking allowed in the Service Cart.** Each slot holds exactly 1 individual item. This preserves the cart’s identity as an active transfer conduit rather than a bulk storage dump.

---

## 3. The Storage Vault (Bulk Stockpile)

* **Physical Placement:** Accessed via a "Vault / Pantry" drawer icon in the main navigation.
* **Function:** Long-term storage for high-tier components, rare catalysts, and overflow.
* **Slot Capacity:**
  * Starting Slots: 6 slots.
  * Expandable in increments of 2 slots up to 24 slots.
* **Stacking System:**
  * Identical items of the **exact same tier and type** automatically stack when placed in the same vault slot.
  * If a stack reaches its capacity cap, adding another item requires a new empty slot.
* **Stack Capacity Upgrades:**

| Stack Upgrade Level | Max Items Per Slot | Cost to Upgrade | Requirements |
| :---: | :---: | :---: | :---: |
| **Level 1 (Default)** | 3 items | Free | None |
| **Level 2** | 5 items | 500 Dust | Room 1 Complete |
| **Level 3** | 10 items | 1,500 Dust + 10 Insight | Room 2 Unlocked |
| **Level 4** | 20 items | 4,000 Dust + 25 Insight | Room 3 Unlocked |

---

## 4. Interaction Design (Desktop & Mobile)

To ensure fluid gameplay on both phones and computers, all inventory and board interactions must support dual input modes:

### Desktop (Mouse)
* **Drag-and-Drop:** Primary method. Dragging an item lifts it, highlighting compatible merge targets with an amber glow and invalid cells with a subtle red tint.
* **Click-to-Move Alternative:** Clicking an item selects it (floating halo); clicking a valid empty cell or merge target completes the action.
* **Right-Click / Hover:** Displays a tooltip showing the item name, tier, elemental family, and Dust dissolution value.

### Mobile (Touch)
* **Touch Drag:** Touch-and-slide with an offset drag avatar (positioned slightly above the finger so the player's thumb does not obscure the target grid tile).
* **Tap-to-Select Fallback:** Tapping an item marks it with a clear pulsating boundary; tapping an open slot or the Cart moves it immediately.
* **Haptic Feedback:** Subtle vibration (via standard Web Vibration API where supported) on successful merges or dissolution drops.

---

## 5. Tasks for Next AI Planning Session

- [ ] Draft wireframes/ASCII layouts for the mobile portrait screen showing the Board, Service Cart, and Dissolution Basin simultaneously.
- [ ] Specify auto-sort / stack-consolidation rules for the Vault.
- [ ] Define edge-case behaviors (e.g., what happens if a player drags an illegal item type from the Cart onto a restricted equipment board).
