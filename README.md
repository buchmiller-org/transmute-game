# Transmute

A web-first, spatial-management alchemical merge puzzle game.

Playable directly in modern mobile and desktop browsers with zero install, no backend servers, and zero timers.

---

## The Concept

In **Transmute**, you step into an antique alchemical workshop. Instead of a single massive board or endless story dialogue, you operate specialized pieces of **Equipment** across multiple **Rooms**. 

* **Space is the Puzzle:** Board space is tightly constrained. You must balance merging higher tiers against grinding excess clutter in the **Mortar & Pestle** to earn **Elemental Flux** — the currency that expands your grids and upgrades your equipment.
* **The Capstone Export Rule:** Items can only leave a board once they reach their highest (capstone) tier, keeping shared storage clean and giving each board a focused purpose.
* **No Energy / Timers:** Plan your spatial layout and merges at your own pace.
* **Patron Orders & Masterworks:** Fulfill rotating **Patron Orders** for **Sovereigns**, discover elemental tiers in the **Grand Codex** for passive perks, and combine capstones from different rooms into **Milestone Masterworks** to unlock new wings of the workshop.
* **Cross-Platform:** Seamless pointer/touch controls with local save games and JSON export/import.

---

## Game Design & Architecture Documentation

All systems and progression mechanics have been modularized in the [`docs/`](./docs/) directory so developers and AI coding agents can work on individual systems with complete context:

| Document | Description |
| :--- | :--- |
| [**00. Overview & Vision**](./docs/00_OVERVIEW_AND_VISION.md) | Game pillars, core loop, 3-currency economy (Flux, Sovereigns, Insight), and AI session instructions. |
| [**01. Rooms & Equipment**](./docs/01_ROOMS_AND_EQUIPMENT.md) | Room hierarchy, equipment boards, unlock progression, and expansion math. |
| [**02. Materials & Merge Trees**](./docs/02_MATERIALS_AND_MERGE_TREES.md) | The elemental trees (T1–T4 primary, T5–T8 synthesis), spawner drops, and Flux yield formulas. |
| [**03. Storage & Logistics**](./docs/03_STORAGE_AND_LOGISTICS.md) | The Service Cart (transit tray), Storage Vault (long-term stackable storage), capstone validation, and UI controls. |
| [**04. The Grand Codex & Masterworks**](./docs/04_CODEX_AND_MASTERWORKS.md) | Codex discovery perks, Patron Order system, and multi-equipment Masterworks. |
| [**05. Technical Spec & UX**](./docs/05_TECHNICAL_SPEC_AND_UX.md) | Static web architecture, mobile/desktop wireframes, JSON save schema, and input handling. |

---

## Instructions for AI Agents & Pair Programmers

When picking up a planning or development task in this repository:
1. Open the relevant document in [`docs/`](./docs/) to read the constraints, design decisions, and unresolved tasks.
2. Cross-reference [`docs/00_OVERVIEW_AND_VISION.md`](./docs/00_OVERVIEW_AND_VISION.md) to ensure all additions align with the core game pillars (no timers, spatial focus, capstone export rule, pulverization economy).
3. Update the task checkboxes and design specifications in the respective docs as you build out features.
