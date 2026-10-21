import {
  ACESFilmicToneMapping,
  Color,
  EquirectangularReflectionMapping,
  Fog,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MultiplyBlending,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  TextureLoader
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds of one loop: the wheels turn once a second and the grid scrolls one cell a second. */
const PERIOD = 10

/**
 * The Ferrari 458 Italia (glTF, Draco) with a red clear-coated body, white details and glass
 * (`MeshPhysicalMaterial.transmission`), lit by the Venice sunset HDR on a dark fogged backdrop. It drives on the spot:
 * the wheels turn and the grid underneath scrolls, from time. `body`, `details` and `glass` are the source's color
 * pickers. A baked ambient-occlusion plane shades the ground under the car. Plays when opened.
 */
@Register
export class MaterialsCarExample extends Document {

  @Property({type: Color, init: null})
  declare body: Color

  @Property({type: Color, init: null})
  declare details: Color

  @Property({type: Color, init: null})
  declare glass: Color

  public grid: GridHelper
  public wheels: Object3D[] = []
  private bodyMaterial: MeshPhysicalMaterial
  private detailsMaterial: MeshStandardMaterial
  private glassMaterial: MeshPhysicalMaterial

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 0.85,
      timeline: new Timeline({autoplay: true, duration: PERIOD}),
      ...args,
    })

    const camera = new PerspectiveCamera( 40, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 4.25, 1.4, - 4.5 )
    camera.lookAt( 0, 0.5, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x333333 )
    this.scene.fog = new Fog( 0x333333, 10, 15 )

    this.grid = new GridHelper( 20, 40, 0xffffff, 0xffffff )
    this.grid.name = 'Grid'
    this.grid.material.opacity = 0.2
    this.grid.material.depthWrite = false
    this.grid.material.transparent = true
    this.grid.userData.selectable = false
    this.scene.add( this.grid )

    // materials

    this.bodyMaterial = new MeshPhysicalMaterial( {
      color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
    } )

    this.detailsMaterial = new MeshStandardMaterial( {
      color: 0xffffff, metalness: 1.0, roughness: 0.5
    } )

    this.glassMaterial = new MeshPhysicalMaterial( {
      color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
    } )

    this.body.copy( this.bodyMaterial.color )
    this.details.copy( this.detailsMaterial.color )
    this.glass.copy( this.glassMaterial.color )

    this.pose( this.timeline.currentTime )

    void this.loadEnvironment()
    void this.loadCar()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadEnvironment() {
    try {
      const texture = await new HDRLoader().loadAsync( 'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr' )
      texture.mapping = EquirectangularReflectionMapping
      this.scene.environment = texture
      this.notify({kind: 'other'})
    } catch ( e ) {
      console.error( e )
    }
  }

  private async loadCar() {
    try {
      // Views draw on document changes only, so report the shadow texture when it arrives.
      const shadow = new TextureLoader().load( 'https://threejs.org/examples/models/gltf/ferrari_ao.png', () => this.notify({kind: 'material'}) )

      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath( DRACO_GLTF_CONFIG )

      const loader = new GLTFLoader()
      loader.setDRACOLoader( dracoLoader )

      const gltf = await loader.loadAsync( 'https://threejs.org/examples/models/gltf/ferrari.glb' )
      const carModel = gltf.scene.children[ 0 ]

      const setMaterial = ( name: string, material: MeshStandardMaterial ) => {
        ( carModel.getObjectByName( name ) as Mesh ).material = material
      }

      setMaterial( 'body', this.bodyMaterial )
      setMaterial( 'rim_fl', this.detailsMaterial )
      setMaterial( 'rim_fr', this.detailsMaterial )
      setMaterial( 'rim_rr', this.detailsMaterial )
      setMaterial( 'rim_rl', this.detailsMaterial )
      setMaterial( 'trim', this.detailsMaterial )
      setMaterial( 'glass', this.glassMaterial )

      this.wheels = [
        carModel.getObjectByName( 'wheel_fl' )!,
        carModel.getObjectByName( 'wheel_fr' )!,
        carModel.getObjectByName( 'wheel_rl' )!,
        carModel.getObjectByName( 'wheel_rr' )!
      ]

      // shadow
      const mesh = new Mesh(
        new PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
        new MeshBasicMaterial( {
          map: shadow, blending: MultiplyBlending, toneMapped: false, transparent: true, premultipliedAlpha: true
        } )
      )
      mesh.name = 'Shadow'
      mesh.rotation.x = - Math.PI / 2
      mesh.renderOrder = 2
      mesh.userData.selectable = false
      carModel.add( mesh )

      this.scene.add( carModel )
      this.pose( this.timeline.currentTime )

      this._frameTarget = carModel
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  bodyChanged() { this.bodyMutated() }
  detailsChanged() { this.detailsMutated() }
  glassChanged() { this.glassMutated() }

  /** The color editors change the colors in place. */
  bodyMutated() {
    if ( ! this.bodyMaterial ) return
    this.bodyMaterial.color.copy( this.body )
    this.notify({kind: 'material'})
  }

  detailsMutated() {
    if ( ! this.detailsMaterial ) return
    this.detailsMaterial.color.copy( this.details )
    this.notify({kind: 'material'})
  }

  glassMutated() {
    if ( ! this.glassMaterial ) return
    this.glassMaterial.color.copy( this.glass )
    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** The source's `time` runs backwards (`- performance.now() / 1000`): the wheels turn once a second, the grid scrolls one cell. */
  private pose(time: number) {
    for ( const wheel of this.wheels ) {
      wheel.rotation.x = - time * Math.PI * 2
    }

    this.grid.position.z = time % 1
  }
}

registerEditorGroups(MaterialsCarExample, {
  Main: ['body', 'details', 'glass'],
  Hidden: ['grid', 'wheels', 'bodyMaterial', 'detailsMaterial', 'glassMaterial'],
})
