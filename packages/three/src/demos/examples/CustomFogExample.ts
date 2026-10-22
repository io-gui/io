import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  PerspectiveCamera,
  PMREMGenerator,
  RenderTarget,
  Scene,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { color, densityFogFactor, fog, normalWorld, positionWorld, triNoise3D, uniform } from 'three/tsl'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { TerrainGenerator } from 'three/addons/generators/TerrainGenerator.js'
import { ForestGenerator } from 'three/addons/generators/ForestGenerator.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of playback. The fog noise drifts without repeating, so it jumps at the wrap. */
const DURATION = 60

const _cameraPosition = new Vector3()

/** A renderer's environment generator and the target it reuses when the sun moves. */
interface Environment {
  pmremGenerator: PMREMGenerator
  renderTarget: RenderTarget | null
  version: number
}

/**
 * A generated valley (`TerrainGenerator`) planted with half a million trees (`ForestGenerator`) under a custom fog:
 * an animated, two-octave `triNoise3D` haze that settles into the valley as a band between `fogBase` and `fogTop`,
 * plus a distance `haze`. A sky that is never drawn lights the scene as a PMREM environment: `elevation` and `azimuth`
 * move the sun and its key light, and regenerate that environment in `onBeforeDraw`. The fog drifts on the timeline.
 * The forest thins out with the distance from the active camera (`cullFrom`, `cullTo`), the source's main camera, so
 * every view sees the same trees. The camera is in the scene: move it with the editor's tools (the source's
 * first-person controls are dropped) and the forest and its shadows follow. `regenerate` builds a new terrain
 * and forest from the next seed with the current `erosion` and `valleyBias`. Plays when opened.
 */
@Register
export class CustomFogExample extends Document {

  @Property({type: Number, value: 11})
  declare elevation: number

  @Property({type: Number, value: 150})
  declare azimuth: number

  @Property({type: Number, value: - 20})
  declare fogBase: number

  @Property({type: Number, value: 55})
  declare fogTop: number

  @Property({type: Number, value: 0.0012})
  declare haze: number

  @Property({type: Number, value: 300})
  declare cullFrom: number

  @Property({type: Number, value: 620})
  declare cullTo: number

  @Property({type: Number, value: 0.7})
  declare erosion: number

  @Property({type: Number, value: 1.2})
  declare valleyBias: number

  public terrain: TerrainGenerator
  public forest: ForestGenerator
  public sunLight: DirectionalLight
  private terrainGroup: Group | null = null
  private forestGroup: Group | null = null
  private sky: SkyMesh
  private envScene = new Scene()
  private fogBaseUniform = uniform( - 20 ) // world-y the fog is solid below ( the valley floor )
  private fogTopUniform = uniform( 55 ) // world-y the fog fades out by ( mid-mountain )
  private hazeUniform = uniform( 0.0012 ) // distance haze, so the far peaks dissolve into the same grey
  /** Bumped when the sun moves: the sky environment is regenerated before the next draw. */
  private environmentVersion = 0
  private environments = new WeakMap<WebGPURenderer, Environment>()
  /** The world position the forest is culled around: the active camera's when it was last applied. */
  private cullCentre = new Vector3()

  constructor(args?: DocumentProps) {
    super({
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 0.62,
      timeline: new Timeline({autoplay: true, duration: DURATION}),
      ...args,
    })

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 20000 )
    camera.name = 'Camera'
    camera.position.set( - 50, 88, 230 )
    camera.lookAt( 0, 5, - 120 ) // face across the valley
    this.activeCamera = camera

    this.scene.add( camera )

    this.scene.environmentIntensity = 0.16 // a dim, cool sky fill so the warm sun stays the key and shadows read

    // a physical sky, used only to bake the image-based lighting ( it is not
    // the visible background — the fog gradient below is ); elevation / azimuth move the sun
    this.sky = new SkyMesh()
    this.sky.scale.setScalar( 10000 )
    this.sky.turbidity.value = 12
    this.sky.rayleigh.value = 2
    this.sky.mieCoefficient.value = 0.005
    this.sky.mieDirectionalG.value = 0.88
    this.sky.showSunDisc.value = false
    this.envScene.add( this.sky )

    // custom fog. an animated, two-octave triNoise3D haze that settles into
    // the valley as a level band: solid below `fogBase` ( down under the
    // mountains ) and fading out by `fogTop` ( around mid-height ), so the
    // peaks rise clear above it. the band sits at a fixed altitude whatever
    // the distance, and the noise wobbles its top edge and drifts it through
    // world space, so it reads as slow-moving cloud. ( the peaks reach ~130 )
    const skyColor = color( 0xf0f5f5 )
    const groundColor = color( 0xd0dee7 )

    const time = this.timeline.timeNode
    const fogNoiseA = triNoise3D( positionWorld.mul( .005 ), 0.2, time )
    const fogNoiseB = triNoise3D( positionWorld.mul( .01 ), 0.2, time.mul( 1.2 ) )
    const fogNoise = fogNoiseA.add( fogNoiseB )

    // the noise lifts and drops the top of the band so it breaks into wisps
    const top = this.fogTopUniform.add( fogNoise.sub( 0.7 ).mul( 22 ) )
    const groundFogArea = top.sub( positionWorld.y ).div( top.sub( this.fogBaseUniform ) ).saturate().mul( .98 )

    // the valley band plus a distance haze, so the far peaks dissolve into the grey too
    const fogArea = groundFogArea.oneMinus().mul( densityFogFactor( this.hazeUniform ).oneMinus() ).oneMinus()

    this.scene.fogNode = fog( groundColor, fogArea )
    this.scene.backgroundNode = normalWorld.y.max( 0 ).mix( groundColor, skyColor )

    // terrain + forest

    this.terrain = new TerrainGenerator( {
      seed: 1,
      size: 900,
      segments: 512,
      frequency: 0.0065,
      heightScale: 150,
      erosion: this.erosion,
      valleyBias: this.valleyBias
    } )

    this.forest = new ForestGenerator( { count: 500000, castShadow: true, from: this.cullFrom, to: this.cullTo } )
    this.forest.setCameraPosition( camera.position ) // drives the forest cull; onBeforeDraw follows the camera
    this.cullCentre.copy( camera.position )

    // a single directional key aligned with the sky's sun, for the crisp relief
    // shadows the sky fill alone can't give. its colour, intensity and position —
    // and the baked environment — are set by updateSun()
    this.sunLight = new DirectionalLight()
    this.sunLight.name = 'Sun'
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.left = - 420
    this.sunLight.shadow.camera.right = 420
    this.sunLight.shadow.camera.top = 420
    this.sunLight.shadow.camera.bottom = - 420
    this.sunLight.shadow.camera.near = 200
    this.sunLight.shadow.camera.far = 1800
    this.sunLight.shadow.mapSize.set( 4096, 4096 )
    this.sunLight.shadow.bias = - 0.0004
    this.sunLight.shadow.normalBias = 0.15
    this.sunLight.shadow.autoUpdate = false // the scene is static — re-render the shadow map only when the sun moves ( see updateSun ), not every frame
    this.scene.add( this.sunLight )

    this.generate()
    this.updateSun()
  }

  /** a new seed ( and whatever erosion / valley bias is dialled in ) rebuilds the terrain, and with it the forest that sits on top */
  regenerate = () => {
    this.terrain.parameters.seed ++
    this.generate()
    this.notify({kind: 'structure'})
  }

  /** the forest sits on the terrain, so a new terrain means a new forest */
  private generate() {
    if ( this.terrainGroup ) this.scene.remove( this.terrainGroup )
    if ( this.forestGroup ) this.scene.remove( this.forestGroup )

    this.terrainGroup = this.terrain.build()
    this.forestGroup = this.forest.build( this.terrain )

    this.scene.add( this.terrainGroup )
    this.scene.add( this.forestGroup )

    this.sunLight.shadow.needsUpdate = true // rebuilt geometry ⇒ re-render the shadow map
  }

  /**
   * walks the sun: aligns the sky and the key light ( warm and dim near the horizon ); `onBeforeDraw` re-bakes the
   * sky into the IBL environment
   */
  private updateSun() {
    const sunLight = this.sunLight
    if ( ! sunLight ) return

    const elevation = this.elevation
    const sun = new Vector3().setFromSphericalCoords(
      1,
      MathUtils.degToRad( 90 - elevation ),
      MathUtils.degToRad( this.azimuth )
    )

    this.sky.sunPosition.value.copy( sun )

    // the longer air path near the horizon dims and warms the sun. it stays
    // far brighter than the sky fill, so it reads as the key and casts firm shadows
    const transmittance = Math.sqrt( Math.max( Math.sin( MathUtils.degToRad( elevation ) ), 0 ) )
    sunLight.color.set( 0xff7a2f ).lerp( new Color( 0xfff2e0 ), transmittance ) // deep orange → warm white
    sunLight.intensity = 11 * transmittance + 0.3
    sunLight.position.copy( sun ).multiplyScalar( 900 )
    sunLight.shadow.needsUpdate = true // the sun moved, so the on-demand shadow map needs one refresh

    this.environmentVersion ++
  }

  elevationChanged() { this.updateSun() }
  azimuthChanged() { this.updateSun() }
  fogBaseChanged() { this.fogBaseUniform.value = this.fogBase }
  fogTopChanged() { this.fogTopUniform.value = this.fogTop }
  hazeChanged() { this.hazeUniform.value = this.haze }
  cullFromChanged() { if ( this.forest ) this.forest.from.value = this.cullFrom }
  cullToChanged() { if ( this.forest ) this.forest.to.value = this.cullTo }
  erosionChanged() { if ( this.terrain ) this.terrain.parameters.erosion = this.erosion }
  valleyBiasChanged() { if ( this.terrain ) this.terrain.parameters.valleyBias = this.valleyBias }

  /**
   * Follows the active camera with the forest cull, and regenerates the sky environment after the sun moved (and before
   * the first draw), reusing the renderer's target.
   */
  override onBeforeDraw(renderer: WebGPURenderer) {
    this.followActiveCamera()

    let environment = this.environments.get( renderer )

    if ( ! environment ) {
      environment = { pmremGenerator: new PMREMGenerator( renderer ), renderTarget: null, version: - 1 }
      this.environments.set( renderer, environment )
    }

    if ( environment.version === this.environmentVersion ) return

    environment.renderTarget = environment.pmremGenerator.fromScene( this.envScene, 0, 0.1, 100, { renderTarget: environment.renderTarget } )
    environment.version = this.environmentVersion

    this.scene.environment = environment.renderTarget.texture
  }

  /**
   * Culls the forest around the active camera's world position again once the camera has moved (tools, the Inspector,
   * another active camera), and refreshes the shadow map, which holds the culled trees too.
   */
  private followActiveCamera() {
    const camera = this.activeCamera
    if ( ! camera ) return

    camera.getWorldPosition( _cameraPosition )
    if ( _cameraPosition.equals( this.cullCentre ) ) return

    this.cullCentre.copy( _cameraPosition )
    this.forest.setCameraPosition( this.cullCentre )
    this.sunLight.shadow.needsUpdate = true
  }
}

registerEditorConfig(CustomFogExample, [
  ['elevation', ioNumberSlider({min: 1, max: 40, step: 0.5})],
  ['azimuth', ioNumberSlider({min: 0, max: 360, step: 1})],
  ['fogBase', ioNumberSlider({min: - 40, max: 20, step: 1})],
  ['fogTop', ioNumberSlider({min: 0, max: 130, step: 1})],
  ['haze', ioNumberSlider({min: 0, max: 0.005, step: 0.0001})],
  ['cullFrom', ioNumberSlider({min: 50, max: 1000, step: 10})],
  ['cullTo', ioNumberSlider({min: 100, max: 1400, step: 10})],
  ['erosion', ioNumberSlider({min: 0, max: 1.5, step: 0.05})],
  ['valleyBias', ioNumberSlider({min: 1, max: 3, step: 0.1})],
])

registerEditorGroups(CustomFogExample, {
  Main: ['elevation', 'azimuth'],
  Fog: ['fogBase', 'fogTop', 'haze'],
  Forest: ['cullFrom', 'cullTo'],
  Terrain: ['erosion', 'valleyBias', 'regenerate'],
  Hidden: [
    'terrain', 'forest', 'sunLight', 'terrainGroup', 'forestGroup', 'sky', 'envScene',
    'fogBaseUniform', 'fogTopUniform', 'hazeUniform', 'environmentVersion', 'environments', 'cullCentre',
  ],
})
