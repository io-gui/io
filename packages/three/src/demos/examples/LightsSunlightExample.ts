import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  Fog,
  InstancedMesh,
  Light,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Node,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RenderTarget,
  Scene,
  WebGPURenderer
} from 'three/webgpu'
import { cos, float, output, positionView, rangeFogFactor, reference, step, vec3, vec4 } from 'three/tsl'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { SunLight } from 'three/addons/lights/SunLight.js'
import { SunLightNode } from 'three/addons/lights/SunLightNode.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioOptionSelect, Menu } from '@io-gui/menus'

// `Light.registerNode()` is r187 (the source at r186 used `renderer.library.addLight()`, deprecated since); not in
// @types/three 0.186.
( SunLight as unknown as typeof Light & { registerNode( lightNodeClass: typeof SunLightNode ): void } ).registerNode( SunLightNode )

const _sunDay = new Color( 0xfff2e3 ), _sunDusk = new Color( 0xff8a3d )
const _fogDay = new Color( 0xd8e2ea ), _fogDusk = new Color( 0xd9a273 )

/** The source's sky: one in the scene, one in a scene of its own that lights the scene as a PMREM environment. */
function createSky() {
  const sky = new SkyMesh()
  sky.name = 'Sky'
  sky.scale.setScalar( 9000 )
  sky.turbidity.value = 3
  sky.rayleigh.value = 2
  sky.cloudSpeed.value = 0 // keep the clouds static, like the WebGL version
  sky.showSunDisc.value = false // the sun is represented by the light
  sky.userData.selectable = false
  return sky
}

/**
 * A `SunLight` (cascaded shadow maps fitted to the drawing camera) over an avenue of thin posts and towers that runs
 * to the fog. `azimuth` and `elevation` move the sun, which warms up towards the horizon along with the fog, and
 * regenerate the sky environment in `onBeforeDraw`. `showCascades` tints each cascade, `shadowFar` and `shadowRes`
 * set the shadow distance and map size. The cascades refit per view. The source's first-person controls are
 * dropped; the active camera keeps its start pose.
 */
@Register
export class LightsSunlightExample extends Document {

  @Property({type: Boolean, value: false})
  declare showCascades: boolean

  @Property({type: Number, value: 1000})
  declare shadowFar: number

  @Property({type: Number, value: 2048})
  declare shadowRes: number

  @Property({type: Number, value: 135})
  declare azimuth: number

  @Property({type: Number, value: 10})
  declare elevation: number

  public sunLight: SunLight
  public sky: SkyMesh
  public posts: InstancedMesh
  public towers: InstancedMesh
  private fog: Fog
  private skyScene = new Scene()
  private environmentSky: SkyMesh
  private environmentTarget: RenderTarget | null = null
  /** Bumped when the sun moves: the sky environment is regenerated before the next draw. */
  private environmentVersion = 0
  private environments = new WeakMap<WebGPURenderer, number>()
  private pmremGenerators = new WeakMap<WebGPURenderer, PMREMGenerator>()

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.6, ...args})

    this.fog = new Fog( 0x000000, 500, 4000 )
    this.scene.fog = this.fog
    this.scene.environmentIntensity = 0.5

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.5, 5000 )
    camera.name = 'Camera'
    camera.position.set( 60, 8, 0 )
    camera.lookAt( - 60, 8, 0 )
    this.activeCamera = camera

    // sky and sun

    this.sky = createSky()
    this.scene.add( this.sky )

    this.environmentSky = createSky()
    this.skyScene.add( this.environmentSky )

    this.sunLight = new SunLight()
    this.sunLight.name = 'Sun'
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = this.shadowFar // maximum shadow distance
    this.sunLight.shadow.mapSize.setScalar( this.shadowRes )
    this.sunLight.shadow.normalBias = 0.05
    this.scene.add( this.sunLight )

    // ground

    const ground = new Mesh( new PlaneGeometry( 10000, 10000 ), new MeshStandardMaterial( { color: 0xa39f8e } ) )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    const dummy = new Object3D()

    // an avenue of thin posts shows the shadow resolution from up close
    // all the way down to the shadow distance

    this.posts = new InstancedMesh( new BoxGeometry( 1, 10, 1 ), new MeshStandardMaterial( { color: 0x475161 } ), 120 )
    this.posts.name = 'Posts'
    this.posts.castShadow = true
    this.posts.receiveShadow = true
    this.scene.add( this.posts )

    for ( let i = 0; i < 60; i ++ ) {
      for ( const side of [ - 1, 1 ] ) {
        dummy.position.set( 30 - i * 17, 5, side * 13 )
        dummy.updateMatrix()
        this.posts.setMatrixAt( i * 2 + ( side + 1 ) / 2, dummy.matrix )
      }
    }

    // towers for large shadows in the distance

    this.towers = new InstancedMesh( new BoxGeometry( 10, 1, 10 ), new MeshStandardMaterial(), 60 )
    this.towers.name = 'Towers'
    this.towers.castShadow = true
    this.towers.receiveShadow = true
    this.scene.add( this.towers )

    const towerColors = [ new Color( 0x08d9d6 ), new Color( 0xff2e63 ) ]

    MathUtils.seededRandom( 6 )

    for ( let i = 0; i < 30; i ++ ) {
      for ( const side of [ - 1, 1 ] ) {
        const height = 20 + MathUtils.seededRandom() * 40
        dummy.position.set( - 40 - i * 32 - MathUtils.seededRandom() * 10, height / 2, side * ( 38 + MathUtils.seededRandom() * 55 ) )
        dummy.scale.y = height
        dummy.updateMatrix()
        const index = i * 2 + ( side + 1 ) / 2
        this.towers.setMatrixAt( index, dummy.matrix )
        this.towers.setColorAt( index, towerColors[ ( i + ( side + 1 ) / 2 ) % 2 ] )
      }
    }

    this.updateSun()
  }

  /** The ground and the sky dwarf the avenue. */
  override getEditorFrameTarget() {
    return [ this.posts, this.towers ]
  }

  /** Tints each fragment by its cascade, using the data of the built-in sun shadow node. */
  private tintCascades() {
    const shadow = this.sunLight.shadow
    // `ReferenceNode.element()` is not in @types/three 0.186.
    const cascadeData = reference( '_cascadeData', 'vec4', shadow ) as unknown as { element( index: number ): Node<'vec4'> }
    const viewDepth = positionView.z.negate()

    let cascade: Node<'float'> = float( 0 )

    for ( let i = 0; i < shadow.getViewportCount(); i ++ ) {
      cascade = cascade.add( step( cascadeData.element( i ).y, viewDepth ) )
    }

    const tint = cos( cascade.mul( 1.2 ).add( vec3( 0, 4.2, 2.1 ) ) ).mul( 0.3 ).add( 0.7 )

    // tint before the fog by wrapping the scene fog
    const fogColor = reference( 'color', 'color', this.fog )
    const fogFactor = rangeFogFactor( reference( 'near', 'float', this.fog ), reference( 'far', 'float', this.fog ) )

    return vec4( fogFactor.mix( output.rgb.mul( tint ), fogColor ), output.a )
  }

  private updateSun() {
    const sunLight = this.sunLight
    if ( ! sunLight ) return

    sunLight.position.setFromSphericalCoords( 1, MathUtils.degToRad( 90 - this.elevation ), MathUtils.degToRad( this.azimuth ) )

    // the sun light warms up and fades towards the horizon
    const daylight = Math.min( 1, this.elevation / 30 )

    sunLight.color.lerpColors( _sunDusk, _sunDay, daylight )
    sunLight.intensity = 3 + daylight * 2

    this.fog.color.lerpColors( _fogDusk, _fogDay, daylight )

    this.sky.sunPosition.value.copy( sunLight.position )
    this.environmentSky.sunPosition.value.copy( sunLight.position )

    // light the scene with the sky itself (onBeforeDraw)
    this.environmentVersion ++
  }

  showCascadesChanged() {
    if ( this.sunLight ) this.scene.fogNode = this.showCascades ? this.tintCascades() : null
  }

  shadowFarChanged() {
    if ( this.sunLight ) this.sunLight.shadow.camera.far = this.shadowFar
  }

  shadowResChanged() {
    if ( this.sunLight ) this.sunLight.shadow.mapSize.setScalar( this.shadowRes )
  }

  azimuthChanged() { this.updateSun() }
  elevationChanged() { this.updateSun() }

  /** Regenerates the sky environment after the sun moved (and before the first draw). */
  override onBeforeDraw(renderer: WebGPURenderer) {
    if ( this.environments.get( renderer ) === this.environmentVersion ) return

    let pmremGenerator = this.pmremGenerators.get( renderer )

    if ( ! pmremGenerator ) {
      pmremGenerator = new PMREMGenerator( renderer )
      this.pmremGenerators.set( renderer, pmremGenerator )
    }

    if ( this.environmentTarget ) this.environmentTarget.dispose()

    this.environmentTarget = pmremGenerator.fromScene( this.skyScene )
    this.scene.environment = this.environmentTarget.texture

    this.environments.set( renderer, this.environmentVersion )
  }
}

registerEditorConfig(LightsSunlightExample, [
  ['shadowFar', ioNumberSlider({min: 100, max: 3000, step: 1})],
  ['shadowRes', ioOptionSelect({model: new Menu({options: [ 256, 512, 1024, 2048, 4096 ].map(value => ({value, id: String(value)}))})})],
  ['azimuth', ioNumberSlider({min: 0, max: 360, step: 0.1})],
  ['elevation', ioNumberSlider({min: 5, max: 80, step: 0.1})],
])

registerEditorGroups(LightsSunlightExample, {
  Main: ['azimuth', 'elevation', 'showCascades', 'shadowFar', 'shadowRes'],
  Hidden: [
    'sunLight', 'sky', 'posts', 'towers', 'fog', 'skyScene', 'environmentSky', 'environmentTarget',
    'environmentVersion', 'environments', 'pmremGenerators',
  ],
})
