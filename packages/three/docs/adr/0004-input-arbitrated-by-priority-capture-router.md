---
status: accepted
---

# Input is arbitrated by a per-viewport InputRouter with priority capture

Each `IoThreeViewport` owns one `InputRouter`. The router is the only code that adds DOM input listeners to the viewport or takes pointer capture. Everything that wants input registers as a `Behavior` with a priority: modal operators (1000), gizmos (800), the active tool (500), navigation (300), fallback selection (100), context menu (50).

On press, wheel or key, the router asks behaviors in priority order `wantsCapture(event)`. The first one that says yes owns the stream until it ends. Hover is a separate pass that runs only when nothing has captured. While a behavior with `allowsStealing` has captured, a new pointer is first offered to the other behaviors; one that wants it cancels the capturing behavior and takes over all captured pointers, for example when a second touch turns a tool drag into a pan. Without `allowsStealing`, extra pointers go to the capturing behavior (multi-touch navigation). The router calls `preventDefault()` / `stopPropagation()` only for captured events. Unclaimed events reach the rest of the page.

Tools no longer attach to viewports. `ToolBase.registerViewport()` already let one tool listen to many viewports. That multi-viewport reach moves into the routers. A tool is one shared object holding its settings, and the router of every view whose kind, mode and interaction profile allow it asks the tool for that view's behaviors. Per-view pointer state lives in those behaviors, replacing `ToolBase`'s per-viewport `WeakMap`s.

The editor stores the active tool per view kind + mode. Each view has an interaction profile (`full`, `select`, `navigate`, `none`) that filters what its router installs. A UV preview is `uv` + `select`, so it gets navigation and selection but no transform tool.

Bindings live in keymap tables (data), layered as running modal, then active tool, then view kind + mode, then global. Navigation and tools coexist because their default bindings are disjoint (LMB for tools; MMB, Alt and wheel for navigation).

Before this, `OrbitControls` and `ToolBase` each added their own listeners to the same element. Both saw every pointer event and nothing chose between them. `ToolBase` also stopped and prevented every event.

## Considered Options

- **One global router for all viewports.** Rejected: pointer capture, hover and focus are per element. A per-viewport router keeps them local, and shared tools give the cross-viewport reach.
- **Ordered DOM listeners with `stopImmediatePropagation`.** Rejected: order depends on registration timing, and there is no capture-stealing or hover pass.

## Consequences

- `OrbitControls` is removed. Navigation is a set of behaviors acting on `ThreeView` navigation state (ADR-0005).
- `ToolBase` stays as an adapter that wraps its `on3DPointer*` methods into one `Behavior`, so existing tools keep working. `Pointer3D` stays as the event shape, with the ray built lazily. Removed 2026-10-07: tools are `ToolDefinition`s only.
- Keyboard events go to the viewport under the pointer, else the focused viewport.
- A drag that starts in one viewport stays captured there, even across other viewports.
