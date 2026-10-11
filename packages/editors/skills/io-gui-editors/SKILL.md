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

- Do not emit a `{ name, type, tag, props }` object shape — use tuples + vDOM factories.
- Matching is **last match wins** in config order (registered constructors, then the `config` prop) — not name-before-type priority.
- Register configs and groups in the class's own module, right after the class, on the narrowest class that needs them. Never register on `Object` or another broad base: registrations aggregate along `instanceof`, so a broad one steps over every derived class. A separate config module is only for classes you can't edit (third-party).
- Explicit names beat regexes in every group. A class can whitelist its inspector with `Main: [...names]` and `Advanced: [/^[\s\S]*$/]`; subclasses name their own properties to surface them.
- `IoPropertyEditor` listens for `io-mutation`. Editing plain objects in place requires `dispatchMutation()` on the owner/graph.
- Functions render as buttons invoked with the object as `this`.
- `IoObject` expand persistence keys off guid/uuid/id/name/label when present → localStorage.
- `IoContextEditorSingleton` owns the right-click popup — forward gestures; don't fork panel state.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API overview: [README.md](../../README.md)
