import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene } from 'three/webgpu'
import { AxisView, ViewNavigation, ViewNavigationData } from './ViewNavigation.js'
import { copyProjection } from '../utils/copyProjection.js'

export type ViewKind = '3d'

export type ThreeViewProps = ReactiveObjectProps & {
  kind?: ViewKind
  overscan?: number
  clearColor?: number
  clearAlpha?: number
}

export type ThreeViewData = {
  kind?: ViewKind
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

  frame(object: Object3D, padding = 1) {
    this.navigation.frame(object, padding)
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
    if (data.overscan !== undefined) props.overscan = data.overscan
    if (data.clearColor !== undefined) props.clearColor = data.clearColor
    if (data.clearAlpha !== undefined) props.clearAlpha = data.clearAlpha
    this.setProperties(props)
    this.markNavigationChanged()
    return this
  }
}
