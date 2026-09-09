---
name: io-gui-menus
description: >-
  Build Io-Gui menus with Menu/Option models and entry points (IoOptionSelect,
  IoMenuTree, IoContextMenu, IoMenuHamburger). Use when working with @io-gui/menus,
  dropdowns, context menus, menu trees, selectedID, path, or Option modes.
---

# @io-gui/menus

## Defaults

- Import from `@io-gui/menus`.
- Root model is always a **`Menu`** (extends Option). Entry points take `model: Menu`.
- Every menus view holds the model in a property named **`model`** (not `option` / `menu` as the prop name for the node).
- Observe selection by binding **`selectedID`** / **`path`**. Do not treat **`value`** as an address.
- Activation event: `io-option-clicked`. Selection state has no public selection events.

## Gotchas

- **Id vs Value.** Id addresses the Option (unique per Menu, no commas). Value is opaque payload — shareable, never the selection key.
- **Mode:** `select` | `toggle` | `none`. Action without explicit mode ⇒ `mode: 'none'`. Explicit mode always wins.
- Selection scope = `select`-mode siblings under one parent; parent enforces at most one selected.
- `selectedID` / `path` are writable derived projections (Storage-friendly). Scope's immediate selection via `getSelectedIDImmediate()` — derived, never bind that.
- **Disclosure** (`expandedIDs`, persistent tree) ≠ **Expansion** (transient overlay submenu).
- `toJSON` / structure restore is structure-only — selection persists via bindings, not JSON (ADR 0003).
- Submenus use `IoOverlaySingleton` + `nudge()`.
- `IoOptionSelect.value` mirrors the selected Option's **value** (payload), not its id.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API / composition diagrams: [README.md](../../README.md)
