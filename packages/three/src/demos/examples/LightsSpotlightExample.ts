import {
  Color,
  HemisphereLight,
  LinearFilter,
  Mesh,
  MeshLambertMaterial,
  NeutralToneMapping,
  PlaneGeometry,
  SRGBColorSpace,
  SpotLight,
  Texture,
  TextureLoader
} from 'three/webgpu'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one circle of the spot light (1/3 rad/s): the timeline length, so looping is seamless. */
const PERIOD = 6 * Math.PI

/** The textures the light can project, by file name. */
const MAPS = [ 'none', 'disturb.jpg', 'colors.png', 'uv_grid_opengl.jpg' ]

/**
 * Lucy on a floor under a circling spot light that projects a texture and casts shadows. The light's map, color,
 * intensity, cone and shadow settings are in the Document tab. The source's `helpers` toggle is dropped: the light
 * helpers overlay draws the cone. Plays when opened.
 */
@Register
export class LightsSpotlightExample extends Document {

  public spotLight: SpotLight
  private textures: Record<string, Texture | null> = { none: null }

  @Property({type: String, value: 'disturb.jpg'})
  declare map: string

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: Number, value: 100})
  declare intensity: number

  @Property({type: Number, value: 0})
  declare distance: number

  @Property({type: Number, value: Math.PI / 6})
  declare angle: number

  @Property({type: Number, value: 1})
  declare penumbra: number

  @Property({type: Number, value: 2})
  declare decay: number

  @Property({type: Number, value: 1})
  declare focus: number

  @Property({type: Number, value: 1})
  declare shadowIntensity: number

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // Textures

    // Views draw on document changes only, so report each texture when it arrives.
    const loader = new TextureLoader().setPath( 'https://threejs.org/examples/textures/' )

    for ( const filename of MAPS.slice( 1 ) ) {
      const texture = loader.load( filename, () => this.notify({kind: 'material'}) )
      texture.minFilter = LinearFilter
      texture.magFilter = LinearFilter
      texture.generateMipmaps = false
      texture.colorSpace = SRGBColorSpace
      this.textures[ filename ] = texture
    }

    // Lights

    const ambient = new HemisphereLight( 0xffffff, 0x8d8d8d, 0.25 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    this.spotLight = new SpotLight( 0xffffff, 100 )
    this.spotLight.name = 'Spot'
    this.spotLight.position.set( 2.5, 5, 2.5 )
    this.spotLight.castShadow = true
    this.spotLight.shadow.mapSize.width = 1024
    this.spotLight.shadow.mapSize.height = 1024
    this.spotLight.shadow.camera.near = 2
    this.spotLight.shadow.camera.far = 10
    this.scene.add( this.spotLight )

    //

    const geometry = new PlaneGeometry( 10, 10 )
    const material = new MeshLambertMaterial( { color: 0xbcbcbc } )
    const mesh = new Mesh( geometry, material )
    mesh.name = 'Floor'
    mesh.position.set( 0, - 1, 0 )
    mesh.rotation.x = - Math.PI / 2
    mesh.receiveShadow = true
    mesh.userData.selectable = false
    this.scene.add( mesh )

    void this.loadModel()

    this.mapChanged()
    this.colorChanged()
    this.intensityChanged()
    this.distanceChanged()
    this.angleChanged()
    this.penumbraChanged()
    this.decayChanged()
    this.focusChanged()
    this.shadowIntensityChanged()
    this.pose( this.timeline.currentTime )
  }

  private async loadModel() {
    try {
      const geometry = await new PLYLoader().loadAsync( 'https://threejs.org/examples/models/ply/binary/Lucy100k.ply' )
      geometry.scale( 0.0024, 0.0024, 0.0024 )
      geometry.computeVertexNormals()

      const material = new MeshLambertMaterial()
      const mesh = new Mesh( geometry, material )
      mesh.name = 'Lucy'
      mesh.rotation.y = - Math.PI / 2
      mesh.position.y = 0.8
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  mapChanged() {
    if ( this.spotLight ) this.spotLight.map = this.textures[ this.map ] ?? null
  }

  colorChanged() {
    this.colorMutated()
  }

  /** The color editor changes the color in place. */
  colorMutated() {
    if ( ! this.spotLight ) return
    this.spotLight.color.copy( this.color )
    this.notify({kind: 'other'})
  }

  intensityChanged() { if ( this.spotLight ) this.spotLight.intensity = this.intensity }
  distanceChanged() { if ( this.spotLight ) this.spotLight.distance = this.distance }
  angleChanged() { if ( this.spotLight ) this.spotLight.angle = this.angle }
  penumbraChanged() { if ( this.spotLight ) this.spotLight.penumbra = this.penumbra }
  decayChanged() { if ( this.spotLight ) this.spotLight.decay = this.decay }
  focusChanged() { if ( this.spotLight ) this.spotLight.shadow.focus = this.focus }
  shadowIntensityChanged() { if ( this.spotLight ) this.spotLight.shadow.intensity = this.shadowIntensity }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(elapsed: number) {
    const time = elapsed / 3

    this.spotLight.position.x = Math.cos( time ) * 2.5
    this.spotLight.position.z = Math.sin( time ) * 2.5
  }
}

registerEditorConfig(LightsSpotlightExample, [
  ['map', ioOptionSelect({model: new Menu({options: MAPS})})],
  ['intensity', ioNumberSlider({min: 0, max: 500, step: 1})],
  ['distance', ioNumberSlider({min: 0, max: 20, step: 0.1})],
  ['angle', ioNumberSlider({min: 0, max: Math.PI / 3, step: 0.01})],
  ['penumbra', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['decay', ioNumberSlider({min: 1, max: 2, step: 0.01})],
  ['focus', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['shadowIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(LightsSpotlightExample, {
  Main: ['map', 'color', 'intensity', 'distance', 'angle', 'penumbra', 'decay', 'focus', 'shadowIntensity'],
  Hidden: ['spotLight', 'textures'],
})
