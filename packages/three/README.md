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
└── ViewCameras (perspective/orthographic)

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
  overscan?: number; // Camera overscan factor (default 1.1)
  clearColor?: number; // Background color (hex)
  clearAlpha?: number; // Background alpha (0-1)
  cameraSelect?: string; // 'perspective' | 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back' | 'scene' | 'scene:<cameraName>'
  renderer?: WebGPURenderer; // Custom renderer (optional)
  tool?: ToolBase; // Active 3D pointer tool (optional)
};
```

**Key behaviors:**

- Shared WebGPURenderer instance across viewports
- Per-viewport CanvasTarget for independent rendering
- IntersectionObserver for visibility-based rendering
- Automatic resize handling with pixel ratio support
- Debounced rendering for performance

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

### ViewCameras

Manages viewport cameras with perspective and orthographic options.

```typescript
type ViewCamerasProps = {
  viewport: IoThreeViewport;
  applet: ThreeApplet;
  cameraSelect: string; // see IoThreeViewport
};
```

**Key behaviors:**

- Automatic aspect ratio adjustment
- Overscan support for edge rendering
- Camera switching without scene modification

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

Disposing a viewport unregisters it from the scheduler, disposes its CanvasTarget and ViewCameras, and unregisters its tool. The renderer (shared or custom) is never disposed by the viewport.

## Packaging

Published `dist/index.js` is a bundled ES module. All `@io-gui/*` packages and `three` (including `three/webgpu`, `three/tsl`, and `three/addons`) are peer dependencies and stay external — install them alongside this package. The bundle does not inline Three.js.
