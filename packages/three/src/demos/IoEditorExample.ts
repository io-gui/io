import { Register, ReactiveElement, ReactiveElementProps, Property, div, Field } from '@io-gui/core'
import { ioBoolean, ioButton } from '@io-gui/inputs'
import { ioPropertyEditor } from '@io-gui/editors'
import { Object3D } from 'three/webgpu'
import { mrt, output, velocity } from 'three/tsl'
import { traa } from 'three/addons/tsl/display/TRAANode.js'
import { PostProcessingPipeline, SelectionModel, ThreeDocument, ThreeEditor, ThreeView, ioThreeViewport, pipelineTypes } from '@io-gui/three'
import { ioLayout, Layout } from '@io-gui/layout'
import { threeEditorStatus } from '../editor/ThreeEditorStatus.js'

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
              type: 'split',
              size: 'auto',
              children: [
                  {
                      type: 'panel',
                      tabs: [
                          { id: 'Front', selected: true },
                          { id: 'Back' }
                      ]
                  },
                  {
                      type: 'panel',
                      tabs: [
                          { id: 'Right', selected: true },
                          { id: 'Left' }
                      ]
                  }
              ],
              orientation: 'vertical'
          },
          {
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
                  },
                  {
                      type: 'panel',
                      tabs: [
                          { id: 'UV' },
                          { id: 'Scene Camera' },
                      ]
                  }
              ],
              orientation: 'vertical'
          },
          {
              type: 'panel',
              tabs: [
                  { id: 'Inspector' },
                  { id: 'Document' }
              ],
              size: '253.0390625px'
          }
      ]
  }
})

// ThreeDocument subclasses, imported when first opened.
const DOCUMENTS: Record<string, () => Promise<ThreeDocument>> = {
  EditorDocument1: () => import('./examples/EditorDocument1.js').then(module => new module.EditorDocument1()),
  EditorDocument2: () => import('./examples/EditorDocument2.js').then(module => new module.EditorDocument2()),
  GeometriesExample: () => import('./examples/GeometriesExample.js').then(module => new module.GeometriesExample()),
  GeometryColorsExample: () => import('./examples/GeometryColorsExample.js').then(module => new module.GeometryColorsExample()),
  GeometryConvexExample: () => import('./examples/GeometryConvexExample.js').then(module => new module.GeometryConvexExample()),
  CameraExample: () => import('./examples/CameraExample.js').then(module => new module.CameraExample()),
  CameraArrayExample: () => import('./examples/CameraArrayExample.js').then(module => new module.CameraArrayExample()),
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
}

/**
 * One ThreeEditor in tabbed views, each with its own pipeline (ADR-0006) and interaction profile: a forward
 * perspective view with the grid overlay and the Move tool, select-only axis views post-processed with TRAA, and a
 * select-only UV view of the selection, and a select-only Camera view through the document's first scene camera.
 * The inspector follows the active object; the Document tab shows the document's own properties.
 * The heading buttons load a ThreeDocument subclass and make it the editor's document. Each loaded document keeps
 * its edits, selection and view navigation when switching back (ADR-0002). Play ticks the document's `onAnimate`; opening a document plays or pauses it by its `autoplay`.
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

  @Property({type: ThreeEditor, init: null})
  declare editor: ThreeEditor

  @Field({
    top: new ThreeView({pipeline: 'traa', overlays: {grid: true}}),
    bottom: new ThreeView({pipeline: 'traa', overlays: {grid: true}}),
    left: new ThreeView({pipeline: 'traa', overlays: {grid: true}}),
    right: new ThreeView({pipeline: 'traa', overlays: {grid: true}}),
    front: new ThreeView({pipeline: 'traa', overlays: {grid: true}}),
    back: new ThreeView({pipeline: 'traa', overlays: {grid: true}}),
    perspective: new ThreeView({overlays: {grid: true}}),
    uv: new ThreeView({kind: 'uv', profile: 'select'}),
    camera: new ThreeView({profile: 'select'}),
  })
  declare views: Record<'top' | 'bottom' | 'left' | 'right' | 'front' | 'back' | 'perspective' | 'uv' | 'camera', ThreeView>

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
  declare private _documents: Map<string, Promise<ThreeDocument>>

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
    void this.open('EditorDocument1')
    this.changed()
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

  documentNameChanged() {
    this.changed()
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
    this.editor.isPlaying = document.autoplay
  }

  changed() {
    this.render([
      div({class: 'heading'}, [
        ...Object.keys(DOCUMENTS).map(name => ioButton({label: name, selected: name === this.documentName, action: () => this.open(name)})),
        ioBoolean({value: this.editor.bind('isPlaying'), true: 'Pause', false: 'Play'}),
      ]),
      ioLayout({class: 'content',
        model: editorLayout,
        elements: [
          {group: 'view', ...ioThreeViewport({id: 'Top', editor: this.editor, view: this.views.top})},
          {group: 'view', ...ioThreeViewport({id: 'Bottom', editor: this.editor, view: this.views.bottom})},
          {group: 'view', ...ioThreeViewport({id: 'Left', editor: this.editor, view: this.views.left})},
          {group: 'view', ...ioThreeViewport({id: 'Right', editor: this.editor, view: this.views.right})},
          {group: 'view', ...ioThreeViewport({id: 'Front', editor: this.editor, view: this.views.front})},
          {group: 'view', ...ioThreeViewport({id: 'Back', editor: this.editor, view: this.views.back})},
          {group: 'view', ...ioThreeViewport({id: 'Perspective', editor: this.editor, view: this.views.perspective})},
          {group: 'view', ...ioThreeViewport({id: 'UV', editor: this.editor, view: this.views.uv})},
          {group: 'view', ...ioThreeViewport({id: 'Scene Camera', editor: this.editor, view: this.views.camera})},
          ioPropertyEditor({id: 'Inspector', value: this.bind('activeObject')}),
          ioPropertyEditor({id: 'Document', value: this.editor.bind('document')}),
        ]
      }),
      threeEditorStatus({editor: this.editor}),
    ])
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
    for (const loading of this._documents.values()) void loading.then(document => document.dispose())
    super.dispose()
  }
}

export const ioEditorExample = (arg0: ReactiveElementProps) => IoEditorExample.vConstructor(arg0)
