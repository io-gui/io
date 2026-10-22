import {
  ACESFilmicToneMapping,
  Box3,
  Light,
  MathUtils,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { SunLight } from 'three/addons/lights/SunLight.js'
import { SunLightNode } from 'three/addons/lights/SunLightNode.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { LightProbeGrid } from 'three/addons/lighting/LightProbeGrid.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

// `Light.registerNode()` is r187 (the source at r186 used `renderer.library.addLight()`, deprecated since); not in
// @types/three 0.186.
( SunLight as unknown as typeof Light & { registerNode( lightNodeClass: typeof SunLightNode ): void } ).registerNode( SunLightNode )

const MODEL_INDEX_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/model-index.json'
const SAMPLE_ASSETS_BASE_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/'

/** Probes baked per draw: the source bakes 16 per frame, finishing each pass before the next bounce. */
const PROBES_PER_DRAW = 16

/** The grid's bounds (the source's `bounds` and `size` parameters, which have no controls). */
const PROBES_POSITION = new Vector3( - 0.5, 6, - 0.3 )
const PROBES_SIZE = new Vector3( 21, 11, 9 )

async function getSponzaModelURL() {
  const response = await fetch( MODEL_INDEX_URL )
  const models = await response.json() as {name: string; variants?: Record<string, string>}[]
  const sponzaInfo = models.find( ( model ) => model.name === 'Sponza' )

  if ( ! sponzaInfo ) {
    throw new Error( 'Sponza entry was not found in the glTF sample model index.' )
  }

  const variants = sponzaInfo.variants || {}
  const variantName = variants[ 'glTF-Binary' ] || variants[ 'glTF' ] || variants[ 'glTF-Embedded' ] || Object.values( variants )[ 0 ]

  if ( ! variantName ) {
    throw new Error( 'Sponza has no supported glTF variant in the model index.' )
  }

  const variantFolder = variantName.endsWith( '.glb' ) ? 'glTF-Binary' : 'glTF'
  return `${ SAMPLE_ASSETS_BASE_URL }${ sponzaInfo.name }/${ variantFolder }/${ variantName }`
}

/** How far a renderer got with the current bake. */
interface BakeProgress {
  probes: LightProbeGrid
  version: number
  index: number
  pass: number
}

/**
 * Sponza under a sky, lit by a `SunLight` and a `LightProbeGrid` with indirect bounces. Once the model has loaded, the
 * grid bakes progressively in `onBeforeDraw`, 16 probes per draw, one pass per bounce, and restarts after edits to
 * the light, `shadows` or `bounces`; the counts replace the grid. `gi` toggles the grid's light. The probe helpers
 * overlay shows each probe's irradiance on a sphere in the editor's views, so the source's `showProbes` and `probeSize`
 * are dropped, as are its first-person controls and Log Camera button; the active camera keeps its start pose. `shadows` turns the sun's shadows on and off (the
 * source also switches the renderer's shadow map, which the editor shares). Static: the bake runs on edits.
 */
@Register
export class LightprobesSponzaExample extends Document {

  @Property({type: Boolean, value: true})
  declare gi: boolean

  @Property({type: Number, value: - 75})
  declare lightAzimuth: number

  @Property({type: Number, value: 60})
  declare lightElevation: number

  @Property({type: Number, value: 100})
  declare lightIntensity: number

  @Property({type: Boolean, value: true})
  declare shadows: boolean

  @Property({type: Number, value: 10})
  declare countX: number

  @Property({type: Number, value: 7})
  declare countY: number

  @Property({type: Number, value: 7})
  declare countZ: number

  @Property({type: Number, value: 1})
  declare bounces: number

  public sky: SkyMesh
  public sunLight: SunLight
  public model: Object3D | null = null
  public probes: LightProbeGrid | null = null
  private probeFar = 100
  /** Bumped by edits that restart the bake of the current grid. */
  private bakeVersion = 0
  private progress = new WeakMap<WebGPURenderer, BakeProgress>()

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 1000 )
    camera.name = 'Camera'
    camera.position.set( - 10.25, 4.99, 0.40 )
    camera.rotation.set( 1.6505, - 1.5008, 1.6507 )
    this.activeCamera = camera

    this.sky = new SkyMesh()
    this.sky.name = 'Sky'
    this.sky.scale.setScalar( 450000 )
    this.sky.turbidity.value = 10
    this.sky.rayleigh.value = 2
    this.sky.mieCoefficient.value = 0.005
    this.sky.mieDirectionalG.value = 0.8
    this.sky.cloudSpeed.value = 0 // keep the clouds static, like the WebGL version
    this.sky.showSunDisc.value = false // the sun is represented by the light
    this.sky.userData.selectable = false
    this.scene.add( this.sky )

    this.sunLight = new SunLight( 0xfff2dc, this.lightIntensity )
    this.sunLight.name = 'Sun'
    this.sunLight.castShadow = this.shadows
    this.sunLight.shadow.camera.far = 50
    this.sunLight.shadow.mapSize.setScalar( 2048 )

    this.updateLightPosition()

    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async load() {
    try {
      const gltf = await new GLTFLoader().loadAsync( await getSponzaModelURL() )
      const model = gltf.scene
      model.name = 'Sponza'

      const embeddedLights: Object3D[] = []

      model.traverse( ( child ) => {
        if ( ( child as Mesh ).isMesh ) {
          child.castShadow = true
          child.receiveShadow = true
        } else if ( ( child as Light ).isLight ) {
          embeddedLights.push( child )
        }
      } )

      for ( const light of embeddedLights ) light.removeFromParent()

      this.scene.add( model )
      this.model = model

      const modelSize = new Box3().setFromObject( model ).getSize( new Vector3() )
      this.probeFar = Math.max( modelSize.x, modelSize.y, modelSize.z ) * 2.0

      this.scene.add( this.sunLight )

      this.createProbes()

      this._frameTarget = model
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  /** A new grid for the counts, baked by `onBeforeDraw`. */
  private createProbes() {
    if ( this.probes ) {
      this.probes.removeFromParent()
      this.probes.dispose()
    }

    this.probes = new LightProbeGrid(
      PROBES_SIZE.x, PROBES_SIZE.y, PROBES_SIZE.z,
      this.countX, this.countY, this.countZ
    )
    this.probes.name = 'Probes'
    this.probes.position.copy( PROBES_POSITION )
    this.probes.visible = this.gi
    this.scene.add( this.probes )
  }

  private updateLightPosition() {
    const elevation = MathUtils.degToRad( this.lightElevation )
    const azimuth = MathUtils.degToRad( this.lightAzimuth )

    this.sunLight.position.setFromSphericalCoords( 1, Math.PI / 2 - elevation, azimuth )
    this.sky.sunPosition.value.copy( this.sunLight.position )
  }

  private resetProbeBake() {
    this.bakeVersion ++
  }

  giChanged() {
    if ( this.probes ) this.probes.visible = this.gi
  }

  lightAzimuthChanged() { this.lightChanged() }
  lightElevationChanged() { this.lightChanged() }

  private lightChanged() {
    if ( ! this.sunLight ) return
    this.updateLightPosition()
    this.resetProbeBake()
  }

  lightIntensityChanged() {
    if ( ! this.sunLight ) return
    this.sunLight.intensity = this.lightIntensity
    this.resetProbeBake()
  }

  shadowsChanged() {
    if ( ! this.sunLight ) return
    this.sunLight.castShadow = this.shadows
    this.resetProbeBake()
  }

  countXChanged() { this.countChanged() }
  countYChanged() { this.countChanged() }
  countZChanged() { this.countChanged() }

  private countChanged() {
    if ( ! this.probes ) return
    this.createProbes()
    this.notify({kind: 'structure'})
  }

  bouncesChanged() {
    this.resetProbeBake()
  }

  /**
   * Bakes the next probes of the current pass, then asks for another draw until the last bounce is done. Each renderer
   * keeps its own progress, restarted for a new grid or after edits.
   */
  override onBeforeDraw(renderer: WebGPURenderer) {
    const probes = this.probes
    if ( ! probes ) return

    let progress = this.progress.get( renderer )

    if ( ! progress || progress.probes !== probes || progress.version !== this.bakeVersion ) {
      progress = { probes, version: this.bakeVersion, index: 0, pass: 0 }
      this.progress.set( renderer, progress )
    }

    if ( progress.pass > this.bounces ) return

    const resolution = probes.resolution
    const totalProbes = resolution.x * resolution.y * resolution.z
    const count = Math.min( PROBES_PER_DRAW, totalProbes - progress.index )

    // Publish a few probes per draw, finishing each pass before the next bounce.
    probes.bake( renderer, this.scene, {
      cubemapSize: 32,
      near: 0.05,
      far: this.probeFar,
      start: progress.index,
      count,
      pass: progress.pass
    } )

    progress.index += count

    if ( progress.index === totalProbes ) {
      progress.index = 0
      progress.pass ++
    }

    if ( progress.pass <= this.bounces ) this.notify({kind: 'other'})
  }
}

registerEditorConfig(LightprobesSponzaExample, [
  ['lightAzimuth', ioNumberSlider({min: - 180, max: 180, step: 1})],
  ['lightElevation', ioNumberSlider({min: 5, max: 85, step: 1})],
  ['lightIntensity', ioNumberSlider({min: 0, max: 100, step: 0.1})],
  ['countX', ioNumberSlider({min: 2, max: 32, step: 1})],
  ['countY', ioNumberSlider({min: 2, max: 16, step: 1})],
  ['countZ', ioNumberSlider({min: 2, max: 16, step: 1})],
  ['bounces', ioNumberSlider({min: 0, max: 2, step: 1})],
])

registerEditorGroups(LightprobesSponzaExample, {
  Main: ['gi', 'lightAzimuth', 'lightElevation', 'lightIntensity', 'shadows'],
  Probes: ['countX', 'countY', 'countZ', 'bounces'],
  Hidden: ['sky', 'sunLight', 'model', 'probes', 'probeFar', 'bakeVersion', 'progress'],
})
