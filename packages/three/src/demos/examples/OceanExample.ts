import {
  ACESFilmicToneMapping,
  BoxGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RenderTarget,
  RepeatWrapping,
  Scene,
  TextureLoader,
  UniformNode,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { overrideNode, time } from 'three/tsl'
import { WaterMesh } from 'three/addons/objects/WaterMesh.js'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { Register, Property } from '@io-gui/core'
import { Bloom, Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds of one loop: ten bobs (2π s each) and five turns about x (0.5 rad/s) of the box. Its turn about z
 * (0.51 rad/s), the waves and the clouds do not repeat, so they jump at the wrap.
 */
const PERIOD = 20 * Math.PI

/** The source's sky; its clouds drift on the timeline instead of TSL's global time. */
function createSky( timeNode: UniformNode<'float', number> ) {
  const sky = new SkyMesh()
  sky.name = 'Sky'
  sky.scale.setScalar( 10000 )
  sky.turbidity.value = 10
  sky.rayleigh.value = 2
  sky.mieCoefficient.value = 0.005
  sky.mieDirectionalG.value = 0.8
  sky.material.contextNode = overrideNode( time, timeNode )
  sky.userData.selectable = false
  return sky
}

/** A renderer's environment generator and the target of the environment it made last. */
interface Environment {
  pmremGenerator: PMREMGenerator
  renderTarget: RenderTarget | null
  version: number
}

/**
 * A box bobbing on a `WaterMesh` ocean (a TSL `reflector()` of each view, scrolling normal maps) under a `SkyMesh`
 * sky that also lights the scene as a PMREM environment: `elevation` and `azimuth` move the sun, which regenerates
 * that environment in `onBeforeDraw`. The waves and the clouds move on the timeline (the source moves them on TSL's
 * global `time`). The source's bloom is the document's (Rendering), as is its exposure. Plays when opened.
 */
@Register
export class OceanExample extends Document {

  @Property({type: Number, value: 2})
  declare elevation: number

  @Property({type: Number, value: 180})
  declare azimuth: number

  @Property({type: Number, value: 3.7})
  declare distortionScale: number

  @Property({type: Number, value: 1})
  declare size: number

  @Property({type: Number, value: 0.4})
  declare cloudCoverage: number

  @Property({type: Number, value: 0.5})
  declare cloudDensity: number

  @Property({type: Number, value: 0.5})
  declare cloudElevation: number

  public water: WaterMesh
  public sky: SkyMesh
  public mesh: Mesh
  private sceneEnv = new Scene()
  private environmentSky: SkyMesh
  /** Bumped when the sun moves: the sky environment is regenerated before the next draw. */
  private environmentVersion = 0
  private environments = new WeakMap<WebGPURenderer, Environment>()

  constructor(args?: DocumentProps) {
    super({
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 0.1,
      bloom: new Bloom({enabled: true, strength: 0.1, radius: 0, threshold: 0}),
      timeline: new Timeline({autoplay: true, duration: PERIOD}),
      ...args,
    })

    const camera = new PerspectiveCamera( 55, 400 / 250, 1, 20000 )
    camera.name = 'Camera'
    camera.position.set( 30, 30, 100 )
    camera.lookAt( 0, 10, 0 )
    this.activeCamera = camera

    // Water

    const waterGeometry = new PlaneGeometry( 10000, 10000 )

    // Views draw on document changes only, so report the texture when it arrives.
    const waterNormals = new TextureLoader().load( 'https://threejs.org/examples/textures/waternormals.jpg', () => this.notify({kind: 'material'}) )
    waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping

    this.water = new WaterMesh(
      waterGeometry,
      {
        waterNormals: waterNormals,
        sunDirection: new Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: this.distortionScale
      }
    )
    this.water.name = 'Water'
    this.water.rotation.x = - Math.PI / 2
    this.water.material.contextNode = overrideNode( time, this.timeline.timeNode )
    this.scene.add( this.water )

    // Skybox, and its copy for the environment

    this.sky = createSky( this.timeline.timeNode )
    this.scene.add( this.sky )

    this.environmentSky = createSky( this.timeline.timeNode )
    this.sceneEnv.add( this.environmentSky )

    //

    const geometry = new BoxGeometry( 30, 30, 30 )
    const material = new MeshStandardMaterial( { roughness: 0 } )

    this.mesh = new Mesh( geometry, material )
    this.mesh.name = 'Box'
    this.scene.add( this.mesh )

    this.updateSun()
    this.updateClouds()
    this.pose( this.timeline.currentTime )
  }

  /** The sky and the ocean dwarf the box. */
  override getEditorFrameTarget() {
    return this.mesh
  }

  private updateSun() {
    if ( ! this.water ) return

    const phi = MathUtils.degToRad( 90 - this.elevation )
    const theta = MathUtils.degToRad( this.azimuth )
    const sun = new Vector3().setFromSphericalCoords( 1, phi, theta )

    this.sky.sunPosition.value.copy( sun )
    this.environmentSky.sunPosition.value.copy( sun )
    this.water.sunDirection.value.copy( sun ).normalize()

    this.environmentVersion ++
  }

  private updateClouds() {
    if ( ! this.sky ) return

    for ( const sky of [ this.sky, this.environmentSky ] ) {
      sky.cloudCoverage.value = this.cloudCoverage
      sky.cloudDensity.value = this.cloudDensity
      sky.cloudElevation.value = this.cloudElevation
    }
  }

  elevationChanged() { this.updateSun() }
  azimuthChanged() { this.updateSun() }
  distortionScaleChanged() { if ( this.water ) this.water.distortionScale.value = this.distortionScale }
  sizeChanged() { if ( this.water ) this.water.size.value = this.size }
  cloudCoverageChanged() { this.updateClouds() }
  cloudDensityChanged() { this.updateClouds() }
  cloudElevationChanged() { this.updateClouds() }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.mesh.position.y = Math.sin( time ) * 20 + 5
    this.mesh.rotation.x = time * 0.5
    this.mesh.rotation.z = time * 0.51
  }

  /** Regenerates the sky environment after the sun moved (and before the first draw). */
  override onBeforeDraw(renderer: WebGPURenderer) {
    let environment = this.environments.get( renderer )

    if ( ! environment ) {
      environment = { pmremGenerator: new PMREMGenerator( renderer ), renderTarget: null, version: - 1 }
      this.environments.set( renderer, environment )
    }

    if ( environment.version === this.environmentVersion ) return

    if ( environment.renderTarget ) environment.renderTarget.dispose()

    environment.renderTarget = environment.pmremGenerator.fromScene( this.sceneEnv )
    environment.version = this.environmentVersion

    this.scene.environment = environment.renderTarget.texture
  }
}

registerEditorConfig(OceanExample, [
  ['elevation', ioNumberSlider({min: 0, max: 90, step: 0.1})],
  ['azimuth', ioNumberSlider({min: - 180, max: 180, step: 0.1})],
  ['distortionScale', ioNumberSlider({min: 0, max: 8, step: 0.1})],
  ['size', ioNumberSlider({min: 0.1, max: 10, step: 0.1})],
  ['cloudCoverage', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['cloudDensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['cloudElevation', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(OceanExample, {
  Main: ['elevation', 'azimuth'],
  Water: ['distortionScale', 'size'],
  Clouds: ['cloudCoverage', 'cloudDensity', 'cloudElevation'],
  Hidden: ['water', 'sky', 'mesh', 'sceneEnv', 'environmentSky', 'environmentVersion', 'environments'],
})
