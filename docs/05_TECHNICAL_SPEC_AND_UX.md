# Transmute — Technical Specification & UX Design

## 1. Technical Vision & Architecture
**Transmute** is built from the ground up to run entirely in the browser as a **static web application** without servers, databases, or build-step dependencies.

### Technical Principles
1. **Zero-Backend / Static-Only:** Runs on GitHub Pages, Cloudflare Pages, Netlify, or local file servers.
2. **Framework Freedom:** Can be implemented with Vanilla ES6 JavaScript (modules), lightweight DOM rendering, or minimal canvas/SVG. No complex build chains or node dependencies required.
3. **Local Persistence:** Game state is continuously serialized to `localStorage`. Includes a one-click **"Export/Import Save (JSON)"** tool so players can seamlessly transfer their laboratory between mobile and desktop devices.
4. **Offline First:** Once cached via a lightweight Service Worker, the game can be played completely offline.

---

## 2. Responsive UI Wireframes

### Mobile Portrait Layout (Phone)
```text
+------------------------------------------+
| [Workspace: The First Sanctum v]         |
| Dust: 1,420 | Insight: 14 | Crowns: 350  |
+------------------------------------------+
| Equipment: Herbalist's Bench [Flora/Fung]|
|                                          |
|   +---+---+---+---+---+                  |
|   | S | s |   |   |   |   S,s = Spawners |
|   +---+---+---+---+---+                  |
|   |   | * | * |   |   |   * = Items      |
|   +---+---+---+---+---+                  |
|   |   | * |   | L | L |   L = Locked     |
|   +---+---+---+---+---+                  |
|   | L | L | L | L | L |                  |
|   +---+---+---+---+---+                  |
|                                          |
+------------------------------------------+
| [Pulverizer]  | [Flora ▼ Lv1] [Fungi ▼ Lv2]|
+------------------------------------------+
| Service Cart: [Item A] [Item B] [Empty]  |
+------------------------------------------+
| [Codex] [Blueprints] [Vault] [Orders]    |
+------------------------------------------+
```

### Desktop Widescreen Layout (Computer)
```text
+-------------------------------------------------------------------------+
| TRANSMUTE  | Workspace: The First Sanctum                    | Settings |
| Currencies | Dust: 1,420 | Insight: 14 | Crowns: 350         | Save/Exp |
+---------------------------------------+---------------------------------+
| ACTIVE EQUIPMENT GRID                 | SIDEBAR CONTROLS                |
| Equipment: Herbalist's Bench          |                                 |
|                                       | SPAWNERS (on-grid tiles)        |
|   +----+----+----+----+----+          | Flora: Seed Planter (Lv 1)     |
|   | S  | s  |    |    |    |          | Fungi: Spore Log (Lv 2)        |
|   +----+----+----+----+----+          |                                 |
|   |    | *  | *  |    |    |          | SERVICE CART (Transit Tray)     |
|   +----+----+----+----+----+          | +----+ +----+ +----+            |
|   |    | *  |    | L  | L  |          | | T3 | | T5 | |    |            |
|   +----+----+----+----+----+          | +----+ +----+ +----+            |
|   | L  | L  | L  | L  | L  |          |                                 |
|   +----+----+----+----+----+          | THE PULVERIZER                  |
|                                       | [ Drag items here for Dust ]    |
| EQUIPMENT TABS                        |                                 |
| [Herbalist] [Mortar] [Alembic]        | QUICK NAVIGATION                |
|                                       | [Storage Vault] [Grand Codex]   |
|                                       | [Blueprints]    [Patron Orders] |
+---------------------------------------+---------------------------------+
```

---

## 3. Save State Data Schema (JSON)

```json
{
  "version": "1.1.0",
  "timestamp": 1757123456789,
  "currencies": {
    "dust": 1420,
    "insight": 14,
    "crowns": 350
  },
  "serviceCart": [
    { "id": "flora_t3", "tier": 3, "family": "flora" },
    null
  ],
  "storageVault": {
    "unlockedSlots": 8,
    "stackLimit": 5,
    "slots": [
      { "id": "flora_t4", "count": 3 },
      null
    ]
  },
  "workspaces": {
    "the_first_sanctum": {
      "unlocked": true,
      "equipment": {
        "herbalist_bench": {
          "unlocked": true,
          "rows": 4,
          "cols": 5,
          "spawners": {
            "flora": { "level": 1, "progress": 0 },
            "fungi": { "level": 2, "progress": 0 }
          },
          "tiles": [
            { "index": 0, "type": "spawner", "family": "flora" },
            { "index": 1, "type": "spawner", "family": "fungi" },
            { "index": 2, "type": "item", "id": "flora_t2", "tier": 2 },
            { "index": 19, "type": "locked", "unlockCost": 30 }
          ]
        },
        "mortar_station": {
          "unlocked": false
        }
      }
    }
  },
  "codex": {
    "discoveredIds": ["flora_t1", "flora_t2", "flora_t3", "flora_t4"],
    "unlockedBlueprints": ["mortar_station"]
  },
  "settings": {
    "hapticsEnabled": true,
    "soundVolume": 0.8
  }
}
```

---

## 4. Cross-Platform Input Handling Spec
* **Unified Pointer Events:** Use `PointerEvent` (`pointerdown`, `pointermove`, `pointerup`) rather than separate touch and mouse event listeners.
* **Scroll Prevention:** During active drags on mobile, apply `touch-action: none` to the game board container so swiping does not accidentally scroll the browser page.
* **Keyboard Accessibility (Desktop):**
  * `1` through `5`: Quick-select Service Cart slot.
  * `Q` and `W`: Trigger primary and secondary spawners on the active board.
  * `Escape`: Deselect active item or close open modal.

---

## 5. Resolved Decisions & Remaining Tasks

### Decided
- [x] **UI Grouping:** Replaced "Rooms" with Workspaces and minimal equipment tabs.
- [x] **Multi-Tree State:** Updated save schema to support dual spawners and multiple material families per board.
- [x] **Blueprint Logic:** Added `unlockedBlueprints` array to Codex save block.

### Open Tasks
- [ ] Build a minimal vanilla JS proof-of-concept prototype verifying PointerEvent drag-and-drop across grid cells and cart slots.
- [ ] Implement save/load serialization with a schema migration handler.
- [ ] Define CSS design tokens (colors, antique borders, typography) matching the alchemical theme.
