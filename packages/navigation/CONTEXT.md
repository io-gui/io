# Navigation

The `@io-gui/navigation` context: menu-driven content switching. A navigator presents a Menu (from `@io-gui/menus`) as chrome and mirrors its selection onto a selector that shows matching content elements. Selection vocabulary lives in the menus context — this context names how selection depth, caching, and anchors map to content display.

## Language

### Routing

**Select mode**:
How an `IoNavigator` derives which content id to show from its Menu: `shallow` (immediate selected child of the scope), `deep` (deepest selected Option in the tree), `all` (every element, `*`), or `none` (nothing). Distinct from Option Mode (`select`/`toggle`/`none`).
_Avoid_: routing mode, selection mode (ambiguous with Option Mode)

**Content element**:
A VDOM descriptor in the navigator/selector elements list whose `id` matches a Menu Option id. Matched at render time; not part of the Menu model.
_Avoid_: page, view, route target

**Dynamic import**:
An optional `import` path on a content element descriptor that lazy-loads the module before first render.
_Avoid_: lazy route, code split entry

### Caching & anchors

**Caching**:
How `IoSelector` retains rendered content elements between selections: `proactive` (idle-frame pre-render), `reactive` (keep after first show), or `none` (dispose and rebuild each time). Cache keys are content element ids — colliding ids across templates share the wrong instance.
_Avoid_: keep-alive, memoization

**Anchor sync**:
Bidirectional link between the selector's `anchor` property and a heading marked `data-heading` in the shown content. Programmatic anchor changes scroll to the heading; scroll updates the nearest heading into `anchor`, with a short debounce to break feedback loops.
_Avoid_: hash routing, scroll spy (as domain terms)

### Chrome

**Menu position**:
Where navigator chrome sits relative to content: `top` (`IoMenu` bar), `left` (`IoMenuTree`), or `none` (selector only, still routed by the Menu model).
_Avoid_: layout, sidebar mode

**IoNavigatorDrawer**:
A navigation-package drawer that hosts navigator chrome. Unrelated to layout's Drawer (collapsed Split children).
_Avoid_: Drawer (without package qualifier), sidebar

**IoCollapsible**:
A self-contained expand/collapse chrome with a toggle header and lazy-rendered content elements. Not a Menu Disclosure and not a layout Drawer.
_Avoid_: accordion, disclosure panel
