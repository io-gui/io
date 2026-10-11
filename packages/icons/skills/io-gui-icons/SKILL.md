---
name: io-gui-icons
description: >-
  Display and register SVG icons via IconsetSingleton and IoIcon using namespace:id
  references. Use when working with @io-gui/icons, icon labels on other elements,
  registering an app's own icons, or adding icons from Material Symbols.
---

# @io-gui/icons

## Defaults

- Import from `@io-gui/icons`.
- Reference format: **`namespace:id`** (e.g. `io:gear`).
- Register custom SVG groups on **`IconsetSingleton`**; render with **`IoIcon`** / `ioIcon`, or pass the reference as `icon` to fields and buttons (`ioButton({icon: 'app:play'})`).
- Register an app's own namespace once, in a module imported before the icons are used: `IconsetSingleton.registerIcons('app', svg)`. If your package.json has `sideEffects`, list that module, or bundlers drop the import.
- **Material Symbols** (fonts.google.com/icons): their viewBox is `0 -960 960 960`. Keep only the `<path d>` and wrap it in `<g id="play" transform="scale(0.025) translate(0 960)">`, which maps it onto the 24×24 icon box. Drop `fill`, `width`, `height` and `xmlns`.

## Gotchas

- Register markup as `<g id="…">` inside a wrapper `<svg>`; icons render in a fixed **24×24** viewBox, so other coordinate systems need a `transform` on the group.
- **Every element with an `id`** in the registered markup becomes an icon, nested ones too. Registering an existing `namespace:id` again replaces it; an id defined twice in one markup warns in debug builds.
- **No colon** ⇒ value rendered as **text**, not an icon miss. **Unknown reference** ⇒ empty icon, no warning; check with `IconsetSingleton.hasIcon('ns:id')`.
- Empty `value` ⇒ element hidden.
- Fill from `--io_color`, so icons follow field states (selected, red, green); stroke via `stroke` prop + `--io_colorStrong`. A `fill` left on the path overrides the theme.
- `IoBoolean` shows a `true` / `false` string as an icon when it names a registered icon, in any namespace; otherwise as text.
- `IoButton` keeps a right margin on its icon even without a label. Icon-only buttons: add `io-button > io-icon { margin-right: 0 }` scoped to your element.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
