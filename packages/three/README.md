# @io-gui/three

Three.js integration for Io-Gui with WebGPU viewport and editor configurations.

See [live examples here](https://iogui.dev/io/#path=Demos,Three)

## Overview

```
IoThreeViewport (element)
├── WebGPURenderer (shared)
├── CanvasTarget (per viewport)
└── ViewCameras (perspective/orthographic)

ThreeApplet (node)
├── scene: Scene
├── toneMapping, toneMappingExposure
└── onAnimate(delta), onResized(width, height)

EditorConfigs (configs/*)
└── Property editors for Three.js classes
```

## Elements

### IoThreeViewport

WebGPU-powered viewport element for rendering Three.js scenes.

```typescript
type IoThreeViewportProps = {
  applet: ThreeApplet; // Application node
  playing?: boolean; // Enable animation loop
  clearColor?: number; // Background color (hex)
  clearAlpha?: number; // Background alpha (0-1)
  cameraSelect?: string; // Camera type: 'perspective' | 'orthographic'
  renderer?: WebGPURenderer; // Custom renderer (optional)
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
import { IoThreeViewport, ThreeApplet } from "@io-gui/three";
import { Scene, Mesh, BoxGeometry, MeshBasicMaterial } from "three/webgpu";

class MyApplet extends ThreeApplet {
  constructor() {
    super();
    this.scene = new Scene();
    this.scene.add(
      new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0xff0000 })),
    );
  }
  onAnimate(delta: number) {
    // Animation logic
  }
}

const viewport = new IoThreeViewport({
  applet: new MyApplet(),
  playing: true,
});
```

## Nodes

### ThreeApplet

Base class for Three.js applications with lifecycle hooks.

```typescript
type ThreeAppletProps = {
  scene?: Scene;
  toneMappingExposure?: number;
  toneMapping?: ToneMapping;
  uiConfig?: PropertyConfig[];
  uiGroups?: PropertyGroups;
};
```

**Lifecycle methods:**

| Method                            | Description                          |
| --------------------------------- | ------------------------------------ |
| `onRendererInitialized(renderer)` | Called when WebGPU renderer is ready |
| `onResized(width, height)`        | Called on viewport resize            |
| `onAnimate(delta)`                | Called each animation frame          |

### ViewCameras

Manages viewport cameras with perspective and orthographic options.

```typescript
type ViewCamerasProps = {
  viewport: IoThreeViewport;
  applet: ThreeApplet;
  cameraSelect: "perspective" | "orthographic";
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

The shared renderer runs a global animation loop:

```typescript
// Viewports opt-in to animation
viewport.playing = true; // Adds to animation loop
viewport.playing = false; // Removes from animation loop
```

**Loop behavior:**

- Uses `renderer.setAnimationLoop()` for WebGPU sync
- Calls `onAnimate()` only for playing viewports
- Skips rendering for non-visible viewports (IntersectionObserver)
- Provides `time` and `delta` to applets

## Edge Cases

### Shared Renderer

All `IoThreeViewport` instances share a single `WebGPURenderer` by default. This improves performance but means renderer state (tone mapping, clear color) is reset per viewport render.

### Visibility Optimization

Viewports not intersecting the viewport (scrolled out of view) skip rendering entirely. The `visible` property tracks this state.

### Renderer Initialization

The renderer initializes asynchronously. Viewports wait for `renderer.initialized === true` before rendering. Similarly, applets wait for `onRendererInitialized()` before performing renderer-dependent setup.

### Dispose Cleanup

Disposing a viewport disposes its CanvasTarget and ViewCameras. The shared renderer is only disposed if a custom renderer was provided.
