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
```
+------------------------------------------+
| [Room: Prep Parlor v]   Dust: 1,420 (D)  |
| [Codex] [Vault] [Orders]  Insight: 14(I) |
+------------------------------------------+
| Equipment: Herbalist's Bench [Lv 1]      |
|                                          |
|   +---+---+---+---+                      |
|   | S |   |   |   |   S = Spawner        |
|   +---+---+---+---+                      |
|   |   | * | * |   |   * = Active Items   |
|   +---+---+---+---+                      |
|   |   | * |   | L |   L = Locked Tile    |
|   +---+---+---+---+                      |
|   | L | L | L | L |                      |
|   +---+---+---+---+                      |
|                                          |
+------------------------------------------+
| [Pulverizer]       | [Spawn Herb (T1)]   |
+------------------------------------------+
| Service Cart: [Item A] [Item B] [Empty]  |
+------------------------------------------+
```

### Desktop Widescreen Layout (Computer)
```
+-------------------------------------------------------------------------+
| TRANSMUTE  | Room: [Preparation Parlor] [Distillation Annex] | Settings |
| Currencies | Dust: 1,420 | Insight: 14 | Crowns: 350        | Save/Exp |
+---------------------------------------+---------------------------------+
| ACTIVE WORKBENCH                      | SIDEBAR CONTROLS                |
| Equipment: Herbalist's Bench (Lv 1)   |                                 |
|                                       | [Spawner: Herb Planter]         |
|   +----+----+----+----+----+          | Tap to produce Tier 1 Seed      |
|   | S  |    |    |    |    |          |                                 |
|   +----+----+----+----+----+          | SERVICE CART (Transit Tray)     |
|   |    | *  | *  |    |    |          | +----+ +----+ +----+            |
|   +----+----+----+----+----+          | | T3 | | T5 | |    |            |
|   |    | *  |    | L  | L  |          | +----+ +----+ +----+            |
|   +----+----+----+----+----+          |                                 |
|   | L  | L  | L  | L  | L  |          | THE PULVERIZER                  |
|   +----+----+----+----+----+          | [ Drag items here for Dust ]    |
|                                       |                                 |
|                                       | QUICK NAVIGATION                |
|                                       | [Open Storage Vault]            |
|                                       | [Open Grand Codex]              |
|                                       | [Active Commissions]            |
+---------------------------------------+---------------------------------+
```

---

## 3. Save State Data Schema (JSON)

```json
{
  "version": "1.0.0",
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
  "rooms": {
    "prep_parlor": {
      "unlocked": true,
      "equipment": {
        "herbalist_bench": {
          "unlocked": true,
          "rows": 4,
          "cols": 4,
          "tiles": [
            { "index": 0, "type": "spawner", "spawnerId": "seed_planter" },
            { "index": 1, "type": "empty" },
            { "index": 2, "type": "item", "id": "flora_t2", "tier": 2 },
            { "index": 15, "type": "locked", "unlockCost": 150 }
          ]
        }
      }
    }
  },
  "codex": {
    "discoveredIds": ["flora_t1", "flora_t2", "flora_t3", "flora_t4"],
    "completedMilestones": ["milestone_01"]
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
  * `Space`: Trigger spawner on active board.
  * `Escape`: Deselect active item or close open modal.

---

## 5. Tasks for Next AI Planning Session

- [ ] Build a minimal vanilla JS proof-of-concept prototype verifying PointerEvent drag-and-drop across grid cells and cart slots.
- [ ] Implement save/load serialization with a schema migration handler.
- [ ] Define CSS design tokens (colors, antique borders, typography) matching the alchemical theme.
