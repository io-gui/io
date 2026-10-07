# @io-gui/three

Three.js integration for Io-Gui with WebGPU viewport and editor configurations.

See [live examples here](https://iogui.dev/io/#path=Demos,Three)

## Overview

```
RenderScheduler (singleton, the only thing that renders)
├── WebGPURenderer (shared default; custom renderers allowed)
├── one requestAnimationFrame loop
└── typed dirty tags per viewport

IoThreeViewport (element)
├── CanvasTarget (per viewport)
└── view: ThreeView (object, outlives the element)
    ├── navigation: ViewNavigation (target, rotation, distance, projection, axis view, scene camera)
    └── overscan, clearColor, clearAlpha

ThreeEditor (object, one per app)
├── document: ThreeDocument (switchable at runtime)
│   ├── scene, toneMapping, toneMappingExposure
│   ├── changeBus: ChangeBus
│   └── transact() / begin(): Transaction of invertible patches
├── mode, isPlaying, onAnimate(delta, time), requestRender()
├── operators: OperatorRegistry (run, modal operators, lastCommand)
└── tools: ToolRegistry + activeTools per '<viewKind>:<mode>'

ThreeApplet (object, compatibility shim)
└── a ThreeEditor whose scene / toneMapping props are bound to its document

EditorConfigs (configs/*)
└── Property editors for Three.js classes
```

## Elements

### IoThreeViewport

WebGPU-powered viewport element for rendering Three.js scenes.

```typescript
type IoThreeViewportProps = {
  editor?: ThreeEditor; // App object (or `applet`, an alias for ThreeApplet)
  view?: ThreeView; // View state; pass one to keep navigation across remounts (default: the viewport makes its own)
  cameraSelect?: string; // Shorthand setting the view: 'perspective' | 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back' | 'scene' | 'scene:<cameraName>'
  renderer?: WebGPURenderer; // Custom renderer (optional)
  keymap?: Keymap; // Navigation bindings (default: navigationKeymaps.default, OrbitControls-like)
  tool?: ToolBase; // Active 3D pointer tool (optional)
};
```

**Key behaviors:**

- Shared WebGPURenderer instance across viewports
- Per-viewport CanvasTarget for independent rendering
- IntersectionObserver for visibility-based rendering
- Automatic resize handling with pixel ratio support
- Drawn by the RenderScheduler only when tagged dirty
- `getViewCamera()` returns the camera it draws and picks with
- Frames an object when its applet dispatches `frame-object` with `{object, overscan?}`
- A `'scene'` / `'scene:<name>'` camera added later (async asset load) is picked up when it appears
- All input goes through `viewport.inputRouter` (see Input below)

**Usage:**

```typescript
import { Register } from "@io-gui/core";
import { IoThreeViewport, ThreeApplet, ThreeAppletProps } from "@io-gui/three";
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial } from "three/webgpu";

@Register
class MyApplet extends ThreeApplet {
  constructor(args?: ThreeAppletProps) {
    super(args);
    this.scene = new Scene();
    this.scene.add(
      new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0xff0000 })),
    );
  }
  onAnimate(delta: number, time: number) {
    // Animation logic
  }
}

const viewport = new IoThreeViewport({
  applet: new MyApplet({ isPlaying: true }),
});
```

## Objects

### ThreeEditor and ThreeDocument

The app object and its content ([ADR-0002](./docs/adr/0002-app-view-frame-layers.md)). Viewports show `editor.document`; assigning a new document switches every viewport, and each view remembers its camera per document.

```typescript
const editor = new ThreeEditor({ isPlaying: false });
editor.document.scene.add(mesh);
ioThreeViewport({ editor });

editor.document = new ThreeDocument(); // switch; switching back restores each view's camera
```

**Edits go through transactions** of invertible patches ([ADR-0008](./docs/adr/0008-commands-transactions-and-patches.md)). Edits apply immediately and redraw the views; the old values are recorded, so a transaction can be rolled back, reverted or re-applied. Writes to the same path coalesce.

```typescript
editor.document.transact((tx) => {
  tx.set(mesh, "position", new Vector3(1, 2, 3)); // math objects are copied in place
  tx.set(mesh.uuid, "material.color", new Color(0xff0000));
  tx.insert(group, mesh, 0);
}, "Move mesh");

const drag = editor.document.begin("Drag"); // long-running: commit() or rollback()
```

The undo stack and multi-user sync are planned on top of `document.history`, `revert()` / `reapply()` and `addCommitListener()`.

### Operators

One action, one transaction. `exec` for instant actions; `invoke` returning `'running'` plus `modal` for interactive ones, which then receive every event in the viewport (Escape cancels and rolls back).

```typescript
editor.operators.register({ id: "object.rename", label: "Rename", create: (props) => ({
  exec: (ctx) => { ctx.transaction.set(props.id as string, "name", props.name); return "finished"; },
}) });
editor.operators.run("object.rename", { id: mesh.uuid, name: "Box" });
editor.operators.run("object.slide", {}, { host: viewport, event }); // modal in that viewport
editor.operators.lastCommand; // { name: "object.rename", args: {...} }
```

### Tools

A tool is a definition registered on the editor and active per view kind + mode. Each viewport whose view `profile` allows it gets its own behaviors from `createBehaviors`.

```typescript
editor.tools.register({ id: "slide", label: "Slide", viewKinds: ["3d"], modes: ["object"],
  createBehaviors: ({ editor, host }) => [mySlideBehavior(editor, host)] });
editor.setActiveTool("3d", "object", "slide");
viewport.view.profile = "navigate"; // 'full' | 'select' | 'navigate' | 'none'
```

### ThreeApplet

Compatibility shim: a `ThreeEditor` with one document, whose `scene`, `toneMapping` and `toneMappingExposure` are two-way bound to the document. Existing applets keep working.

```typescript
type ThreeAppletProps = ThreeEditorProps & {
  scene?: Scene;
  toneMappingExposure?: number;
  toneMapping?: ToneMapping;
};
```

**Lifecycle methods:**

| Method                            | Description                          |
| --------------------------------- | ------------------------------------ |
| `onRendererInitialized(renderer)` | Called when WebGPU renderer is ready |
| `onResized(width, height, viewport)` | Deprecated. Called when a viewport showing the applet resizes; last one wins |
| `onAnimate(delta, time)`          | Called each frame while `isPlaying`  |

### ThreeView

Serializable state of one view ([ADR-0002](./docs/adr/0002-app-view-frame-layers.md), [ADR-0005](./docs/adr/0005-navigation-is-view-state-camera-built-per-draw.md)). Navigation is stored as numbers in `view.navigation`; the camera is built from it for each draw and pick.

```typescript
const view = new ThreeView({ overscan: 1.1, clearColor: 0x000000 });
view.setAxisView("top"); // orthographic axis view, or null for perspective
view.setCameraSource(sceneCamera.uuid); // look through a scene camera (never mutated)
view.frame(object); // fit an object
view.getCamera(width, height, scene); // camera for this size
view.toJSON(); // persist with a layout; restore with applyJSON()

ioThreeViewport({ applet, view }); // the view survives the element being remounted
```

**Key behaviors:**

- Viewport aspect and overscan are applied at draw time, never stored
- Scene cameras are copied, never mutated
- A new view frames its scene once; restored views keep their navigation
- After changing `view.navigation` directly, call `view.markNavigationChanged()`
- Navigation is done by the viewport's `NavigationBehavior`, which edits `view.navigation`

## Input

Each viewport has one `InputRouter` ([ADR-0004](./docs/adr/0004-input-arbitrated-by-priority-capture-router.md)). It owns the viewport's pointer, wheel and context-menu listeners and pointer capture, and offers events to `Behavior`s in priority order: the first whose `wantsCapture(event)` returns true owns the pointer stream until release. Only captured events are `preventDefault`ed and stopped. Key events go to the viewport under the pointer, else to the focused one.

| Band | Priority | Today |
| --- | --- | --- |
| Modal operator | 1000 | (later) |
| Gizmos | 800 | (later) |
| Tool | 500 | `ToolBase` subclasses |
| Navigation | 300 | `NavigationBehavior` |
| Fallback selection | 100 | (later) |

**Navigation** is driven by a keymap (data): `navigationKeymaps.default` (OrbitControls-like: LMB orbit, RMB / Shift+LMB pan, MMB dolly, wheel zoom, Home frame all), `.blender` (MMB orbit, Shift+MMB pan, Ctrl+MMB dolly, numpad axis views) and `.maya` (Alt+LMB/MMB/RMB). Two-finger touch pans and pinch-dollies. Axis views pan instead of orbit. Navigation is off while looking through a scene camera.

```typescript
ioThreeViewport({ applet, keymap: navigationKeymaps.blender });
const keymap = Keymap.layer(myBindings, navigationKeymaps.default); // first match wins
```

**Tools**: `ToolBase` registers one behavior on each viewport router at tool priority. By default it captures every press and wheel event; override `capturesInput(event)` to leave some to navigation:

```typescript
class PaintTool extends ToolBase {
  capturesInput(event: PointerEvent | WheelEvent) {
    return event.type === "pointerdown" && (event as PointerEvent).button === 0;
  }
  on3DPointerDown(pointer: Pointer3D) { /* ... */ }
}
```

## Editor Configurations

The package includes `EditorConfig` and `EditorGroups` for most Three.js classes, enabling automatic property inspection via `IoPropertyEditor`, `IoObject` or `IoInspector`.

### Custom Configuration

Extend or override configurations for your classes:

```typescript
import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors";
import { MyCustomObject } from "./MyCustomObject";

registerEditorConfig(MyCustomObject, [
  ["speed", ioNumberSlider({ min: 0, max: 100 })],
  ["color", ioColorPicker()],
]);

registerEditorGroups(MyCustomObject, {
  Main: ["speed", "color"],
  Hidden: ["_internalState"],
});
```

## Render Loop

`renderScheduler` runs one `requestAnimationFrame` loop and is the only code that renders ([ADR-0003](./docs/adr/0003-redraw-is-a-dirty-tag-consumed-by-one-scheduler.md)). Viewports never draw on their own; they are tagged dirty and drawn on the next frame.

```typescript
applet.isPlaying = true; // ticks onAnimate every frame, redraws its viewports
applet.isPlaying = false;

applet.requestRender(); // redraw viewports showing this applet once
applet.notify({kind: 'transform', source: applet, ids: [mesh.uuid]}); // same, with a typed change
```

**Each frame:**

1. Tick playing applets: `onAnimate(delta, time)` (one shared three.js `Timer`).
2. Drain change buses; tag viewports whose `listens(change)` is true.
3. Update each scene's world matrices once, then draw tagged, visible viewports in priority order (focused, hovered, other) within a frame budget (`renderScheduler.frameBudget`, 12 ms). Views not reached draw next frame.

Plain Three.js edits made outside `onAnimate` must call `applet.requestRender()` (or `viewport.tag('content')`), or nothing redraws.

## Edge Cases

### WebGPU Only

The package requires WebGPU ([ADR-0001](./docs/adr/0001-webgpu-only-one-renderer-canvas-target-per-viewport.md)). If a renderer ends up on a non-WebGPU backend, its viewports show an error message instead of rendering.

### Shared Renderer

All `IoThreeViewport` instances share a single `WebGPURenderer` by default (`getDefaultRenderer()`). Renderer state (tone mapping, clear color) is reset per viewport render. A viewport may be given its own `renderer` for renderer-level options such as `logarithmicDepthBuffer`; GPU resources are then not shared with other renderers.

### Visibility Optimization

Viewports not intersecting the viewport (scrolled out of view) skip rendering entirely. The `visible` property tracks this state.

### Renderer Initialization

The renderer initializes asynchronously. The scheduler initializes each renderer once and draws its viewports when it is ready. Applets get `onRendererInitialized(renderer)` before their first draw and do renderer-dependent setup there.

### Dispose Cleanup

Disposing a viewport unregisters it from the scheduler, disposes its CanvasTarget and the view it created (a view passed in is not disposed), and unregisters its tool. The renderer (shared or custom) is never disposed by the viewport.

## Packaging

Published `dist/index.js` is a bundled ES module. All `@io-gui/*` packages and `three` (including `three/webgpu`, `three/tsl`, and `three/addons`) are peer dependencies and stay external — install them alongside this package. The bundle does not inline Three.js.
