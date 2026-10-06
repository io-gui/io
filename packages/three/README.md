# @io-gui/three

Three.js integration for Io-Gui with WebGPU viewport and editor configurations.

See [live examples here](https://iogui.dev/io/#path=Demos,Three)

## Overview

```
IoThreeViewport (element)
├── WebGPURenderer (shared)
├── CanvasTarget (per viewport)
└── ViewCameras (perspective/orthographic)

ThreeApplet (object)
├── scene: Scene
├── toneMapping, toneMappingExposure, isPlaying
└── onAnimate(delta, time), onResized(width, height)

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
| `onResized(width, height)`        | Called on viewport resize            |
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

## Animation Loop

A single global `requestAnimationFrame` loop drives all playing applets:

```typescript
// Applets opt-in to animation
applet.isPlaying = true; // Adds to animation loop
applet.isPlaying = false; // Removes from animation loop
```

**Loop behavior:**

- Calls `onAnimate(delta, time)` only for playing applets (time from a three.js `Timer`)
- After each frame the applet dispatches a bubbling `three-applet-needs-render` event; viewports showing it re-render (debounced)
- Skips rendering for non-visible viewports (IntersectionObserver)

## Edge Cases

### Shared Renderer

All `IoThreeViewport` instances share a single `WebGPURenderer` by default. This improves performance but means renderer state (tone mapping, clear color) is reset per viewport render.

### Visibility Optimization

Viewports not intersecting the viewport (scrolled out of view) skip rendering entirely. The `visible` property tracks this state.

### Renderer Initialization

The renderer initializes asynchronously. Viewports wait for `renderer.initialized === true` before rendering. Similarly, applets wait for `onRendererInitialized()` before performing renderer-dependent setup.

### Dispose Cleanup

Disposing a viewport disposes its CanvasTarget and ViewCameras and unregisters its tool. The renderer (shared or custom) is never disposed by the viewport.

## Packaging

Published `dist/index.js` is a bundled ES module. All `@io-gui/*` packages and `three` (including `three/webgpu`, `three/tsl`, and `three/addons`) are peer dependencies and stay external — install them alongside this package. The bundle does not inline Three.js.
