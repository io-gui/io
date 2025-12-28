import { Register, Node, ReactiveProperty, Property, NodeProps, Binding } from '@io-gui/core'
import { IoThreeViewport } from '../elements/IoThreeViewport.js'
import { ThreeState } from './ThreeState.js'
import { Box3, Camera, Object3D, OrthographicCamera, PerspectiveCamera, Sphere, Vector3 } from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const box = new Box3()
const sphere = new Sphere()
const center = new Vector3()
const delta = new Vector3()

function setAspect(camera: PerspectiveCamera | OrthographicCamera, width: number, height: number) {
  const aspect = width / height
  if (camera instanceof PerspectiveCamera) {
    camera.aspect = aspect
  } else if (camera instanceof OrthographicCamera) {
    const frustumHeight = camera.top - camera.bottom
    camera.left = - frustumHeight * aspect / 2
    camera.right = frustumHeight * aspect / 2
  }
  camera.updateProjectionMatrix()
}

class DefaultCameras {
  public perspective: PerspectiveCamera
  public top: OrthographicCamera
  public bottom: OrthographicCamera
  public left: OrthographicCamera
  public right: OrthographicCamera
  public front: OrthographicCamera
  public back: OrthographicCamera
  constructor() {
    this.perspective = new PerspectiveCamera(75, 1, 0.1, 1000)
    this.top = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.bottom = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.left = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.right = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.front = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)
    this.back = new OrthographicCamera(-1, 1, 1, -1, 0, 1000)

    this.perspective.position.set(0.5, 0.25, 1)
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
  state: ThreeState
  cameraSelect: string | Binding<string>
}

@Register
export class ViewCameras extends Node {
  @Property(0)
  declare private width: number
  @Property(0)
  declare private height: number

  @Property()
  declare private viewport: IoThreeViewport

  @ReactiveProperty({type: ThreeState})
  declare public state: ThreeState

  @ReactiveProperty({type: String, value: 'perspective'})
  declare public cameraSelect: string

  @ReactiveProperty({type: Camera})
  declare public camera: PerspectiveCamera | OrthographicCamera

  @ReactiveProperty({type: DefaultCameras, init: null})
  declare private readonly defaultCameras: DefaultCameras

  @ReactiveProperty({type: OrbitControls, init: ['this.defaultCameras.perspective']})
  declare private readonly orbitControls: OrbitControls

  constructor(args: ViewCamerasProps) {
    super(args)

    this.orbitControls.connect(this.viewport)
    this.orbitControls.addEventListener('change', () => {
      this.state.dispatchMutation()
    })

    if (this.camera === undefined) this.camera = this.defaultCameras.perspective
  }

  cameraSelectChanged() {
    if (this.cameraSelect.startsWith('scene')) {
      const cameraId = this.cameraSelect.split(':')[1] || ''
      const persp = this.state.scene.getObjectsByProperty('isPerspectiveCamera', true)
      const ortho = this.state.scene.getObjectsByProperty('isOrthographicCamera', true)
      const cameras = [...persp, ...ortho]

      let matchedCamera: PerspectiveCamera | OrthographicCamera | undefined
      if (cameraId) {
        matchedCamera = cameras.find(camera => camera.name === cameraId) as PerspectiveCamera | OrthographicCamera | undefined
      } else {
        matchedCamera = cameras[0] as PerspectiveCamera | OrthographicCamera | undefined
      }
      if (matchedCamera) {
        this.camera = matchedCamera
      } else {
        this.camera = this.defaultCameras.perspective
        console.warn(`Camera ${cameraId} not found in the scene, using default perspective camera`)
      }
    } else {
      this.camera = this.defaultCameras.getCamera(this.cameraSelect) || this.defaultCameras.perspective
    }
    this.orbitControls.object = this.camera
  }

  setSize(width: number, height: number) {
    if (width === 0 || height === 0) return
    if (this.width !== width || this.height !== height) {
      for (const camera of this.defaultCameras.cameras) {
        setAspect(camera, width, height)
      }
      // setAspect(this.camera, width, height)
      this.width = width
      this.height = height
    }
  }

  cameraChanged() {
    // TODO: redundant if camera is one of the defaults?
    // TODO: Consider leaving scene camera aspect ratio unchanged or:
    // - Set it temporarily to match viewport aspect ratio (show frame mask) and restore it

    // if (!this.defaultCameras.cameras.includes(this.camera)) {
    //   console.log('cameraChanged', this.camera, this.width, this.height)
    //   setAspect(this.camera, this.width, this.height)
    // }
  }

  stateChanged() {
    for (const camera of this.defaultCameras.cameras) {
      this.frameObject(this.state.scene, camera)
    }
  }

  frameObject(object: Object3D, camera: Camera) {

    let distance

    box.setFromObject( object )

    if ( box.isEmpty() === false ) {
      box.getCenter( center )
      distance = box.getBoundingSphere( sphere ).radius
    } else {
      // Focusing on an Group, AmbientLight, etc
      // TODO: Investigate and make more robust
      center.setFromMatrixPosition( camera.matrixWorld )
      distance = 0.1
    }

    // TODO: Consider frustum geometry (fov) when framing

    delta.set( 0, 0, 1 )
    delta.applyQuaternion( camera.quaternion )
    delta.multiplyScalar( distance * 2 )

    if (camera instanceof PerspectiveCamera) {
      camera.near = distance * 0.001
      camera.far = distance * 16
      camera.updateProjectionMatrix()
      camera.position.copy( center ).add( delta )
    } else if (camera instanceof OrthographicCamera) {
      delta.copy(camera.userData.position).multiplyScalar(distance)
      const aspect = this.width / this.height
      camera.top = distance
      camera.bottom = - distance
      camera.left = - distance * aspect
      camera.right = distance * aspect

      camera.near = 0
      camera.far = distance * 8

      camera.position.copy( center ).add( delta)
      camera.lookAt( center )
      camera.updateProjectionMatrix()
    }
  }

  dispose() {
    this.orbitControls.dispose()
    super.dispose()
  }
}