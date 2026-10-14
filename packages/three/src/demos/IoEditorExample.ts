import { Register, ReactiveElement, ReactiveElementProps, Property, div, Field, Storage as $ } from '@io-gui/core'
import { ioField } from '@io-gui/inputs'
import { ioPropertyEditor } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { Object3D } from 'three/webgpu'
import { mrt, output, velocity } from 'three/tsl'
import { traa } from 'three/addons/tsl/display/TRAANode.js'
import { PostProcessingPipeline, SelectionModel, Document, Editor, View, ViewOverlays, threeViewport, threeTimeline, threeScenegraph, pipelineTypes } from '@io-gui/three'
import { ioLayout, Layout } from '@io-gui/layout'
import { threeEditorStatus } from '../elements/ThreeEditorStatus.js'

pipelineTypes.register({
  id: 'traa',
  label: 'Forward + TRAA',
  create: renderer => new PostProcessingPipeline(renderer, (scenePass, camera) => {
    scenePass.setMRT(mrt({output, velocity}))
    return traa(scenePass.getTextureNode('output'), scenePass.getTextureNode('depth'), scenePass.getTextureNode('velocity'), camera)
  }, {convergeFrames: 32}),
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
  gizmos: true,
}

/**
 * One Editor in tabbed views, each with its own pipeline (ADR-0006) and interaction profile: a forward
 * perspective view with the Move tool, select-only axis views post-processed with TRAA, and a
 * select-only UV view of the selection, and a select-only Camera view through the document's first scene camera.
 * The 3D views turn on every overlay (`VIEW_OVERLAYS`; the Camera view without the grid).
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
    top: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS}),
    bottom: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS}),
    left: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS}),
    right: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS}),
    front: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS}),
    back: new View({pipeline: 'traa', overlays: VIEW_OVERLAYS}),
    perspective: new View({overlays: VIEW_OVERLAYS}),
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

  /** The document last asked for; it becomes the editor's document once loaded. */
  @Property({type: String, value: ''})
  declare documentName: string

  /** Loaded documents by name. A Field: `ready()` runs inside the base constructor. */
  @Field(Map)
  declare private _documents: Map<string, Promise<Document>>

  override connectedCallback(): void {
    super.connectedCallback()
    if (!EXAMPLE_MENU.selectedID) {
      EXAMPLE_MENU.selectedID = _SELECTED_EXAMPLE
    } else {
      this.open(EXAMPLE_MENU.selectedID)
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
    this.open(event.detail.value)
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
