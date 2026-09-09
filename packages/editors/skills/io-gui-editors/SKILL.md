---
name: io-gui-editors
description: >-
  Configure and use IoInspector, IoPropertyEditor, and IoObject with PropertyConfig
  tuples and EditorGroups. Use when working with @io-gui/editors, registerEditorConfig,
  property widgets, or context property editing.
---

# @io-gui/editors

## Defaults

- Import from `@io-gui/editors`.
- Register widgets with `registerEditorConfig(Constructor, PropertyConfig[])`.
- **Real shape:** `PropertyConfig = [PropertyIdentifier, VDOMElement]` — matcher + prebuilt vDOM factory result (e.g. `ioNumber({step: 0.01})`).
- Groups via `registerEditorGroups`. Visibility convention: `__*` Hidden, `_*` Advanced.

## Gotchas

- **README `{ name, type, tag, props }` examples are stale.** Do not emit that object shape — use tuples + vDOM factories.
- Configs inherit along the prototype chain; `Object` defaults apply broadly.
- `IoPropertyEditor` listens for `io-mutation`. Editing plain objects in place requires `dispatchMutation()` on the owner/graph.
- Functions render as buttons invoked with the object as `this`.
- `IoObject` expand persistence keys off guid/uuid/id/name when present → localStorage.
- `IoContextEditorSingleton` owns the right-click popup — forward gestures; don't fork panel state.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- Prefer source/`CONTEXT` over README config snippets when they conflict.
- API overview: [README.md](../../README.md)
