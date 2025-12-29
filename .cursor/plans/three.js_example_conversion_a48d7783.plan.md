---
name: Three.js Example Conversion
overview: A systematic approach to convert three.js source examples from self-contained HTML files to TypeScript classes extending ThreeState, delegating renderer, controls, and animation loop management to IoThreeViewport.
todos:
  - id: analyze-example
    content: Analyze source example (imports, scene objects, animation, resize logic)
    status: completed
  - id: create-ts-file
    content: Create TypeScript file with class extending ThreeState
    status: completed
    dependencies:
      - analyze-example
  - id: convert-imports
    content: Convert THREE.* to named imports from three/webgpu, three/tsl, three/addons
    status: completed
    dependencies:
      - create-ts-file
  - id: implement-constructor
    content: Move scene initialization to constructor()
    status: completed
    dependencies:
      - convert-imports
  - id: implement-lifecycle
    content: Implement onAnimate(), onResized(), onRendererInitialized() as needed
    status: completed
    dependencies:
      - implement-constructor
  - id: test-in-demo
    content: Add to IoThreeDemo and verify rendering
    status: completed
    dependencies:
      - implement-lifecycle
---

# Three.js Example Conversion Plan

## Summary of Observations

### Source Examples Structure ([`src_examples/*.html`](packages/three/src_examples))

Self-contained HTML files with these characteristics:

- Import THREE namespace or individual modules from `three/webgpu`, `three/tsl`, `three/addons/*`
- Create their own `WebGPURenderer`, `Scene`, `Camera`
- Handle window resize, animation loop, DOM container
- Often include `OrbitControls`, `Inspector`/GUI, raycasters, event listeners

### Converted Examples Structure ([`src/examples/*.ts`](packages/three/src/examples))

TypeScript classes extending [`ThreeState`](packages/three/src/nodes/ThreeState.ts):

```typescript
@Register
export class WebGPU{PascalCaseName}Example extends ThreeState {
  constructor() {
    super()
    // Scene content setup (this.scene is provided by ThreeState)
  }
  onResized(width: number, height: number) { /* aspect-dependent updates */ }
  onAnimate() { /* per-frame updates */ }
  onRendererInitialized(renderer: WebGPURenderer) { /* async/compute operations */ }
}
```

---

## Conversion Rules

### 1. File and Class Naming

| Source | Converted |

|--------|-----------|

| `webgpu_camera.html` | `webgpu_camera.ts` |

| Class name: | `WebGPUCameraExample` |

Pattern: Keep snake_case filename, convert to PascalCase class name with `Example` suffix.

### 2. Remove/Delegate (handled by IoThreeViewport)

- HTML boilerplate, CSS, info divs
- `WebGPURenderer` creation and configuration
- `renderer.setAnimationLoop()` / DOM canvas appending
- `OrbitControls` (provided by `ViewCameras`)
- `window.addEventListener('resize', ...)` handlers
- WebGPU availability checks
- GUI/Inspector creation

### 3. Transform

| Source Pattern | Converted Pattern |

|----------------|-------------------|

| `import * as THREE from 'three/webgpu'` | Named imports: `import { Mesh, ... } from 'three/webgpu'` |

| `THREE.SomeThing` | Direct: `SomeThing` |

| Global `let scene, camera, mesh` | Class properties: `public mesh: Mesh` |

| `function init() {}` | `constructor() { super(); ... }` |

| `function animate() {}` | `onAnimate() {}` |

| `function onWindowResize() {}` | `onResized(width, height) {}` |

| `await renderer.init(); renderer.compute(...)` | `async onRendererInitialized(renderer) { await super...; renderer.compute(...) }` |

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

---

## Conversion Workflow (Per Example)

1. **Analyze** - Read source HTML, identify:

   - Three.js imports needed
   - Scene objects created
   - Animation logic
   - Resize-dependent logic
   - Async/compute operations
   - Custom cameras or interaction patterns

2. **Create TypeScript file** - `packages/three/src/examples/{original_name}.ts`

3. **Convert imports** - Replace `THREE.*` with named imports

4. **Define class** - Extend `ThreeState`, add `@Register` decorator

5. **Move initialization** - Scene content from `init()` to `constructor()`

6. **Implement lifecycle methods**:

   - `onAnimate()` for frame updates
   - `onResized()` for aspect-ratio dependent updates
   - `onRendererInitialized()` for compute/async operations

7. **Add to demo** (optional) - Update [`IoThreeDemo.ts`](packages/three/src/demos/IoThreeDemo.ts) to include the new example

---

## Complexity Categories

### Simple (straightforward conversion)

- Static scenes with no animation
- Basic materials and geometries
- No custom controls or interaction

### Medium (some adaptation needed)

- Animation in `onAnimate()`
- Resize-dependent camera adjustments
- Compute shaders via `onRendererInitialized()`
- Custom cameras added to scene

### Complex (may need design decisions)

- Custom controls/interaction patterns (raycasting, drag)
- GUI parameters (need alternative approach or omit)
- Multiple viewports/scissor tests (example-specific logic)
- Keyboard event handlers (may need external handling)
- External asset loading (GLTFLoader, etc. - should work but verify paths)

---

## Reference Comparison

| Source ([`webgpu_camera.html`](packages/three/src_examples/webgpu_camera.html)) | Converted ([`webgpu_camera.ts`](packages/three/src/examples/webgpu_camera.ts)) |

|------|-----------|

| Creates renderer, canvas, animation loop | Delegates to IoThreeViewport |

| Creates OrbitControls | Delegates to ViewCameras |

| Has keyboard listener for O/P camera switch | Cameras accessible via `cameraSelect: 'scene:name'` |

| Window resize handler | `onResized()` method |

| `render()` function with dual viewport | `onAnimate()` updates scene objects |

---

## Execution Notes

- Convert one example at a time for review
- Start with simpler examples to establish patterns
- Note any deviations or special cases for documentation
- GUI/Inspector parameters can be tracked as potential future feature