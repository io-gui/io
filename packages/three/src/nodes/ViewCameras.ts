import { Register, Node, ReactiveProperty, Property, NodeProps, Binding  } from '@io-gui/core'
import { IoThreeViewport } from '../elements/IoThreeViewport.js'
import { ThreeApplet } from './ThreeApplet.js'
import { Box3, Camera, Object3D, OrthographicCamera, PerspectiveCamera, Sphere, Vector3 } from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const box = new Box3()
const sphere = new Sphere()
const center = new Vector3()
const size = new Vector3()
const delta = new Vector3()
const cameraRight = new Vector3()
const cameraUp = new Vector3()
const cameraForward = new Vector3()
const corner = new Vector3()
let radius = 0

const resetCameras = new WeakMap<Camera, Camera>()

class DefaultCameras {
  public perspective: PerspectiveCamera
  public top: OrthographicCamera
  public bottom: OrthographicCamera
  public left: OrthographicCamera
  public right: OrthographicCamera
  public front: OrthographicCamera
  public back: OrthographicCamera
  constructor() {
    this.perspective = new PerspectiveCamera(50, 1, 0.1, 1000)
    this.top = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.bottom = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.left = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.right = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.front = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.back = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)

    this.perspective.userData.position = new Vector3(0.5, 0.25, 1)
    this.perspective.position.copy(this.perspective.userData.position)
    this.perspective.lookAt(0, 0, 0)
    this.perspective.name = 'perspective'

    this.top.userData.position = new Vector3(0, 1, 0)
    this.top.position.copy(this.top.userData.position)
    this.top.lookAt(0, 0, 0)
    this.top.name = 'top'

    this.bottom.userData.position = new Vector3(0, -1, 0)
    this.bottom.position.copy(this.bottom.userData.position)
    this.bottom.lookAt(0, 0, 0)
    this.bottom.name = 'bottom'

    this.left.userData.position = new Vector3(-1, 0, 0)
    this.left.position.copy(this.left.userData.position)
    this.left.lookAt(0, 0, 0)
    this.left.name = 'left'

    this.right.userData.position = new Vector3(1, 0, 0)
    this.right.position.copy(this.right.userData.position)
    this.right.lookAt(0, 0, 0)
    this.right.name = 'right'

    this.front.userData.position = new Vector3(0, 0, 1)
    this.front.position.copy(this.front.userData.position)
    this.front.lookAt(0, 0, 0)
    this.front.name = 'front'

    this.back.userData.position = new Vector3(0, 0, -1)
    this.back.position.copy(this.back.userData.position)
    this.back.lookAt(0, 0, 0)
    this.back.name = 'back'
  }
  get cameras() {
    return [this.perspective, this.top, this.bottom, this.left, this.right, this.front, this.back]
  }
  getCamera(name: string) {
    return this.cameras.find(camera => camera.name === name)
  }
}



export type ViewCamerasProps = NodeProps & {
  viewport: IoThreeViewport
  applet: ThreeApplet | Binding<ThreeApplet>
  cameraSelect: string | Binding<string>
}

@Register
export class ViewCameras extends Node {

  @Property()
  declare private viewport: IoThreeViewport

  @ReactiveProperty({type: ThreeApplet})
  declare public applet: ThreeApplet

  @ReactiveProperty({type: String, value: 'perspective'})
  declare public cameraSelect: string

  @ReactiveProperty({type: Camera})
  declare public camera: PerspectiveCamera | OrthographicCamera

  @ReactiveProperty({type: DefaultCameras, init: null})
  declare private readonly defaultCameras: DefaultCameras

  @ReactiveProperty({type: OrbitControls, init: ['this.defaultCameras.perspective']})
  declare private readonly orbitControls: OrbitControls

  static get Listeners() {
    return {
      'scene-ready': 'onSceneReady'
    }
  }

  constructor(args: ViewCamerasProps) {
    super(args)

    this.orbitControls.connect(this.viewport)
    this.orbitControls.addEventListener('change', () => {
      this.applet.dispatchMutation()
    })

    if (this.camera === undefined) this.camera = this.defaultCameras.perspective
  }

  cameraSelectChanged() {
    this.debounce(this.cameraSelectChangedDebounced)
  }

  cameraSelectChangedDebounced() {
    let matchedCamera: PerspectiveCamera | OrthographicCamera | undefined
    if (this.cameraSelect.startsWith('scene')) {
      const cameraId = this.cameraSelect.split(':')[1] || ''
      const persp = this.applet.scene.getObjectsByProperty('isPerspectiveCamera', true)
      const ortho = this.applet.scene.getObjectsByProperty('isOrthographicCamera', true)
      const cameras = [...persp, ...ortho]

      if (cameraId) {
        matchedCamera = cameras.find(camera => camera.name === cameraId) as PerspectiveCamera | OrthographicCamera | undefined
        if (!matchedCamera) {
          console.warn(`Camera ${cameraId} not found in the scene, using default perspective camera`)
        }
      } else {
        matchedCamera = cameras[0] as PerspectiveCamera | OrthographicCamera | undefined
        if (!matchedCamera) {
          console.warn('No cameras found in the scene, using default perspective camera')
        }
      }
      if (matchedCamera) {
        this.camera = matchedCamera
      } else {
        this.camera = this.defaultCameras.perspective
      }
    } else {
      matchedCamera = this.defaultCameras.getCamera(this.cameraSelect)
      if (matchedCamera) {
        this.camera = matchedCamera
      } else {
        console.warn(`Camera ${this.cameraSelect} not found in the default cameras, using default perspective camera`)
        this.camera = this.defaultCameras.perspective
      }
    }
  }

  cameraChanged() {
    // TODO: redundant if camera is one of the defaults?
    // TODO: Consider leaving scene camera aspect ratio unchanged or:
    // - Set it temporarily to match viewport aspect ratio (show frame mask) and restore it
    if (!this.defaultCameras.cameras.includes(this.camera)) {
      this.orbitControls.enabled = false
    } else {
      this.orbitControls.enabled = true
      this.orbitControls.object = this.camera
      this.orbitControls.enableRotate = !!(this.camera as PerspectiveCamera).isPerspectiveCamera
    }
  }

  appletChanged() {
    for (const camera of this.defaultCameras.cameras) {
      camera.position.copy(camera.userData.position)
      camera.lookAt(0, 0, 0)
      this.frameObject(this.applet.scene, camera)
    }
    this.debounce(this.cameraSelectChangedDebounced)
  }

  onSceneReady() {
    this.appletChanged()
  }

  frameObject(object: Object3D, camera: Camera) {

    box.setFromObject( object )

    if ( box.isEmpty() === false ) {
      box.getCenter( center )
      radius = box.getBoundingSphere( sphere ).radius
    } else {
      // Focusing on an Group, AmbientLight, etc
      // TODO: Investigate and make more robust
      center.setFromMatrixPosition( camera.matrixWorld )
      radius = 0.1
    }
   
    // Project box onto camera axes
    cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion)
    cameraUp.set(0, 1, 0).applyQuaternion(camera.quaternion)
    cameraForward.set(0, 0, -1).applyQuaternion(camera.quaternion)

    box.getSize(size).multiplyScalar(0.5)

    const halfWidth = Math.abs(size.x * cameraRight.x) + Math.abs(size.y * cameraRight.y) + Math.abs(size.z * cameraRight.z)
    const halfHeight = Math.abs(size.x * cameraUp.x) + Math.abs(size.y * cameraUp.y) + Math.abs(size.z * cameraUp.z)
    const halfDepth = Math.abs(size.x * cameraForward.x) + Math.abs(size.y * cameraForward.y) + Math.abs(size.z * cameraForward.z)

    if (camera instanceof PerspectiveCamera) {

      const vfov = camera.fov * Math.PI / 180
      const tanHalfVfov = Math.tan(vfov / 2)
      const aspect = camera.aspect || 1

      let distance = 0
      for (let i = 0; i < 8; i++) {
        corner.set(
          (i & 1) ? box.max.x : box.min.x,
          (i & 2) ? box.max.y : box.min.y,
          (i & 4) ? box.max.z : box.min.z
        ).sub(center)

        const x = corner.dot(cameraRight)
        const y = corner.dot(cameraUp)
        const z = corner.dot(cameraForward)

        const distV = Math.abs(y) / tanHalfVfov - z
        const distH = Math.abs(x) / (tanHalfVfov * aspect) - z
        distance = Math.max(distance, distV, distH)
      }

      delta.set(0, 0, 1)
        .applyQuaternion(camera.quaternion)
        .multiplyScalar(distance)
      camera.position.copy(center).add(delta)

      camera.near = Math.max(halfDepth * 0.1)
      camera.far = distance + halfDepth * 20
      camera.updateProjectionMatrix()

    } else if (camera instanceof OrthographicCamera) {

      delta.set(0, 0, 1).applyQuaternion(camera.quaternion).multiplyScalar(radius)
      camera.position.copy(center).add(delta)
      camera.lookAt(center)

      camera.left = -halfWidth
      camera.right = halfWidth
      camera.bottom = -halfHeight
      camera.top = halfHeight

      camera.zoom = 1
      camera.near = 0
      camera.far = radius + halfDepth * 20

      camera.updateProjectionMatrix()
    }

    this.orbitControls.target.copy( center )
  }

  setOverscan(width: number, height: number, overscan: number) {

    const camera = this.camera
    const resetCamera = resetCameras.get(camera) || camera.clone(false)
    resetCamera.copy(camera, false)
    resetCameras.set(camera, resetCamera)

    const aspect = width / height
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = aspect
      camera.fov *= overscan
    } else if (camera instanceof OrthographicCamera) {
      const frustumHeight = camera.top - camera.bottom
      const frustumWidth = camera.right - camera.left
      const frustumAspect = frustumWidth / frustumHeight

      if (frustumAspect > aspect) {
        camera.top = frustumWidth / 2 / aspect
        camera.bottom = -frustumWidth / 2 / aspect
      } else {
        camera.left = -frustumHeight / 2 * aspect
        camera.right = frustumHeight / 2 * aspect
      }

      camera.top *= overscan
      camera.bottom *= overscan
      camera.left *= overscan
      camera.right *= overscan
    }
    camera.updateProjectionMatrix()
  }

  resetOverscan() {
    const camera = this.camera
    const resetCamera = resetCameras.get(camera)
    if (resetCamera) {
      camera.copy(resetCamera, false)
    }
  }

  dispose() {
    this.orbitControls.dispose()
    super.dispose()
  }
}