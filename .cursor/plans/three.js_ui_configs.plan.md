# Three.js UI Configurations Plan

## Goal

Provide useful inspectors for public three.js objects without turning the inspector registry into a second model layer. Configurations are side effects loaded by `@io-gui/three`; they select editors, organize properties, and optionally provide a focused widget.

## Registration Types

Three.js UI integration has three independent registrations:

1. `registerEditorConfig` maps property names or value types to editors.
2. `registerEditorGroups` organizes an inspected object's properties.
3. `registerEditorWidget` supplies a focused editor for the object itself.

### Value-Type Dispatch

Register reusable value types on `Object` so properties of that type receive the specialized editor:

```typescript
import { registerEditorConfig } from '@io-gui/editors'
import { Vector3 } from 'three/webgpu'
import { threeVector3 } from '../../elements/math/ThreeVector3.js'

registerEditorConfig(Object, [
  [Vector3, threeVector3({min: -Infinity, max: Infinity, step: 0.1})],
])
```

This pattern is for values such as `Vector2/3/4`, `Euler`, `Quaternion`, `Color`, matrices, bounds, tracks, and other reusable domain values.

### Class Inspector Configuration

Register property names and groups on the narrowest class that owns them:

```typescript
registerEditorConfig(PerspectiveCamera, [
  ['fov', ioNumberSlider({min: 1, max: 180, step: 0.01})],
  ['zoom', ioNumberSlider({min: 0.01, max: 10, step: 0.01, exponent: 3})],
])

registerEditorGroups(PerspectiveCamera, {
  Film: ['focus', 'filmGauge', 'filmOffset'],
  Advanced: ['view'],
  Hidden: ['fov', 'aspect', 'near', 'far', 'zoom'],
})
```

**Invariant: never register a class inspector's string or regex property identifiers on `Object` or another broad base.** Registrations aggregate with `instanceof`, so a broad registration leaks those property rules into every derived object.

`registerEditorConfig(Object, [[Vector3, ...]])` remains valid: it dispatches by the property's value type rather than claiming a property name for every object.

Singleton plain objects without a narrow constructor, such as `ColorManagement`, cannot have global class configs. Use a local `ioPropertyEditor` config if a dedicated view needs one.

### Focused Widgets

Use `registerEditorWidget` when an object needs a compact task-specific surface:

```typescript
registerEditorWidget(PerspectiveCamera, ioPropertyEditor({
  properties: ['fov', 'aspect', 'near', 'far', 'zoom', 'updateProjectionMatrix'],
  labelWidth: '52px',
}))
```

Camera widget properties are hidden from the general grouped inspector to avoid duplication. Geometry classes similarly register `threeBuildGeometry()` and hide their constructor `parameters`.

## Three.js-Specific Editors

Current math editors live in `packages/three/src/elements/math/`:

- `threeVector2`, `threeVector3`, `threeVector4`
- `threeEuler`
- `threeQuaternion`
- `threeMatrix2`, `threeMatrix3`, `threeMatrix4`

Matrices configure their `elements` property with the specialized matrix element and use an unlabeled `ioObject` when a matrix is a property value.

`Color` currently uses `ioColorRgba`. Add a three.js-specific color element in the future so three.js color behavior and typing remain in `@io-gui/three`.

Other common editors:

- `ioPropertyEditor` / `ioObject`: composite values
- `ioNumberSlider`: bounded values
- `ioNumber`: unbounded values or explicit numeric constraints
- `ioOptionSelect`: enums and constants
- `ioSwitch({value: false})`: write-only update setters such as `needsUpdate`
- `ioField({disabled: true})`: read-only display

## Default Editors

`@io-gui/editors` already provides:

- `String` → `ioString()`
- `Number` → `ioNumber({step: 0.01})`
- `Boolean` → `ioSwitch()`
- `Object` → `ioObject()`
- `Function` → `ioButton()`
- `null` / `undefined` → disabled `ioField()`

Only configure properties that gain meaningful behavior: constraints, a selector, a specialized domain editor, read-only treatment, or a focused widget.

## Grouping Rules

- Prefer semantic groups such as `Source`, `Mapping`, `Filtering`, and `Wrapping`.
- Do not repeat inherited groups unless a subclass deliberately moves a property.
- Explicit names take priority over regexes.
- Put implementation details and flags such as `/^is[A-Z0-9]/` in `Hidden`.
- Include useful computed getters; read-only detection converts them to disabled fields.
- Keep focused-widget properties in `Hidden` when showing them again would duplicate UI.

## Source Mirroring and Imports

`packages/three/src/configs/` mirrors the linked three.js `src/` tree:

```text
three.js/src/renderers/webgpu/WebGPURenderer.js
→ packages/three/src/configs/renderers/webgpu/WebGPURenderer.ts

three.js/src/renderers/common/RenderPipeline.js
→ packages/three/src/configs/renderers/common/RenderPipeline.ts
```

Do not flatten directories.

`packages/three/src/configs/index.ts`:

- Imports base classes before subclasses.
- Uses `.js` extensions.
- Imports comment-only files for intentionally inherited, abstract, deprecated, or utility modules when that makes coverage explicit.
- Keeps unconfigured public modules commented as tracker references.

Deprecated aliases inherit their replacement's config:

- `Source` inherits `TextureSource`.
- `PostProcessing` inherits `RenderPipeline`.

## Visual Verification

`packages/three/src/demos/ThreeEditorConfigs.ts` is the standalone config inspector. It exports `allClasses`, arranges class families in `io-layout`, and appears beside `IoEditorExample` as **Three Configs** in the root demo menu.

When adding a config:

1. Add or update its representative instance in `allClasses`.
2. Run `pnpm dev`.
3. Open **Demos → Three Configs**.
4. Check groups, constraints, selectors, focused widgets, setters, and read-only fields.
5. Run `pnpm exec tsc -b packages/three`.

## Progress Tracker

### Completed

- [x] **math/**
  - Vector2/3/4, Quaternion, Euler
  - Matrix2/3/4
  - Color; ColorManagement intentionally has no global config
  - Box2/3, Sphere, Plane, Triangle, Line3, Ray
  - Spherical, Cylindrical, Frustum, FrustumArray, SphericalHarmonics3
  - Cubic, Linear, Discrete, QuaternionLinear, and Bezier interpolants
  - MathUtils intentionally skipped

- [x] **cameras/**
  - Camera, StereoCamera, PerspectiveCamera, OrthographicCamera, CubeCamera, ArrayCamera
  - PerspectiveCamera and OrthographicCamera have focused widgets

- [x] **core/**
  - Object3D, EventDispatcher, Clock, Timer, Raycaster, Layers
  - Buffer and interleaved attributes
  - BufferGeometry and InstancedBufferGeometry
  - Uniform, UniformsGroup
  - RenderTarget, RenderTarget3D

- [x] **scenes/**
  - Scene, Fog, FogExp2

- [x] **animation/**
  - AnimationMixer, AnimationAction, AnimationClip, AnimationObjectGroup
  - KeyframeTrack and concrete tracks
  - PropertyBinding, PropertyMixer
  - AnimationUtils intentionally skipped

- [x] **audio/**
  - AudioListener, Audio, PositionalAudio, AudioAnalyser
  - AudioContext intentionally skipped

- [x] **renderers/**
  - WebGPU renderer config at `renderers/webgpu/WebGPURenderer.ts`
  - RenderPipeline; deprecated PostProcessing inherits it
  - BundleGroup, CanvasTarget, QuadMesh, InspectorBase
  - Storage textures and storage attributes
  - Lighting intentionally skipped

- [x] **textures/**
  - TextureSource, Texture, HTMLTexture, CanvasTexture, VideoTexture, VideoFrameTexture
  - Cube, data, compressed, depth, framebuffer, and external texture subclasses
  - Simple subclasses inherit the closest configured base

- [x] **objects/**
  - Mesh, Group, Line, Points, Sprite, Bone, LOD
  - SkinnedMesh, InstancedMesh, BatchedMesh
  - LineSegments, LineLoop, ClippingGroup, Skeleton

- [x] **lights/**
  - Light and concrete light classes
  - LightShadow and concrete shadows
  - WebGPU IESSpotLight and ProjectorLight

- [x] **geometries/**
  - Primitive, curved, extruded, lathed, polyhedron, edge, and wireframe geometries
  - Constructor-parameter editing through `threeBuildGeometry`

### TODO

- [ ] **materials/** — Material base and classic material subclasses
- [ ] **materials/nodes/** — NodeMaterial and public node-material subclasses
- [ ] **helpers/** — Public helper classes
- [ ] **loaders/** — Public loader classes; skip utility-only modules
- [ ] **extras/core/** and **extras/curves/** — Curve, Path, Shape, and concrete curves
- [ ] **nodes/** — Decide useful public inspection scope before configuring; do not mirror internal implementation indiscriminately
- [ ] Add a three.js-specific color editor and replace `ioColorRgba` for `THREE.Color`

## Checklist

1. Confirm the class is public and useful to inspect.
2. Mirror its three.js source path.
3. Register property names/groups on the narrowest class.
4. Use `Object` only for property-value type dispatch.
5. Add a focused widget only when it removes repetitive editing work.
6. Import the config in inheritance order.
7. Add an instance to `ThreeEditorConfigs.ts`.
8. Verify in **Three Configs** and type-check the package.
