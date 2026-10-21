import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  MathUtils,
  Mesh,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RenderTarget,
  Scene,
  ShadowMaterial,
  UniformNode,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { overrideNode, time, uniform } from 'three/tsl'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { SkyscraperGenerator, createSkyscraperMaterial, pickBuildingColor } from 'three/addons/generators/city/SkyscraperGenerator.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds of one turn of the camera: `OrbitControls.autoRotate` at speed 0.3 turns once in 200 s. The clouds drift
 * without repeating, so they jump at the wrap.
 */
const PERIOD = 200

/** The camera's orbit: the source's start position about the controls' target. */
const TARGET = new Vector3( 0, 58, 0 )
const ORBIT_RADIUS = Math.hypot( 120, 155 )
const ORBIT_START = Math.atan2( 120, 155 )
const ORBIT_HEIGHT = 95

// the key-light colours the sun blends between as it nears the horizon or climbs high
const sunHorizonColor = new Color( 0xffb072 )
const sunMiddayColor = new Color( 0xfff4e8 )

/** The source's physical sky; its clouds drift on the timeline instead of TSL's global time. */
function createSky( timeNode: UniformNode<'float', number> ) {
  const sky = new SkyMesh()
  sky.name = 'Sky'
  sky.scale.setScalar( 10000 )
  sky.turbidity.value = 8
  sky.rayleigh.value = 3
  sky.mieCoefficient.value = 0.008
  sky.mieDirectionalG.value = 0.88
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
 * A procedural skyscraper (`SkyscraperGenerator`) under a physical sky that also lights it as a PMREM environment,
 * with a directional key light whose shadow frustum fits the tower and the shadow it casts on an invisible ground.
 * The building controls rebuild the tower; `timeOfDay` moves the sun along its arc and regenerates the sky
 * environment in `onBeforeDraw` (without the sun disc, as the source bakes it). The active camera turns about the
 * tower once per loop (the source's `OrbitControls.autoRotate`), and the clouds drift on the timeline. Plays when
 * opened.
 */
@Register
export class GeneratorBuildingExample extends Document {

  @Property({type: Number, value: 7})
  declare seed: number

  @Property({type: Number, value: 100})
  declare height: number

  @Property({type: Number, value: 34})
  declare width: number

  @Property({type: Number, value: 28})
  declare depth: number

  @Property({type: Number, value: 4})
  declare floorHeight: number

  @Property({type: Number, value: 2.6})
  declare bayWidth: number

  @Property({type: Number, value: 5})
  declare chamfer: number

  @Property({type: Number, value: 1.5})
  declare setback: number

  /** Hours: 6 sunrise, 12 noon, 18 sunset. */
  @Property({type: Number, value: 17})
  declare timeOfDay: number

  public building: Mesh | null = null
  public sunLight: DirectionalLight
  public sky: SkyMesh
  private camera: PerspectiveCamera
  private material: MeshStandardNodeMaterial
  // every building takes one flat masonry colour; a uniform lets the seed
  // repick it without recompiling the shared material
  private baseColor = uniform( new Color( 0xc6c0b2 ) )
  /** The current sun direction. */
  private sun = new Vector3()
  private envScene = new Scene()
  private environmentSky: SkyMesh
  /** Bumped when the sun moves: the sky environment is regenerated before the next draw. */
  private environmentVersion = 0
  private environments = new WeakMap<WebGPURenderer, Environment>()

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 0.25,
      timeline: new Timeline({autoplay: true, duration: PERIOD}),
      ...args,
    })

    this.scene.environmentIntensity = 0.25 // sky as a soft fill; the sun is the key

    this.camera = new PerspectiveCamera( 45, 400 / 250, 1, 20000 )
    this.camera.name = 'Camera'
    this.activeCamera = this.camera

    // a physical sky drives both the backdrop and the image-based lighting; the
    // environment bakes a copy without the sun disc ( see onBeforeDraw )
    this.sky = createSky( this.timeline.timeNode )
    this.scene.add( this.sky )

    this.environmentSky = createSky( this.timeline.timeNode )
    this.environmentSky.showSunDisc.value = false
    this.envScene.add( this.environmentSky )

    // a single directional key aligned with the sky's sun, for the crisp
    // relief shadows the IBL alone can't give. updateSun() and
    // fitShadowCamera() drive its colour, intensity and shadow frustum
    this.sunLight = new DirectionalLight()
    this.sunLight.name = 'Sun'
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.set( 2048, 2048 )
    this.sunLight.shadow.bias = - 0.0004
    this.sunLight.target.name = 'Sun Target'
    this.scene.add( this.sunLight )
    this.scene.add( this.sunLight.target )

    // an invisible ground that only catches the tower's shadow, large
    // enough to hold the long shadow the low sun casts
    const ground = new Mesh(
      new PlaneGeometry( 2000, 2000 ).rotateX( - Math.PI / 2 ),
      new ShadowMaterial( { color: 0x000000, opacity: 0.35 } )
    )
    ground.name = 'Ground'
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    this.material = createSkyscraperMaterial( this.baseColor )

    // place the sun ( sky, IBL, key light and shadow ) for the current time
    this.updateSun()
    this.generate()
    this.turnCamera( this.timeline.currentTime )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  seedChanged() { this.regenerate() }
  heightChanged() { this.regenerate() }
  widthChanged() { this.regenerate() }
  depthChanged() { this.regenerate() }
  floorHeightChanged() { this.regenerate() }
  bayWidthChanged() { this.regenerate() }
  chamferChanged() { this.regenerate() }
  setbackChanged() { this.regenerate() }

  timeOfDayChanged() { this.updateSun() }

  private regenerate() {
    if ( ! this.material ) return
    this.generate()
    this.notify({kind: 'structure'})
  }

  private generate() {
    if ( this.building ) {
      this.scene.remove( this.building )
      this.building.geometry.dispose()
    }

    this.baseColor.value.setHex( pickBuildingColor( this.seed ) )

    const generator = new SkyscraperGenerator( {
      seed: this.seed,
      totalHeight: this.height,
      footprint: { width: this.width, depth: this.depth },
      floorHeight: this.floorHeight,
      bayWidth: this.bayWidth,
      chamferWidth: this.chamfer,
      setbackDepth: this.setback
    }, this.material )

    const building = generator.build()
    building.name = 'Building'
    building.castShadow = building.receiveShadow = true
    this.scene.add( building )
    this.building = building

    this.fitShadowCamera()

    this._frameTarget = building
  }

  private updateSun() {
    if ( ! this.sunLight ) return

    // map the time of day to a sun arc: low and warm at dawn / dusk, high and
    // bright at noon, sweeping east → west across the day
    const t = this.timeOfDay
    const u = ( t - 12 ) / 6 // -1 at sunrise, 0 at noon, +1 at sunset
    const elevation = Math.max( 0, 1 - u * u ) * 72 // degrees above the horizon, peaks at noon
    const azimuth = 90 - u * 55 // the sun swings east → west across the day

    this.sun.setFromSphericalCoords( 1, MathUtils.degToRad( 90 - elevation ), MathUtils.degToRad( azimuth ) )
    this.sky.sunPosition.value.copy( this.sun )
    this.environmentSky.sunPosition.value.copy( this.sun )

    // physically-motivated key light: real sunlight is far brighter than the
    // sky, so the sun stays the dominant source and cast shadows read clearly
    // against the soft sky fill. the longer air path near the horizon dims and
    // warms it ( the fill dims with it, as the environment is re-baked ).
    const sinElevation = Math.sin( MathUtils.degToRad( elevation ) )
    const transmittance = Math.sqrt( Math.max( sinElevation, 0 ) ) // 0 at the horizon → 1 at the zenith
    this.sunLight.color.copy( sunHorizonColor ).lerp( sunMiddayColor, transmittance )
    this.sunLight.intensity = 6 * transmittance // illuminance perpendicular to the rays; the renderer applies N·L per surface

    // re-bake the sky ( without the sun disc ) into the environment map for IBL
    this.environmentVersion ++

    this.fitShadowCamera()
  }

  private fitShadowCamera() {
    // fit the directional light's shadow frustum to the tower and the full
    // ground shadow it casts, so a low sun's long shadow isn't clipped
    const sun = this.sun
    const height = this.height
    const tipDistance = height / Math.max( sun.y, 0.05 ) // shadow tip on the ground
    const centerX = - sun.x * tipDistance * 0.5
    const centerZ = - sun.z * tipDistance * 0.5
    const radius = Math.hypot( this.width, this.depth ) * 0.5
    const half = Math.hypot( centerX, centerZ ) + radius + 20
    const distance = half + height // place the light clear of the whole scene

    this.sunLight.target.position.set( centerX, 0, centerZ )
    this.sunLight.target.updateMatrixWorld()
    this.sunLight.position.set( centerX + sun.x * distance, sun.y * distance, centerZ + sun.z * distance )

    const shadowCamera = this.sunLight.shadow.camera
    shadowCamera.left = - half
    shadowCamera.right = half
    shadowCamera.top = half
    shadowCamera.bottom = - half
    shadowCamera.near = 1
    shadowCamera.far = distance * 2
    shadowCamera.updateProjectionMatrix()
  }

  override onAnimate(delta: number, time: number) {
    this.turnCamera( time )
  }

  /** `OrbitControls.autoRotate` about the target from (120, 95, 155): clockwise seen from above. */
  private turnCamera(time: number) {
    const angle = ORBIT_START - time * 2 * Math.PI / PERIOD
    this.camera.position.set( Math.sin( angle ) * ORBIT_RADIUS, ORBIT_HEIGHT, Math.cos( angle ) * ORBIT_RADIUS )
    this.camera.lookAt( TARGET )
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

    environment.renderTarget = environment.pmremGenerator.fromScene( this.envScene )
    environment.version = this.environmentVersion

    this.scene.environment = environment.renderTarget.texture
  }
}

registerEditorConfig(GeneratorBuildingExample, [
  ['seed', ioNumberSlider({min: 0, max: 100, step: 1})],
  ['height', ioNumberSlider({min: 60, max: 200, step: 1})],
  ['width', ioNumberSlider({min: 18, max: 60, step: 1})],
  ['depth', ioNumberSlider({min: 16, max: 50, step: 1})],
  ['floorHeight', ioNumberSlider({min: 3, max: 6, step: 0.1})],
  ['bayWidth', ioNumberSlider({min: 1.8, max: 4.5, step: 0.1})],
  ['chamfer', ioNumberSlider({min: 0, max: 10, step: 0.5})],
  ['setback', ioNumberSlider({min: 0, max: 4, step: 0.1})],
  ['timeOfDay', ioNumberSlider({min: 6, max: 18, step: 0.1})],
])

registerEditorGroups(GeneratorBuildingExample, {
  Main: ['seed', 'height', 'width', 'depth', 'floorHeight', 'bayWidth', 'chamfer', 'setback', 'timeOfDay'],
  Hidden: [
    'building', 'sunLight', 'sky', 'camera', 'material', 'baseColor', 'sun', 'envScene', 'environmentSky',
    'environmentVersion', 'environments',
  ],
})
