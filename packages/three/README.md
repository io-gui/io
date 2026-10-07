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

ThreeApplet (object)
├── scene: Scene
├── changeBus: ChangeBus
├── toneMapping, toneMappingExposure, isPlaying
└── onAnimate(delta, time), requestRender(), notify(change)

EditorConfigs (configs/*)
└── Property editors for Three.js classes
```

## Elements

### IoThreeViewport

WebGPU-powered viewport element for rendering Three.js scenes.

```typescript
type IoThreeViewportProps = {
  applet: ThreeApplet; // Application object
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

### ThreeApplet

Base class for Three.js applications with lifecycle hooks.

```typescript
type ThreeAppletProps = {
  scene?: Scene;
  toneMappingExposure?: number;
  toneMapping?: ToneMapping;
  isPlaying?: boolean; // Run the animation loop
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
