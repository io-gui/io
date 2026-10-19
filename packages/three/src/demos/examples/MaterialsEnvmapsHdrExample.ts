import {
  ACESFilmicToneMapping,
  Color,
  CubeTexture,
  CubeTextureLoader,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Texture,
  TorusKnotGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js'
import { DebugEnvironment } from 'three/addons/environments/DebugEnvironment.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one turn of the knot: the timeline length, so looping is seamless (the source turns 0.005 rad per frame). */
const PERIOD = 20

type Environment = {background: Texture; envMap: Texture}

/**
 * A torus knot lit by a PMREM environment generated from a scene (`DebugEnvironment`), an LDR cube map or an HDR cube
 * map (`envMap`); the cube map is the background (the generated one shows its PMREM). The source's exposure control is
 * the document's `toneMappingExposure`. Its `debug` plane, which shows the PMREM texture as a 2D atlas, is dropped:
 * three's WebGPU PMREM is a cube texture. The knot turns with document time. Plays when opened.
 */
@Register
export class MaterialsEnvmapsHdrExample extends Document {

  public torusMesh: Mesh<TorusKnotGeometry, MeshStandardMaterial>

  @Property({type: String, value: 'HDR'})
  declare envMap: string

  @Property({type: Number, value: 0.0})
  declare roughness: number

  @Property({type: Number, value: 0.0})
  declare metalness: number

  /** The cube maps, loading from construction. */
  private cubeMaps: Promise<Record<string, CubeTexture>>
  /** PMREM environments by `envMap` name, once generated. */
  private environments: Record<string, Environment> = {}
  private preparing?: Promise<void>

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 120 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )

    this.torusMesh = new Mesh(
      new TorusKnotGeometry( 18, 8, 150, 20 ),
      new MeshStandardMaterial( { color: 0xffffff, metalness: this.metalness, roughness: this.roughness } )
    )
    this.torusMesh.name = 'TorusKnot'
    this.scene.add( this.torusMesh )

    this.cubeMaps = this.loadCubeMaps()

    this.pose( this.timeline.currentTime )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.preparing ??= this.prepare( renderer )
  }

  envMapChanged() { this.applyEnvironment() }

  roughnessChanged() {
    if ( this.torusMesh ) this.torusMesh.material.roughness = this.roughness
  }

  metalnessChanged() {
    if ( this.torusMesh ) this.torusMesh.material.metalness = this.metalness
  }

  private async loadCubeMaps() {
    const hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ]
    const ldrUrls = [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ]

    const [ hdrCubeMap, ldrCubeMap ] = await Promise.all( [
      new HDRCubeTextureLoader().setPath( 'https://threejs.org/examples/textures/cube/pisaHDR/' ).loadAsync( hdrUrls ),
      new CubeTextureLoader().setPath( 'https://threejs.org/examples/textures/cube/pisa/' ).loadAsync( ldrUrls ),
    ] )

    return { HDR: hdrCubeMap, LDR: ldrCubeMap }
  }

  /** Generates the PMREM environments with the first renderer: PMREMGenerator draws them. */
  private async prepare(renderer: WebGPURenderer) {
    const pmremGenerator = new PMREMGenerator( renderer )

    const generated = pmremGenerator.fromScene( new DebugEnvironment() ).texture
    this.environments.Generated = {background: generated, envMap: generated}
    this.applyEnvironment()

    try {
      const cubeMaps = await this.cubeMaps

      this.environments.HDR = {background: cubeMaps.HDR, envMap: pmremGenerator.fromCubemap( cubeMaps.HDR ).texture}
      cubeMaps.HDR.magFilter = LinearFilter
      cubeMaps.HDR.needsUpdate = true

      this.environments.LDR = {background: cubeMaps.LDR, envMap: pmremGenerator.fromCubemap( cubeMaps.LDR ).texture}

      this.applyEnvironment()
    } catch ( e ) {
      console.error( e )
    }

    pmremGenerator.dispose()
  }

  private applyEnvironment() {
    const environment = this.environments?.[ this.envMap ]
    if ( ! environment ) return

    if ( environment.envMap !== this.torusMesh.material.envMap ) {
      this.torusMesh.material.envMap = environment.envMap
      this.torusMesh.material.needsUpdate = true
    }

    this.scene.background = environment.background
    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( this.torusMesh ) this.torusMesh.rotation.y = time / PERIOD * Math.PI * 2
  }
}

registerEditorConfig(MaterialsEnvmapsHdrExample, [
  ['envMap', ioOptionSelect({model: new Menu({options: [ 'Generated', 'LDR', 'HDR' ]})})],
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsEnvmapsHdrExample, {
  Main: ['envMap', 'roughness', 'metalness'],
  Hidden: ['torusMesh', 'cubeMaps', 'environments', 'preparing'],
})
