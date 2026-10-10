import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { Box3, Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene, ToneMapping, Vector3 } from 'three/webgpu'
import { AxisView, ViewNavigation, ViewNavigationData } from './ViewNavigation.js'
import { ViewCamera, cameraAspect, copyProjection, worldPerPixelAt } from '../utils/camera.js'
import { isDescendant } from '../utils/sceneGraph.js'
import type { InteractionProfile } from '../tools/Tool.js'

/** `3d` shows the content scene; `uv` shows the UV layout of the edit set in a 2D view of the 0–1 square. */
export type ViewKind = '3d' | 'uv'

/** Overlay ids switched on or off for one view; ids it does not name use the overlay's default. */
export type ViewOverlays = Record<string, boolean>

const UV_BOX = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 0))

type ThreeViewSettings = {
  kind?: ViewKind
  pipeline?: string
  overlays?: ViewOverlays
  xray?: boolean
  toneMapping?: ToneMapping | null
  toneMappingExposure?: number | null
  profile?: InteractionProfile
  overscan?: number
  clearColor?: number
  clearAlpha?: number
}

export type ThreeViewProps = ReactiveObjectProps & ThreeViewSettings

export type ThreeViewData = ThreeViewSettings & {navigation?: Partial<ViewNavigationData>}

const _box = new Box3()
const _center = new Vector3()

/**
 * State of one view (ADR-0002): navigation and display settings, independent of any element.
 * An IoThreeViewport shows it; the view survives the element being unmounted or moved.
 */
@Register
export class ThreeView extends ReactiveObject {

  @Property({type: String, value: '3d'})
  declare kind: ViewKind

  /** Registered pipeline id (ADR-0006). Empty uses the view kind's default: `forward` for 3d, `uv` for uv. */
  @Property({type: String, value: ''})
  declare pipeline: string

  /** Overlays switched on or off (`grid`, `selection`, `cameraFrame`, `gizmos`, ...). Replace the object, or use `setOverlay`. */
  @Property({type: Object, init: null})
  declare overlays: ViewOverlays

  /** Component picking sees through surfaces: hidden points, edges and faces can be picked too. */
  @Property({type: Boolean, value: false})
  declare xray: boolean

  /** Overrides the document's tone mapping in this view; `null` uses the pipeline's or the document's. */
  @Property({value: null})
  declare toneMapping: ToneMapping | null

  /** Overrides the document's exposure in this view; `null` uses the document's. */
  @Property({value: null})
  declare toneMappingExposure: number | null

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
  /** Scene camera name `setCameraView` waits for (`''` = first scene camera); null when none is pending. */
  private _cameraSourceName: string | null = null
  /** What `setCameraView` asked for by name (`''` = first scene camera), looked for again in each document shown; null otherwise. */
  private _cameraRequest: string | null = null
  /** Last scene camera found for `navigation.cameraSource`; reused while it is still in the scene. */
  private _sourceCamera: Object3D | null = null
  /** A `cameraSource` uuid not found in the scene; not searched again until the current task ends. */
  private _missingSource: string | null = null
  /** Session state: navigation per document uuid, so switching documents back restores the camera. */
  private readonly _navigationByDocument = new Map<string, ViewNavigationData>()

  constructor(args?: ThreeViewProps) {
    super(args)
  }

  /**
   * Call after changing `navigation` directly, so viewports showing this view redraw. The methods below call
   * it themselves. It dispatches `navigation-changed` to the view's parents (the viewports holding it), not a
   * reactive mutation: navigation runs per pointer move, and inspectors or bindings of the view need not wake.
   */
  markNavigationChanged() {
    this.dispatch('navigation-changed', undefined, true)
  }

  /** Looks through the view's own navigation: an orthographic axis view, or the default perspective view with `free`. */
  setAxisView(axis: AxisView) {
    this.navigation.cameraSource = null
    this._cameraSourceName = null
    this._cameraRequest = null
    this.navigation.setAxisView(axis)
    this.markNavigationChanged()
    return this
  }

  /**
   * Looks through a scene camera. `'uuid:<uuid>'` picks a camera by uuid, `'name:<name>'` by name; with no id
   * (or `null`) the first camera found in the scene is used. Names and the first camera resolve to a uuid once
   * a camera is in the scene, so a camera that is still loading is picked up when it is added; until then, or
   * when the scene has no camera, the view shows its own `free` perspective view. An id without a prefix warns
   * and uses the `free` view.
   */
  setCameraView(id: string | null = null) {
    this.navigation.cameraSource = null
    this._cameraSourceName = null
    this.navigation.setAxisView('free')
    this._cameraRequest = null
    if (id === null) {
      this._cameraSourceName = this._cameraRequest = ''
    } else if (id.startsWith('uuid:')) {
      this.navigation.cameraSource = id.slice(5)
    } else if (id.startsWith('name:')) {
      this._cameraSourceName = this._cameraRequest = id.slice(5)
    } else {
      console.warn(`ThreeView.setCameraView: "${id}" needs a "uuid:" or "name:" prefix; using the free view`)
    }
    this.markNavigationChanged()
    return this
  }

  frame(object: Object3D | readonly Object3D[], padding = 1) {
    if (this.kind === 'uv') return this.frameUV()
    this.navigation.frame(object, padding)
    this.markNavigationChanged()
  }

  /** Shows the 0–1 UV square, looking down -Z (2D views). */
  frameUV(padding = 1.05) {
    if (this.navigation.axisView !== 'front') this.navigation.setAxisView('front')
    this.navigation.frameBox(UV_BOX, padding)
    this.markNavigationChanged()
  }

  isOverlayEnabled(id: string, enabledByDefault = true) {
    return this.overlays[id] ?? enabledByDefault
  }

  setOverlay(id: string, enabled: boolean) {
    this.overlays = {...this.overlays, [id]: enabled}
  }

  /**
   * Stores the current navigation for `fromDocument` and restores the one saved for `toDocument`,
   * or starts unframed in the same axis view (the viewport then frames the new scene). A view set with
   * `setCameraView()` or `setCameraView('name:…')` looks for that camera in the new document.
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
    // A view on the first or a named scene camera looks for it in a document where it has none yet.
    this._cameraSourceName = this._cameraRequest !== null && !this.navigation.cameraSource ? this._cameraRequest : null
    this.markNavigationChanged()
  }

  /** The scene camera this view looks through, if it is set and present in `scene`. */
  getSourceCamera(scene: Scene | null): ViewCamera | null {
    if (this._cameraSourceName !== null && scene) this._resolveCameraSourceName(scene)
    const uuid = this.navigation.cameraSource
    if (!uuid || !scene) return null
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
    if ((camera as PerspectiveCamera)?.isPerspectiveCamera || (camera as OrthographicCamera)?.isOrthographicCamera) {
      return camera as ViewCamera
    }
    return null
  }

  private _resolveCameraSourceName(scene: Scene) {
    const name = this._cameraSourceName
    let found: Object3D | undefined
    scene.traverse(object => {
      if (found) return
      const isCamera = (object as PerspectiveCamera).isPerspectiveCamera || (object as OrthographicCamera).isOrthographicCamera
      if (isCamera && (!name || object.name === name)) found = object
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
  getCamera(width: number, height: number, scene: Scene | null): ViewCamera {
    const aspect = width > 0 && height > 0 ? width / height : 1
    const source = this.getSourceCamera(scene)
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
      // Orthographic depth does not shrink with distance; clip symmetrically around the eye.
      orthographic.near = -nav.far
      orthographic.far = nav.far
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
  getWorldPerPixel(width: number, height: number, scene: Scene | null) {
    const camera = this.getCamera(width, height, scene)
    let point = this.navigation.target
    if (scene && this.getSourceCamera(scene)) {
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

  /** Core serializes the primitive settings; the overlay flags, tone mapping overrides (also `null`) and navigation are added. */
  override toJSON(): ThreeViewData {
    return {
      ...super.toJSON() as ThreeViewData,
      overlays: {...this.overlays},
      toneMapping: this.toneMapping,
      toneMappingExposure: this.toneMappingExposure,
      navigation: this.navigation.toJSON(),
    }
  }

  override applyJSON(data: ThreeViewData) {
    const {navigation, ...settings} = data
    if (navigation) this.navigation.applyJSON(navigation)
    if (settings.overlays) settings.overlays = {...settings.overlays}
    this.setProperties(settings)
    this.markNavigationChanged()
    return this
  }
}
