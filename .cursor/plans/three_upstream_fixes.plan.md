---
name: three.js Upstream Fixes
overview: WebGPURenderer and addon bugs found while converting three.js examples (packages/three/src/demos/ExamplesConversion.plan.md), with a fix plan for each and the example workarounds to remove once a fix is in the three io runs. Compressed textures were filed as #35081-#35084 (#35081-#35083 merged, #35084 in review); Mesh.count, dynamic buffers, instance count and Min/Max blending are planned here and not yet filed.
todos:
  - id: compressed-mipmaps
    content: "#35081 CompressedTexture: Default `mipmaps` to an empty array (branch fixes/compressed-texture-mipmaps). Merged 2026-10-19 (db1ef0781a). LoaderTextureDds assigns maps at the load call again (done 2026-10-19)"
    status: completed
  - id: compressed-rgba
    content: "#35082 WebGPURenderer: Support uncompressed data in compressed textures (fixes/compressed-texture-rgba). Merged 2026-10-19 (bc88736756). LoaderTextureDds dropped `uncompressed()` (done 2026-10-19)"
    status: completed
  - id: compressed-cube
    content: "#35083 WebGPURenderer: Support `CompressedCubeTexture` (fixes/compressed-cube-texture). Merged 2026-10-19 (f9ba4abd3d). LoaderTextureDds restored its three cube maps (done 2026-10-19), wrapped as `CompressedCubeTexture`s until #35084"
    status: completed
  - id: compressed-loader-cube
    content: "#35084 CompressedTextureLoader: Return cube maps as cube textures (fixes/compressed-texture-loader-cube). Review 2026-10-19 (Mugen87): no `is*` flag patching; proposes `load()` without a return value, the texture only in `onLoad`, as KTX2Loader. Reworked 2026-10-19 on the branch (dev merged in; rework uncommitted): `loadAsync()` resolves with a CompressedCubeTexture for cube maps (else CompressedTexture), `load()` unchanged plus a cube-map deprecation warning. DataTexture for uncompressed data dropped after review. See '#35084 review'"
    status: in_progress
  - id: mesh-count
    content: "MarchingCubes keeps its vertex count in `Mesh.count`, which WebGPURenderer reads as the instance count. Fix in the addon. Then: Marchingcubes drops `count = 1`"
    status: pending
  - id: dynamic-usage
    content: "DynamicDrawUsage attributes upload whole on every render call (every view and pass). Upload at most once per frame. Then: Marchingcubes and BuffergeometryDrawrange go back to the source's dynamic buffers"
    status: pending
  - id: instanced-mesh-instance-count
    content: "InstancedMesh of an InstancedBufferGeometry draws geometry.instanceCount (Infinity by default; drawIndexed throws). Prefer the mesh's count as WebGL does; clamp Infinity. Then: BuffergeometryInstancingInterleaved drops `geometry.instanceCount`"
    status: pending
  - id: minmax-blend-factors
    content: "CustomBlending with MinEquation / MaxEquation fails pipeline validation unless both factors are One. Force One in the WebGPU backend. Then: MaterialsBlendingCustom keeps the source's factors"
    status: pending
  - id: cache-key-deprecated-accessor
    content: "Regression in dev (#35039, the fix of #35029): RenderObject.getMaterialCacheKey reads every prototype getter, including MeshPhysicalMaterial's deprecated iridescenceThicknessRange, which warns once per page for any physical material. Skip the alias in the cache key. No io workaround (three's renderer reads it). Fixed upstream by Mugen87 as planned (2b7c79ef26, 2026-10-19: the alias in the skip regex); gone in io once ../three.js has it"
    status: completed
  - id: velocity-per-view
    content: "VelocityNode keeps one previous world matrix per object and overwrites it after every draw, so of several views drawing velocity in one frame only the first sees objects move (confirmed 2026-10-22; TRAA smears them in the others). Track previous matrices per object and camera. io workaround in place 2026-10-22 (ViewVelocityNode / viewVelocity; canary test in ViewVelocityNode.test.ts)"
    status: pending
  - id: triage-cube-envmap-loading
    content: "Triage, not planned: a loading CubeTexture as a standard material's envMap binds a 2D placeholder as a cube (MaterialsDisplacementmap, Marchingcubes)"
    status: pending
  - id: triage-fragment-node-mrt
    content: "Triage, not planned: a material with fragmentNode fails in an MRT pass (TRAA color + velocity): LightProbeHelperGPU, LightProbeGridHelper, LDrawConditionalLineNodeMaterial (LightprobeCubecamera, LoaderLdraw; the probe helpers overlay draws the other probe examples' helpers without MRT)"
    status: pending
  - id: triage-materialx-compile-async
    content: "Triage, not planned: webgpu_loader_materialx rendered from src (dev d94661f706, headless Chromium) logs ~360 WebGPU validation errors ('CommandEncoder renderContext_0 is already finished', invalid render pass encoders) while it loads; likely compileAsync of each sample during the animation loop. No io workaround: the conversion does not precompile"
    status: pending
isProject: false
---

# three.js Upstream Fixes

Bugs in `WebGPURenderer` or three addons that converted examples work around. Each section gives the cause with source references (three.js dev `0978e2b62e`, 2026-10-18), a standalone repro, the proposed fix and the workarounds that go once the fix is in the three io runs. Each example's sidecar (`packages/three/src/demos/examples/<Name>Example.md`) lists its workarounds under Workarounds (the fix id, the code and where, what to restore), and the Open table of [ExamplesConversion.plan.md](../../packages/three/src/demos/ExamplesConversion.plan.md) indexes them by example; code carries a `Workaround (upstream: <id>)` comment at each site (`grep -rn "Workaround (upstream" packages/three/src`).

## Workflow

- `packages/three` links `three` to `../three.js` (`link:../../../three.js`), so io runs the checked-out branch's `build/`. Remotes: `upstream` is mrdoob/three.js, `origin` the user's fork.
- One branch per fix off `upstream/dev`, named `fixes/<topic>`, one commit, PR title in upstream style (`Component: Sentence.`). Maintainers prefer an issue or a minimal repro first and small steps (Mugen87 on #35002).
- Repro first: a standalone page (`WebGPURenderer`, no io), checked headlessly against the dev build. Then the fix, `npm run lint` and `npm run test-unit` in `../three.js`, and the affected upstream examples (`npm run test-e2e` screenshots where they exist).
- To test the io example without its workaround before a fix merges: check out the fix branch in `../three.js`, `npm run build`, restart `pnpm dev`, remove the workaround locally. Switch `../three.js` back to `dev` (and rebuild) afterwards.
- **Removing a workaround:** once the fix is merged and in the build io links (and before publishing, in the three release io-gui requires), remove it as the sidecar's Workarounds bullet says, recheck the example (Perspective and Front views, its controls, all documents in one page) and move the bullet to the sidecar's History (the conversion plan's Workflows, Remove a workaround).

## Compressed textures (filed 2026-10-18)

Found in LoaderTextureDds (`webgl_loader_texture_dds`). Branches in `../three.js`. #35081-#35083 merged in `upstream/dev` on 2026-10-19; `../three.js` `dev` pulled to `ad4f951a86` and rebuilt the same day, and their LoaderTextureDds workarounds were removed. They ship in r187; io's `three` peer range is still `>=0.186.0`, so raise it to `>=0.187.0` before publishing.

| PR | Branch | Fixes | Workaround it removes |
| --- | --- | --- | --- |
| [#35081](https://github.com/mrdoob/three.js/pull/35081) CompressedTexture: Default `mipmaps` to an empty array. | `fixes/compressed-texture-mipmaps` | a compressed texture still loading has `mipmaps` undefined, which binding reads | maps assigned in the load callback (`load()` helper): removed |
| [#35082](https://github.com/mrdoob/three.js/pull/35082) WebGPURenderer: Support uncompressed data in compressed textures. | `fixes/compressed-texture-rgba` | uncompressed DDS files (`CompressedTexture` in `RGBAFormat`) have no block size in the compressed upload | `uncompressed()`: `DataTexture` conversion: removed |
| [#35083](https://github.com/mrdoob/three.js/pull/35083) WebGPURenderer: Support `CompressedCubeTexture`. | `fixes/compressed-cube-texture` | a compressed cube texture is sized from its face array's `width` (`Textures.getSize`), uploads 1 × 1 and fails validation | the three dropped cube maps: restored, wrapped (#35084 workaround) |
| [#35084](https://github.com/mrdoob/three.js/pull/35084) CompressedTextureLoader: Return cube maps as cube textures. | `fixes/compressed-texture-loader-cube` | DDS cube maps load as 2D `CompressedTexture`s with six images | `cubeTexture()` wrap and the env maps assigned once loaded |

### #35084 review (2026-10-19)

**Mugen87.**

- Don't set `is*` flags on an instance; a cube map should be a `CompressedCubeTexture`.
- `load()` returns a `CompressedTexture` before the file says what it holds. He proposes the `KTX2Loader` way: no return value, the texture only in `onLoad`.
- He also wants plain `Texture`s for uncompressed data eventually (#35082 review).

**Flags.** Patched flags don't survive `clone()`. `new this.constructor().copy()` returns a plain `CompressedTexture` with the six faces and `CubeReflectionMapping`, but no flags: the original bug again. This was checked in node. `MaterialXDocument` clones the textures that handlers return (`materialx/MaterialXDocument.js:530`).

**Cost of a callback-only `load()`.**

- The DDS, PVRTC and KTX examples build their materials from the return value: 14, 8 and 9 loads.
- `FBXLoader.loadTexture()` (`FBXLoader.js:492`) and `MTLLoader.loadTexture()` (`MTLLoader.js:583`, used at `:362`) use the return value of a `LoadingManager` handler. FBX and OBJ/MTL assets with a DDS handler would throw on `undefined`. `KTX2Loader` can't be their handler today for the same reason.
- `GLTFLoader` and `MaterialXDocument` load through the callback. `loadAsync()` resolves with the callback's texture, so it keeps working.

**Rework, if Mugen87 agrees.**

- `load()` returns nothing. `onLoad` gets a `CompressedTexture` for 2D data, or `new CompressedCubeTexture( faces, format )` for a single-file cube map and for the six-file form.
- The examples use the callbacks, and the screenshots are updated.
- FBX and MTL: either they assign the texture once it has loaded, or a migration-guide note. That is his call.
- Rejected: keep `load()`'s return value for 2D and pass cube maps to `onLoad` as a `CompressedCubeTexture`. The returned object and the one passed to `onLoad` would differ for cube maps. Code that sets properties on the texture in `onLoad`, while its materials hold the returned one (the DDS and PVRTC examples), would silently lose them.

**Non-breaking first step (proposed to the user 2026-10-19).** `load()` hands out its texture before the file is read, and `onLoad` must receive that same object. So `load()` itself cannot deliver a cube map as a `CompressedCubeTexture` without breaking someone.

- `CompressedTextureLoader` overrides `loadAsync()` to resolve with the right class. Promise users never see the early texture, so for them only the cube maps change, and they now work.
- `load()` stays as it is. It warns once when it loads a cube map, pointing to `loadAsync()`.
- The DDS and PVRTC examples load their cube maps with `loadAsync()`.
- Later, if Mugen87 wants callback-only:
  - first, FBX and MTL wait for the callback, which also lets them take a `KTX2Loader` handler;
  - then `load()` warns when called without `onLoad`;
  - about 10 releases later, the return value goes.
- No warning reaches 2D code that both passes `onLoad` and uses the return value; that needs a migration-guide note.
- During the deprecation period, `load()` and `loadAsync()` deliver cube maps differently.

**Rework (2026-10-19).**

- The user asked to merge `dev` into the branch without building. Done with `git merge-tree` and `commit-tree` (merge commit `9c8feaa495`), so the rebuilt `build/` in `../three.js` stayed in place. The branch is checked out there.
- The user first asked to also cover Mugen87's #35082 wish (`Texture`s for uncompressed data). A `DataTexture` branch for `RGBAFormat` 2D data was built and verified, then dropped after another agent's review. Its problems:
  - it was inconsistent: uncompressed cube maps stay `CompressedCubeTexture`s, and `load()` still returns a `CompressedTexture` for the same file;
  - it changed a working result: `loadAsync()` results lose `isCompressedTexture`.
  - What it would buy: `GLTFExporter` writes `DataTexture`s from `image.data`, but decompresses any `CompressedTexture` on the GPU and throws without `setTextureUtils()`.
  - It belongs to the callback-only step, when the results change anyway.
  - Uncompressed cube maps could be a `CubeTexture` of `DataTexture` faces only with mip levels as cubes of `DataTexture`s (WebGL reads `mipmap.image[ i ].image`, WebGPU `mipmap.images[ i ]`). No loader builds that.
- Review points applied: `// @deprecated r187` on the warning, tests for six files and uncompressed cube maps, and the TexData JSDoc typo (height). The two array-path issues are left alone, since they aren't new: an array that isn't six files misbehaves, and the last face loaded sets the format.
- The rework is uncommitted and touches four files:
  - `src/loaders/CompressedTextureLoader.js`:
    - `_loadData()` loads and parses one file or six.
    - `load()` behaves as on dev. When it loads a cube map it calls `warnOnce( 'CompressedTextureLoader: Loading cube maps with load() has been deprecated. Use loadAsync() instead.' ); // @deprecated r187`.
    - `loadAsync()` resolves with `createTexture()`: a `CompressedCubeTexture` for faces (uncompressed ones too), a `CompressedTexture` otherwise. It doesn't go through `load()`, as `ObjectLoader.loadAsync()` doesn't.
  - The `loadAsync` unit test (`test/unit/src/loaders/CompressedTextureLoader.tests.js`): compressed and uncompressed 2D, cube maps in one file (compressed and uncompressed), and in six files.
  - `webgl_loader_texture_dds` and `webgl_loader_texture_pvrtc`: cube maps via `loadAsync().then()`, which assigns `envMap`. The `mapping` lines are dropped.
  - The PR's DDS screenshot is kept.
- Checks:
  - eslint is clean, and `npm run test-unit` passes (1968 pass, 0 fail).
  - The examples were rendered from `src/` with no build: Playwright rewrites the import map, and time is frozen at 0 (`scratchpad/verify/srcmap.mjs`, python http.server on 3019).
  - DDS in WebGL and in WebGPU (`WebGPURenderer` swapped in): no errors, and both match the PR screenshot. PVRTC in WebGL: no errors.
  - In-page: `load()` keeps returning 2D cube maps and logs the warning once. `loadAsync()` gives a `CompressedCubeTexture` (mapping 301), and a `CompressedTexture` for uncompressed data.
- Proposed PR title: `CompressedTextureLoader: Return cube maps from loadAsync() as CompressedCubeTexture.`

**io.**

- Callback-only moves the source to the callback shape LoaderTextureDds already has (the #35081 workaround).
- Done 2026-10-19: LoaderTextureDds wraps the loaded faces in a `CompressedCubeTexture` (`cubeTexture`) and assigns the env maps once loaded. Checked headless: the time-0 frame matches the reference screenshot, with no errors.

## mesh-count: MarchingCubes keeps its vertex count in `Mesh.count`

**Cause.** `Mesh.count` (#31091) is the instance count in `WebGPURenderer` (`RenderObject.getDrawParameters`, `src/renderers/common/RenderObject.js:666`: `instanceCount = Math.max( 0, object.count )`; `count > 1` also adds the object's uuid to the geometry cache key, line 888). `MarchingCubes` predates it and uses `this.count` as its running vertex counter (`examples/jsm/objects/MarchingCubes.js:99, 435, 491, 522, 908, 939, 951`). After `update()` the mesh draws its draw range (already `count` vertices) `count` times: tens of thousands of instances per view. `init()` sets `count = 0`, which draws nothing until the first `update()`. `WebGLRenderer` ignores `Mesh.count`, so `webgl_marchingcubes` is fine.

**Repro.** `const mc = new MarchingCubes( 28, new MeshNormalMaterial(), false, false, 100000 ); mc.addBall( 0.5, 0.5, 0.5, 0.5, 12 ); mc.update()`, render once with `WebGPURenderer`: `renderer.info.render.triangles` is the triangle count times `mc.count`, and the frame takes seconds.

**Fix.** Keep the counter out of `Mesh.count`: a closure variable in the constructor (`let vertexCount = 0`), used by `posnormtriv`, `update()` and the safety check, as the other internals already are (`scope`, the caches). `count` stays `Mesh`'s, 1. Alternative if maintainers want it readable: a documented `vertexCount` property. Undocumented today, so no public API changes either way.
PR: `MarchingCubes: Keep the vertex count out of Mesh.count.` Check `webgl_marchingcubes` and `webxr_xr_marchingcubes` (WebGL, unchanged) and the repro.

**Workarounds.** Marchingcubes: `object.count = 1` after `update()` in `updateCubes`.

## dynamic-usage: dynamic attributes upload on every render call

**Cause.** `Attributes.update` (`src/renderers/common/Attributes.js:162`) uploads when `data.version < attribute.version || attribute.usage === DynamicDrawUsage`, since the universal renderer (#26079). `Geometries.updateAttribute` (`src/renderers/common/Geometries.js:314`) dedupes per `info.render.calls`, that is per `renderer.render()` call. So a dynamic attribute goes up whole (update ranges are cleared after each upload) for every view, render pass and shadow pass, changed or not. In WebGL usage is only a hint (`gl.DYNAMIC_DRAW`); data uploads when `needsUpdate` bumps the version. MarchingCubes' 100000-polygon buffers (`DynamicDrawUsage` in the addon) and BuffergeometryDrawrange's million-segment line buffers stalled the editor with several views.

**Compatibility constraint.** Upstream code relies on the implicit upload: `webgpu_instance_mesh` calls `setMatrixAt` every frame on a dynamic `instanceMatrix` and never sets `needsUpdate`. Dropping the clause would freeze it, so keep "dynamic means it may change every frame" and cap it at once per frame.

**Fix.** Track the frame of the last upload in the attribute's data and upload a dynamic attribute when its version changed, or when it has not been uploaded this frame:
```js
const frame = this.info.frame; // Animation sets it from nodeFrame.frameId every rAF, with or without setAnimationLoop
if ( data.version < attribute.version || ( attribute.usage === DynamicDrawUsage && data.frame !== frame ) ) {
	this.backend.updateAttribute( attribute );
	data.version = attribute.version;
	data.frame = frame;
}
```
`Attributes` already holds the renderer's `Info` (`constructor( backend, info )`). Behavior change: data edited between two renders of one frame without `needsUpdate` shows the first upload. `needsUpdate` still uploads immediately. Measure with the repro: a 1M-vertex dynamic attribute rendered by four cameras per frame, uploads per frame before (4) and after (1).
PR: `Attributes: Upload dynamic attributes once per frame.` Check `webgpu_instance_mesh`, `webgpu_tsl_vfx_linkedparticles`, `webgpu_lights_clustered`, `webgpu_display_stereo` (stereo renders twice per frame).

**Workarounds.** Marchingcubes: `staticUsage()` and the update ranges in `updateCubes`. BuffergeometryDrawrange: the line buffers without `DynamicDrawUsage` and the update ranges in `connect()`. Both go back to the source's dynamic buffers: one whole upload per frame is what the source does in WebGL (its `update()` / `needsUpdate` upload whole buffers every frame).

## instanced-mesh-instance-count: InstancedMesh with InstancedBufferGeometry

**Cause.** `RenderObject.getDrawParameters` (`RenderObject.js:662-670`) takes `geometry.instanceCount` whenever the geometry is an `InstancedBufferGeometry`, before `object.count`. `WebGLRenderer.renderBufferDirect` checks `object.isInstancedMesh` first (`src/renderers/WebGLRenderer.js:1341`) and draws `object.count` instances. `InstancedBufferGeometry.instanceCount` defaults to `Infinity`; WebGL clamps it to the instanced attributes' length (`geometry._maxInstanceCount`, `WebGLBindingStates.js:373, 415`), WebGPU passes it to `drawIndexed`, which throws a `TypeError` (the argument is `[EnforceRange] GPUSize32`). The throw leaves the frame mid-pass, and later pipelines in the same page fail with `structures must have at least one member`. `webgl_buffergeometry_instancing_interleaved` builds exactly this (an `InstancedMesh` of an `InstancedBufferGeometry` with an interleaved instanced attribute).

**Repro.** `const geometry = new InstancedBufferGeometry().copy( new BoxGeometry() ); const mesh = new InstancedMesh( geometry, new MeshBasicNodeMaterial(), 10 )`, render with `WebGPURenderer`: `drawIndexed` throws. Same for a plain `Mesh` of an `InstancedBufferGeometry` without `instanceCount` and one instanced attribute (WebGL draws the attribute's count).

**Fix.** Two steps, two PRs if maintainers prefer:
1. `object.isInstancedMesh === true` takes `object.count` first, as WebGL; `InstancedBufferGeometry.instanceCount` applies to other objects.
2. An `instanceCount` of `Infinity` is clamped to the smallest `meshPerAttribute * count` of the geometry's instanced attributes (and instanced interleaved buffers), as `_maxInstanceCount` in WebGL; with no instanced attribute the draw is skipped (`return null`, as for `count === Infinity` below it) instead of throwing.
PR: `RenderObject: Use the instance count of InstancedMesh with instanced geometries.` Check `webgpu_compute_cloth`, `webgpu_struct_drawindirect`, `GaussianSplat` and fat lines (`LineSegmentsGeometry` sets `instanceCount`), which use `InstancedBufferGeometry`.

**Workarounds.** BuffergeometryInstancingInterleaved: `geometry.instanceCount = instances` before creating the mesh.

## minmax-blend-factors: Min / Max blending needs One factors

**Cause.** WebGPU validates `GPUBlendComponent`: when `operation` is `"min"` or `"max"`, `srcFactor` and `dstFactor` must both be `"one"`. GL ignores the factors for `MIN` / `MAX`. `WebGPUPipelineUtils._getBlending` (`src/renderers/webgpu/utils/WebGPUPipelineUtils.js:570-586`) passes the material's factors through for `CustomBlending`, so a material with `blendEquation = MaxEquation` and the default factors (`SrcAlpha`, `OneMinusSrcAlpha`) fails `createRenderPipeline`. Only `webgl_materials_blending_custom` uses Min/Max upstream.

**Repro.** `new MeshBasicNodeMaterial( { blending: CustomBlending, blendEquation: MaxEquation, transparent: true } )` on a plane, rendered with `WebGPURenderer`: pipeline validation error, nothing drawn.

**Fix.** In the `CustomBlending` branch, set both factors of a component to `GPUBlendFactor.One` when its operation is `Min` or `Max`, for color and alpha separately (`blendEquationAlpha` can differ). Matches WebGL output, since GL ignores the factors.
PR: `WebGPUPipelineUtils: Use One factors for Min and Max blending.` Check `webgl_materials_blending_custom` under `WebGPURenderer` (all equation and factor combinations), and that the WebGL fallback backend is unaffected.

**Workarounds.** MaterialsBlendingCustom: `blendEquationChanged` sets `blendSrc` / `blendDst` to `OneFactor` for Min/Max; it goes back to the selected factors.

## cache-key-deprecated-accessor: every physical material warns about `iridescenceThicknessRange`

**Cause.** #35039 (2026-10-16, the fix of #35029: the range did not update and was shared between materials) replaced `MeshPhysicalMaterial.iridescenceThicknessRange` with `iridescenceThicknessMinimum` / `Maximum` and kept the old name as a deprecated accessor that calls `warnOnce` (`src/materials/MeshPhysicalMaterial.js:607-620`). `RenderObject.getMaterialCacheKey()` builds the key from `getKeys( material )`, which collects the material's own keys and every getter on its prototype chain (`src/renderers/common/RenderObject.js:7`, cached per constructor since #33805), so it reads the deprecated getter. The first `MeshPhysicalMaterial` (or `MeshPhysicalNodeMaterial`) any `WebGPURenderer` draws logs `MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by ...`, once per page. Not in r186; in the dev build io links (seen in LoaderUsdz, ComputeCloth, Clearcoat, AnimationRetargeting, SkinningInstancingIndividual, Loader3dm: stack `get iridescenceThicknessRange` ← `RenderObject.getMaterialCacheKey` ← `getCacheKey` ← `new RenderObject`).

**Repro.** Draw a mesh with `new MeshPhysicalNodeMaterial()` with `WebGPURenderer` on dev: the warning appears though nothing uses the old name.

**Fix.** Skip the alias where the key is built: add `iridescenceThicknessRange` to the properties `getMaterialCacheKey` ignores (the regex next to `visible|version|uuid|...`), with a `@deprecated r187` comment. The key already sees `iridescenceThicknessMinimum` / `Maximum`, and numbers only reduce to on/off there. A general rule (skip accessors that only forward to other properties) has no signal to rely on; this is the only deprecated material accessor today. Remove the skip with the alias.
PR: `RenderObject: Ignore deprecated iridescenceThicknessRange in the material cache key.` Check that no warning is logged for physical materials, and that changing `iridescenceThicknessMinimum` still updates (#35029's repro).

**Workarounds.** None in io: the renderer reads the property. Examples that set the range (none of ours) would move to the new properties on the next three upgrade.

## velocity-per-view: velocity tracks objects, not views

**Cause.**
- **Per-object storage.** `VelocityNode.update` (`src/nodes/accessors/VelocityNode.js:111-152`, dev `d94661f706`) copies `getPreviousMatrix( object )` into `previousModelWorldMatrix` before each draw of an object. `updateAfter` (`:159-161`, `updateAfterType = OBJECT`) overwrites it with `object.matrixWorld` after each draw. The matrix lives in the object's node data (`getData( object )`), whatever the camera.
- **Consequence.** A second camera that draws the object in the same frame reads the matrix the first draw just wrote, so its velocity shows no object motion. A view that skipped frames gets the motion since any camera's last draw, not since its own, while its history is its own.
- **What is unaffected.** The camera half is kept per camera and frame (`cameraData.frameId`), and skinning shifts previous bone matrices once per skeleton and frame (`Skinning.js:243-262`). So only object motion is lost.
- **Scope.** Single-view pages never see this. Several views or passes with velocity per frame do: an editor's viewports, or a TRAA pass plus a second velocity pass with another camera.

**Repro** (headless, dev build `d94661f706`):
- Two `pass( scene, camera )` with `mrt( { output, velocity } )` and two cameras look at a box moved 0.1 per frame. Both pipelines render each frame.
- The pass rendered first reads velocity.x 0.0476 at the box; the second reads 0. Swapping the order swaps them, and one pass alone reads 0.0476.
- In io's demo host (Front, Right and Top TRAA views on screen, one sphere moved), only the view drawn first had velocity: 3895 pixels against 0 and 0.
- A sphere moving at constant speed smears under TRAA in the later views. Mean pixel difference was 4.97 on the sphere against 0.83 elsewhere, compared with the same view drawn first.

**Fix.** Key the previous matrix by object and camera, shift it once per frame and camera, and drop `updateAfter`:
```js
update( { frameId, camera, object } ) {

	const entry = getPreviousEntry( object, camera ); // { frameId, previous, current }, both start at object.matrixWorld

	if ( entry.frameId !== frameId ) {

		entry.frameId = frameId;
		entry.previous.copy( entry.current );
		entry.current.copy( object.matrixWorld );

	}

	this.previousModelWorldMatrix.value.copy( entry.previous );

	// camera matrices as before

}
```
- **Storage.** A `WeakMap` keyed by camera in the object's data, since cameras come and go.
- **Behavior change.** The previous matrix is the one this camera drew last. So a view that skipped frames reprojects across them, as its history does.
- **Same-frame redraws.** Two velocity passes with one camera in the same frame shift once.
- **PR:** `VelocityNode: Track previous object matrices per camera.`
- **Check:** `webgpu_postprocessing_traa`, `_motion_blur`, `_ssr` and `_ssgi`, and XR (one `ArrayCamera` per frame).

**Workarounds.** io (2026-10-22, `velocity-per-view` in [three_effects.plan.md](./three_effects.plan.md)):
- **The node.** `ViewVelocityNode` / `viewVelocity` (`packages/three/src/render/ViewVelocityNode.ts`) is a `VelocityNode` subclass with the fix's logic, one instance shared by the TRAA views.
- **Where it is used.** The demo host's TRAA writes it in its MRT and names it as TRAA's context `velocity`, which TRAA un-jitters. The README and SKILL.md show the same.
- **When to remove it.** A canary in `ViewVelocityNode.test.ts` fails once three tracks previous matrices per camera. Then remove the node and use `velocity` again (demo host, README, SKILL.md).

## Triage (not planned)

- **triage-cube-envmap-loading:** a `CubeTexture` still loading, set as a standard material's `envMap`, binds a 2D placeholder as a cube in the PMREM path and fails validation until it loads (the sources race the same way). Workarounds: MaterialsDisplacementmap adds the head once the cube map loads; Marchingcubes assigns the env maps in the load callback.
- **triage-fragment-node-mrt:** a material with `fragmentNode` writes only the first color output, and an MRT pass (TRAA views: color and velocity) rejects its pipeline. `outputNode` is merged with the MRT. Upstream materials that set `fragmentNode`: `LightProbeHelperGPU`, `LightProbeGridHelper`, `LDrawConditionalLineNodeMaterial`. Could be a fix in the addons (use `outputNode`) or in the MRT handling. Workarounds: LightprobeCubecamera (`useBasicMaterial`, its probe helper being content), LoaderLdraw (`ConditionalLineMaterial`). Checked 2026-10-20: `LightProbeGridHelper`'s own material fails validation in the TRAA views. Since 2026-10-21 the editor's probe helpers overlay draws `LightProbeHelperGPU` and `LightProbeGridHelper` in the overlay pass, which has no MRT, with their own materials: Lightprobe, Lightprobes, LightprobesComplex, LightprobesSponza and GeneratorCity no longer author helpers, nor need the workaround.
- **triage-materialx-compile-async:** `webgpu_loader_materialx` rendered from the sources (dev `d94661f706`, headless Chromium on Metal) logs about 360 WebGPU validation errors while its samples load: `[CommandEncoder "renderContext_0"] is already finished`, `Parent encoder of [Invalid RenderPassEncoder] is already finished`. The page awaits `renderer.compileAsync( model, camera, scene )` per sample while `setAnimationLoop` keeps rendering, which likely interleaves two passes on one encoder. Not investigated; the conversion (LoaderMaterialx) does not precompile and logs none.
