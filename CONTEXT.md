# Context Map

Io-Gui has one foundational context (the reactive core) plus application-domain contexts built on top of it. Only contexts that have been deliberately modeled are listed here; more may be added as their vocabulary is pinned down.

## Contexts

- [Core](./packages/core/CONTEXT.md) — the shared reactive system: properties, change/mutation propagation, bindings, rendering. Every other context is built from these primitives.
- [Icons](./packages/icons/CONTEXT.md) — SVG icon registry and `namespace:id` references (`@io-gui/icons`).
- [Inputs](./packages/inputs/CONTEXT.md) — field controls: IoField, appearance, live commit, number ladder (`@io-gui/inputs`).
- [Sliders](./packages/sliders/CONTEXT.md) — WebGL continuous value controls and number+slider composites (`@io-gui/sliders`).
- [Colors](./packages/colors/CONTEXT.md) — ColorValue channel editors and color panel singleton (`@io-gui/colors`).
- [Menus](./packages/menus/CONTEXT.md) — hierarchical option trees presented as dropdowns, menu bars, context menus, and trees (`@io-gui/menus`).
- [Navigation](./packages/navigation/CONTEXT.md) — menu-driven content switching, caching, and anchor sync (`@io-gui/navigation`).
- [Layout](./packages/layout/CONTEXT.md) — IDE-like tabbed, split, drag-and-drop panel layouts (`@io-gui/layout`).
- [Editors](./packages/editors/CONTEXT.md) — universal property inspection via PropertyConfig / EditorGroups (`@io-gui/editors`).
- [Markdown](./packages/markdown/CONTEXT.md) — fetch-and-render markdown with sanitize and highlight themes (`@io-gui/markdown`).
- [Three](./packages/three/CONTEXT.md) — WebGPU Three.js applets, viewports, and editor config side-effects (`@io-gui/three`).

## Relationships

- **Core → all**: Packages build on ReactiveObject / ReactiveElement, bindings, Theme, Storage, and overlay primitives. Core `Color` is the theme token class — not colors-package ColorValue.
- **Core → Colors**: Colors edits plain ColorValue objects (0–1 RGBA). Theme and CSS variables use core `Color`.
- **Core → Sliders**: Sliders extend `IoGl` (2D shader quads). Unrelated to Three's WebGPU renderer.
- **Icons → Inputs / Menus / Layout**: Icon references (`io:…`) appear as labels/icons on fields, options, and tabs.
- **Inputs → Sliders**: Composite sliders bind IoNumber beside slider tracks.
- **Sliders → Colors**: Color channel sliders build on sliders WebGL controls.
- **Menus → Navigation**: Navigator presents one Menu and mirrors selection (`selectedID` deep, `getSelectedIDImmediate()` shallow). Element ids must match Option ids.
- **Menus → Layout**: `IoLayout` composes menus elements for tab chrome (add-tab picker, tab overflow menus); Layout models never reference menus models.
- **Menus → Editors**: Default editor widgets include `ioOptionSelect` with Menu models for enum-like properties.
- **Layout Drawer ≠ Navigation IoNavigatorDrawer**: Same everyday word, different packages and jobs (collapsed Split child vs navigator chrome host).
- **Editors → inspected objects**: Inspects arbitrary objects; ReactiveNodes get live `io-mutation` updates. Non-nodes need `dispatchMutation()` after in-place edits.
- **Three → Editors**: Importing `@io-gui/three` registers PropertyConfigs / EditorGroups for Three.js classes. ThreeApplet may supply `uiConfig` / `uiGroups`.
- **Markdown → Navigation**: Rendered headings expose `data-heading` for selector Anchor sync.
