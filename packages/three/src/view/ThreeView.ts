import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { Box3, Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene, ToneMapping, Vector3 } from 'three/webgpu'
import { AxisView, ViewNavigation, ViewNavigationData } from './ViewNavigation.js'
import { copyProjection } from '../utils/copyProjection.js'
import type { InteractionProfile } from '../tools/Tool.js'

/** `3d` shows the content scene; `uv` shows the UV layout of the edit set in a 2D view of the 0–1 square. */
export type ViewKind = '3d' | 'uv'

/** Overlay ids switched on or off for one view; ids it does not name use the overlay's default. */
export type ViewOverlays = Record<string, boolean>

const UV_BOX = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 0))

export type ThreeViewProps = ReactiveObjectProps & {
  kind?: ViewKind
  pipeline?: string
  overlays?: ViewOverlays
  toneMapping?: ToneMapping | null
  toneMappingExposure?: number | null
  profile?: InteractionProfile
  overscan?: number
  clearColor?: number
  clearAlpha?: number
}

export type ThreeViewData = {
  kind?: ViewKind
  pipeline?: string
  overlays?: ViewOverlays
  profile?: InteractionProfile
  overscan?: number
  clearColor?: number
  clearAlpha?: number
  navigation?: Partial<ViewNavigationData>
}

type ViewCamera = PerspectiveCamera | OrthographicCamera

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
  /** Session state: navigation per document uuid, so switching documents back restores the camera. */
  private readonly _navigationByDocument = new Map<string, ViewNavigationData>()

  constructor(args?: ThreeViewProps) {
    super(args)
  }

  /**
   * Call after changing `navigation` directly, so viewports showing this view redraw.
   * The methods below call it themselves.
   */
  markNavigationChanged() {
    this.dispatchMutation()
  }

  setAxisView(axis: AxisView | null) {
    this.navigation.setAxisView(axis)
    this.markNavigationChanged()
  }

  /** Looks through a scene camera by `uuid`, or stops with `null`. */
  setCameraSource(uuid: string | null) {
    this.navigation.cameraSource = uuid
    this.markNavigationChanged()
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
   * or starts unframed (the viewport then frames the new scene).
   */
  switchDocument(fromDocument: string | null, toDocument: string) {
    if (fromDocument === toDocument) return
    if (fromDocument) this._navigationByDocument.set(fromDocument, this.navigation.toJSON())
    const saved = this._navigationByDocument.get(toDocument)
    if (saved) this.navigation.applyJSON(saved)
    else this.navigation.copy(new ViewNavigation()).framed = false
    this.markNavigationChanged()
  }

  /** The scene camera this view looks through, if it is set and present in `scene`. */
  getSourceCamera(scene: Scene | null): ViewCamera | null {
    const uuid = this.navigation.cameraSource
    if (!uuid || !scene) return null
    const camera = scene.getObjectByProperty('uuid', uuid) as Camera | undefined
    if ((camera as PerspectiveCamera)?.isPerspectiveCamera || (camera as OrthographicCamera)?.isOrthographicCamera) {
      return camera as ViewCamera
    }
    return null
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

  /** World units covered by one CSS pixel at the target distance. */
  getWorldPerPixel(width: number, height: number, scene: Scene | null) {
    const camera = this.getCamera(width, height, scene)
    let visibleHeight: number
    if (camera instanceof PerspectiveCamera) {
      visibleHeight = 2 * this.navigation.distance * Math.tan(camera.fov * Math.PI / 360) / camera.zoom
    } else {
      visibleHeight = (camera.top - camera.bottom) / camera.zoom
    }
    return height > 0 ? visibleHeight / height : 0
  }

  private _fromSceneCamera(source: ViewCamera, aspect: number): ViewCamera {
    source.updateWorldMatrix(true, false)
    const camera: ViewCamera = (source as PerspectiveCamera).isPerspectiveCamera ? this._scenePerspective : this._sceneOrthographic
    source.matrixWorld.decompose(camera.position, camera.quaternion, camera.scale)
    copyProjection(source, camera)
    if (camera instanceof PerspectiveCamera) {
      // Fit the source frame inside the viewport.
      const sourceAspect = (source as PerspectiveCamera).aspect
      camera.aspect = aspect
      camera.fov = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * Math.max(1, sourceAspect / aspect)) * 180 / Math.PI
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

  override toJSON(): ThreeViewData {
    return {
      kind: this.kind,
      pipeline: this.pipeline,
      overlays: {...this.overlays},
      profile: this.profile,
      overscan: this.overscan,
      clearColor: this.clearColor,
      clearAlpha: this.clearAlpha,
      navigation: this.navigation.toJSON(),
    }
  }

  override applyJSON(data: ThreeViewData) {
    if (data.navigation) this.navigation.applyJSON(data.navigation)
    const props: ThreeViewProps = {}
    if (data.kind !== undefined) props.kind = data.kind
    if (data.pipeline !== undefined) props.pipeline = data.pipeline
    if (data.overlays !== undefined) props.overlays = {...data.overlays}
    if (data.profile !== undefined) props.profile = data.profile
    if (data.overscan !== undefined) props.overscan = data.overscan
    if (data.clearColor !== undefined) props.clearColor = data.clearColor
    if (data.clearAlpha !== undefined) props.clearAlpha = data.clearAlpha
    this.setProperties(props)
    this.markNavigationChanged()
    return this
  }
}
