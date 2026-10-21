import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  Group,
  InstancedMesh,
  Material,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicNodeMaterial,
  Node,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  RenderTarget,
  Scene,
  UniformNode,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { overrideNode, time } from 'three/tsl'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { CityGenerator, createBuildingMaterial, createRoadMaterial } from 'three/addons/generators/CityGenerator.js'
import { LightProbeGrid } from 'three/addons/lighting/LightProbeGrid.js'
import { LightProbeGridHelper } from 'three/addons/helpers/LightProbeGridHelper.js'
import { Register, Property, Field } from '@io-gui/core'
import { Bloom, Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of playback. The clouds drift without repeating, so they jump at the wrap. */
const DURATION = 60

// the irradiance grid spans the whole footprint plus the streets, rising to
// the mid-rise rooftops. diffuse GI is low frequency, so a coarse grid still
// reads the urban canyon: streets sit in shade, walls glow with terracotta bounce
const GRID_SIZE = new Vector3( 240, 120, 170 )
const GRID_PROBES = new Vector3( 10, 7, 8 )

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

/**
 * Workaround (upstream: triage-fragment-node-mrt): the helper's `fragmentNode` writes only the first color output,
 * so the TRAA views' MRT pass rejects its pipeline. The same irradiance as the color of a basic material.
 */
function useBasicMaterial( helper: LightProbeGridHelper ) {
  const previous = helper.material
  helper.material = new MeshBasicNodeMaterial( { colorNode: previous.fragmentNode as Node<'vec4'> } )
  previous.dispose()
}

/** What a renderer has baked: its sky environment and how far it got with the probes. */
interface Bake {
  pmremGenerator: PMREMGenerator
  envRenderTarget: RenderTarget | null
  version: number
  bakeIndex: number
  bakePass: number
}

/**
 * A procedural city (`CityGenerator`) on wet asphalt under a physical sky, lit by a directional sun, a hint of sky
 * environment and a `LightProbeGrid` whose occlusion-aware irradiance puts the streets in shade. `timeOfDay` walks the
 * sun along its arc, `seed` builds another city; both regenerate the sky environment and restart the probe bake in
 * `onBeforeDraw`, which bakes one row of probes per draw against the city's box proxy (direct light, then one
 * bounce). `gi` toggles the grid's light, `showProbes` its helper. The source's bloom is the document's (Rendering),
 * as is its exposure; its first-person controls are dropped, and the active camera keeps its start pose. The clouds
 * drift on the timeline. Plays when opened.
 */
@Register
export class GeneratorCityExample extends Document {

  @Property({type: Number, value: 94})
  declare seed: number

  /** Hours: 6 sunrise, 12 noon, 18 sunset. */
  @Property({type: Number, value: 6.4})
  declare timeOfDay: number

  @Property({type: Boolean, value: true})
  declare gi: boolean

  @Property({type: Boolean, value: false})
  declare showProbes: boolean

  public city: CityGenerator
  public cityGroup: Group | null = null
  public sunLight: DirectionalLight
  public sky: SkyMesh
  public probes: LightProbeGrid
  public probesHelper: LightProbeGridHelper
  private cityProxy: InstancedMesh | null = null
  private materials: { building: Material }
  private cityBounds: Box3
  private sun = new Vector3()
  private envScene = new Scene()
  private environmentSky: SkyMesh
  /** Bumped by edits that regenerate the environment and restart the probe bake. */
  private bakeVersion = 0
  private bakes = new WeakMap<WebGPURenderer, Bake>()
  /** Whether the helper samples the grid's atlas, which the first bake creates. */
  private helperBound = false

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 0.13,
      bloom: new Bloom({enabled: true, strength: 0.05, radius: 0, threshold: 0}),
      timeline: new Timeline({autoplay: true, duration: DURATION}),
      ...args,
    })

    this.scene.environmentIntensity = 0.05 // a hint of sky in the reflections; the diffuse sky fill comes occlusion-aware from the probe grid

    // a physical sky drives both the backdrop and the image-based
    // lighting; the time-of-day slider walks the sun along its arc
    this.sky = createSky( this.timeline.timeNode )
    this.scene.add( this.sky )

    this.environmentSky = createSky( this.timeline.timeNode )
    this.environmentSky.showSunDisc.value = false
    this.envScene.add( this.environmentSky )

    const camera = new PerspectiveCamera( 55, 400 / 250, 1, 20000 )
    camera.name = 'Camera'
    camera.position.set( - 35, 55, - 100 )
    camera.lookAt( 35, 55, 0 )
    this.activeCamera = camera

    this.city = new CityGenerator( { seed: this.seed } )

    // road: wet asphalt with sidewalks, lane lines and crosswalks, all
    // aligned to the city grid via TSL. sized to the city footprint plus
    // one street ( a crosswalk's width ) of margin all round
    const floorW = this.city.layout.cityW + 2 * this.city.layout.street
    const floorD = this.city.layout.cityD + 2 * this.city.layout.street
    const ground = new Mesh( new PlaneGeometry( floorW, floorD ).rotateX( - Math.PI / 2 ), createRoadMaterial( this.city.layout ) )
    ground.name = 'Ground'
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    // everything a shadow can touch fits this box: the ground plane up to just
    // above the tallest tower crown. updateSun() wraps the shadow camera around it
    this.cityBounds = new Box3(
      new Vector3( - floorW / 2, 0, - floorD / 2 ),
      new Vector3( floorW / 2, 160, floorD / 2 )
    )

    // a single directional key aligned with the sky's sun, for the crisp
    // relief shadows the IBL alone can't give. its colour, intensity and
    // position — and the baked environment — are set by updateSun()
    this.sunLight = new DirectionalLight()
    this.sunLight.name = 'Sun'
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.set( 4096, 4096 )
    // acne is suppressed along the surface normal ( in world units ) rather
    // than with a depth bias: a depth bias scales with the shadow range, and
    // even a small one erases short casters, like the shadow beneath a car
    this.sunLight.shadow.normalBias = 0.05
    this.scene.add( this.sunLight )

    this.updateSun()

    this.materials = { building: createBuildingMaterial( this.city.layout, this.city.seedNode ) }
    this.generateCity()

    // irradiance probes across the city, with the bottom layer just above the road
    this.probes = new LightProbeGrid( GRID_SIZE.x, GRID_SIZE.y, GRID_SIZE.z, GRID_PROBES.x, GRID_PROBES.y, GRID_PROBES.z )
    this.probes.name = 'Probes'
    this.probes.position.set( 0, GRID_SIZE.y / 2 + 1, 0 )
    this.probes.visible = this.gi
    this.scene.add( this.probes )

    this.probesHelper = new LightProbeGridHelper( this.probes, 3 )
    this.probesHelper.name = 'Probes Helper'
    this.probesHelper.visible = this.showProbes
    this.probesHelper.userData.selectable = false
    useBasicMaterial( this.probesHelper )
    this.scene.add( this.probesHelper )
  }

  /** The sky dwarfs the city. */
  override getEditorFrameTarget() {
    return this._frameTarget
  }

  seedChanged() {
    if ( ! this.materials ) return
    this.generateCity()
    this.bakeVersion ++
    this.notify({kind: 'structure'})
  }

  timeOfDayChanged() {
    this.updateSun()
  }

  giChanged() {
    if ( this.probes ) this.probes.visible = this.gi
  }

  showProbesChanged() {
    if ( this.probesHelper ) this.probesHelper.visible = this.showProbes
  }

  private updateSun() {
    const sunLight = this.sunLight
    if ( ! sunLight ) return

    const t = this.timeOfDay
    const u = ( t - 12 ) / 6 // -1 at sunrise, 0 at noon, +1 at sunset
    const elevation = Math.max( 0, 1 - u * u ) * 72 // degrees above the horizon, peaks at noon
    const azimuth = 90 - u * 55 // the sun swings east → west across the day

    const sun = this.sun.setFromSphericalCoords(
      1,
      MathUtils.degToRad( 90 - elevation ),
      MathUtils.degToRad( azimuth )
    )

    this.sky.sunPosition.value.copy( sun )
    this.environmentSky.sunPosition.value.copy( sun )

    // physically-motivated key light: on a real hazy midday the sun delivers
    // about three times the sky's irradiance onto a horizontal surface, so it
    // is anchored to ~3x the sky dome the probes capture. the longer air path
    // near the horizon dims and warms it ( the fill dims with it, as the
    // environment and probes are re-baked ).
    const sinElevation = Math.sin( MathUtils.degToRad( elevation ) )
    const transmittance = Math.sqrt( Math.max( sinElevation, 0 ) ) // 0 at the horizon → 1 at the zenith
    sunLight.color.set( 0xffb072 ).lerp( new Color( 0xfff4e8 ), transmittance )
    sunLight.intensity = 100 * transmittance // illuminance perpendicular to the rays; the renderer applies N·L per surface
    sunLight.position.copy( sun ).multiplyScalar( 600 )

    // shrink-wrap the shadow camera around the city for this sun angle: project
    // the scene box into light space and fit the ortho bounds and depth range to
    // it, so the map spends its texels only where shadows can actually fall
    const shadowCamera = sunLight.shadow.camera
    const lightSpace = new Quaternion().setFromRotationMatrix( new Matrix4().lookAt( sunLight.position, this.scene.position, Object3D.DEFAULT_UP ) ).invert()
    const fit = new Box3()
    const corner = new Vector3()
    const cityBounds = this.cityBounds

    for ( let i = 0; i < 8; i ++ ) {
      corner.set(
        i & 1 ? cityBounds.max.x : cityBounds.min.x,
        i & 2 ? cityBounds.max.y : cityBounds.min.y,
        i & 4 ? cityBounds.max.z : cityBounds.min.z
      ).sub( sunLight.position ).applyQuaternion( lightSpace )
      fit.expandByPoint( corner )
    }

    const pad = 2
    shadowCamera.left = fit.min.x - pad
    shadowCamera.right = fit.max.x + pad
    shadowCamera.bottom = fit.min.y - pad
    shadowCamera.top = fit.max.y + pad
    shadowCamera.near = - fit.max.z - pad // the camera looks down its negative z axis, so depth flips sign
    shadowCamera.far = - fit.min.z + pad
    shadowCamera.updateProjectionMatrix()

    // re-bake the sky ( without the sun disc ) into the environment map for IBL, and the probes
    this.bakeVersion ++
  }

  private generateCity() {
    if ( this.cityGroup ) this.scene.remove( this.cityGroup )

    const cityProxy = this.cityProxy

    if ( cityProxy ) {
      const material = cityProxy.material as Material
      this.scene.remove( cityProxy )
      cityProxy.geometry.dispose()
      material.dispose()
      cityProxy.dispose()
    }

    this.city.parameters.seed = this.seed

    this.cityGroup = this.city.build( this.materials )
    this.cityGroup.name = 'City'
    this.scene.add( this.cityGroup )

    // the box proxy shares the towers just built; it stands in only during the bake
    this.cityProxy = this.city.buildProxy()
    this.cityProxy.name = 'City Proxy'
    this.cityProxy.visible = false
    this.cityProxy.userData.selectable = false
    this.scene.add( this.cityProxy )

    this._frameTarget = this.cityGroup
  }

  /**
   * Regenerates the sky environment and restarts the probe bake after an edit, then bakes the next row of probes and
   * asks for another draw until both passes are done. Each renderer keeps its own environment and progress.
   */
  override onBeforeDraw(renderer: WebGPURenderer) {
    let bake = this.bakes.get( renderer )

    if ( ! bake ) {
      bake = { pmremGenerator: new PMREMGenerator( renderer ), envRenderTarget: null, version: - 1, bakeIndex: 0, bakePass: 0 }
      this.bakes.set( renderer, bake )
    }

    if ( bake.version !== this.bakeVersion ) {
      // reuse one render target so the texture keeps its identity: a fresh texture
      // would force every material to recompile its shader
      bake.envRenderTarget = bake.pmremGenerator.fromScene( this.envScene, 0, 0.1, 100, { renderTarget: bake.envRenderTarget } )
      this.scene.environment = bake.envRenderTarget.texture
      bake.version = this.bakeVersion
      bake.bakeIndex = 0
      bake.bakePass = 0
    }

    const totalProbes = GRID_PROBES.x * GRID_PROBES.y * GRID_PROBES.z
    const cityGroup = this.cityGroup
    const cityProxy = this.cityProxy
    if ( bake.bakeIndex >= totalProbes || ! cityGroup || ! cityProxy ) return

    // capture the box proxy, ground and sky without the helper or sun disc.
    // the directional light supplies sunlight; pass 1 captures the diffuse bounce
    const helper = this.probesHelper
    const helperVisible = helper.visible

    helper.visible = false
    cityGroup.visible = false
    cityProxy.visible = true
    this.sky.showSunDisc.value = false

    try {
      // Publish one row per draw. Finish the direct pass before starting
      // the indirect pass, which reads a snapshot of the completed direct bake.
      this.probes.bake( renderer, this.scene, {
        cubemapSize: 16,
        near: 0.1,
        far: 20000,
        start: bake.bakeIndex,
        count: GRID_PROBES.x,
        pass: bake.bakePass
      } )
    } finally {
      this.sky.showSunDisc.value = true
      cityProxy.visible = false
      cityGroup.visible = true
      helper.visible = helperVisible
    }

    if ( ! this.helperBound ) {
      helper.update()
      this.helperBound = true
    }

    bake.bakeIndex += GRID_PROBES.x

    if ( bake.bakeIndex === totalProbes && bake.bakePass === 0 ) {
      bake.bakeIndex = 0
      bake.bakePass = 1
    }

    if ( bake.bakeIndex < totalProbes ) this.notify({kind: 'other'})
  }
}

registerEditorConfig(GeneratorCityExample, [
  ['seed', ioNumberSlider({min: 0, max: 100, step: 1})],
  ['timeOfDay', ioNumberSlider({min: 6, max: 18, step: 0.1})],
])

registerEditorGroups(GeneratorCityExample, {
  Main: ['seed', 'timeOfDay', 'gi', 'showProbes'],
  Hidden: [
    'city', 'cityGroup', 'sunLight', 'sky', 'probes', 'probesHelper', 'cityProxy', 'materials', 'cityBounds', 'sun',
    'envScene', 'environmentSky', 'bakeVersion', 'bakes', 'helperBound',
  ],
})
