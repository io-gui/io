import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferGeometry,
  CubeCamera,
  CubeRenderTarget,
  HalfFloatType,
  IcosahedronGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  TextureLoader,
  TorusKnotGeometry,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds of one loop: five orbits (2π s each), while the cube and torus knot turn six and nine times about x and y
 * (the source turns them 0.02 and 0.03 rad per frame: 1.2 and 1.8 rad/s at 60 fps).
 */
const PERIOD = 10 * Math.PI

/**
 * A mirror sphere reflecting a cube and a torus knot that orbit it in the Pisa HDR environment: a `CubeCamera` captures
 * the scene around the sphere before each draw (`onBeforeDraw`), with the sphere hidden. `roughness`, `metalness`,
 * `envIntensity` (the scene's `environmentIntensity`) and `knotEnvMap` (the torus knot's `envMapIntensity`) are in the
 * Document tab, exposure in Rendering. The active camera turns about the middle once per loop (the source's
 * `OrbitControls.autoRotate`, once in 30 s); views frame the orbits. Plays when opened.
 */
@Register
export class CubemapDynamicExample extends Document {

  @Property({type: Number, value: 0.05})
  declare roughness: number

  @Property({type: Number, value: 1})
  declare metalness: number

  @Property({type: Number, value: 1})
  declare envIntensity: number

  @Property({type: Number, value: 1})
  declare knotEnvMap: number

  public cube: Mesh
  public sphere: Mesh
  public torus: Mesh
  private material: MeshStandardNodeMaterial
  private material2: MeshStandardNodeMaterial
  private cubeCamera: CubeCamera
  private camera: PerspectiveCamera

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.camera = new PerspectiveCamera( 60, 400 / 250, 1, 1000 )
    this.camera.name = 'Camera'
    this.activeCamera = this.camera

    // Views draw on document changes only, so report the texture when it arrives.
    const uvTexture = new TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg', () => this.notify({kind: 'material'}) )

    //

    const cubeRenderTarget = new CubeRenderTarget( 256 )
    cubeRenderTarget.texture.type = HalfFloatType
    cubeRenderTarget.texture.minFilter = LinearMipmapLinearFilter
    cubeRenderTarget.texture.magFilter = LinearFilter
    cubeRenderTarget.texture.generateMipmaps = true

    this.cubeCamera = new CubeCamera( 1, 1000, cubeRenderTarget )

    //

    this.material = new MeshStandardNodeMaterial( {
      envMap: cubeRenderTarget.texture,
      roughness: 0.05,
      metalness: 1
    } )

    this.sphere = new Mesh( new IcosahedronGeometry( 15, 8 ), this.material )
    this.sphere.name = 'Sphere'
    this.scene.add( this.sphere )

    const material1 = new MeshStandardNodeMaterial( {
      map: uvTexture,
      roughness: 0.1,
      metalness: 0,
    } )

    // Its envMap is the Pisa cube map, set once loaded.
    this.material2 = new MeshStandardNodeMaterial( {
      map: uvTexture,
      roughness: 0.1,
      metalness: 0,
    } )

    this.cube = new Mesh( new BoxGeometry( 15, 15, 15 ), material1 )
    this.cube.name = 'Cube'
    this.scene.add( this.cube )

    this.torus = new Mesh( new TorusKnotGeometry( 8, 3, 128, 16 ), this.material2 )
    this.torus.name = 'Torus Knot'
    this.scene.add( this.torus )

    this.pose( this.timeline.currentTime )

    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async load() {
    try {
      const hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ]
      const texture = await new HDRCubeTextureLoader()
        .setPath( 'https://threejs.org/examples/textures/cube/pisaHDR/' )
        .loadAsync( hdrUrls )

      texture.name = 'pisaHDR'
      texture.minFilter = LinearMipmapLinearFilter
      texture.magFilter = LinearFilter

      this.scene.background = texture
      this.scene.environment = texture
      this.material2.envMap = texture
      this.material2.needsUpdate = true

      this.notify({kind: 'other'})
    } catch ( e ) {
      console.error( e )
    }
  }

  roughnessChanged() { this.updateMaterials() }
  metalnessChanged() { this.updateMaterials() }
  envIntensityChanged() { this.updateMaterials() }
  knotEnvMapChanged() { this.updateMaterials() }

  private updateMaterials() {
    if ( ! this.material ) return
    this.material.roughness = this.roughness
    this.material.metalness = this.metalness
    this.material2.envMapIntensity = this.knotEnvMap
    this.scene.environmentIntensity = this.envIntensity
    this.notify({kind: 'material'})
  }

  /** The orbits reach 30√2 from the middle: frame a stand-in for them. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 40, - 40, - 40 ), new Vector3( 40, 40, 40 ) ] ) )
    this._frameTarget = standIn
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const cube = this.cube
    const torus = this.torus

    cube.position.x = Math.cos( time ) * 30
    cube.position.y = Math.sin( time ) * 30
    cube.position.z = Math.sin( time ) * 30

    cube.rotation.x = time * 1.2
    cube.rotation.y = time * 1.8

    torus.position.x = Math.cos( time + 10 ) * 30
    torus.position.y = Math.sin( time + 10 ) * 30
    torus.position.z = Math.sin( time + 10 ) * 30

    torus.rotation.x = time * 1.2
    torus.rotation.y = time * 1.8

    // autoRotate turns the camera about the target, clockwise seen from above.
    const angle = - time * 2 * Math.PI / PERIOD
    this.camera.position.set( Math.sin( angle ) * 75, 0, Math.cos( angle ) * 75 )
    this.camera.lookAt( 0, 0, 0 )
  }

  /** Captures the scene around the sphere, without it. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    const visible = this.material.visible

    this.material.visible = false

    this.cubeCamera.update( renderer, this.scene )

    this.material.visible = visible
  }
}

registerEditorConfig(CubemapDynamicExample, [
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['envIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['knotEnvMap', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(CubemapDynamicExample, {
  Main: ['roughness', 'metalness', 'envIntensity', 'knotEnvMap'],
  Hidden: ['cube', 'sphere', 'torus', 'material', 'material2', 'cubeCamera', 'camera'],
})
