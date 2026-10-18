import { Register, ReactiveElement, ReactiveElementProps, Property, div, Field, Storage as $ } from '@io-gui/core'
import { ioField } from '@io-gui/inputs'
import { ioPropertyEditor } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { Object3D } from 'three/webgpu'
import { mrt, output, velocity } from 'three/tsl'
import { traa } from 'three/addons/tsl/display/TRAANode.js'
import { PostProcessingPipeline, SelectionModel, Document, Editor, View, ViewOverlays, ThreeViewport, threeViewport, threeTimeline, threeScenegraph, pipelineTypes } from '@io-gui/three'
import { ioLayout, Layout } from '@io-gui/layout'
import { threeEditorStatus } from '../elements/ThreeEditorStatus.js'

pipelineTypes.register({
  id: 'traa',
  label: 'Forward + TRAA',
  create: renderer => new PostProcessingPipeline(renderer, (scenePass, camera) => {
    scenePass.setMRT(mrt({output, velocity}))
    return traa(scenePass.getTextureNode('output'), scenePass.getTextureNode('depth'), scenePass.getTextureNode('velocity'), camera)
  }, {convergeFrames: 32, msaa: false}),
})

const editorLayout = new Layout({
  child: {
      type: 'split',
      children: [
        {
          type: 'panel',
          // size: '320px',
          size: 'auto',
          tabs: [
            { id: 'Scene' }
          ]
        }, {
          type: 'split',
          size: 'auto',
          children: [
            {
              type: 'panel',
              tabs: [
                { id: 'Front', selected: true },
                { id: 'Back' }
              ]
            }, {
              type: 'panel',
              tabs: [
                { id: 'Right', selected: true },
                { id: 'Left' }
              ]
            }
          ],
          orientation: 'vertical'
      }, {
          type: 'split',
          size: 'auto',
          children: [
            {
              type: 'panel',
              tabs: [
                { id: 'Perspective', selected: true },
                { id: 'Top' },
                { id: 'Bottom' }
              ]
            }, {
              type: 'panel',
              tabs: [
                { id: 'UV' },
                { id: 'Scene Camera', selected: true },
              ]
            }
          ],
          orientation: 'vertical'
      }, {
          type: 'split',
          orientation: 'vertical',
          children: [
            {
              type: 'panel',
              size: '320px',
              tabs: [
                { id: 'Document' }
              ]
            }, {
              type: 'panel',
              size: 'auto',
              tabs: [
                { id: 'Inspector' },
                { id: 'View' },
              ]
            }
          ],
          size: '253.0390625px'
      }
    ]
  }
})

// Document subclasses, imported when first opened.
const DOCUMENTS: Record<string, () => Promise<Document>> = {
  GeometriesExample: () => import('./examples/GeometriesExample.js').then(module => new module.GeometriesExample()),
  GeometryColorsExample: () => import('./examples/GeometryColorsExample.js').then(module => new module.GeometryColorsExample()),
  GeometryConvexExample: () => import('./examples/GeometryConvexExample.js').then(module => new module.GeometryConvexExample()),
  CameraExample: () => import('./examples/CameraExample.js').then(module => new module.CameraExample()),
  AnimationGroupsExample: () => import('./examples/AnimationGroupsExample.js').then(module => new module.AnimationGroupsExample()),
  AnimationKeyframesExample: () => import('./examples/AnimationKeyframesExample.js').then(module => new module.AnimationKeyframesExample()),
  AnimationRetargetingExample: () => import('./examples/AnimationRetargetingExample.js').then(module => new module.AnimationRetargetingExample()),
  AnimationRetargetingReadyplayerExample: () => import('./examples/AnimationRetargetingReadyplayerExample.js').then(module => new module.AnimationRetargetingReadyplayerExample()),
  AnimationSkinningBlendingExample: () => import('./examples/AnimationSkinningBlendingExample.js').then(module => new module.AnimationSkinningBlendingExample()),
  AnimationSkinningAdditiveBlendingExample: () => import('./examples/AnimationSkinningAdditiveBlendingExample.js').then(module => new module.AnimationSkinningAdditiveBlendingExample()),
  BackdropExample: () => import('./examples/BackdropExample.js').then(module => new module.BackdropExample()),
  BackdropAreaExample: () => import('./examples/BackdropAreaExample.js').then(module => new module.BackdropAreaExample()),
  VolumePerlinExample: () => import('./examples/VolumePerlinExample.js').then(module => new module.VolumePerlinExample()),
  ComputeTextureExample: () => import('./examples/ComputeTextureExample.js').then(module => new module.ComputeTextureExample()),
  AnimationKeysExample: () => import('./examples/AnimationKeysExample.js').then(module => new module.AnimationKeysExample()),
  GeometryCubeExample: () => import('./examples/GeometryCubeExample.js').then(module => new module.GeometryCubeExample()),
  SpritesExample: () => import('./examples/SpritesExample.js').then(module => new module.SpritesExample()),
  InstanceUniformExample: () => import('./examples/InstanceUniformExample.js').then(module => new module.InstanceUniformExample()),
  MaterialsToonExample: () => import('./examples/MaterialsToonExample.js').then(module => new module.MaterialsToonExample()),
  ClearcoatExample: () => import('./examples/ClearcoatExample.js').then(module => new module.ClearcoatExample()),
  LightsPhongExample: () => import('./examples/LightsPhongExample.js').then(module => new module.LightsPhongExample()),
  LightsRectarealightExample: () => import('./examples/LightsRectarealightExample.js').then(module => new module.LightsRectarealightExample()),
  ShadowmapExample: () => import('./examples/ShadowmapExample.js').then(module => new module.ShadowmapExample()),
  SkinningExample: () => import('./examples/SkinningExample.js').then(module => new module.SkinningExample()),
  LoaderGltfIridescenceExample: () => import('./examples/LoaderGltfIridescenceExample.js').then(module => new module.LoaderGltfIridescenceExample()),
  LoaderGltfAnisotropyExample: () => import('./examples/LoaderGltfAnisotropyExample.js').then(module => new module.LoaderGltfAnisotropyExample()),
  LoaderGltfDispersionExample: () => import('./examples/LoaderGltfDispersionExample.js').then(module => new module.LoaderGltfDispersionExample()),
  LoaderGltfTransmissionExample: () => import('./examples/LoaderGltfTransmissionExample.js').then(module => new module.LoaderGltfTransmissionExample()),
  PmremCubemapExample: () => import('./examples/PmremCubemapExample.js').then(module => new module.PmremCubemapExample()),
  PmremEquirectangularExample: () => import('./examples/PmremEquirectangularExample.js').then(module => new module.PmremEquirectangularExample()),
  CubemapMixExample: () => import('./examples/CubemapMixExample.js').then(module => new module.CubemapMixExample()),
  MorphtargetsHorseExample: () => import('./examples/MorphtargetsHorseExample.js').then(module => new module.MorphtargetsHorseExample()),
  TslVfxFlamesExample: () => import('./examples/TslVfxFlamesExample.js').then(module => new module.TslVfxFlamesExample()),
  LightsPointlightsExample: () => import('./examples/LightsPointlightsExample.js').then(module => new module.LightsPointlightsExample()),
  BuffergeometryExample: () => import('./examples/BuffergeometryExample.js').then(module => new module.BuffergeometryExample()),
  BuffergeometryIndexedExample: () => import('./examples/BuffergeometryIndexedExample.js').then(module => new module.BuffergeometryIndexedExample()),
  BuffergeometryLinesExample: () => import('./examples/BuffergeometryLinesExample.js').then(module => new module.BuffergeometryLinesExample()),
  BuffergeometryLinesIndexedExample: () => import('./examples/BuffergeometryLinesIndexedExample.js').then(module => new module.BuffergeometryLinesIndexedExample()),
  LinesDashedExample: () => import('./examples/LinesDashedExample.js').then(module => new module.LinesDashedExample()),
  GeometryExtrudeShapesExample: () => import('./examples/GeometryExtrudeShapesExample.js').then(module => new module.GeometryExtrudeShapesExample()),
  GeometryTeapotExample: () => import('./examples/GeometryTeapotExample.js').then(module => new module.GeometryTeapotExample()),
  MorphtargetsExample: () => import('./examples/MorphtargetsExample.js').then(module => new module.MorphtargetsExample()),
  MorphtargetsFaceExample: () => import('./examples/MorphtargetsFaceExample.js').then(module => new module.MorphtargetsFaceExample()),
  InstancingMorphExample: () => import('./examples/InstancingMorphExample.js').then(module => new module.InstancingMorphExample()),
  AnimationMultipleExample: () => import('./examples/AnimationMultipleExample.js').then(module => new module.AnimationMultipleExample()),
  MaterialsExample: () => import('./examples/MaterialsExample.js').then(module => new module.MaterialsExample()),
  MaterialsBasicExample: () => import('./examples/MaterialsBasicExample.js').then(module => new module.MaterialsBasicExample()),
  MaterialsLightmapExample: () => import('./examples/MaterialsLightmapExample.js').then(module => new module.MaterialsLightmapExample()),
  MaterialsEnvmapsExample: () => import('./examples/MaterialsEnvmapsExample.js').then(module => new module.MaterialsEnvmapsExample()),
  MaterialsSssExample: () => import('./examples/MaterialsSssExample.js').then(module => new module.MaterialsSssExample()),
  ProceduralTextureExample: () => import('./examples/ProceduralTextureExample.js').then(module => new module.ProceduralTextureExample()),
  Textures2dArrayExample: () => import('./examples/Textures2dArrayExample.js').then(module => new module.Textures2dArrayExample()),
  TslGalaxyExample: () => import('./examples/TslGalaxyExample.js').then(module => new module.TslGalaxyExample()),
  LoaderObjExample: () => import('./examples/LoaderObjExample.js').then(module => new module.LoaderObjExample()),
  LoaderStlExample: () => import('./examples/LoaderStlExample.js').then(module => new module.LoaderStlExample()),
  LoaderPlyExample: () => import('./examples/LoaderPlyExample.js').then(module => new module.LoaderPlyExample()),
  Loader3dsExample: () => import('./examples/Loader3dsExample.js').then(module => new module.Loader3dsExample()),
  LoaderDracoExample: () => import('./examples/LoaderDracoExample.js').then(module => new module.LoaderDracoExample()),
  LoaderKmzExample: () => import('./examples/LoaderKmzExample.js').then(module => new module.LoaderKmzExample()),
  LoaderAmfExample: () => import('./examples/LoaderAmfExample.js').then(module => new module.LoaderAmfExample()),
  LoaderUsdzExample: () => import('./examples/LoaderUsdzExample.js').then(module => new module.LoaderUsdzExample()),
  LoaderVoxExample: () => import('./examples/LoaderVoxExample.js').then(module => new module.LoaderVoxExample()),
  FogHeightExample: () => import('./examples/FogHeightExample.js').then(module => new module.FogHeightExample()),
  InstanceMeshExample: () => import('./examples/InstanceMeshExample.js').then(module => new module.InstanceMeshExample()),
  InstancePathExample: () => import('./examples/InstancePathExample.js').then(module => new module.InstancePathExample()),
  TslRagingSeaExample: () => import('./examples/TslRagingSeaExample.js').then(module => new module.TslRagingSeaExample()),
  LoaderColladaExample: () => import('./examples/LoaderColladaExample.js').then(module => new module.LoaderColladaExample()),
  LoaderColladaSkinningExample: () => import('./examples/LoaderColladaSkinningExample.js').then(module => new module.LoaderColladaSkinningExample()),
  LoaderFbxExample: () => import('./examples/LoaderFbxExample.js').then(module => new module.LoaderFbxExample()),
  LoaderFbxNurbsExample: () => import('./examples/LoaderFbxNurbsExample.js').then(module => new module.LoaderFbxNurbsExample()),
  Loader3mfExample: () => import('./examples/Loader3mfExample.js').then(module => new module.Loader3mfExample()),
  Loader3mfMaterialsExample: () => import('./examples/Loader3mfMaterialsExample.js').then(module => new module.Loader3mfMaterialsExample()),
  LoaderPcdExample: () => import('./examples/LoaderPcdExample.js').then(module => new module.LoaderPcdExample()),
  LoaderXyzExample: () => import('./examples/LoaderXyzExample.js').then(module => new module.LoaderXyzExample()),
  LoaderVrmlExample: () => import('./examples/LoaderVrmlExample.js').then(module => new module.LoaderVrmlExample()),
  LoaderGcodeExample: () => import('./examples/LoaderGcodeExample.js').then(module => new module.LoaderGcodeExample()),
  LoaderSvgExample: () => import('./examples/LoaderSvgExample.js').then(module => new module.LoaderSvgExample()),
  LoaderGltfAvifExample: () => import('./examples/LoaderGltfAvifExample.js').then(module => new module.LoaderGltfAvifExample()),
  LoaderGltfInstancingExample: () => import('./examples/LoaderGltfInstancingExample.js').then(module => new module.LoaderGltfInstancingExample()),
  LoaderGltfVariantsExample: () => import('./examples/LoaderGltfVariantsExample.js').then(module => new module.LoaderGltfVariantsExample()),
  LoaderMddExample: () => import('./examples/LoaderMddExample.js').then(module => new module.LoaderMddExample()),
  LoaderTextureExrExample: () => import('./examples/LoaderTextureExrExample.js').then(module => new module.LoaderTextureExrExample()),
  LoaderTextureHdrExample: () => import('./examples/LoaderTextureHdrExample.js').then(module => new module.LoaderTextureHdrExample()),
  LoaderTextureTgaExample: () => import('./examples/LoaderTextureTgaExample.js').then(module => new module.LoaderTextureTgaExample()),
  LoaderTextureTiffExample: () => import('./examples/LoaderTextureTiffExample.js').then(module => new module.LoaderTextureTiffExample()),
  LoaderTextureUltrahdrExample: () => import('./examples/LoaderTextureUltrahdrExample.js').then(module => new module.LoaderTextureUltrahdrExample()),
  MaterialsBumpmapExample: () => import('./examples/MaterialsBumpmapExample.js').then(module => new module.MaterialsBumpmapExample()),
  MaterialsCubemapExample: () => import('./examples/MaterialsCubemapExample.js').then(module => new module.MaterialsCubemapExample()),
  MaterialsCubemapRefractionExample: () => import('./examples/MaterialsCubemapRefractionExample.js').then(module => new module.MaterialsCubemapRefractionExample()),
  MaterialsEnvmapsExrExample: () => import('./examples/MaterialsEnvmapsExrExample.js').then(module => new module.MaterialsEnvmapsExrExample()),
  MaterialsEnvmapsHdrExample: () => import('./examples/MaterialsEnvmapsHdrExample.js').then(module => new module.MaterialsEnvmapsHdrExample()),
  MaterialsNormalmapExample: () => import('./examples/MaterialsNormalmapExample.js').then(module => new module.MaterialsNormalmapExample()),
  MaterialsNormalmapObjectSpaceExample: () => import('./examples/MaterialsNormalmapObjectSpaceExample.js').then(module => new module.MaterialsNormalmapObjectSpaceExample()),
  MaterialsTextureRotationExample: () => import('./examples/MaterialsTextureRotationExample.js').then(module => new module.MaterialsTextureRotationExample()),
  MaterialsBlendingExample: () => import('./examples/MaterialsBlendingExample.js').then(module => new module.MaterialsBlendingExample()),
  PanoramaCubeExample: () => import('./examples/PanoramaCubeExample.js').then(module => new module.PanoramaCubeExample()),
  LightsCustomExample: () => import('./examples/LightsCustomExample.js').then(module => new module.LightsCustomExample()),
  LightsIesSpotlightExample: () => import('./examples/LightsIesSpotlightExample.js').then(module => new module.LightsIesSpotlightExample()),
  LightsPhysicalExample: () => import('./examples/LightsPhysicalExample.js').then(module => new module.LightsPhysicalExample()),
  LightsProjectorExample: () => import('./examples/LightsProjectorExample.js').then(module => new module.LightsProjectorExample()),
  LightsSelectiveExample: () => import('./examples/LightsSelectiveExample.js').then(module => new module.LightsSelectiveExample()),
  LightsSpotlightExample: () => import('./examples/LightsSpotlightExample.js').then(module => new module.LightsSpotlightExample()),
  ShadowmapPointlightExample: () => import('./examples/ShadowmapPointlightExample.js').then(module => new module.ShadowmapPointlightExample()),
  LightprobeExample: () => import('./examples/LightprobeExample.js').then(module => new module.LightprobeExample()),
  LightprobeCubecameraExample: () => import('./examples/LightprobeCubecameraExample.js').then(module => new module.LightprobeCubecameraExample()),
  MaterialsAlphahashExample: () => import('./examples/MaterialsAlphahashExample.js').then(module => new module.MaterialsAlphahashExample()),
  MaterialsArraysExample: () => import('./examples/MaterialsArraysExample.js').then(module => new module.MaterialsArraysExample()),
  MaterialsCubemapMipmapsExample: () => import('./examples/MaterialsCubemapMipmapsExample.js').then(module => new module.MaterialsCubemapMipmapsExample()),
  MaterialsDisplacementmapExample: () => import('./examples/MaterialsDisplacementmapExample.js').then(module => new module.MaterialsDisplacementmapExample()),
  MaterialsMatcapExample: () => import('./examples/MaterialsMatcapExample.js').then(module => new module.MaterialsMatcapExample()),
  MaterialxNoiseExample: () => import('./examples/MaterialxNoiseExample.js').then(module => new module.MaterialxNoiseExample()),
  ParallaxUvExample: () => import('./examples/ParallaxUvExample.js').then(module => new module.ParallaxUvExample()),
  CubemapAdjustmentsExample: () => import('./examples/CubemapAdjustmentsExample.js').then(module => new module.CubemapAdjustmentsExample()),
  TonemappingExample: () => import('./examples/TonemappingExample.js').then(module => new module.TonemappingExample()),
  EquirectangularExample: () => import('./examples/EquirectangularExample.js').then(module => new module.EquirectangularExample()),
  PmremSceneExample: () => import('./examples/PmremSceneExample.js').then(module => new module.PmremSceneExample()),
  TslAngularSlicingExample: () => import('./examples/TslAngularSlicingExample.js').then(module => new module.TslAngularSlicingExample()),
  TslEarthExample: () => import('./examples/TslEarthExample.js').then(module => new module.TslEarthExample()),
  TslHalftoneExample: () => import('./examples/TslHalftoneExample.js').then(module => new module.TslHalftoneExample()),
  TslWoodExample: () => import('./examples/TslWoodExample.js').then(module => new module.TslWoodExample()),
  VolumeCloudExample: () => import('./examples/VolumeCloudExample.js').then(module => new module.VolumeCloudExample()),
  ParticlesExample: () => import('./examples/ParticlesExample.js').then(module => new module.ParticlesExample()),
  ClippingExample: () => import('./examples/ClippingExample.js').then(module => new module.ClippingExample()),
  GeometryLoftExample: () => import('./examples/GeometryLoftExample.js').then(module => new module.GeometryLoftExample()),
  LoaderGltfExample: () => import('./examples/LoaderGltfExample.js').then(module => new module.LoaderGltfExample()),
  LoaderGltfSheenExample: () => import('./examples/LoaderGltfSheenExample.js').then(module => new module.LoaderGltfSheenExample()),
  MirrorExample: () => import('./examples/MirrorExample.js').then(module => new module.MirrorExample()),
  ReflectionExample: () => import('./examples/ReflectionExample.js').then(module => new module.ReflectionExample()),
  ReflectionBlurredExample: () => import('./examples/ReflectionBlurredExample.js').then(module => new module.ReflectionBlurredExample()),
  ReflectionRoughnessExample: () => import('./examples/ReflectionRoughnessExample.js').then(module => new module.ReflectionRoughnessExample()),
  RefractionExample: () => import('./examples/RefractionExample.js').then(module => new module.RefractionExample()),
  LensflaresExample: () => import('./examples/LensflaresExample.js').then(module => new module.LensflaresExample()),
  OcclusionExample: () => import('./examples/OcclusionExample.js').then(module => new module.OcclusionExample()),
  MeshBatchExample: () => import('./examples/MeshBatchExample.js').then(module => new module.MeshBatchExample()),
  GaussianSplatExample: () => import('./examples/GaussianSplatExample.js').then(module => new module.GaussianSplatExample()),
  ParticlesSoftExample: () => import('./examples/ParticlesSoftExample.js').then(module => new module.ParticlesSoftExample()),
  WaterExample: () => import('./examples/WaterExample.js').then(module => new module.WaterExample()),
  TslVfxTornadoExample: () => import('./examples/TslVfxTornadoExample.js').then(module => new module.TslVfxTornadoExample()),
  MaterialsRetroreflectionExample: () => import('./examples/MaterialsRetroreflectionExample.js').then(module => new module.MaterialsRetroreflectionExample()),
  SkinningInstancingExample: () => import('./examples/SkinningInstancingExample.js').then(module => new module.SkinningInstancingExample()),
  SkinningPointsExample: () => import('./examples/SkinningPointsExample.js').then(module => new module.SkinningPointsExample()),
  InstanceSpritesExample: () => import('./examples/InstanceSpritesExample.js').then(module => new module.InstanceSpritesExample()),
  SandboxExample: () => import('./examples/SandboxExample.js').then(module => new module.SandboxExample()),
  ModifierCurveExample: () => import('./examples/ModifierCurveExample.js').then(module => new module.ModifierCurveExample()),
  LinesFatExample: () => import('./examples/LinesFatExample.js').then(module => new module.LinesFatExample()),
  LinesFatWireframeExample: () => import('./examples/LinesFatWireframeExample.js').then(module => new module.LinesFatWireframeExample()),
  Textures2dArrayCompressedExample: () => import('./examples/Textures2dArrayCompressedExample.js').then(module => new module.Textures2dArrayCompressedExample()),
  LoaderTextureKtx2Example: () => import('./examples/LoaderTextureKtx2Example.js').then(module => new module.LoaderTextureKtx2Example()),
  LoaderGltfCompressedExample: () => import('./examples/LoaderGltfCompressedExample.js').then(module => new module.LoaderGltfCompressedExample()),
  ShadowmapArrayExample: () => import('./examples/ShadowmapArrayExample.js').then(module => new module.ShadowmapArrayExample()),
  GeometryTextShapesExample: () => import('./examples/GeometryTextShapesExample.js').then(module => new module.GeometryTextShapesExample()),
  GeometryTextStrokeExample: () => import('./examples/GeometryTextStrokeExample.js').then(module => new module.GeometryTextStrokeExample()),
  ModifierSimplifierExample: () => import('./examples/ModifierSimplifierExample.js').then(module => new module.ModifierSimplifierExample()),
  ModifierEdgesplitExample: () => import('./examples/ModifierEdgesplitExample.js').then(module => new module.ModifierEdgesplitExample()),
  ClippingIntersectionExample: () => import('./examples/ClippingIntersectionExample.js').then(module => new module.ClippingIntersectionExample()),
  MaterialsModifiedExample: () => import('./examples/MaterialsModifiedExample.js').then(module => new module.MaterialsModifiedExample()),
  BuffergeometryPointsExample: () => import('./examples/BuffergeometryPointsExample.js').then(module => new module.BuffergeometryPointsExample()),
  BuffergeometryPointsInterleavedExample: () => import('./examples/BuffergeometryPointsInterleavedExample.js').then(module => new module.BuffergeometryPointsInterleavedExample()),
  BuffergeometryDrawrangeExample: () => import('./examples/BuffergeometryDrawrangeExample.js').then(module => new module.BuffergeometryDrawrangeExample()),
  BuffergeometryInstancingInterleavedExample: () => import('./examples/BuffergeometryInstancingInterleavedExample.js').then(module => new module.BuffergeometryInstancingInterleavedExample()),
  PointsBillboardsExample: () => import('./examples/PointsBillboardsExample.js').then(module => new module.PointsBillboardsExample()),
  PointsSpritesExample: () => import('./examples/PointsSpritesExample.js').then(module => new module.PointsSpritesExample()),
  PointsWavesExample: () => import('./examples/PointsWavesExample.js').then(module => new module.PointsWavesExample()),
  LinesColorsExample: () => import('./examples/LinesColorsExample.js').then(module => new module.LinesColorsExample()),
  LodExample: () => import('./examples/LodExample.js').then(module => new module.LodExample()),
  HelpersExample: () => import('./examples/HelpersExample.js').then(module => new module.HelpersExample()),
  GeometryNurbsExample: () => import('./examples/GeometryNurbsExample.js').then(module => new module.GeometryNurbsExample()),
  GeometryShapesExample: () => import('./examples/GeometryShapesExample.js').then(module => new module.GeometryShapesExample()),
  GeometryTextExample: () => import('./examples/GeometryTextExample.js').then(module => new module.GeometryTextExample()),
  LoaderTtfExample: () => import('./examples/LoaderTtfExample.js').then(module => new module.LoaderTtfExample()),
  GeometryExtrudeSplinesExample: () => import('./examples/GeometryExtrudeSplinesExample.js').then(module => new module.GeometryExtrudeSplinesExample()),
  GeometryMinecraftExample: () => import('./examples/GeometryMinecraftExample.js').then(module => new module.GeometryMinecraftExample()),
  GeometryTerrainExample: () => import('./examples/GeometryTerrainExample.js').then(module => new module.GeometryTerrainExample()),
  MathOrientationTransformExample: () => import('./examples/MathOrientationTransformExample.js').then(module => new module.MathOrientationTransformExample()),
  InstancingDynamicExample: () => import('./examples/InstancingDynamicExample.js').then(module => new module.InstancingDynamicExample()),
  InstancingPerformanceExample: () => import('./examples/InstancingPerformanceExample.js').then(module => new module.InstancingPerformanceExample()),
  InstancingScatterExample: () => import('./examples/InstancingScatterExample.js').then(module => new module.InstancingScatterExample()),
  MarchingcubesExample: () => import('./examples/MarchingcubesExample.js').then(module => new module.MarchingcubesExample()),
  ClippingAdvancedExample: () => import('./examples/ClippingAdvancedExample.js').then(module => new module.ClippingAdvancedExample()),
  MaterialsBlendingCustomExample: () => import('./examples/MaterialsBlendingCustomExample.js').then(module => new module.MaterialsBlendingCustomExample()),
  LoaderTextureDdsExample: () => import('./examples/LoaderTextureDdsExample.js').then(module => new module.LoaderTextureDdsExample()),
  LightsHemisphereExample: () => import('./examples/LightsHemisphereExample.js').then(module => new module.LightsHemisphereExample()),
  LightsSpotlightsExample: () => import('./examples/LightsSpotlightsExample.js').then(module => new module.LightsSpotlightsExample()),
  ShadowmapPerformanceExample: () => import('./examples/ShadowmapPerformanceExample.js').then(module => new module.ShadowmapPerformanceExample()),
  GeometryColorsLookuptableExample: () => import('./examples/GeometryColorsLookuptableExample.js').then(module => new module.GeometryColorsLookuptableExample()),
  AnimationSkinningMorphExample: () => import('./examples/AnimationSkinningMorphExample.js').then(module => new module.AnimationSkinningMorphExample()),
  LoaderBvhExample: () => import('./examples/LoaderBvhExample.js').then(module => new module.LoaderBvhExample()),
  LoaderMd2Example: () => import('./examples/LoaderMd2Example.js').then(module => new module.LoaderMd2Example()),
  Loader3dmExample: () => import('./examples/Loader3dmExample.js').then(module => new module.Loader3dmExample()),
  LoaderColladaKinematicsExample: () => import('./examples/LoaderColladaKinematicsExample.js').then(module => new module.LoaderColladaKinematicsExample()),
  LoaderPdbExample: () => import('./examples/LoaderPdbExample.js').then(module => new module.LoaderPdbExample()),
  WatchExample: () => import('./examples/WatchExample.js').then(module => new module.WatchExample()),
  LoaderLdrawExample: () => import('./examples/LoaderLdrawExample.js').then(module => new module.LoaderLdrawExample()),
  LoaderNrrdExample: () => import('./examples/LoaderNrrdExample.js').then(module => new module.LoaderNrrdExample()),
  MorphtargetsSphereExample: () => import('./examples/MorphtargetsSphereExample.js').then(module => new module.MorphtargetsSphereExample()),
}

const EXAMPLE_MENU = new Menu({
  id: 'example-menu',
  options: Object.keys(DOCUMENTS).map(name => ({id: name})),
  selectedID: $({key: 'example', storage: 'hash', value: ''})
})
let _SELECTED_EXAMPLE = 'AnimationKeyframesExample'

let _isPlaying = false

/** What the 3D views draw over the content: overlays are off unless a view turns them on. */
const VIEW_OVERLAYS: ViewOverlays = {
  grid: true,
  components: true,
  selection: true,
  cameraFrame: true,
  cameraHelpers: true,
  lightHelpers: true,
  skeletonHelpers: true,
  clippingHelpers: true,
  gizmos: true,
}

/**
 * One Editor in tabbed views, each with its own pipeline (ADR-0006) and interaction profile: a forward
 * perspective view with the Move tool, select-only axis views post-processed with TRAA, and a
 * select-only UV view of the selection, and a select-only Camera view through the document's first scene camera.
 * The 3D views turn on every overlay (`VIEW_OVERLAYS`; the Camera view without the grid). The Camera view draws the
 * document's bloom; the other views do not until their `bloom` is switched on. The View tab shows the settings (bloom,
 * MSAA) of the view focused last.
 * The inspector follows the active object; the Document tab shows the document's own properties. The Scene tab is
 * the document's scene graph: click a row to select its object, its triangle to collapse it, double-click or F2 to
 * rename it; what is collapsed is kept in localStorage by object uuid. Selecting in a view reveals the object there.
 * The heading buttons load a Document subclass and make it the editor's document. Each loaded document keeps
 * its edits, selection and view navigation when switching back (ADR-0002). The timeline above the status bar plays, steps
 * and scrubs the document's timeline, whose current time drives its `onAnimate`; opening a document plays or pauses it
 * by its timeline's `autoplay`.
 * Click selects (Shift toggles, Ctrl removes), Alt+drag box-selects, Ctrl+A selects all, Escape clears, F frames the
 * selection. Drag a gizmo arrow to move along an axis, the center to move in the view plane; X / Y / Z switch the
 * axis while dragging, Escape or right click cancels. Tab enters edit mode on the selection; 1 / 2 / 3 pick points,
 * edges or faces; the UV view then edits UVs of the faces selected in 3D.
 */
@Register
export class IoEditorExample extends ReactiveElement {

  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        max-width: 100%;
        max-height: 100%;
      }
      :host > .heading {
        display: flex;
        flex-wrap: wrap;
        gap: var(--io_spacing);
        padding: var(--io_spacing);
      }
    `
  }

  @Property({type: Editor, init: null})
  declare editor: Editor

  @Field({
    top: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS, bloom: false}),
    bottom: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS, bloom: false}),
    left: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS, bloom: false}),
    right: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS, bloom: false}),
    front: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS, bloom: false}),
    back: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS, bloom: false}),
    perspective: new View({overlays: VIEW_OVERLAYS, bloom: false}),
    uv: new View({kind: 'uv', profile: 'select' }),
    camera: new View({profile: 'select', overlays: { cameraFrame: true }}),
  })
  declare views: Record<'top' | 'bottom' | 'left' | 'right' | 'front' | 'back' | 'perspective' | 'uv' | 'camera', View>

  /** Selection of the editor's current document; each document has its own. */
  @Property({type: SelectionModel})
  declare selection: SelectionModel

  /**
   * The inspected object. The layout keeps the inspector it first rendered, so it binds to this rather than to the
   * selection of one document.
   */
  @Property({type: Object3D, value: undefined})
  declare activeObject: Object3D | undefined

  /** The view of the viewport focused last, shown in the View tab. */
  @Property({type: View, value: undefined})
  declare activeView: View | undefined

  /** The document last asked for; it becomes the editor's document once loaded. */
  @Property({type: String, value: ''})
  declare documentName: string

  /** Loaded documents by name. A Field: `ready()` runs inside the base constructor. */
  @Field(Map)
  declare private _documents: Map<string, Promise<Document>>

  static override get Listeners() {
    return {
      'focusin': 'onFocusIn',
    }
  }

  /** A viewport takes focus on pointer down: show its view's settings. */
  onFocusIn(event: FocusEvent) {
    const viewport = event.composedPath().find(target => target instanceof ThreeViewport) as ThreeViewport | undefined
    if (viewport) this.activeView = viewport.view
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!EXAMPLE_MENU.selectedID) {
      EXAMPLE_MENU.selectedID = _SELECTED_EXAMPLE
    } else {
      void this.open(EXAMPLE_MENU.selectedID)
    }
    this.editor.isPlaying = _isPlaying
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    _SELECTED_EXAMPLE = EXAMPLE_MENU.selectedID
    EXAMPLE_MENU.selectedID = ''
    _isPlaying = this.editor.isPlaying
    this.editor.isPlaying = false
  }

  onExampleSelected(event: CustomEvent<{value: string}>) {
    void this.open(event.detail.value)
  }

  override ready() {
    this.views.top.setAxisView('top')
    this.views.bottom.setAxisView('bottom')
    this.views.left.setAxisView('left')
    this.views.right.setAxisView('right')
    this.views.front.setAxisView('front')
    this.views.back.setAxisView('back')
    this.views.perspective.setAxisView('free')
    this.views.camera.setCameraView()
    this.activeView = this.views.perspective

    this.editor.setActiveTool('3d', 'object', 'transform.translate')
    this.selection = this.editor.selection

    EXAMPLE_MENU.addEventListener('selectedID-changed', this.onExampleSelected)

    this.render([
      div({class: 'heading'}, [
        ioField({value: this.bind('documentName')}),
        ioOptionSelect({ label: 'Load Example', model: EXAMPLE_MENU }),
      ]),
      ioLayout({class: 'content',
        model: editorLayout,
        elements: [
          {group: 'view', ...threeViewport({id: 'Top', editor: this.editor, view: this.views.top})},
          {group: 'view', ...threeViewport({id: 'Bottom', editor: this.editor, view: this.views.bottom})},
          {group: 'view', ...threeViewport({id: 'Left', editor: this.editor, view: this.views.left})},
          {group: 'view', ...threeViewport({id: 'Right', editor: this.editor, view: this.views.right})},
          {group: 'view', ...threeViewport({id: 'Front', editor: this.editor, view: this.views.front})},
          {group: 'view', ...threeViewport({id: 'Back', editor: this.editor, view: this.views.back})},
          {group: 'view', ...threeViewport({id: 'Perspective', editor: this.editor, view: this.views.perspective})},
          {group: 'view', ...threeViewport({id: 'UV', editor: this.editor, view: this.views.uv})},
          {group: 'view', ...threeViewport({id: 'Scene Camera', editor: this.editor, view: this.views.camera})},
          threeScenegraph({
            id: 'Scene',
            editor: this.editor,
            disclosure: $<Record<string, boolean>>({key: 'three-scenegraph-disclosure', storage: 'local', value: {}}),
          }),
          ioPropertyEditor({id: 'Inspector', value: this.bind('activeObject')}),
          ioPropertyEditor({id: 'View', value: this.bind('activeView')}),
          ioPropertyEditor({id: 'Document', value: this.editor.bind('document')}),
        ]
      }),
      threeTimeline({editor: this.editor}),
      threeEditorStatus({editor: this.editor}),
    ])
  }

  editorMutated() {
    this.selection = this.editor.selection
  }

  selectionChanged() {
    this.activeObject = this.selection.activeObject
  }

  selectionMutated() {
    this.activeObject = this.selection.activeObject
  }

  async open(name: string) {
    this.documentName = name
    let loading = this._documents.get(name)
    if (!loading) {
      loading = DOCUMENTS[name]()
      this._documents.set(name, loading)
    }
    const document = await loading
    // Another document may have been asked for while this one loaded.
    if (this.documentName !== name) return
    this.editor.document = document
    this.editor.isPlaying = document.timeline.autoplay
  }

  override dispose() {
    this.editor.dispose()
    this.views.front.dispose()
    this.views.back.dispose()
    this.views.top.dispose()
    this.views.bottom.dispose()
    this.views.left.dispose()
    this.views.right.dispose()
    this.views.perspective.dispose()
    this.views.uv.dispose()
    this.views.camera.dispose()
    EXAMPLE_MENU.removeEventListener('selectedID-changed', this.onExampleSelected)
    for (const loading of this._documents.values()) void loading.then(document => document.dispose())
    super.dispose()
  }
}

export const ioEditorExample = (arg0: ReactiveElementProps) => IoEditorExample.vConstructor(arg0)
