---
name: three.js Example Conversion
overview: Index and rules for converting three.js examples to Document subclasses in packages/three/src/demos/examples. Converted examples (each with a sidecar <Name>Example.md), their open items, TODO by blocker and not candidates; tags, blockers, workflows (convert, sync with three.js, remove a workaround), the sidecar format, the conversion rules and a log of batches.
todos:
  - id: crossfade-state
    content: "Skinning blending examples: show which crossfade or base action applies (upstream disables or dims buttons)"
    status: pending
  - id: inspector-refresh
    content: "Replace debug-only dispatchMutation in onAnimate (inspector stops following in bundled builds)"
    status: pending
  - id: framing-scenery
    content: "Whole-scene framing (first show, frame all) includes skies and large floors; examples frame their model instead. Skip unselectable scenery in the framework?"
    status: pending
  - id: blocker-document-pipeline
    content: "Unblock: a document brings its own post-processing graph and scene inputs (MRT). See Blockers"
    status: pending
  - id: blocker-view-camera
    content: "Unblock: content bound to the drawing camera (CSM, pass() in a material, camera layers)"
    status: pending
  - id: blocker-renderer-option
    content: "Unblock: stencil on the shared renderer; renderer.lighting, VSM, shadowMap.transmitted per document?"
    status: pending
  - id: framing-motion
    content: "First-show framing uses the bounds at rest; content that moves beyond them (AnimationKeys) leaves the frame"
    status: pending
  - id: occlusion-recheck
    content: "Recheck Occlusion with two views on the linked build (#35066) and close the Open item in its sidecar; the WebGPU notes' occlusion paragraph then describes r186 only"
    status: pending
  - id: r187-followups
    content: "Once r187 is released: load the dev-branch assets from threejs.org (MaterialsEnvmapsFasthdr, LoaderMaterialx, LoaderGltfDiffuseRoughness, LoaderJpegxl: raw.githubusercontent.com/mrdoob/three.js/dev), raise the peer range to >=0.187.0. With @types/three 0.187: drop the @ts-expect-error imports (ProxyNodeMaterial, JXLLoader) and the casts for Light.registerNode, Texture.isPMREMTexture, ReferenceNode.element(), materialReference(). InstancingMorph still calls renderer.library.addLight() (deprecated in r187: SunLight.registerNode)"
    status: pending
  - id: remove-workarounds
    content: "As each three_upstream_fixes.plan.md fix reaches the linked three build, remove its workaround from the examples whose sidecars list it under Workarounds (Workflows, Remove a workaround)"
    status: pending
  - id: upstream-port
    content: "Port the upstream source changes that sidecars list under Upstream as not ported yet (2026-10-21 baseline: LoaderGltf, the camera fit's Math.tan from #34585)"
    status: pending
  - id: scene-camera-helpers
    content: "Helpers the sources show as visuals come from overlays, which the Scene Camera view does not draw: LoaderBvh shows nothing (its bare skeleton), LightsRectarealight and MaterialsEnvmapsBpcem lack their glowing area-light panels. Either the Scene Camera view draws light and skeleton helpers, or examples whose helpers are the subject author them as content"
    status: pending
  - id: cull-follows-camera
    content: "CustomFog: the forest cull centre is the active camera's position, copied once in the constructor. The camera is in the scene since 2026-10-21 (to see whether the forest follows it), and moving it leaves the trees and the shadow map as they were. Copy the position in onBeforeDraw and refresh the shadow map when it changes, or take the camera out of the scene again"
    status: pending
isProject: false
---

# three.js Example Conversion

three.js examples converted to `Document` subclasses in `examples/<Name>Example.ts`, which `IoEditorExample.ts` opens in one shared editor (index.html Demos > Three). This plan is the index (what is converted, open, TODO, not a candidate), the blockers and tags, the workflows, the sidecar format and the conversion rules. Each converted example's own record is its sidecar `examples/<Name>Example.md`: how it differs from its source, its upstream workarounds, open items, upstream sync state and history. The vocabulary is in [CONTEXT.md](CONTEXT.md); upstream bugs and their fixes are in [three_upstream_fixes.plan.md](../../../../.cursor/plans/three_upstream_fixes.plan.md). Background: `io-gui.mdc` (io-three: Document, Editor, View), [ADR-0002](../../docs/adr/0002-app-view-frame-layers.md), the three SKILL.

The earlier `ThreeApplet` + `IoThreeExample` element pattern was replaced on 2026-10-10 (`289e7bf9`). Until 2026-10-21 this plan was `.cursor/plans/three_example_conversion.plan.md`, with a per-example Audit table that the sidecars replaced.

## Converted

<!-- examples.mjs:converted -->
231 examples; each has its sidecar `examples/<Name>Example.md`.

- **Animation** (9): AnimationGroups, AnimationKeyframes, AnimationKeys, AnimationMultiple, AnimationRetargeting, AnimationRetargetingReadyplayer, AnimationSkinningAdditiveBlending, AnimationSkinningBlending, AnimationSkinningMorph
- **Backdrop** (2): Backdrop, BackdropArea
- **Buffergeometry** (8): Buffergeometry, BuffergeometryDrawrange, BuffergeometryIndexed, BuffergeometryInstancingInterleaved, BuffergeometryLines, BuffergeometryLinesIndexed, BuffergeometryPoints, BuffergeometryPointsInterleaved
- **Camera** (1): Camera
- **Clearcoat** (1): Clearcoat
- **Clipping** (3): Clipping, ClippingAdvanced, ClippingIntersection
- **Compute** (9): ComputeBirds, ComputeCloth, ComputeParticles, ComputeParticlesFluid, ComputeParticlesRain, ComputePoints, ComputeTexture, ComputeTexture3d, ComputeWater
- **Cubemap** (3): CubemapAdjustments, CubemapDynamic, CubemapMix
- **Custom** (1): CustomFog
- **Equirectangular** (1): Equirectangular
- **Fog** (1): FogHeight
- **Gaussian** (1): GaussianSplat
- **Generator** (2): GeneratorBuilding, GeneratorCity
- **Geometries** (1): Geometries
- **Geometry** (15): GeometryColors, GeometryColorsLookuptable, GeometryConvex, GeometryCube, GeometryExtrudeShapes, GeometryExtrudeSplines, GeometryLoft, GeometryMinecraft, GeometryNurbs, GeometryShapes, GeometryTeapot, GeometryTerrain, GeometryText, GeometryTextShapes, GeometryTextStroke
- **Helpers** (1): Helpers
- **Instance** (5): InstanceMesh, InstancePath, InstancePoints, InstanceSprites, InstanceUniform
- **Instancing** (4): InstancingDynamic, InstancingMorph, InstancingPerformance, InstancingScatter
- **Lensflares** (1): Lensflares
- **Lightprobe** (2): Lightprobe, LightprobeCubecamera
- **Lightprobes** (3): Lightprobes, LightprobesComplex, LightprobesSponza
- **Lights** (12): LightsCustom, LightsHemisphere, LightsIesSpotlight, LightsPhong, LightsPhysical, LightsPointlights, LightsProjector, LightsRectarealight, LightsSelective, LightsSpotlight, LightsSpotlights, LightsSunlight
- **Lines** (4): LinesColors, LinesDashed, LinesFat, LinesFatWireframe
- **Loader** (49): Loader3dm, Loader3ds, Loader3mf, Loader3mfMaterials, LoaderAmf, LoaderBvh, LoaderCollada, LoaderColladaKinematics, LoaderColladaSkinning, LoaderDraco, LoaderFbx, LoaderFbxNurbs, LoaderGcode, LoaderGltf, LoaderGltfAnisotropy, LoaderGltfAvif, LoaderGltfCompressed, LoaderGltfDiffuseRoughness, LoaderGltfDispersion, LoaderGltfInstancing, LoaderGltfIridescence, LoaderGltfSheen, LoaderGltfTransmission, LoaderGltfVariants, LoaderJpegxl, LoaderKmz, LoaderLdraw, LoaderMaterialx, LoaderMd2, LoaderMdd, LoaderNrrd, LoaderObj, LoaderPcd, LoaderPdb, LoaderPly, LoaderStl, LoaderSvg, LoaderTextureDds, LoaderTextureExr, LoaderTextureHdr, LoaderTextureKtx2, LoaderTextureTga, LoaderTextureTiff, LoaderTextureUltrahdr, LoaderTtf, LoaderUsdz, LoaderVox, LoaderVrml, LoaderXyz
- **Lod** (1): Lod
- **Marchingcubes** (1): Marchingcubes
- **Materials** (30): Materials, MaterialsAlphahash, MaterialsArrays, MaterialsBasic, MaterialsBlending, MaterialsBlendingCustom, MaterialsBumpmap, MaterialsCar, MaterialsCubemap, MaterialsCubemapMipmaps, MaterialsCubemapRefraction, MaterialsDisplacementmap, MaterialsEnvmaps, MaterialsEnvmapsBpcem, MaterialsEnvmapsExr, MaterialsEnvmapsFasthdr, MaterialsEnvmapsGroundprojected, MaterialsEnvmapsHdr, MaterialsLightmap, MaterialsMatcap, MaterialsModified, MaterialsNodeProxy, MaterialsNormalmap, MaterialsNormalmapObjectSpace, MaterialsPhysicalTransmissionAlpha, MaterialsRetroreflection, MaterialsSss, MaterialsTextureRotation, MaterialsToon, MaterialsTransmission
- **Materialx** (1): MaterialxNoise
- **Math** (1): MathOrientationTransform
- **Mesh** (1): MeshBatch
- **Mirror** (1): Mirror
- **Modifier** (3): ModifierCurve, ModifierEdgesplit, ModifierSimplifier
- **Morphtargets** (4): Morphtargets, MorphtargetsFace, MorphtargetsHorse, MorphtargetsSphere
- **Occlusion** (1): Occlusion
- **Ocean** (1): Ocean
- **Panorama** (1): PanoramaCube
- **Parallax** (1): ParallaxUv
- **Particles** (2): Particles, ParticlesSoft
- **Pmrem** (3): PmremCubemap, PmremEquirectangular, PmremScene
- **Points** (3): PointsBillboards, PointsSprites, PointsWaves
- **Procedural** (1): ProceduralTexture
- **Reflection** (3): Reflection, ReflectionBlurred, ReflectionRoughness
- **Refraction** (1): Refraction
- **Sandbox** (1): Sandbox
- **Shadow** (1): ShadowContact
- **Shadowmap** (5): Shadowmap, ShadowmapArray, ShadowmapPerformance, ShadowmapPointlight, ShadowmapProgressive
- **Skinning** (4): Skinning, SkinningInstancing, SkinningInstancingIndividual, SkinningPoints
- **Sky** (1): Sky
- **Sprites** (1): Sprites
- **Textures** (3): Textures2dArray, Textures2dArrayCompressed, TexturesPartialupdate
- **Tonemapping** (1): Tonemapping
- **Tsl** (11): TslAngularSlicing, TslComputeAttractorsParticles, TslEarth, TslGalaxy, TslHalftone, TslOcclusionDither, TslProceduralTerrain, TslRagingSea, TslVfxFlames, TslVfxTornado, TslWood
- **Volume** (2): VolumeCloud, VolumePerlin
- **Watch** (1): Watch
- **Water** (1): Water
<!-- /examples.mjs -->

## Open on converted examples

Open items and workarounds, from the sidecars' Open and Workarounds sections. Ids are todos of this plan, Blockers, or todos of the upstream plan.

<!-- examples.mjs:open -->
| Example | Open | Workarounds |
|---|---|---|
| [AnimationKeys](examples/AnimationKeysExample.md) | `framing-motion` |  |
| [AnimationSkinningAdditiveBlending](examples/AnimationSkinningAdditiveBlendingExample.md) | `crossfade-state`, `inspector-refresh` |  |
| [AnimationSkinningBlending](examples/AnimationSkinningBlendingExample.md) | `crossfade-state` |  |
| [Backdrop](examples/BackdropExample.md) | `inspector-refresh` |  |
| [BuffergeometryDrawrange](examples/BuffergeometryDrawrangeExample.md) |  | `dynamic-usage` |
| [BuffergeometryInstancingInterleaved](examples/BuffergeometryInstancingInterleavedExample.md) |  | `instanced-mesh-instance-count` |
| [Camera](examples/CameraExample.md) | `inspector-refresh` |  |
| [CustomFog](examples/CustomFogExample.md) | `cull-follows-camera` |  |
| [FogHeight](examples/FogHeightExample.md) | `shared-refresh` |  |
| [GaussianSplat](examples/GaussianSplatExample.md) | `document-pipeline` |  |
| [GeneratorCity](examples/GeneratorCityExample.md) |  | `triage-fragment-node-mrt` |
| [GeometryLoft](examples/GeometryLoftExample.md) | `framing-scenery` |  |
| [InstancingMorph](examples/InstancingMorphExample.md) | `r187-followups`, `framing-scenery` |  |
| [Lightprobe](examples/LightprobeExample.md) | `shared-refresh` | `triage-fragment-node-mrt` |
| [LightprobeCubecamera](examples/LightprobeCubecameraExample.md) |  | `triage-fragment-node-mrt` |
| [Lightprobes](examples/LightprobesExample.md) |  | `triage-fragment-node-mrt` |
| [LightprobesComplex](examples/LightprobesComplexExample.md) |  | `triage-fragment-node-mrt` |
| [LightprobesSponza](examples/LightprobesSponzaExample.md) | `r187-followups` | `triage-fragment-node-mrt` |
| [LightsRectarealight](examples/LightsRectarealightExample.md) | `scene-camera-helpers` |  |
| [LightsSunlight](examples/LightsSunlightExample.md) | `r187-followups` |  |
| [LoaderBvh](examples/LoaderBvhExample.md) | `scene-camera-helpers` |  |
| [LoaderGltf](examples/LoaderGltfExample.md) | `upstream-port` |  |
| [LoaderGltfDiffuseRoughness](examples/LoaderGltfDiffuseRoughnessExample.md) | `r187-followups` |  |
| [LoaderJpegxl](examples/LoaderJpegxlExample.md) | `r187-followups` |  |
| [LoaderLdraw](examples/LoaderLdrawExample.md) |  | `triage-fragment-node-mrt` |
| [LoaderMaterialx](examples/LoaderMaterialxExample.md) | `r187-followups` |  |
| [LoaderSvg](examples/LoaderSvgExample.md) | `r187-followups` |  |
| [LoaderTextureDds](examples/LoaderTextureDdsExample.md) |  | `#35084` |
| [Marchingcubes](examples/MarchingcubesExample.md) |  | `mesh-count`, `dynamic-usage`, `triage-cube-envmap-loading` |
| [MaterialsAlphahash](examples/MaterialsAlphahashExample.md) | `document-pipeline` |  |
| [MaterialsBlendingCustom](examples/MaterialsBlendingCustomExample.md) |  | `minmax-blend-factors` |
| [MaterialsDisplacementmap](examples/MaterialsDisplacementmapExample.md) |  | `triage-cube-envmap-loading` |
| [MaterialsEnvmapsBpcem](examples/MaterialsEnvmapsBpcemExample.md) | `scene-camera-helpers` |  |
| [MaterialsEnvmapsFasthdr](examples/MaterialsEnvmapsFasthdrExample.md) | `r187-followups` |  |
| [MaterialsNodeProxy](examples/MaterialsNodeProxyExample.md) | `r187-followups` |  |
| [MaterialsNormalmap](examples/MaterialsNormalmapExample.md) | `document-pipeline` |  |
| [MaterialsTextureRotation](examples/MaterialsTextureRotationExample.md) | `shared-refresh` |  |
| [MaterialsToon](examples/MaterialsToonExample.md) | `document-pipeline` |  |
| [MorphtargetsFace](examples/MorphtargetsFaceExample.md) | `inspector-refresh` |  |
| [Occlusion](examples/OcclusionExample.md) | `occlusion-recheck` |  |
| [Reflection](examples/ReflectionExample.md) | `document-pipeline` |  |
| [Shadowmap](examples/ShadowmapExample.md) | `framing-scenery` |  |
| [SkinningInstancing](examples/SkinningInstancingExample.md) | `document-pipeline` |  |
| [Water](examples/WaterExample.md) | `document-pipeline` |  |
<!-- /examples.mjs -->

## TODO

45 candidates wait for a blocker (Blockers). Sorted through `d94661f706` (2026-10-20): every upstream example up to that commit is converted, here, or under Not candidates; `examples.mjs upstream` lists newer ones.

### `document-pipeline` (29)

| Example | Source | Note |
|---|---|---|
| PointsDynamic | `webgl_points_dynamic` | the post chain is part of the subject |
| TslVfxLinkedparticles | `webgpu_tsl_vfx_linkedparticles` |  |
| ComputeParticlesSnow | `webgpu_compute_particles_snow` | collision target as in Rain |
| VolumeFire | `webgpu_volume_fire` |  |
| CustomFogBackground | `webgpu_custom_fog_background` | fog composed in post |
| CustomFogScattering | `webgpu_custom_fog_scattering` |  |
| BackdropWater | `webgpu_backdrop_water` | the underwater mask is post |
| PostprocessingAo | `webgpu_postprocessing_ao` |  |
| PostprocessingBloom | `webgpu_postprocessing_bloom` |  |
| PostprocessingBloomEmissive | `webgpu_postprocessing_bloom_emissive` | needs an emissive MRT output |
| PostprocessingBloomSelective | `webgpu_postprocessing_bloom_selective` | per-object bloom flag via MRT; click toggling dropped |
| PostprocessingDof | `webgpu_postprocessing_dof` |  |
| PostprocessingDofBasic | `webgpu_postprocessing_dof_basic` | click-to-focus dropped |
| PostprocessingFog | `webgpu_postprocessing_fog` |  |
| PostprocessingGodrays | `webgpu_postprocessing_godrays` | needs the light from the scene |
| PostprocessingLensflare | `webgpu_postprocessing_lensflare` |  |
| PostprocessingOutline | `webgpu_postprocessing_outline` | overlaps the selection outline overlay |
| PostprocessingSsgi | `webgpu_postprocessing_ssgi` |  |
| PostprocessingSsgiBallpool | `webgpu_postprocessing_ssgi_ballpool` | pointer pushing dropped |
| PostprocessingSsr | `webgpu_postprocessing_ssr` |  |
| PostprocessingSsrDenoise | `webgpu_postprocessing_ssr_denoise` |  |
| PostprocessingSss | `webgpu_postprocessing_sss` |  |
| Oit | `webgpu_oit` |  |
| VolumeLighting | `webgpu_volume_lighting` |  |
| VolumeLightingRectarea | `webgpu_volume_lighting_rectarea` |  |
| VolumeLightingTraa | `webgpu_volume_lighting_traa` |  |
| VolumeCaustics | `webgpu_volume_caustics` | also `renderer-option`; `shadowMap.transmitted` |
| Vxgi | `webgpu_vxgi` |  |
| VxgiSponza | `webgpu_vxgi_sponza` |  |

### `renderer-option` (8)

| Example | Source | Note |
|---|---|---|
| ClippingStencil | `webgpu_clipping_stencil` | needs `stencil: true` |
| LightsDynamic | `webgpu_lights_dynamic` | `renderer.lighting = new DynamicLighting()` |
| LightsClustered | `webgpu_lights_clustered` | `renderer.lighting` (clustered); FXAA dropped |
| LightsClusteredCity | `webgpu_lights_clustered_city` | `renderer.lighting = new ClusteredLighting( 2048 )` (post-r186, 2026-10-16); its bloom would be the document's; traffic and light animation from time; the camera tour as an animated active camera |
| ShadowmapOpacity | `webgpu_shadowmap_opacity` | `shadowMap.transmitted` |
| ShadowmapVsm | `webgpu_shadowmap_vsm` | `shadowMap.type = VSMShadowMap` |
| Shadowmesh | `webgl_shadowmesh` | `ShadowMesh` writes stencil |
| Caustics | `webgpu_caustics` | `shadowMap.transmitted` |

### `view-camera` (3)

| Example | Source | Note |
|---|---|---|
| ShadowmapCsm | `webgpu_shadowmap_csm` | `CSMShadowNode` splits one camera's frustum |
| Portal | `webgpu_portal` | the portal material is `pass(scenePortal, camera)` with the main camera |
| Layers | `webgpu_layers` | toggles the camera's layers |

### `dependency` (5)

| Example | Source | Note |
|---|---|---|
| LoaderGltfAnimationPointer | `webgl_loader_gltf_animation_pointer` | `KHR_animation_pointer` through `@needle-tools/three-animation-pointer` |
| GeometryCsg | `webgl_geometry_csg` | `three-bvh-csg` |
| ModifierSubdivision | `webgl_modifier_subdivision` | `three-subdivide` (the source maps it to the CDN in its import map) |
| LoaderIfc | `webgl_loader_ifc` | `web-ifc` |
| LoaderVdb | `webgl_loader_vdb` | `three-vdb-loader` (post-r186, 2026-10-16); threshold / range / opacity / steps re-run the volume material |

## Tags

Traits that examples share, set in each sidecar's `tags`. A tag says when to revisit the examples that carry it; `check` accepts only the tags in this table.

| Tag | Trait | Revisit when |
|---|---|---|
| `live` | live document (ADR-0009): builds state from interaction or simulation, integrates positive `delta` only | `onAnimate` learns why time changed (`timeline-negative-delta`) |
| `per-frame-gpu` | GPU work in `onBeforeDraw` on every draw: compute, captures, renders into targets (ADR-0010) | the hook or the render scheduler changes |
| `renderer-on-change` | GPU work redone per renderer after an edit (a version the hook compares) | the same |
| `timeline-time` | TSL `time` replaced by `timeline.timeNode`, or by `overrideNode( time, ... )` in addon materials | three's `time` or the Timeline changes |
| `loop-jump` | motion that does not repeat within the timeline, so it jumps at the wrap | seamless loops are wanted |
| `pointer-dropped` | the source's pointer or keyboard interaction dropped, parked, or turned into a property, a button or the editor's tools | documents can take tools or operators |
| `stand-in-framing` | frames a detached stand-in (ADR-0012) | framing changes |
| `camera-in-scene` | the active camera is in the scene: the source adds it, or a light rides it | ADR-0011 changes |
| `moving-camera` | the active camera moves with document time | `lockCameraToView` (ADR-0005) lands |
| `verify-per-view` | content updated for the drawing camera (`onBeforeRender`, LOD, reflectors, splat sorting, occlusion queries) | views or the renderer change: check with two views |
| `types` | casts or `@ts-expect-error` for `@types/three` gaps | `@types/three` is upgraded |

<!-- examples.mjs:tags -->
- `live` (12): AnimationSkinningAdditiveBlending, AnimationSkinningBlending, AnimationSkinningMorph, ComputeBirds, ComputeCloth, ComputeParticles, ComputeParticlesFluid, ComputeParticlesRain, ComputePoints, ComputeWater, TexturesPartialupdate, TslComputeAttractorsParticles
- `per-frame-gpu` (19): ComputeBirds, ComputeCloth, ComputeParticles, ComputeParticlesFluid, ComputeParticlesRain, ComputePoints, ComputeTexture3d, ComputeWater, CubemapDynamic, GeneratorCity, InstancePoints, LightprobesSponza, MaterialsEnvmapsBpcem, ShadowContact, ShadowmapProgressive, SkinningInstancingIndividual, Sky, TexturesPartialupdate, TslComputeAttractorsParticles
- `renderer-on-change` (9): CustomFog, GeneratorBuilding, GeneratorCity, Lightprobes, LightprobesComplex, LightprobesSponza, LightsSunlight, MaterialsEnvmapsGroundprojected, Ocean
- `timeline-time` (33): AnimationRetargeting, Backdrop, BackdropArea, ComputeCloth, ComputeTexture3d, CubemapMix, CustomFog, GeneratorBuilding, GeneratorCity, InstanceMesh, InstancePath, InstancePoints, InstanceSprites, LightsPointlights, LightsProjector, MaterialsModified, MaterialsNodeProxy, MaterialxNoise, Ocean, Particles, ParticlesSoft, PointsWaves, Reflection, ReflectionBlurred, ReflectionRoughness, Sandbox, SkinningInstancing, Sky, Textures2dArray, TslGalaxy, TslRagingSea, TslVfxFlames, TslVfxTornado
- `loop-jump` (22): AnimationMultiple, Backdrop, BuffergeometryDrawrange, ComputeTexture3d, CustomFog, InstanceMesh, InstancePath, InstanceSprites, LightsProjector, Marchingcubes, MaterialxNoise, Ocean, Particles, ParticlesSoft, Reflection, ReflectionBlurred, SkinningInstancing, Sky, TslGalaxy, TslOcclusionDither, TslVfxFlames, TslVfxTornado
- `pointer-dropped` (21): ComputeBirds, ComputeParticles, ComputeParticlesFluid, ComputePoints, ComputeWater, GeometryColors, GeometryNurbs, GeometryShapes, GeometryText, InstanceSprites, LinesColors, LoaderTtf, MaterialsBasic, MaterialsCubemapRefraction, ModifierCurve, PointsBillboards, PointsSprites, PointsWaves, ShadowmapProgressive, TslComputeAttractorsParticles, TslProceduralTerrain
- `stand-in-framing` (19): ComputeCloth, ComputeParticles, ComputeParticlesFluid, ComputeParticlesRain, ComputePoints, ComputeTexture3d, CubemapDynamic, GaussianSplat, GeometryTerrain, InstancePoints, LightsIesSpotlight, LightsRectarealight, LightsSpotlights, LoaderBvh, LoaderMaterialx, LoaderMdd, MorphtargetsSphere, Reflection, SkinningInstancingIndividual
- `camera-in-scene` (26): Backdrop, CustomFog, Geometries, GeometryColorsLookuptable, GeometryConvex, GeometryShapes, Loader3mf, Loader3mfMaterials, LoaderAmf, LoaderGltfCompressed, LoaderKmz, LoaderNrrd, LoaderObj, LoaderPcd, LoaderPdb, LoaderVox, LoaderVrml, LoaderXyz, MaterialsDisplacementmap, MaterialsNormalmapObjectSpace, MaterialsRetroreflection, MaterialsTextureRotation, ModifierSimplifier, Morphtargets, Skinning, SkinningInstancing
- `moving-camera` (8): CubemapDynamic, GeneratorBuilding, GeometryExtrudeSplines, Helpers, InstancingMorph, InstancingPerformance, MeshBatch, Reflection
- `verify-per-view` (10): GaussianSplat, Lensflares, LightsSunlight, LoaderVrml, Lod, MeshBatch, Mirror, Occlusion, Refraction, TslOcclusionDither
- `types` (9): ComputeParticlesFluid, InstanceUniform, LightprobesSponza, LightsSunlight, LoaderJpegxl, Materials, MaterialsEnvmapsFasthdr, MaterialsNodeProxy, MaterialxNoise
<!-- /examples.mjs -->

## Not candidates

Every `src_examples` source sorted against What fits (611 files at HEAD, 608 at r186; 615 at HEAD on 2026-10-20, the four new sources sorted in). Selection rules:

- An example with both a `webgl_*` and a `webgpu_*` version converts from the `webgpu_*` one. Renamed twins count too: `webgl_gpgpu_birds` -> `webgpu_compute_birds`, `gpgpu_water` -> `compute_water`, `materials_physical_clearcoat` -> `clearcoat`, `materials_physical_transmission` -> `materials_transmission`, `materials_subsurface_scattering` -> `materials_sss`, `shaders_ocean` -> `ocean`, `shaders_sky` -> `sky`, `materials_cubemap_dynamic` -> `cubemap_dynamic`, `texture2darray(_compressed)` -> `textures_2d-array(_compressed)`, `materials_texture_partialupdate` -> `textures_partialupdate`, `materials_texture_anisotropy` -> `textures_anisotropy`, `rendertarget_texture2darray` -> `rendertarget_2d-array_3d`, `panorama_equirectangular` -> `equirectangular`, `video_panorama_equirectangular` -> `video_panorama`, `postprocessing_unreal_bloom(_selective)` -> `postprocessing_bloom(_selective)`, `postprocessing_sao / ssao / gtao` -> `postprocessing_ao`, `postprocessing_taa` -> `postprocessing_traa`.
- `webgl_*` / `misc_*` only: kept when the scene stands on its own once the host-provided parts are dropped. GLSL (`ShaderMaterial`, `onBeforeCompile`) is rewritten in TSL only when the shader is small and not the subject.
- **The conversion does not change `@io-gui/three`** (or the demo host beyond its `DOCUMENTS` entry). An example that needs a framework feature or fix stays TODO with its tag in **Blocked by** (see Blockers below) until that work is done. Bloom of the scene color is the document's `bloom` (Map). Other cosmetic post-processing (vignette, blur, FXAA, emissive bloom) is dropped and noted, so the scene converts now; the full look waits for `document-pipeline`.
- "Verify per view" marks content that updates itself for the drawing camera (`onBeforeRender`, LOD, reflectors, splat sorting, occlusion queries): it should work through any view, but check it with two views open before calling the example done.

Not candidates:

- **Out of scope** (as asked): `webxr_*`, `webgpu_xr_*`, `css2d_*`, `css3d_*`, `svg_*`, plus `physics_*` (external engines stepping in wall-clock time), `webaudio_*`, `games_fps`, `index`.
- **WebGL twins** of the webgpu examples above (81 by name, plus the renamed ones under the selection rules).
- **Renderer-level or renderer tests**: `camera_logarithmicdepthbuffer`, `reversed_depth_buffer`, `centroid_sampling`, `multisampled_renderbuffers`, `hdr`, `compile_async`, `furnace_test`, `pmrem_test`, `test_memory`, `webgl_test_memory2`, `webgl_test_wide_gamut`, `performance`, `performance_renderbundle`, `multiple_canvas`, `display_stereo`, `webgl_effects_*`, `webgl_worker_offscreencanvas`, `webgl_buffergeometry_glbufferattribute`, `webgl_clipculldistance`, `webgl_ubo`, `webgl_ubo_arrays`, `webgl_read_float_buffer`, `webgpu_renderer_pathtracer` (post-r186), `webgl_loader_priority` (post-r186: fetch priorities and their timings in the DOM; its one model is LoaderGltf's).
- **Custom render loops, render targets, split screens**: `depth_texture`, `rtt`, `multiple_elements`, `webgl_multiple_elements_text`, `multiple_rendertargets(_readback)`, `webgl_multiple_scenes_comparison`, `webgl_multiple_views`, `rendertarget_2d-array_3d`, `webgl_framebuffer_texture`, `mrt`, `mrt_mask`, `deferred`, `webgl_simple_gi`, `texturegather`, `texturegrad`, `materials_texture_manualmipmap`, `textures_anisotropy`, `webgl_materials_texture_filters`, `webgl_shadowmap_viewer`, `storage_buffer`, `struct_drawindirect`, `compute_reduce`, `compute_sort_bitonic`, `compute_rasterizer(_ibl)`, `compute_texture_pingpong`, `shadertoy`, `tsl_interoperability`.
- **Screen-space filters**: these are view pipelines (`pipelineTypes.register` in the host), not documents: `postprocessing`, `postprocessing_3dlut`, `_afterimage`, `_anamorphic`, `_ca`, `_difference`, `_direct`, `_fxaa`, `_masking`, `_motion_blur`, `_pixel`, `_radial_blur`, `_retro`, `_smaa`, `_sobel`, `_ssaa`, `_transition`, `_traa`, `upscaling_fsr1`, `upscaling_taau`; webgl only: `postprocessing_advanced`, `_backgrounds`, `_glitch`, `_procedural`, `_rgb_halftone`, `_dof2`.
- **Interaction is the subject** (tools and operators): `misc_boxselection`, `misc_controls_*`, `misc_raycaster_helper`, `webgl_animation_skinning_ik`, `webgl_animation_walk`, `webgl_decals`, `webgl_geometry_spline_editor`, `webgl_geometry_terrain_raycast`, `webgl_interactive_*`, `webgl_instancing_raycast`, `lines_fat_raycasting`, `webgl_math_obb`, `webgl_modifier_curve_instanced`, `webgl_raycaster_*`, `sculpt`, `webgl_materials_texture_canvas`, `webgl_loader_md2_control`, `compute_geometry`, `webgl_buffergeometry_selective_draw`, `webgl_batch_lod_bvh`.
- **DOM, media, editors**: `materials_texture_html`, `materials_video`, `webgl_materials_video_webcam`, `webgl_morphtargets_webcam`, `video_frame`, `video_panorama`, `webgl_video_kinect`, `compute_audio`, `webgl_loader_texture_lottie`, `webgl_loader_imagebitmap`, `misc_uv_tests`, `tsl_editor`, `tsl_transpiler`, `tsl_graph`.
- **GLSL is the subject** (TSL counterparts exist among the webgpu examples): `webgl_buffergeometry_attributes_integer`, `_attributes_none`, `_custom_attributes_particles`, `_instancing`, `_instancing_billboards`, `_rawshader`, `webgl_custom_attributes*`, `webgl_materials_channels`, `webgl_materials_cubemap_render_to_mipmaps`, `webgl_materials_wireframe`, `webgl_modifier_tessellation`, `webgl_random_uv`, `webgl_shader`, `webgl_shader_lava`, `webgl_texture2darray_layerupdate`, `webgl_texture3d`, `webgl_texture3d_partialupdate`, `webgl_volume_instancing`, `webgl_gpgpu_birds_gltf`, `webgl_gpgpu_protoplanet`, `webgl_shadowmap_pcss` (patches `ShaderChunk`).
- **Exporters** (`misc_exporter_*`): export buttons over a sample scene; export is editor I/O, not document content.
- **Camera-driven streaming** (external libraries): `webgl_loader_3dtiles`, `webgl_loader_gltf_progressive_lod`.
- **Duplicates**: `webgl_tsl_clearcoat`, `webgl_tsl_shadowmap`, `webgl_tsl_skinning`, `webgl_tsl_instancing` (TSL on `WebGLRenderer` through `WebGLNodesHandler`; same content as `clearcoat`, `shadowmap`, `skinning`, `instancing_performance`), `webgl_buffergeometry_uint` (as `buffergeometry`), `webgl_loader_texture_ktx` and `_pvrtc` (legacy formats; `loader_texture_ktx2` covers them).

Removed: CameraLogarithmicDepthBuffer (renderer-level option, see What fits); CameraArray (runtime multi-view, see What fits; 2026-10-13).

## Blockers

Features or fixes outside the examples. Each one unblocks the rows tagged with it; until then those stay TODO.

- **`document-pipeline`**: a document cannot bring a post-processing graph. Pipelines are registered by the host (`pipelineTypes.register` in `IoEditorExample.ts`) and picked per `View.pipeline` (ADR-0006). Needed: a document-declared builder (`PostProcessingBuilder`) that views use, plus scene inputs it can read (MRT outputs such as emissive or a per-object bloom flag, the scene's lights). Also unblocks the full look of rows that drop cosmetic post. Bloom of the scene color is covered since 2026-10-16 by `Document.bloom` with a per-view override (`document-bloom` in the future-work plan); emissive bloom is not (`bloom-emissive`).
- **`per-frame-gpu`** (resolved 2026-10-18): GPU work every tick (`renderer.compute`, `CubeCamera.update`, renders into targets). Served by `Document.onBeforeDraw(renderer, delta)` ([ADR-0010](../../docs/adr/0010-documents-do-frame-gpu-work-before-views-draw.md)); see GPU work per frame. Its examples carry the tag.
- **`renderer-on-change`** (resolved 2026-10-20): GPU work after a property edit (rebake light probes, regenerate a sky environment). Served by `onBeforeDraw` without framework changes: the handler bumps a version and the hook redoes the work per renderer. Its examples carry the tag.
- **`view-camera`**: content bound to the camera that draws it: `CSMShadowNode` (one camera's frustum), `pass(scene, camera)` inside a material (Portal), camera layers (Layers). Views build their camera per draw (ADR-0005), so the document has no camera to bind. Needed: a per-view hook, or nodes that read the drawing camera.
- **`renderer-option`**: the shared renderer (`RenderScheduler.ts`: `{antialias: false, alpha: true}`) has no stencil buffer (three defaults `stencil` to `false`), and `renderer.lighting`, `shadowMap.type = VSMShadowMap` and `shadowMap.transmitted` are renderer-wide (ADR-0001). Needed: enable stencil on the shared renderer, or a renderer a document can ask for.
- **`three-upgrade`** (resolved 2026-10-20): sources that exist only after r186 convert against the linked r187dev build (Sources; todo `r187-followups`).
- **`dependency`**: needs an npm package the workspace does not have (`three-bvh-csg`, `web-ifc`, `three-subdivide`, `@needle-tools/three-animation-pointer`).
- **`shared-refresh`** (three, since #34162 in r186; worked around): `NodeMaterialObserver.needsRefresh` gives an unchanged object whose material has no node properties a SHARED refresh, which uploads only shared uniform groups (`renderGroup`, `frameGroup`). A default `uniform()` is in `objectGroup`: read by a scene node (`fogNode`, `environmentNode`), its new value never reaches such objects until they or their material change. TRAA views write velocity and refresh fully, so only forward views go stale (FogHeight fog controls; CubemapMix reflections froze at their first time). Workaround: `setGroup(renderGroup)` (Map table; `Timeline.timeNode` since 2026-10-13). Standalone repro on the dev build: a plane with `MeshBasicNodeMaterial({color})` under `fogNode = fog(color, density)` keeps its first pixels after `density.value` changes, and updates with `renderGroup`. Upstream's own `webgpu_fog_height` and `webgpu_cubemap_adjustments` are stale too (checked headlessly 2026-10-14; bisected to #34162). Upstream fix three.js #34996 (merged 2026-10-14, Mugen87 cleanup `c5e5061ed0`, in the dev build `ca10fb69aa`): `NodeMaterialObserver.containsNode()` treats a custom `scene.fogNode` / `scene.environmentNode` like material node properties. FogHeight dropped its workaround on 2026-10-14; recheck it on dev (io links `../three.js`). Once a release has it, the `Timeline.timeNode` workaround can go too. Second gap, same cause (2026-10-14): built-in state the observer does not track, so changes never reach unchanged objects: texture `offset`/`repeat`/`rotation`/`center`/`matrix` (MaterialsTextureRotation), `refractionRatio`, `clearcoatRoughnessMap`, `thicknessMap`, in-place `iridescenceThicknessRange` edits. PR #35002 (closed 2026-10-14): Mugen87 asked for step-by-step fixes and issues first, and merged the three missing properties himself as #35022 (2026-10-15). Still broken on dev `ec2b7458ea`: texture transforms and `iridescenceThicknessRange`, plus three found by a property sweep: `LightProbe` `sh`/`intensity` (object-group uniform, regression in r186), `Sprite.center` and standard `envMap` (both bound to the first object or material that built the shader, older than r186). Issue kits https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz (2026-10-15).
- **`transmission-views`** (not reproducible 2026-10-20): transmission materials logged `Destroyed texture ... used in a submit` while several views redrew; four views playing and resizing are clean on three 0.186.1 and on the r187dev build.

## Open questions

- **`interactive-timeline`** (decided 2026-10-11, ADR-0009): live documents treat the timeline as a clock and ignore time going back. Considered: recording button presses on the timeline and replaying them, which is exact under scrubbing but makes the demo authored content. Follow-up: pass the cause of a time change to `onAnimate` (`timeline-negative-delta` in the future-work plan).
- **`inspector-refresh`**: Camera, Backdrop and the skinning examples call `dispatchMutation(...)` in `onAnimate` inside `debug:` blocks so the inspector follows per-frame values. Bundles strip debug blocks, so bundled builds stop refreshing. Alternative: the host refreshes the Document tab on `time` changes.
- **`framing-motion`**: First-show framing uses the scene's bounds at rest. AnimationKeys' box travels 30 units from a 5-unit start, so the perspective view loses it; the conversion keeps the source camera as a scene camera. Option: a document-declared framing box, or `frame-object` with several objects / a box.
- **`framing-scenery`**: First-show framing and frame-all use the whole scene's bounds, so a sky dome or a large floor dwarfs the subject. Documents name their model with `getEditorFrameTarget()` (ADR-0012; it replaced the `frame-object` event, which views in unopened tabs missed). Axis views still see enclosing scenery from outside (GeometryLoft's curtain). Option: framing skips `userData.selectable === false` scenery.

## Workflows

The tool is `node packages/three/scripts/examples.mjs` (from anywhere in the repository): `check` (sidecars, code, this plan and `../three.js` agree), `index` (rewrites this plan's generated blocks) and `upstream` (upstream commits each sidecar has not reviewed).

### Convert an example

1. Read the source at `../three.js` HEAD (Sources) and list its scene content, animation, async loads, GUI, cameras and helpers, and renderer settings (tone mapping, shadows).
2. Write `examples/<Name>Example.ts` following the conversion rules, and add it to `DOCUMENTS` in `IoEditorExample.ts`.
3. Run the typecheck, lint and tests (`io-gui.mdc`), then check it (Checking a conversion).
4. Write the sidecar (Sidecars): `source`, `synced` (`git -C ../three.js rev-parse --short=10 HEAD`), Deviations, any Workarounds and Open, and History "Converted (<batch>). Checked: ...".
5. Delete its TODO row, then run `index` and `check`.

### Sync with three.js

1. Pull `../three.js` `dev` and rebuild its `build/` (Sources).
2. Run `upstream`: per example the commits after `synced` that touch its source or `watch` files, sources removed upstream, and examples added after the TODO section's sorted-through commit.
3. Per listed example: read `git -C ../three.js diff <synced>..HEAD -- examples/<source>.html`, port or decline each commit, record it under Upstream (commit, PR, disposition), update Deviations, add History "Synced to `<sha>`: ...", and move `synced`. A change to port later is recorded as not ported yet, with the Open item `upstream-port`.
4. Sort new upstream examples into TODO (with a blocker) or Not candidates, and move the sorted-through commit.
5. Run `upstream --bump-unchanged`, which moves `synced` to HEAD for sidecars without upstream commits. Open all documents in one page, since the build changed under every example. Run `index` and `check`.

### Remove a workaround

Once its fix is in the linked build (`three_upstream_fixes.plan.md`):

1. Find the sites: the Open table above, or `grep -l '<id>' packages/three/src/demos/examples/*.md`. Each site in code carries a `Workaround (upstream: <id>)` comment.
2. Restore the code as the bullet's **Restore** says, delete the comment, and recheck the example (Perspective and Front views, its controls, all documents in one page).
3. Move the bullet to History ("Workaround removed: `<id>`, #<PR>"), then run `index` and `check`. Complete the upstream plan's todo once no sidecar names the id.

## Sidecars

Each converted example has a sidecar `examples/<Name>Example.md` next to its `.ts`. No build reads them: ESLint lints `**/*.ts`, Vite pre-scans `**/*.ts`, `tsc` emits `.ts` only, and npm publishes `/dist/`.

### Frontmatter

Flat YAML (scalars and one-line lists), so `examples.mjs` reads it without a YAML library:

```yaml
---
source: webgl_marchingcubes
synced: d94661f706
tags: [loop-jump]
watch: [examples/jsm/shaders/ToonShader.js]
---
```

- `source`: the three.js example converted, `examples/<source>.html`.
- `synced`: the `../three.js` commit through which upstream changes to `source` (and `watch`) are reviewed: each change before it was ported, or is recorded under Upstream as declined or not ported yet. Deviations compare the example with the source at this commit.
- `tags` (optional): traits from the Tags table. Ids of open items and workarounds are not tags; they lead their bullets in Open and Workarounds.
- `watch` (optional): other upstream files whose code was copied or ported into the example rather than imported (Marchingcubes ports `ToonShader.js` to TSL). Imported addons come from the linked build and need no watch.

### Body

Deviations and History always; the other sections only with content, in this order.

- `# <Name>`, then one line: the source linked to `https://threejs.org/examples/#<source>`, and when (in which batch) it was converted.
- `## Deviations`: how the example differs from its source now, one bullet per difference led by a short bold label (Time, Controls, Camera, Environment, Dropped, ...), with the reason where it is not obvious: a rule here, an ADR, a WebGPU limit. Present tense, current state only. A deviation is what someone comparing the two side by side would notice, or a structural change that matters when porting an upstream change (where the source's code went). Leave out what every example does by these rules (the Drop list, the active camera, asset URLs, notifying after loads, scene graph names, framing) unless it has a consequence here (a stand-in, a camera in the scene), and what the example does as the source does. "None." when nothing is left.
- `## Workarounds`: code that differs because of an upstream bug, one bullet per site: the fix id or PR, what the code does and where, then **Restore:** the source's code. Mirrors the `Workaround (upstream: <id>)` comments; `check` compares the two.
- `## Open`: unfinished work, one bullet per item led by its id: a todo of this plan or a blocker. A new item gets a pending todo here.
- `## Upstream`: upstream commits to `source` after the version first converted, each with its disposition (ported, declined and why, not applicable, not ported yet), and upstream issues or PRs about the example, with when they were filed and merged.
- `## Related`: examples to read together, with the relation (`[Lightprobes](LightprobesExample.md): the same grid bake`). A TODO example has no sidecar to link: name it and say in words why it is not converted yet, with its blocker id.
- `## History`: dated entries, oldest first, appended and never rewritten: `- 2026-10-20: Converted (batch 5) ...`. Each starts with a verb (Converted, Checked, Fixed, Changed, Synced, Filed, Workaround added, Workaround removed), and Checked entries name the three build when known. A deviation that stops being true moves here with the change that ended it; fixes to io's own earlier port and check results are History, not Deviations. Refactors that change neither what the example shows nor how it differs from its source get no entry.

Style: plain and factual, one unwrapped line per bullet so diffs stay per item.

### Boundaries

- The class docblock says what the document shows and how to drive it; the sidecar says how and why it differs from its source and what happened to it. If they disagree, the code is right and the sidecar is fixed in the same change.
- Code comments stay where the code needs them, including `Workaround (upstream: <id>)`.
- A TODO example has no sidecar; its note is its TODO row. A sidecar may start early when research outgrows the row; `check` accepts a sidecar without a `.ts` only for an example in TODO.

## Sources

- `packages/three/src_examples` is a tracked symlink to `../../../three.js/examples`, a local three.js **dev checkout** that runs ahead of the release. `packages/three/node_modules/three` links the same checkout, the linked build (r187dev since 2026-10-20), while the package's peer range and `@types/three` are still **0.186**.
- Convert from the source at the checkout's HEAD and record that commit as the sidecar's `synced`. r187-only APIs are typed with casts or `@ts-expect-error` imports, and assets that reach threejs.org only with r187 load from the dev branch on raw.githubusercontent.com (todo `r187-followups`). Examples converted before 2026-10-20 started from r186 (`148ef33ecb`; the checkout has no r183 to r186 tags, `git -C ../three.js fetch --tags` would add them), and their sidecars record the upstream changes since.
  - `git -C ../three.js show <commit>:examples/<file>.html` (the source at a commit)
  - `git -C ../three.js log --oneline <synced>..HEAD -- examples/<file>.html` (changes not reviewed yet)
- Rebuild `../three.js` after pulling: its committed `build/` can lag its `examples/jsm` addons (2026-10-20: the build predated #34936, and every addon loader threw `loader.setPriority is not a function`). Upstream also reverts: the skinning sources used `SunLight` at r186 and went back to `DirectionalLight` after it.
- After upgrading `three`, restart `pnpm dev`. Vite checks the lockfile only at startup and serves the old pre-bundled three until then.
- `webgl_*` and `misc_*` sources convert too: classic materials run on `WebGPURenderer` through the node library. See the WebGPU notes for the cases that do not.

### What fits

A source fits when it has one scene that any view can show. These do not fit:

- Renderer-level options (`logarithmicDepthBuffer`, `reversedDepthBuffer`, MSAA samples) are fixed per renderer ([ADR-0001](../../docs/adr/0001-webgpu-only-one-renderer-canvas-target-per-viewport.md)). `CameraLogarithmicDepthBufferExample`, which compares renderers with and without `logarithmicDepthBuffer`, was removed (`bcadcea1`).
- A custom render loop (scissor split screens, several passes per frame, `renderer.setRenderTarget` chains) belongs in a pipeline (ADR-0006), not in a document.
- Runtime multi-view rendering (`ArrayCamera` grids, as in WebXR stereo or quilt displays) has no authoring workflow, and a view looking through a scene camera draws one camera ([ADR-0005](../../docs/adr/0005-navigation-is-view-state-camera-built-per-draw.md)). `CameraArrayExample` was removed (2026-10-13). A view-owned `ArrayCamera` that scaled the grid onto the camera frame was built and reverted: it added a second camera (`contentCamera`) to the pipeline context that every pipeline and overlay had to choose between, for one example. The two cameras are the same object in every other document, so wrong choices would go unnoticed, and three's TRAA and velocity use only the main camera, so the cells smeared in TRAA views. Revisit only if a real document needs an ArrayCamera preview; a contained version would lay out the cells inside the forward pipeline.
- Pointer or keyboard interaction (raycast drags, key handlers) belongs to tools and operators. A document only gets property controls.

## Target shape

```ts
import { Mesh, NeutralToneMapping, WebGPURenderer } from 'three/webgpu'
import { uniform } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds in which the animation repeats: the timeline length, so looping is seamless. */
const PERIOD = 20

/** What the scene shows, where its controls are. Plays when opened. */
@Register
export class XxxExample extends Document {
  private amountUniform = uniform(0.5)
  public mesh: Mesh

  @Property({type: Number, value: 0.5})
  declare amount: number

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})
    // scene content: named objects added to this.scene
  }

  amountChanged() {
    this.amountUniform.value = this.amount
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    // compute passes, PMREM environments
  }

  override onAnimate(delta: number, time: number) {
    this.mesh.rotation.y = time / PERIOD * Math.PI * 2
  }
}

registerEditorConfig(XxxExample, [
  ['amount', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(XxxExample, {
  Main: ['amount'],
})
```

Register it in `DOCUMENTS` in `IoEditorExample.ts`:

```ts
XxxExample: () => import('./examples/XxxExample.js').then(module => new module.XxxExample()),
```

Naming: drop the `webgl_` / `webgpu_` / `misc_` prefix and PascalCase the rest (`webgpu_backdrop_area.html` -> `BackdropAreaExample.ts`, class `BackdropAreaExample`).

## Conversion rules

### Drop (the host provides it)

- HTML, CSS, info text, WebGPU availability checks, `Stats`.
- Renderer creation and setup: `antialias`, pixel ratio, size, `setAnimationLoop`, `await renderer.init()`, `renderer.shadowMap.enabled` (the shared renderer has shadows on, `RenderScheduler.ts`).
- Resize handlers and anything that reads `window` or the DOM (a document opens in any editor). Views own camera aspect.
- `OrbitControls` and other camera controls: views navigate and frame the scene.
- `Timer` / `Clock`: the timeline is the clock.
- `AxesHelper` / grids: the grid overlay.

### Map

| Source | Document |
|---|---|
| `renderer.toneMapping`, `renderer.toneMappingExposure` | `super({toneMapping, toneMappingExposure})`. Easy to miss: views present with the document's tone mapping, and exposure does nothing under `NoToneMapping`. |
| `scene.background`, `backgroundNode`, `fog`, `environment` | the same on `this.scene` |
| `init()` | constructor body after `super()` |
| module globals | public fields (internal state) or `@Property` (user-facing controls) |
| `renderer.compute(...)`, `new PMREMGenerator(renderer)` | `onRendererInitialized(renderer)`: runs once per renderer before its first draw of the document |
| `renderer.compute(...)`, `cubeCamera.update(...)`, renders into targets in `animate()` | `onBeforeDraw(renderer, delta)` (see GPU work per frame) |
| `animate()` with `Date.now()` or elapsed time | `onAnimate(delta, time)` deriving state from `time` |
| `mixer.update(timer.getDelta())` | `mixer.update(delta)` in `onAnimate` |
| TSL `time`, `oscSine()` (implicit `time`) | `this.timeline.timeNode`, for example `oscSine(this.timeline.timeNode)`. An addon material that reads `time` itself (`SkyMesh` clouds, `WaterMesh` waves): `material.contextNode = overrideNode( time, this.timeline.timeNode )` |
| `uniform()` read by a scene node (`fogNode`, `environmentNode`) | `uniform().setGroup(renderGroup)`. A per-object uniform reaches the GPU only on a full refresh of its object; objects whose materials have no node properties get shared refreshes only, so the change never shows in forward views (TRAA views refresh fully for velocity). `timeline.timeNode` is shared already (see `shared-refresh` under Blockers) |
| The source's main camera (`camera`: projection, position, `lookAt` or the controls' `target`, `up`) | `this.activeCamera` ([ADR-0011](../../docs/adr/0011-documents-name-an-active-camera.md)): a camera named `Camera` with the source's fov or frustum, near, far, position and orientation, and aspect `400 / 250` (the reference screenshots), so the Scene Camera view reproduces the source's framing. Keep it out of the scene unless the source adds it there. Several cameras: the one the source renders the main view with; a source toggle between cameras (`animationView`) becomes a property that sets `activeCamera`. Cameras that are content (rigs, a camera riding a path) stay in the scene |
| Light attached to the camera (`camera.add(light)`; the source adds the camera to the scene) | the same: the active camera in the scene with the light on it |
| Relative asset path `models/gltf/X.glb` | `https://threejs.org/examples/models/gltf/X.glb` |
| `dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG)` | the same: the decoder resolves next to three's `DRACOLoader.js` (Vite rewrites the URL when pre-bundling; the bundle keeps three external) |
| `Sky` + `pmremGenerator.fromScene(sky)` | an unselectable `SkyMesh` in the scene, plus a second one in a `Scene` of its own for `fromScene` in `onRendererInitialized` (AnimationKeyframes). `SkyMesh` drifts its clouds on TSL's global `time`, so set `cloudSpeed` to 0 unless they should move; clouds that move follow the timeline with `sky.material.contextNode = overrideNode( time, this.timeline.timeNode )` (Sky, Ocean, GeneratorBuilding, GeneratorCity). A 10000-unit sky dominates whole-scene bounds: frame the model with `frame-object` |
| Several viewports or scissor halves | scene cameras, seen through camera view tabs |
| `ColorManagement.workingColorSpace = SRGBColorSpace` (global) | convert the content's colors to the working space instead: `material.colorNode = colorSpaceToWorking( colorNode, SRGBColorSpace )` (GaussianSplat) |
| `scenePass.add( bloom( scenePass, strength, radius, threshold ) )` (bloom of the scene color) | `super({bloom: new Bloom({enabled: true, strength, radius, threshold})})`: the document's bloom, drawn by views that follow it (`View.bloom`; in the demo host the Scene Camera view). Bloom of an emissive MRT output has no equivalent yet (`bloom-emissive`, Water) |
| `KTX2Loader.detectSupport( renderer )` | in `onRendererInitialized`, loading from there; `dispose()` the loader once loaded (three warns about several active KTX2 loaders) |
| Keyboard switches (`O` / `P` keys) | properties |

GUI (`lil-gui`, `Inspector.createParameters`) becomes properties and groups:

| GUI control | Document |
|---|---|
| slider or checkbox on a uniform | `@Property` + `xChanged()` writing `uniform.value` |
| slider on an object field (`gui.add(box.scale, 'x')`) | expose the object as a public field with a config (`boxScale` + `threeVector3`) |
| dropdown | `String` `@Property` + `ioOptionSelect(new Menu({options}))` config + `xChanged()` |
| button | arrow-function field (`run = () => {...}`), shown as a button (`ioButton` config for a label) |
| visibility checkbox (`show model`, `show helpers`) | `Boolean` `@Property` setting `.visible` |
| `.listen()` display of values that change per frame | expose the object; see the `inspector-refresh` todo |

### Time

- Time drives animation (`io-gui.mdc`). Derive state from `time` with a period equal to (or dividing) `timeline.duration`, so loops are seamless (`SPIN_PERIOD` in Geometries, GeometryConvex; `ORBIT_PERIOD` in Camera).
- Integrators (animation mixers) advance by `delta`. For a single clip, set `timeline.duration = clip.duration` and `mixer.setTime(timeline.currentTime)` when the clip arrives.
- No wall-clock timing in a document: no `setTimeout`, `Date.now()`, `performance.now()` or `Timer`. Schedule in timeline or mixer time; mixer fades already run on `mixer.time`.
- Animated examples pass `new Timeline({autoplay: true})`; static ones keep the default (paused).
- `delta` is negative when the timeline wraps or is scrubbed back (accepted, see `timeline-negative-delta` in [three_future_work.plan.md](../../../../.cursor/plans/three_future_work.plan.md)).
- Live documents ([ADR-0009](../../docs/adr/0009-live-documents-use-the-timeline-as-a-clock.md)): game-like content whose state builds up from interaction (the skinning blending demos) uses the timeline only as a clock. It integrates only positive `delta` (`if (delta > 0) mixer.update(delta)`), so wraps and scrubbing back neither rewind nor reset it. Pause and frame step come from the editor's transport; no per-document pause or step properties.

### GPU work per frame

`onBeforeDraw(renderer, delta)` ([ADR-0010](../../docs/adr/0010-documents-do-frame-gpu-work-before-views-draw.md)) runs once per frame and renderer before the views of that renderer draw the document's changes, or draw it for the first time. Navigation, resize and overlay redraws do not run it. `delta` is the time played forward since it last ran for that renderer: 0 for scrubbing back, a loop wrap or a property edit.

- Simulations (compute integrators) are live (ADR-0009): step by `delta`, so they pause with the editor and never rewind.
  - Sources that step once per frame (fixed per-frame velocities, `1/60` steps) keep a remainder per renderer and run one step per whole source frame (60 per second): `WeakMap<WebGPURenderer, number>` of leftover time (ComputeParticles, TslComputeAttractorsParticles, ComputeParticlesRain, ComputeWater; 360 steps per second in ComputeCloth). Cap the time per draw (`MAX_DELTA`, 1/15 s, or the source's own cap) so scrubbing forward does not stall.
  - Sources that pass the frame's `deltaTime` take `delta` itself, capped as the source caps it (ComputeBirds, ComputeParticlesFluid). A linear step can scale instead (ComputePoints).
  - TSL `deltaTime` and `time` inside a simulation become uniforms the hook advances (ComputeParticlesRain); `time` that only animates becomes `timeline.timeNode` (ComputeCloth's wind).
- GPU work that is a function of time (sizes, noise from `time`) runs on every call, whatever `delta`, so scrubbing shows it exactly (InstancePoints, ComputeTexture3d).
- Captures and renders into targets (`CubeCamera.update`, depth from below, collision heights) run on every call: they follow any change, including edits (CubemapDynamic, MaterialsEnvmapsBpcem, ShadowContact). Save and restore the renderer around a render into a target with `RendererUtils.resetRendererState` / `restoreRendererState`; restore objects hidden for a capture to their own visibility.
- Move objects in `onAnimate`, from `time`; the hook runs after the scene is evaluated. A simulation that collides with a moving object interpolates toward its posed position over a draw's steps (ComputeCloth's sphere).
- Initialize simulation buffers in `onRendererInitialized` (`renderer.compute( init )`), not in a compute node's `onInit`, which waits for the first step: a paused document would show uninitialized buffers.
- Edits that need GPU work (regenerate a sky environment, re-bake light probes, convert an equirect to a cube map) bump a version in the property handler; the hook compares it with what each renderer last made and redoes the work, with `delta` 0 (LightsSunlight, CustomFog, Ocean, GeneratorBuilding: PMREM `fromScene` with a `PMREMGenerator` per renderer, reusing the target with `{ renderTarget }` where the source does; Lightprobes, LightprobesComplex: a bake per renderer and grid; MaterialsEnvmapsGroundprojected: `fromEquirectangularTexture` once per renderer). `scene.environment` holds one texture, so with several renderers the last one's wins, as with PMREMs from `onRendererInitialized`.
- Probe grids that the source bakes over frames bake a slice per hook call and notify until the last pass is done, with progress per renderer that edits restart (LightprobesSponza 16 probes, GeneratorCity one row). Objects hidden for a bake (helpers, the city for its box proxy, a sun disc) are restored to their own state.
- Buttons that do GPU work (`hit`, `reset`) count presses; the hook applies the presses each renderer has not applied yet (ComputeParticles, TslComputeAttractorsParticles).
- Progressive work notifies from the hook to run again next frame, and stops when settled: ShadowmapProgressive accumulates for two blend windows after any change, and restarts when its light origin or model moves.
- GPU state lives per renderer. Content bound to one renderer at construction (`ProgressiveLightMap`) serves the first renderer only.
- Sources' pointer interaction is dropped. Park what it drives where it has no effect (ComputeBirds' ray far from the flock, ComputeParticlesFluid's zero force), or turn it into a button (ComputeParticles' `hit`) or a selectable object (TslComputeAttractorsParticles' attractors, ShadowmapProgressive's `Light Origin`).

### Async content

- Content added outside a transaction (loaded models) needs `this.notify({kind: 'structure'})`, or views and the scene graph miss it. A texture loaded in the background needs `this.notify({kind: 'material'})` in its load callback, because views draw only on changes.
- Framing (ADR-0012): override `getEditorFrameTarget()` to return what views frame, an object or an array; `null` (the default) frames the whole scene. Return the model once loaded (a `@Field(null) declare private _frameTarget: FrameTarget | null` set after loading): views that were not navigated frame again when the answer changes, so the camera does not open inside content that arrives (Lightprobe, MaterialsMatcap, MaterialxNoise). Content built in the constructor whose scenery dwarfs it (a large ground, an enclosing curtain) can return its subject from the start. Views update the scene's world matrices before they frame by themselves. Frame an extent (a two-point stand-in `Mesh`) inside enclosing scenery or fog: GeometryLoft frames its pedestals, so the perspective view opens inside the curtain; the fogged snow cubes frame ±400 of their 2000 units. Framing scales nothing: `View.overscan` adds the margin.
- Framing reads current morph influences. Content that morphs beyond its rest shape frames a detached stand-in instead, for example a `Mesh` whose geometry is just the two corners of the geometry's morph-inclusive `boundingBox` (LoaderMdd).
- A loader that returns before its textures arrive (`VRMLLoader`, `FBXLoader`, `ThreeMFLoader`, `ColladaLoader`) gets a `LoadingManager` whose `onLoad` calls `notify({kind: 'material'})`. A static document draws nothing until something changes, so the textures would stay black (LoaderVrml `meshWithTexture`). `GLTFLoader` resolves after its textures.
- A dropdown that reloads content (an `asset` or `file` property) counts its loads and drops a result that is no longer the latest (LoaderFbx, Loader3mf, LoaderVrml, LoaderGcode, LoaderSvg, LoaderPcd). Dispose the previous model's geometries and materials as the source does.
- Scenery the source keeps far away (VRML `Background` spheres, 10000 units, `depthTest: false`) lies beyond the views' far plane, which framing sets from the content's bounds (`FRAME_OVERFIT`). LoaderVrml redraws those spheres around each drawing camera in `onBeforeRender`. They also need explicit render orders: WebGPU sorted the ground sphere under the sky sphere.
- Instances placed on the GPU (`positionNode`, identity instance matrices) have the bounds of one instance: set the `InstancedMesh`'s `boundingBox` and `boundingSphere` to the content's extent, for framing and culling (TslGalaxy, InstancePath).
- Framing reads vertex positions (`expandByObject( object, true )`) except for `InstancedMesh` and `BatchedMesh`, which use their `boundingBox`. Content drawn on the GPU from one small geometry that is not an `InstancedMesh` (`Mesh.count` instances, `GaussianSplat`) frames a detached stand-in whose two vertices are the content's world corners (Reflection, GaussianSplat).
- Whole-scene framing can put the views beyond the fog: an `overscan` below 1 frames from inside the content (InstanceSprites' 2000-unit cube in `FogExp2( 0.001 )`).
- Content derived from other objects' transforms (curve handles) rebuilds on the document's `commit` event, which tool edits dispatch with their transaction even while paused, and checks for uncommitted (Inspector) edits in `onAnimate` (ModifierCurve).
- Fields used by `onAnimate` before the load finishes: a placeholder (`new AnimationMixer(new Group())`) or optional chaining (`this.mixer?.update(delta)`). Change handlers guard content that may not be loaded yet (`if (this.model)`).

### Scene graph and picking

- Name what the scene graph should show: the scene graph and inspector label rows by `name`, or by `<ClassName>` when there is none. Name lights by role (`Key`, `Ambient`).
- Do not rename loaded nodes that animation tracks address by name: the clip's tracks stop binding (`PropertyBinding: No target node found`). The horse's morph track targets `mesh_0`.
- `Object3D.copy` copies `name`: name an object again after copying generated content into it (`lightProbe.copy( LightProbeGenerator.fromCubeTexture( ... ) )`).
- `userData.selectable = false` on floors, backdrops and other scenery. It applies to descendants too.
- Do not author camera, light or skeleton helpers (`CameraHelper`, `PointLightHelper`, `RectAreaLightHelper`, `SkeletonHelper`, ...): the helper overlays draw them in every view for any document (`cameraHelpers` and `lightHelpers` on, `skeletonHelpers` off by default; `scene-helpers` in [three_future_work.plan.md](../../../../.cursor/plans/three_future_work.plan.md), ADR-0006). Drop the source's helpers and its `show helpers` / `show skeleton` toggles. A `SkeletonHelper` built only to collect bones (retargeting) stays, out of the scene. A model toggle hides the meshes, not the model root, so its skeleton still shows. Clipping planes of `ClippingGroup`s come from the `clippingHelpers` overlay: drop the source's `PlaneHelper`s and their toggle (ClippingIntersection). Helpers that are the subject (normal, tangent and box helpers) are content: a `Helpers` group, unselectable, toggled by `showHelpers`, added after the objects they follow.

### Properties and groups

- `registerEditorConfig` / `registerEditorGroups` go right after the class (`io-gui.mdc`, Editor Configs). `Main` lists the curated controls. `Hidden` lists public fields that are internal. The document's own groups (tone mapping, exposure, timeline, plus an `Advanced` catch-all) aggregate with the subclass's groups.
- The Document tab shows about ten characters of a property name: keep names short and distinct within that (MaterialsEnvmaps `rotateX` instead of `backgroundRotationX`; TslRagingSea keeps the source's `largeSpeed`, `smallFrequency`). A nested `ioObject` takes `labelWidth` (MorphtargetsFace blend shapes).
- Colors and vectors edited in place: a `@Property({type: Color, init: null})` (or `Vector2`) with an `xMutated()` that copies it into the material or uniform and calls `notify`. Plain public fields do not observe in-place edits, so a paused view would not redraw.
- Controls that depend on the loaded content (one per clip, one per morph target) cannot be dropdowns: editor configs are per class, and their menus are copied per object. Use a record property shown with `ioObject`. A record of functions shows a button per entry, for example clips (LoaderFbx `clips`). A record of accessors over the content shows a slider per entry, for example morph influences (LoaderFbx `morphs`, MorphtargetsFace `expressions`). Replace the record on each load.
- Many shader values: `reference( name, type, object )` nodes to the document's own properties need no change handlers, as in the sources that refer to a settings object (CubemapAdjustments). A group of settings repeated per layer is a small `ReactiveObject` subclass as a property, shown with `ioObject({expanded: true})`; its nodes refer to its properties, and the document's `xMutated()` notifies (TslHalftone `shade`, `highlight`).
- A dropdown of names fetched at runtime: editor configs copy their menus when the Document tab first shows, so fetch the names with a top-level `await` in the example's module, before the class registers its config (LoaderGltf `asset`, the Khronos sample index). A failed fetch falls back to one entry.
- Private fields show in the `Advanced` catch-all: list internal state (loaders, load counters, pending promises) in `Hidden`.
- Change handlers do not run for default values. They do run inside the base constructor for values passed in `args`, before subclass fields exist. Call `xChanged()` at the end of the constructor to apply the default, and keep the state that handlers touch in `declare`d or lazily created fields if args must work.

### WebGPU notes

- WebGPU points are 1 px. Use a `Sprite` with `PointsNodeMaterial({positionNode: instancedBufferAttribute(attribute)})` and `sprite.count` (GeometryConvex). A `Sprite`'s bounds, picking and frustum culling are one quad at its origin. When the points are the content (loaded clouds), keep the `Points`, which still draw 1 px points and are what picking and framing see. Add a child `InstancedMesh(new PlaneGeometry(1, 1), pointsMaterial, count)` named `Sprites` that draws the sized points: unselectable, with the cloud's `boundingBox` and `boundingSphere` (LoaderPcd, LoaderXyz). Generated clouds of up to half a million points use a child `Sprite` with `count` and `frustumCulled = false` instead, which needs no instance matrices (BuffergeometryPoints, PointsBillboards). Sizes follow WebGL: `sizeAttenuation` scales by half the view's height over depth.
- `PMREMGenerator` output in WebGPU is a cube texture, not WebGL's 2D CubeUV atlas: it cannot be a plane's `map` (the envmaps examples' `debug` plane, dropped). Generate PMREMs in `onRendererInitialized` once the source images have loaded. `fromEquirectangular`, `fromCubemap` and `fromScene` are synchronous there.
- `NoBlending` with `premultipliedAlpha` draws a texture's raw color where WebGL draws it premultiplied (black). Seen in MaterialsBlending's alpha flare row.
- Canvas textures built from a DOM canvas: draw on an `OffscreenCanvas` (`CanvasTexture<OffscreenCanvas>`), or cut images with `createImageBitmap(image, sx, sy, sw, sh)` (MaterialsBlending, PanoramaCube).
- Vertex attribute strides must be multiples of 4 bytes, so 3 × `Float16` is invalid; use `Float32Array` (GeometryColors).
- A material with `fragmentNode` writes only the first color output: the TRAA views' MRT pass (color and velocity) makes WebGPU reject its pipeline. `LightProbeHelperGPU` is one: Lightprobe and LightprobeCubecamera give the helper a `MeshBasicNodeMaterial` whose `colorNode` is the same irradiance. `LightProbeGridHelper` is another: Lightprobes, LightprobesComplex, LightprobesSponza and GeneratorCity reuse its `fragmentNode` as the `colorNode` of a `MeshBasicNodeMaterial` (checked 2026-10-20: the raw helper material makes the TRAA views fail validation). `outputNode` is fine (it is merged with the MRT).
- A standard material's `envMap` that is a `CubeTexture` still loading binds a 2D placeholder as a cube in the PMREM path and fails WebGPU validation until it loads (upstream; the source races the same way). Add the mesh once the cube map has loaded (MaterialsDisplacementmap).
- Addons built on `ShaderMaterial` (`Sky`, `Water`, `Reflector`) need their node versions (`SkyMesh`, `WaterMesh`, TSL `reflector()`).
- WebGPU allows 8 vertex buffers per pipeline. An `InstancedMesh` adds its instance matrix, and TRAA views a second one for velocity: geometry with four instanced attributes (Reflection's tree) stays `Mesh.count` instances.
- A compute pass inside a material (`positionNode = Fn( ... )().compute( count )`, SkinningPoints) builds its pipeline when it first runs. Inside a TRAA view's pass, skinning then sees the velocity output and refers to `positionPrevious`, which compute shaders lack. Run it once with `renderer.compute` outside the views' draws (from `onRendererInitialized` or the load callback, keeping the renderer): the pipeline is cached.
- Occlusion query results arrive after the draw that ran the query, and three keeps them per render context, which it shares between draws into targets of the same format and outputs whatever the camera (since r183, #32546). Views drawn alike overwrite each other's results, so `renderer.isOccluded` can return another view's result (Occlusion keeps the source's behavior and documents it). #35066 keeps the results per camera from the linked build on (`occlusion-recheck`; the Occlusion sidecar has the history).
- `alphaToCoverage` needs a multisampled target: it works in views with `View.msaa` (not TRAA views, whose pipeline ignores MSAA), and does nothing elsewhere (Clipping, ClippingIntersection).
- A mesh's `count` is its instance count in WebGPU. `MarchingCubes` keeps its vertex count in `count`, so each view drew it once per vertex: set `count = 1` after `update()`, whose draw range already holds the vertices (Marchingcubes; upstream `mesh-count`). An `InstancedMesh` whose geometry is an `InstancedBufferGeometry` draws `geometry.instanceCount` (Infinity by default, and `drawIndexed` throws): set it to the mesh's count (BuffergeometryInstancingInterleaved; upstream `instanced-mesh-instance-count`).
- `DynamicDrawUsage` attributes upload whole on every draw of every view, changed or not (`Attributes.js`). Big dynamic buffers stall the editor (MarchingCubes' 100000 polygons, Drawrange's million segments): keep them static and mark `needsUpdate` with update ranges over the drawn part (upstream `dynamic-usage`).
- A draw that throws leaves the renderer mid-pass: documents opened after it in the same page log `structures must have at least one member` for ordinary materials. When many documents fail alike, open each alone first.
- Compressed textures: since #35081 (mipmaps), #35082 (uncompressed data) and #35083 (`CompressedCubeTexture`), merged 2026-10-19, WebGPU takes compressed textures as the sources use them. DDS cube maps still load as 2D `CompressedTexture`s with six faces (#35084 in review): wrap the faces in a `CompressedCubeTexture` once loaded (LoaderTextureDds `cubeTexture`).
- `MinEquation` / `MaxEquation` need `One` factors in WebGPU, where WebGL ignores the factors: set them (MaterialsBlendingCustom; upstream `minmax-blend-factors`).
- 1 px `Points` that keep a `PointsMaterial.map` warn that the geometry has no `uv`: give the map to the sprites only (PointsBillboards, PointsSprites).
- The `fragmentNode` rule above holds for addon materials too: `LDrawConditionalLineNodeMaterial` gets a subclass that moves it to `outputNode` (LoaderLdraw).
- Framing reads children: a `Sprite` under a scaled mesh (glTF scale 100) frames as a 100-unit quad, so frame a stand-in (MorphtargetsSphere).
- Imports are named, from `three/webgpu` and `three/tsl`, with addons from `three/addons/...`. Bare `three` is aliased to `three/webgpu` (`vite.config.ts`).
- `@types/three` 0.186 is stricter than the JS sources:
  - `UniformNode<'float', number>` (node type and value type), `Node<'vec3'>` for typed nodes. Untyped `Node` has no math methods.
  - `Fn` infers its arguments from the annotated parameter: `Fn(([a, b]: [Node<'vec2'>, Node<'float'>]) => ..., {a: 'vec2', b: 'float', return: 'vec3'})`, with the layout as the second argument (the old `Fn<[Node, Node]>(...).setLayout(...)` no longer types).
  - Arguments are not converted implicitly: pass `normalWorldGeometry.xy` to a `vec2` input, and `color(c).rgb` to multiply with a `vec3`.
  - `bool(true)` instead of `true` in `assign()`.

## Checking a conversion

In `pnpm dev` (Demos > Three > Load Example): it renders and matches the source's look (tone mapping, background, lighting); scene graph names; Document tab controls; play, pause, scrub and loop; switching to another document and back; the Scene Camera view against `examples/screenshots/<source>.jpg`.

Headless Chromium with `--enable-unsafe-webgpu --enable-features=Vulkan,WebGPU --use-angle=metal` draws on the GPU, and `page.locator('three-viewport#Perspective').screenshot()` captures a view of the running editor (open a document by setting `documentName` on `io-editor-example`, pause with `editor.isPlaying = false`, change properties on `editor.document`). Without those flags it has a SwiftShader adapter and viewport screenshots come out blank. To check that a document compiles and draws, use the page's own three: import the `three.webgpu` URL listed in `performance.getEntriesByType('resource')` (a fresh `import('three/webgpu')` loads a second instance, and TSL then fails with "No stack defined"). Draw with the page's shared renderer (`threeViewport.renderer`) into a half-float `RenderTarget` (the headless canvas texture is invalid) inside `device.pushErrorScope('validation')`, apply the document's tone mapping with a `renderOutput` quad into an `rgba8` target, read the pixels back and save a PNG to compare with `examples/screenshots/<source>.jpg`. Pause and set the time first so the frame is reproducible. A second `WebGPURenderer` gives false results: lights' shadow nodes and the equirect-to-cube cache are shared across renderers (destroyed shadow maps, black equirect backgrounds). The hidden Scene Camera tab never switches document, so clone the document's scene camera instead of asking that view. New addon imports make Vite re-optimize and reload the page once. Backdrop materials report a format mismatch in an `rgba8` target; that comes from the harness, not the document.

## Log

Batches and passes. Each example's sidecar has its own History.

| Date | What | Examples | Checked |
|---|---|---|---|
| 2026-10-10 | The examples became `Document`s (`289e7bf9`), replacing the `ThreeApplet` + `IoThreeExample` element pattern | 14 | |
| 2026-10-11 | Audit against r186 and HEAD; live documents (ADR-0009); the first batch | 14 audited, 27 converted | compiles and renders on r186 without WebGPU validation errors; renders through the page's shared renderer at a fixed time against `examples/screenshots` |
| 2026-10-13 | Batch; `dolly-far` (the far plane moves with the eye); `Timeline.timeNode` in the render group (`shared-refresh`); helper overlays (`scene-helpers` in the future-work plan) | 25 | in the editor, headless Chromium on the GPU: renders, scene graph names, Document tab controls while paused, no console errors |
| 2026-10-14 | Batch of `webgl_*` loaders and materials (branch `examples-webgl`) | 30 | as 2026-10-13, and all 30 in one page without console errors |
| 2026-10-15 | Batch of `webgpu_*` lights, shadows, probes, materials, TSL | 30 | renders against `examples/screenshots`, controls while paused, all in one page |
| 2026-10-15 | Batch 2: the verify-per-view and dropped-post rows, KTX2, fat lines | 30 | as the first, Perspective and Front views |
| 2026-10-16 | `Document.bloom` with `View.bloom`, `View.msaa`, the clipping helpers overlay | | |
| 2026-10-17 | Batch 3 | 39 | renders (Perspective and Front), every Document tab control headlessly, all in one page |
| 2026-10-18 | Batch 4 on `Document.onBeforeDraw` (ADR-0010); `three_upstream_fixes.plan.md`, compressed textures filed as #35081 to #35084 | 16 | as batch 3, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back) |
| 2026-10-19 | Active cameras (ADR-0011): every example names its source's camera; frame targets (ADR-0012) | 211 | the Scene Camera view of all 211 against `examples/screenshots` |
| 2026-10-20 | Batch 5: renderer-on-change, transmission and post-r186 rows on the linked r187dev build `d94661f706`; three glTF rows completed | 20 | the active view against `examples/screenshots`, sources rendered from `src` on the same GPU, edits and scrubbing, four views while resizing, all in one page |
| 2026-10-21 | Sidecars: the Audit moved to `examples/<Name>Example.md`; upstream baseline at `d94661f706`; plan moved here from `.cursor/plans/` | 231 | `examples.mjs check` |
