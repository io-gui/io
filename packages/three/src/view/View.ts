import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { Box3, Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene, ToneMapping, Vector3 } from 'three/webgpu'
import { AxisView, ViewNavigation, ViewNavigationData } from './ViewNavigation.js'
import { ViewCamera, cameraAspect, copyProjection, worldPerPixelAt } from '../utils/camera.js'
import { isDescendant } from '../utils/sceneGraph.js'
import type { InteractionProfile } from '../tools/Tool.js'
import type { Document } from '../editor/Document.js'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/** `3d` shows the content scene; `uv` shows the UV layout of the edit set in a 2D view of the 0–1 square. */
export type ViewKind = '3d' | 'uv'

/**
 * Overlays switched on in one view, by overlay id. Every overlay is off unless its flag is true, so a view lists what it
 * draws. An overlay registered outside this package adds its id by declaration merging:
 * `declare module '@io-gui/three' { interface ViewOverlays { heatmap?: boolean } }`.
 */
export interface ViewOverlays {
  /** Floor grid with axes. */
  grid?: boolean
  /** Edit mode: wire, points and selected faces of the edit set. */
  components?: boolean
  /** Outline of selected meshes and lines. */
  selection?: boolean
  /** Darkens what lies outside the framed area: a scene camera's frame, or the viewport inside the overscan margin. */
  cameraFrame?: boolean
  /** Frustums of scene cameras, except the one the view looks through. */
  cameraHelpers?: boolean
  /** Light icons, spot cones and rect area panels. */
  lightHelpers?: boolean
  /** Bones of skeletons. */
  skeletonHelpers?: boolean
  /** Planes of clipping groups. */
  clippingHelpers?: boolean
  /** The active tool's gizmos, in `full` profile views. */
  gizmos?: boolean
}

/** The id of an overlay a view switches: a key of `ViewOverlays`. */
export type OverlayId = keyof ViewOverlays

const UV_BOX = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 0))

type ViewSettings = {
  kind?: ViewKind
  pipeline?: string
  // Mapped, unlike the interface itself, so view data stays assignable to core's `Json` (an index signature).
  overlays?: Readonly<ViewOverlays>
  xray?: boolean
  toneMapping?: ToneMapping | null
  toneMappingExposure?: number | null
  bloom?: boolean | null
  msaa?: boolean
  profile?: InteractionProfile
  overscan?: number
  clearColor?: number
  clearAlpha?: number
}

export type ViewProps = ReactiveObjectProps & ViewSettings

export type ViewData = ViewSettings & {navigation?: Partial<ViewNavigationData>}

const _box = new Box3()
const _center = new Vector3()

function isViewCamera(object: Object3D | null | undefined): object is ViewCamera {
  return !!object && ((object as PerspectiveCamera).isPerspectiveCamera === true || (object as OrthographicCamera).isOrthographicCamera === true)
}

/**
 * State of one view (ADR-0002): navigation and display settings, independent of any element.
 * A ThreeViewport shows it; the view survives the element being unmounted or moved.
 */
@Register
export class View extends ReactiveObject {

  @Property({type: String, value: '3d'})
  declare kind: ViewKind

  /** Registered pipeline id (ADR-0006). Empty uses the view kind's default: `forward` for 3d, `uv` for uv. */
  @Property({type: String, value: ''})
  declare pipeline: string

  /** Overlays switched on (all off by default). Replace the object, or use `setOverlay`: a flag changed in place does not redraw. */
  @Property({type: Object, init: null})
  declare overlays: Readonly<ViewOverlays>

  /** Component picking sees through surfaces: hidden points, edges and faces can be picked too. */
  @Property({type: Boolean, value: false})
  declare xray: boolean

  /** Overrides the document's tone mapping in this view; `null` uses the pipeline's or the document's. */
  @Property({value: null})
  declare toneMapping: ToneMapping | null

  /** Overrides the document's exposure in this view; `null` uses the document's. */
  @Property({value: null})
  declare toneMappingExposure: number | null

  /** Overrides the document's bloom in this view (`true` draws it, `false` does not); `null` follows `document.bloom.enabled`. */
  @Property({value: null})
  declare bloom: boolean | null

  /**
   * Draws the content with 4× multisampling, which also smooths the edges of `alphaToCoverage` materials. Pipelines that
   * cannot take a multisampled scene ignore it (a `PostProcessingPipeline` with `msaa: false`, such as TRAA).
   */
  @Property({type: Boolean, value: false})
  declare msaa: boolean

  /** What the viewport's router installs: `full` (tool + navigation), `select`, `navigate`, `none`. */
  @Property({type: String, value: 'full'})
  declare profile: InteractionProfile

  /** Extra margin drawn around the framed area (1 = none). */
  @Property({type: Number, value: 1.1})
  declare overscan: number

  @Property({type: Number, value: 0x000000})
  declare clearColor: number

  @Property({type: Number, value: 1})
  declare clearAlpha: number

  readonly navigation = new ViewNavigation()

  private readonly _perspective = new PerspectiveCamera()
  private readonly _orthographic = new OrthographicCamera()
  private readonly _scenePerspective = new PerspectiveCamera()
  private readonly _sceneOrthographic = new OrthographicCamera()
  /** Whether the view looks through the shown document's `activeCamera` (`setCameraView()`), in every document. */
  private _followDocument = false
  /** Scene camera name `setCameraView` waits for; null when none is pending. */
  private _cameraSourceName: string | null = null
  /** What `setCameraView` asked for by name, looked for again in each document shown; null otherwise. */
  private _cameraRequest: string | null = null
  /** Last scene camera found for `navigation.cameraSource`, or the first scene camera; reused while it is still in the scene. */
  private _sourceCamera: Object3D | null = null
  /** A `cameraSource` uuid not found in the scene; not searched again until the current task ends. */
  private _missingSource: string | null = null
  /** A scene found without cameras by a view following its document; not searched again until the current task ends. */
  private _sceneWithoutCamera: Scene | null = null
  /** Session state: navigation per document uuid, so switching documents back restores the camera. */
  private readonly _navigationByDocument = new Map<string, ViewNavigationData>()

  constructor(args?: ViewProps) {
    super(args)
  }

  /**
   * Call after changing `navigation` directly, so viewports showing this view redraw. The methods below call
   * it themselves. It dispatches `navigation-changed` to the view's parents (the viewports holding it), not a
   * reactive mutation: navigation runs per pointer move, and inspectors or bindings of the view need not wake.
   * The view stops framing itself (`autoFrame`): it keeps what was navigated or framed on request.
   */
  markNavigationChanged() {
    this.navigation.autoFramed = null
    this._dispatchNavigationChanged()
  }

  private _dispatchNavigationChanged() {
    this.dispatch('navigation-changed', undefined, true)
  }

  /** Looks through the view's own navigation: an orthographic axis view, or the default perspective view with `free`. */
  setAxisView(axis: AxisView) {
    this.navigation.cameraSource = null
    this._sourceCamera = null
    this._followDocument = false
    this._cameraSourceName = null
    this._cameraRequest = null
    this.navigation.setAxisView(axis)
    this.markNavigationChanged()
    return this
  }

  /**
   * Looks through a camera of the shown document. With no id (or `null`) the view follows the document's
   * `activeCamera` (ADR-0011), in every document it shows; when a document names none, the first camera found in its
   * scene. `'uuid:<uuid>'` picks a scene camera by uuid, `'name:<name>'` by name; a name resolves to a uuid once such a
   * camera is in the scene, so a camera that is still loading is picked up when it is added. Until then, or when there
   * is no camera, the view shows its own `free` perspective view. An id without a prefix warns and uses the `free` view.
   */
  setCameraView(id: string | null = null) {
    this.navigation.cameraSource = null
    this._sourceCamera = null
    this._followDocument = false
    this._cameraSourceName = null
    this.navigation.setAxisView('free')
    this._cameraRequest = null
    if (id === null) {
      this._followDocument = true
    } else if (id.startsWith('uuid:')) {
      this.navigation.cameraSource = id.slice(5)
    } else if (id.startsWith('name:')) {
      this._cameraSourceName = this._cameraRequest = id.slice(5)
    } else {
      console.warn(`View.setCameraView: "${id}" needs a "uuid:" or "name:" prefix; using the free view`)
    }
    this.markNavigationChanged()
    return this
  }

  /** Fits `object` (or several) in the view, the box scaled by `fitScale`; `overscan` adds the view's margin. */
  frame(object: Object3D | readonly Object3D[], fitScale = 1) {
    if (this.kind === 'uv') return this.frameUV(fitScale)
    this.navigation.frame(object, fitScale)
    this.markNavigationChanged()
  }

  /** Shows the 0–1 UV square, looking down -Z (2D views). */
  frameUV(fitScale = 1) {
    if (this.navigation.axisView !== 'front') this.navigation.setAxisView('front')
    this.navigation.frameBox(UV_BOX, fitScale)
    this.markNavigationChanged()
  }

  /** What the view frames of `document` by default (ADR-0012): its editor frame target, else its whole scene. */
  getFrameTarget(document: Document): Object3D | readonly Object3D[] {
    const target = document.getEditorFrameTarget()
    if (!target || (Array.isArray(target) && target.length === 0)) return document.scene
    return target
  }

  /**
   * Frames `document`'s frame target while the view frames itself (ADR-0012): when it is not framed yet, and again
   * whenever the target changes (a loaded model replaces the scene), until it is navigated or framed on request.
   */
  autoFrame(document: Document) {
    const navigation = this.navigation
    if (navigation.framed && navigation.autoFramed === null) return
    const target = this.getFrameTarget(document)
    const key = Array.isArray(target) ? target.map(object => object.uuid).join(',') : (target as Object3D).uuid
    if (navigation.framed && navigation.autoFramed === key) return
    // Content built or loaded since the last draw has stale world matrices (skinned bounds read the bones').
    document.scene.updateMatrixWorld()
    navigation.frame(target)
    navigation.autoFramed = key
    this._dispatchNavigationChanged()
  }

  isOverlayEnabled(id: OverlayId) {
    return this.overlays[id] === true
  }

  setOverlay(id: OverlayId, enabled: boolean) {
    this.overlays = {...this.overlays, [id]: enabled}
  }

  /**
   * Stores the current navigation for `fromDocument` and restores the one saved for `toDocument`,
   * or starts unframed in the same axis view (the viewport then frames the new document). A view set with
   * `setCameraView('name:…')` looks for that camera in the new document; one set with `setCameraView()` follows the new
   * document's active camera.
   */
  switchDocument(fromDocument: string | null, toDocument: string) {
    if (fromDocument === toDocument) return
    if (fromDocument) this._navigationByDocument.set(fromDocument, this.navigation.toJSON())
    const saved = this._navigationByDocument.get(toDocument)
    if (saved) {
      this.navigation.applyJSON(saved)
    } else {
      const axisView = this.navigation.axisView
      this.navigation.copy(new ViewNavigation()).framed = false
      this.navigation.setAxisView(axisView)
    }
    // A view on a named scene camera looks for it in a document where it has none yet.
    this._cameraSourceName = this._cameraRequest !== null && !this.navigation.cameraSource ? this._cameraRequest : null
    this._dispatchNavigationChanged()
  }

  /**
   * The camera this view looks through in `document`: its active camera (or first scene camera) when the view follows
   * the document, else the scene camera it is set to, if present in the scene.
   */
  getSourceCamera(document: Document | null): ViewCamera | null {
    const scene = document?.scene ?? null
    if (!document || !scene) return null
    if (this._followDocument) {
      const activeCamera = document.activeCamera
      return isViewCamera(activeCamera) ? activeCamera : this._firstSceneCamera(scene)
    }
    if (this._cameraSourceName !== null) this._resolveCameraSourceName(scene)
    const uuid = this.navigation.cameraSource
    if (!uuid) return null
    // Called several times per draw and per pointer event: avoid walking the scene each time.
    let camera = this._sourceCamera?.uuid === uuid && isDescendant(this._sourceCamera, scene) ? this._sourceCamera as Camera : undefined
    if (!camera) {
      if (this._missingSource === uuid) return null
      camera = scene.getObjectByProperty('uuid', uuid) as Camera | undefined
      this._sourceCamera = camera ?? null
      if (!camera) {
        this._missingSource = uuid
        queueMicrotask(() => { this._missingSource = null })
      }
    }
    return isViewCamera(camera) ? camera : null
  }

  /** Width over height of the area the view frames at this size: the source camera's frame, or the whole viewport. */
  getFrameAspect(width: number, height: number, document: Document | null) {
    const source = this.getSourceCamera(document)
    if (source) return cameraAspect(source)
    return width > 0 && height > 0 ? width / height : 1
  }

  /** The first camera found in `scene`, for a view following a document that names no active camera. */
  private _firstSceneCamera(scene: Scene): ViewCamera | null {
    // Called several times per draw and per pointer event: avoid walking the scene each time.
    const cached = this._sourceCamera
    if (isViewCamera(cached) && isDescendant(cached, scene)) return cached
    if (this._sceneWithoutCamera === scene) return null
    let found: ViewCamera | null = null
    scene.traverse(object => {
      if (!found && isViewCamera(object)) found = object
    })
    this._sourceCamera = found
    if (!found) {
      this._sceneWithoutCamera = scene
      queueMicrotask(() => { this._sceneWithoutCamera = null })
    }
    return found
  }

  private _resolveCameraSourceName(scene: Scene) {
    const name = this._cameraSourceName
    let found: Object3D | undefined
    scene.traverse(object => {
      if (!found && isViewCamera(object) && object.name === name) found = object
    })
    if (!found) return
    // Resolved while drawing or picking with this camera, so no mutation is dispatched.
    this.navigation.cameraSource = found.uuid
    this._cameraSourceName = null
  }

  /**
   * The camera to draw and pick with at this size. Built from state every call; owned by the view.
   * Scene cameras are copied, never mutated (ADR-0005).
   */
  getCamera(width: number, height: number, document: Document | null): ViewCamera {
    const aspect = width > 0 && height > 0 ? width / height : 1
    const source = this.getSourceCamera(document)
    if (source) return this._fromSceneCamera(source, aspect)

    const nav = this.navigation
    let camera: ViewCamera
    if (nav.projection === 'perspective') {
      const perspective = this._perspective
      // The navigation frames a square; widen the vertical fov when the viewport is taller than wide.
      perspective.fov = 2 * Math.atan(Math.tan(nav.fov * Math.PI / 360) * Math.max(1, 1 / aspect)) * 180 / Math.PI
      perspective.aspect = aspect
      perspective.near = nav.near
      perspective.far = nav.far
      perspective.zoom = 1 / this.overscan
      camera = perspective
    } else {
      const orthographic = this._orthographic
      const half = nav.getHalfHeight() * this.overscan
      const halfWidth = aspect >= 1 ? half * aspect : half
      const halfHeight = aspect >= 1 ? half : half / aspect
      orthographic.left = -halfWidth
      orthographic.right = halfWidth
      orthographic.top = halfHeight
      orthographic.bottom = -halfHeight
      // Orthographic depth does not shrink with distance; clip symmetrically around the target, so zooming (which
      // changes the distance) never moves content out of the range.
      orthographic.near = nav.distance - nav.far
      orthographic.far = nav.distance + nav.far
      orthographic.zoom = 1
      camera = orthographic
    }
    nav.getPosition(camera.position)
    camera.quaternion.copy(nav.rotation)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    return camera
  }

  /** World units covered by one CSS pixel at the target (at the scene's centre through a scene camera, which has no target). */
  getWorldPerPixel(width: number, height: number, document: Document | null) {
    const camera = this.getCamera(width, height, document)
    let point = this.navigation.target
    const scene = document?.scene
    if (scene && this.getSourceCamera(document)) {
      point = _box.setFromObject(scene).isEmpty() ? camera.localToWorld(_center.set(0, 0, -1)) : _box.getCenter(_center)
    }
    return worldPerPixelAt(camera, point, height)
  }

  private _fromSceneCamera(source: ViewCamera, aspect: number): ViewCamera {
    source.updateWorldMatrix(true, false)
    const camera: ViewCamera = (source as PerspectiveCamera).isPerspectiveCamera ? this._scenePerspective : this._sceneOrthographic
    source.matrixWorld.decompose(camera.position, camera.quaternion, camera.scale)
    copyProjection(source, camera)
    if (camera instanceof PerspectiveCamera) {
      // Fit the source frame inside the viewport.
      camera.aspect = aspect
      camera.fov = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * Math.max(1, cameraAspect(source) / aspect)) * 180 / Math.PI
      camera.zoom = source.zoom / this.overscan
    } else {
      const frustumHeight = camera.top - camera.bottom
      const frustumWidth = camera.right - camera.left
      const centerX = (camera.left + camera.right) / 2
      const centerY = (camera.top + camera.bottom) / 2
      let halfWidth: number
      let halfHeight: number
      if (frustumWidth / frustumHeight > aspect) {
        halfWidth = frustumWidth / 2
        halfHeight = frustumWidth / 2 / aspect
      } else {
        halfHeight = frustumHeight / 2
        halfWidth = frustumHeight / 2 * aspect
      }
      camera.left = centerX - halfWidth * this.overscan
      camera.right = centerX + halfWidth * this.overscan
      camera.top = centerY + halfHeight * this.overscan
      camera.bottom = centerY - halfHeight * this.overscan
    }
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    return camera
  }

  /** Core serializes the primitive settings; the overlay flags, the overrides (also `null`) and navigation are added. */
  override toJSON(): ViewData {
    return {
      ...super.toJSON() as ViewData,
      overlays: {...this.overlays},
      toneMapping: this.toneMapping,
      toneMappingExposure: this.toneMappingExposure,
      bloom: this.bloom,
      navigation: this.navigation.toJSON(),
    }
  }

  override applyJSON(data: ViewData) {
    const {navigation, ...settings} = data
    if (navigation) this.navigation.applyJSON(navigation)
    if (settings.overlays) settings.overlays = {...settings.overlays}
    this.setProperties(settings)
    this._dispatchNavigationChanged()
    return this
  }
}

registerEditorConfig(View, [
  ['bloom', ioOptionSelect({model: new Menu({options: [
    {value: null, id: 'Document'},
    {value: true, id: 'On'},
    {value: false, id: 'Off'},
  ]})})],
])

registerEditorGroups(View, {
  Main: ['bloom', 'msaa'],
  Hidden: ['navigation'],
})
