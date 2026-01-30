# Three.js Example Conversion Plan

## Summary of Observations

### Source Examples Structure ([`src_examples/*.html`](packages/three/src_examples))

Self-contained HTML files with these characteristics:

- Import THREE namespace or individual modules from `three/webgpu`, `three/tsl`, `three/addons/*`
- Create their own `WebGPURenderer`, `Scene`, `Camera`
- Handle window resize, animation loop, DOM container
- Often include `OrbitControls`, `Inspector`/GUI, raycasters, event listeners

### Converted Examples Structure ([`src/demos/examples/Io*Example.ts`](packages/three/src/demos/examples))

Each file contains two classes:

1. **ThreeApplet** - The 3D scene logic
2. **IoElement** - The UI wrapper extending `IoThreeExample`

```typescript
import { Register, ReactiveProperty } from '@io-gui/core'
import { ThreeApplet, IoThreeExample } from '@io-gui/three'
import { PropertyConfig, PropertyGroups } from '@io-gui/editors'

@Register
export class XxxExample extends ThreeApplet {
  constructor() {
    super()
    // Scene content setup (this.scene is provided by ThreeApplet)
  }
  onResized(width: number, height: number) { /* aspect-dependent updates */ }
  onAnimate(delta: number) { /* per-frame updates */ }
  onRendererInitialized(renderer: WebGPURenderer) { /* async/compute operations */ }
}

export class IoXxxExample extends IoThreeExample {

  @ReactiveProperty({type: XxxExample, init: null})
  declare applet: XxxExample

  // Optional: Override uiConfig/uiGroups for custom UI
  @ReactiveProperty({type: Array})
  declare uiConfig: PropertyConfig[]

  @ReactiveProperty({type: Object})
  declare uiGroups: PropertyGroups

  init() {
    // Set uiConfig and uiGroups here if needed
    this.uiConfig = [...]
    this.uiGroups = {...}
  }
}

Register(IoXxxExample)
export const ioXxxExample = IoXxxExample.vConstructor
```

---

## Conversion Rules

### 1. File and Class Naming

| Source | Converted |
|--------|-----------|
| `webgpu_camera.html` | `IoCameraExample.ts` |
| Applet class: | `CameraExample extends ThreeApplet` |
| Element class: | `IoCameraExample extends IoThreeExample` |

Pattern: 
- File: `Io{PascalCaseName}Example.ts`
- Applet: `{PascalCaseName}Example`
- Element: `Io{PascalCaseName}Example`

### 2. Remove/Delegate (handled by IoThreeViewport)

- HTML boilerplate, CSS, info divs
- `WebGPURenderer` creation and configuration
- `renderer.setAnimationLoop()` / DOM canvas appending
- `OrbitControls` (provided by `ViewCameras`)
- `window.addEventListener('resize', ...)` handlers
- WebGPU availability checks
- GUI/Inspector creation → convert to `uiConfig` on IoElement

### 3. Transform

| Source Pattern | Converted Pattern |
|----------------|-------------------|
| `import * as THREE from 'three/webgpu'` | Named imports: `import { Mesh, ... } from 'three/webgpu'` |
| `THREE.SomeThing` | Direct: `SomeThing` |
| Global `let scene, camera, mesh` | Class properties: `public mesh: Mesh` |
| `function init() {}` | `constructor() { super(); ... }` |
| `function animate() {}` | `onAnimate(delta: number) {}` |
| `function onWindowResize() {}` | `onResized(width, height) {}` |
| `await renderer.init(); renderer.compute(...)` | `async onRendererInitialized(renderer) { await super...; renderer.compute(...) }` |
| GUI folder/controls | `uiConfig` and `uiGroups` on IoElement |

### 4. Preserve

- Core scene content (meshes, materials, lights, geometries)
- TSL shader nodes and materials
- Textures and procedural data generation
- Animation logic (move to `onAnimate()`)
- Scene-specific camera handling (helpers, rigs)

### 5. Custom Cameras

If the example requires custom cameras (not just default perspective/ortho views):

- Create cameras and add to `this.scene` with unique `.name` property
- They can be selected via `cameraSelect: 'scene:cameraName'` in IoThreeViewport

### 6. UI Configuration (uiConfig and uiGroups)

UI configuration is defined on the **IoElement**, not the applet:

```typescript
export class IoAnimationExample extends IoThreeExample {
  @ReactiveProperty({type: AnimationExample, init: null})
  declare applet: AnimationExample

  @ReactiveProperty({type: Array})
  declare uiConfig: PropertyConfig[]

  @ReactiveProperty({type: Object})
  declare uiGroups: PropertyGroups

  init() {
    this.uiConfig = [
      ['showSkeleton', ioBoolean({label: 'Show Skeleton'})],
      ['timeScale', ioNumberSlider({min: 0, max: 1.5, step: 0.01})],
    ]

    this.uiGroups = {
      Main: ['showSkeleton', 'timeScale'],
      Hidden: ['scene', 'camera', 'mixer'],
    }
  }
}
```

---

## Conversion Workflow (Per Example)

1. **Analyze** - Read source HTML, identify:

- Three.js imports needed
- Scene objects created
- Animation logic
- Resize-dependent logic
- Async/compute operations
- Custom cameras or interaction patterns
- GUI parameters to convert

2. **Create TypeScript file** - `packages/three/src/demos/examples/Io{PascalName}Example.ts`

3. **Convert imports** - Replace `THREE.*` with named imports, add io-gui imports

4. **Define ThreeApplet class** - Extend `ThreeApplet`, add `@Register` decorator

5. **Move initialization** - Scene content from `init()` to `constructor()`

6. **Implement lifecycle methods**:
- `onAnimate(delta)` for frame updates
- `onResized()` for aspect-ratio dependent updates
- `onRendererInitialized()` for compute/async operations

7. **Define IoElement class** - Extend `IoThreeExample`, declare typed applet property

8. **Convert GUI to uiConfig** - If source has GUI, convert to `uiConfig`/`uiGroups` in `init()`

9. **Register and export** - `Register(IoXxxExample)` and `export const ioXxxExample`

---

## Complexity Categories

### Simple (straightforward conversion)

- Static scenes with no animation
- Basic materials and geometries
- No custom controls or interaction
- No GUI parameters

### Medium (some adaptation needed)

- Animation in `onAnimate()`
- Resize-dependent camera adjustments
- Compute shaders via `onRendererInitialized()`
- Custom cameras added to scene
- Simple GUI → uiConfig conversion

### Complex (may need design decisions)

- Custom controls/interaction patterns (raycasting, drag)
- Complex GUI parameters with interdependencies
- Multiple viewports/scissor tests (example-specific logic)
- Keyboard event handlers (may need external handling)
- External asset loading (GLTFLoader, etc. - should work but verify paths)

---

## Converted Examples

| File | uiConfig | Notes |
|------|----------|-------|
| `IoAnimationBackdropExample.ts` | - | TSL backdrop effects |
| `IoAnimationGroupsExample.ts` | - | Animation object groups |
| `IoAnimationKeyframesExample.ts` | - | GLTF keyframe animation |
| `IoAnimationRetargetingExample.ts` | - | Skeleton retargeting |
| `IoAnimationRetargetingReadyplayerExample.ts` | Yes | Hidden mixer properties |
| `IoAnimationSkinningAdditiveBlendingExample.ts` | Yes | Skeleton, weight sliders |
| `IoAnimationSkinningBlendingExample.ts` | Yes | Crossfade buttons, sliders |
| `IoCameraArrayExample.ts` | - | ArrayCamera grid |
| `IoCameraExample.ts` | - | Perspective/Ortho comparison |
| `IoCameraLogarithmicDepthBufferExample.ts` | - | Extreme depth range |
| `IoComputeTextureExample.ts` | - | Compute shader texture |
| `IoGeometriesExample.ts` | - | Built-in geometries |
| `IoGeometryColorsExample.ts` | - | Vertex colors |
| `IoGeometryConvexExample.ts` | - | Convex hull generation |
| `IoVolumePerlinExample.ts` | - | 3D texture raymarching |
| `IoWebGPUBackdropAreaExample.ts` | Yes | Material selector |

---
