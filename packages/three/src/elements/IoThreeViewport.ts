import { Register, ReactiveElement, ReactiveElementProps, Property, Change, Field, WithBinding } from '@io-gui/core'
import { WebGPURenderer, CanvasTarget, Scene, Object3D, OrthographicCamera, PerspectiveCamera } from 'three/webgpu'
import { ThreeApplet } from '../nodes/ThreeApplet.js'
import { ThreeEditor } from '../editor/ThreeEditor.js'
import type { ThreeDocument } from '../editor/ThreeDocument.js'
import type { Behavior } from '../input/Behavior.js'
import { toolAllowsProfile } from '../tools/Tool.js'
import { ToolBase } from '../nodes/ToolBase.js'
import { ThreeView } from '../view/ThreeView.js'
import { AXIS_VIEW_DIRECTIONS, AxisView } from '../view/ViewNavigation.js'
import { InputRouter } from '../input/InputRouter.js'
import { Keymap, keymaps } from '../input/Keymap.js'
import { NavigationBehavior } from '../input/behaviors/NavigationBehavior.js'
import { SelectBehavior } from '../input/behaviors/SelectBehavior.js'
import type { SelectionModel } from '../selection/SelectionModel.js'
import { DocumentChange, ChangeBus } from '../editor/ChangeBus.js'
import { renderScheduler, getDefaultRenderer, ScheduledView, DirtyReason } from '../render/RenderScheduler.js'

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const viewport = entry.target as IoThreeViewport
    viewport.visible = entry.isIntersecting
    if (entry.isIntersecting) viewport.tag('view')
  })
})

export type IoThreeViewportProps = ReactiveElementProps & {
  /** The editor whose active document this viewport shows. */
  editor?: WithBinding<ThreeEditor>
  /** Compatibility alias: a ThreeApplet is a ThreeEditor; setting it sets `editor`. */
  applet?: WithBinding<ThreeApplet>
  /** View state to show. Pass one to keep navigation across remounts; otherwise the viewport makes its own. */
  view?: WithBinding<ThreeView>
  /** Shorthand that sets the view: `'perspective'`, an axis (`'top'`, `'front'`, ...), `'scene'` or `'scene:<camera name>'`. */
  cameraSelect?: WithBinding<string>
  /** Navigation and selection bindings (default: `keymaps.default`, OrbitControls-like navigation). */
  keymap?: Keymap
  renderer?: WebGPURenderer
  tool?: WithBinding<ToolBase>
}

@Register
export class IoThreeViewport extends ReactiveElement implements ScheduledView {

  public width: number = 0
  public height: number = 0
  public visible: boolean = false

  @Property({type: ThreeEditor})
  declare editor: ThreeEditor

  @Property({type: ThreeApplet})
  declare applet: ThreeApplet

  @Property({type: ThreeView})
  declare view: ThreeView

  /** Empty leaves the view as it is. */
  @Property({type: String, value: ''})
  declare cameraSelect: string

  @Property({type: WebGPURenderer})
  declare renderer: WebGPURenderer

  @Property({type: Keymap, value: keymaps.default})
  declare keymap: Keymap

  @Property({type: ToolBase})
  declare tool: ToolBase

  @Field(0)
  declare tabIndex: number

  // Lazy: `ready()` runs inside the base constructor, before class fields are initialized.
  declare private _renderTarget: CanvasTarget | undefined
  get renderTarget(): CanvasTarget {
    if (!this._renderTarget) this._renderTarget = new CanvasTarget(document.createElement('canvas'))
    return this._renderTarget
  }

  public attachSurface() {
    const canvas = this.renderTarget.domElement
    if (canvas.parentElement !== this) {
      this.appendChild(canvas)
    }
  }

  static override get Style() {
    return /* css */`
      :host {
        position: relative;
        touch-action: none;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        border: var(--io_border);
        border-color: transparent;
      }
      :host > canvas {
        position: absolute;
        pointer-events: none;
      }
      :host:focus {
        border: var(--io_border);
        border-color: var(--io_colorWhite);
      }
    `
  }

  static override get Listeners() {
    return {
      'frame-object': 'onFrameObject',
    }
  }

  declare private _ownsView: boolean
  /** `cameraSelect` asks for a scene camera that is not in the scene yet (assets still loading). */
  declare private _sceneCameraPending: boolean
  // Lazy, like renderTarget: a `tool` passed to the constructor registers before the constructor body runs.
  declare private _inputRouter: InputRouter | undefined
  declare private _navigation: NavigationBehavior | undefined
  declare private _select: SelectBehavior | undefined
  declare private _toolBehaviors: {toolId: string; behaviors: Behavior[]} | undefined
  declare private _shownDocument: ThreeDocument | undefined

  /** Routes this viewport's input to behaviors: navigation, tools, later gizmos and operators (ADR-0004). */
  get inputRouter(): InputRouter {
    if (!this._inputRouter) {
      this._inputRouter = new InputRouter(this)
      this._navigation = new NavigationBehavior(this, this.keymap)
      this._select = new SelectBehavior(this, this.keymap)
      this._inputRouter.add(this._navigation)
      this._inputRouter.add(this._select)
    }
    return this._inputRouter
  }

  get navigationBehavior(): NavigationBehavior {
    void this.inputRouter
    return this._navigation!
  }

  get selectBehavior(): SelectBehavior {
    void this.inputRouter
    return this._select!
  }

  constructor(args: IoThreeViewportProps) {
    super({
      ...args,
      view: args.view ?? new ThreeView(),
      renderer: args.renderer ?? getDefaultRenderer(),
    } as ReactiveElementProps)
    this._ownsView = !args.view
    void this.inputRouter
    this._syncBehaviors()
  }

  override ready() {
    this.attachSurface()
  }

  override connectedCallback() {
    super.connectedCallback()
    observer.observe(this)
    this.attachSurface()
    renderScheduler.register(this)
    this.onResized()
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    observer.unobserve(this)
    renderScheduler.unregister(this)
    this.visible = false
  }

  get scene(): Scene | null {
    return this.editor?.document?.scene ?? null
  }

  get changeBus(): ChangeBus | null {
    return this.editor?.document?.changeBus ?? null
  }

  get mode(): string | undefined {
    return this.editor?.mode
  }

  get selection(): SelectionModel | null {
    return this.editor?.selection ?? null
  }

  /** Marks this viewport for redraw on the next frame. */
  tag(reason: DirtyReason) {
    renderScheduler.tag(this, reason)
  }

  isRenderable() {
    return this.visible && this.width > 0 && this.height > 0 && !!this.scene
  }

  getPriority() {
    if (this.matches(':focus-within')) return 2
    if (this.matches(':hover')) return 1
    return 0
  }

  listens(change: DocumentChange) {
    return !!this.editor && change.source === this.editor.document
  }

  onRendererError(error: Error) {
    this.textContent = error.message
  }

  /** The camera this viewport draws and picks with, built from its view at the current size. */
  getViewCamera(): PerspectiveCamera | OrthographicCamera {
    return this.view.getCamera(this.width, this.height, this.scene)
  }

  /** Applet event `frame-object` with `{object, overscan?}`: frames the object in this viewport's view. */
  onFrameObject(event: CustomEvent<{object: Object3D; overscan?: number}>) {
    event.stopPropagation()
    if (this._sceneCameraPending) this._syncView()
    this.view.frame(event.detail.object, event.detail.overscan ?? 1)
  }

  private _syncView() {
    const view = this.view
    const scene = this.scene
    if (!view) return
    this._sceneCameraPending = !applyCameraSelect(view, this.cameraSelect, scene)
    if (!view.navigation.framed && scene) view.frame(scene)
  }

  /** On a document switch, park this view's navigation for the old document and restore it for the new one. */
  private _syncDocument() {
    const document = this.editor?.document
    if (document === this._shownDocument) return
    if (this._shownDocument && document && this.view) this.view.switchDocument(this._shownDocument.uuid, document.uuid)
    this._shownDocument = document
  }

  /** Installs navigation and the editor's active tool according to the view's interaction profile. */
  private _syncBehaviors() {
    const view = this.view
    if (!view || !this._inputRouter) return
    const router = this._inputRouter
    if (view.profile === 'none') router.remove(this._navigation!)
    else router.add(this._navigation!)
    if (view.profile === 'full' || view.profile === 'select') router.add(this._select!)
    else router.remove(this._select!)

    const tool = this.editor?.getActiveTool(view.kind) ?? null
    const toolId = tool && toolAllowsProfile(tool, view.profile) ? tool.id : null
    if ((this._toolBehaviors?.toolId ?? null) === toolId) return
    for (const behavior of this._toolBehaviors?.behaviors ?? []) router.remove(behavior)
    this._toolBehaviors = undefined
    if (tool && toolId) {
      const behaviors = tool.createBehaviors({editor: this.editor, host: this, view})
      for (const behavior of behaviors) router.add(behavior)
      this._toolBehaviors = {toolId, behaviors}
    }
  }

  toolChanged(change: Change<ToolBase>) {
    const newTool = change.value
    const oldTool = change.oldValue
    if (oldTool) oldTool.unregisterViewport(this)
    if (newTool) newTool.registerViewport(this)
  }

  onResized() {
    const rect = this.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.floor(rect.height)
    if (width === this.width && height === this.height) return
    this.width = width
    this.height = height
    this.renderTarget.setSize(width, height)
    this.renderTarget.setPixelRatio(window.devicePixelRatio)
    if (width && height) this.editor?.onResized(width, height, this)
    this.tag('resize')
  }

  appletChanged() {
    if (this.applet) this.editor = this.applet
  }
  editorChanged() {
    this._syncDocument()
    this._syncView()
    this._syncBehaviors()
    this.tag('content')
  }
  editorMutated() {
    this._syncDocument()
    if (this._sceneCameraPending || !this.view?.navigation.framed) this._syncView()
    this._syncBehaviors()
    this.tag('content')
  }
  cameraSelectChanged() {
    this._syncView()
  }
  viewChanged(change: Change<ThreeView>) {
    if (this._ownsView && change.oldValue && change.oldValue !== change.value) {
      change.oldValue.dispose()
      this._ownsView = false
    }
    this._syncView()
    this._syncBehaviors()
    this.tag('view')
  }
  keymapChanged() {
    if (this._navigation) this._navigation.keymap = this.keymap
    if (this._select) this._select.keymap = this.keymap
  }
  viewMutated() {
    this._syncBehaviors()
    this.tag('view')
  }
  override mutated() {
    this.tag('view')
  }

  /** Called by the RenderScheduler only (ADR-0003). */
  renderView() {
    if (this._sceneCameraPending) this._syncView()
    const editor = this.editor
    const document = editor.document
    if (editor.isRendererInitialized() === false) {
      void editor.onRendererInitialized(this.renderer)
    }

    this.renderer.setCanvasTarget(this.renderTarget)
    this.renderer.setClearColor(this.view.clearColor, this.view.clearAlpha)
    this.renderer.setSize(this.width, this.height)
    this.renderer.clear()

    const toneMapping = this.renderer.toneMapping
    const toneMappingExposure = this.renderer.toneMappingExposure

    this.renderer.toneMapping = document.toneMapping
    this.renderer.toneMappingExposure = document.toneMappingExposure

    this.renderer.render(document.scene, this.getViewCamera())

    this.renderer.toneMapping = toneMapping
    this.renderer.toneMappingExposure = toneMappingExposure
  }

  override dispose() {
    renderScheduler.unregister(this)
    delete (this as Record<string, unknown>).applet
    delete (this as Record<string, unknown>).editor
    this.renderTarget.dispose()
    this._inputRouter?.dispose()
    if (this._ownsView) this.view.dispose()
    if (this.tool) {
      this.tool.unregisterViewport(this)
    }
    super.dispose()
  }
}

/**
 * Maps the `cameraSelect` shorthand onto a view: `'perspective'`, an axis view, `'scene'` (first scene camera)
 * or `'scene:<name>'` (scene camera by name, resolved to its uuid).
 * Returns false when a requested scene camera is not in the scene yet; the view then shows the default
 * perspective view until it appears.
 */
function applyCameraSelect(view: ThreeView, cameraSelect: string, scene: Scene | null): boolean {
  if (!cameraSelect) return true
  const nav = view.navigation
  let resolved = true
  if (cameraSelect.startsWith('scene')) {
    const name = cameraSelect.split(':')[1] || ''
    const cameras = scene ? [
      ...scene.getObjectsByProperty('isPerspectiveCamera', true),
      ...scene.getObjectsByProperty('isOrthographicCamera', true),
    ] : []
    const camera = name ? cameras.find(camera => camera.name === name) : cameras[0]
    if (camera) {
      if (nav.cameraSource !== camera.uuid) view.setCameraSource(camera.uuid)
      return true
    }
    resolved = false
    cameraSelect = 'perspective'
  }
  if (nav.cameraSource !== null) view.setCameraSource(null)
  if (cameraSelect === 'perspective') {
    if (nav.axisView !== null) view.setAxisView(null)
  } else if (cameraSelect in AXIS_VIEW_DIRECTIONS) {
    if (nav.axisView !== cameraSelect) view.setAxisView(cameraSelect as AxisView)
  } else {
    console.warn(`Unknown cameraSelect "${cameraSelect}", using default perspective view`)
    if (nav.axisView !== null) view.setAxisView(null)
  }
  return resolved
}

export const ioThreeViewport = function(arg0: IoThreeViewportProps) {
  return IoThreeViewport.vConstructor(arg0)
}