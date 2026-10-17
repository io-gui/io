import {
  ACESFilmicToneMapping,
  Color,
  HemisphereLight,
  LinearFilter,
  Mesh,
  MeshLambertMaterial,
  Node,
  PlaneGeometry,
  ProjectorLight,
  SRGBColorSpace,
  Texture,
  TextureLoader
} from 'three/webgpu'
import { Fn, color, mx_worley_noise_float } from 'three/tsl'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds of one circle of the projector (1/3 rad/s): the timeline length, so looping is seamless. The caustics
 * scroll with time and do not repeat, so they jump at the wrap.
 */
const PERIOD = 6 * Math.PI

/** Shadow focus that suits each projection, set when `type` changes (as the source does). */
const FOCUS: Record<string, number> = { procedural: 1, texture: 1 }

/**
 * Lucy on a floor under a circling projector light that casts animated caustics (`procedural`) or an image
 * (`texture`), with shadows. The projection, color, intensity, cone and shadow settings are in the Document tab. The
 * source's `video` projection is dropped (a document reads no DOM), and its `shadows` toggle, which switches the
 * renderer's shadow map, turns the light's shadow off instead. Plays when opened.
 */
@Register
export class LightsProjectorExample extends Document {

  public projectorLight: ProjectorLight
  private causticEffect: ( uv: Node<'vec2'> ) => Node
  private mapTexture?: Texture

  @Property({type: String, value: 'procedural'})
  declare type: string

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

  @Property({type: Boolean, value: true})
  declare shadows: boolean

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // Lights

    const time = this.timeline.timeNode

    this.causticEffect = Fn( ( [ projectorUV ]: [ Node<'vec2'> ] ) => {
      const waterLayer0 = mx_worley_noise_float( projectorUV.mul( 10 ).add( time ) ).pow( 2 )

      const caustic = waterLayer0.mul( color( 0x5abcd8 ) ).mul( 2 )

      return caustic
    } )

    const ambient = new HemisphereLight( 0xffffff, 0x8d8d8d, 0.15 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    this.projectorLight = new ProjectorLight( 0xffffff, 100 )
    this.projectorLight.name = 'Projector'
    this.projectorLight.position.set( 2.5, 5, 2.5 )
    this.projectorLight.shadow.mapSize.width = 1024
    this.projectorLight.shadow.mapSize.height = 1024
    this.projectorLight.shadow.camera.near = 1
    this.projectorLight.shadow.camera.far = 10
    this.scene.add( this.projectorLight )

    //

    const geometry = new PlaneGeometry( 200, 200 )
    const material = new MeshLambertMaterial( { color: 0xbcbcbc } )
    const mesh = new Mesh( geometry, material )
    mesh.name = 'Floor'
    mesh.position.set( 0, - 1, 0 )
    mesh.rotation.x = - Math.PI / 2
    mesh.receiveShadow = true
    mesh.userData.selectable = false
    this.scene.add( mesh )

    void this.loadModel()

    this.typeChanged()
    this.colorChanged()
    this.intensityChanged()
    this.distanceChanged()
    this.angleChanged()
    this.penumbraChanged()
    this.decayChanged()
    this.focusChanged()
    this.shadowsChanged()
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
      // The 200-unit floor would dominate whole-scene framing.
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  typeChanged() {
    if ( ! this.projectorLight ) return

    // @types/three 0.186 does not declare `colorNode`; three calls it with the projected uv.
    ( this.projectorLight as ProjectorLight & { colorNode: unknown } ).colorNode = this.type === 'procedural' ? this.causticEffect : null
    this.projectorLight.map = null

    if ( this.type === 'texture' ) {
      if ( ! this.mapTexture ) {
        this.mapTexture = new TextureLoader().load( 'https://threejs.org/examples/textures/colors.png', () => this.notify({kind: 'material'}) )
        this.mapTexture.minFilter = LinearFilter
        this.mapTexture.magFilter = LinearFilter
        this.mapTexture.generateMipmaps = false
        this.mapTexture.colorSpace = SRGBColorSpace
      }

      this.projectorLight.map = this.mapTexture
    }

    this.focus = FOCUS[ this.type ]
  }

  colorChanged() {
    this.colorMutated()
  }

  /** The color editor changes the color in place. */
  colorMutated() {
    if ( ! this.projectorLight ) return
    this.projectorLight.color.copy( this.color )
    this.notify({kind: 'other'})
  }

  intensityChanged() { if ( this.projectorLight ) this.projectorLight.intensity = this.intensity }
  distanceChanged() { if ( this.projectorLight ) this.projectorLight.distance = this.distance }
  angleChanged() { if ( this.projectorLight ) this.projectorLight.angle = this.angle }
  penumbraChanged() { if ( this.projectorLight ) this.projectorLight.penumbra = this.penumbra }
  decayChanged() { if ( this.projectorLight ) this.projectorLight.decay = this.decay }
  focusChanged() { if ( this.projectorLight ) this.projectorLight.shadow.focus = this.focus }
  shadowsChanged() { if ( this.projectorLight ) this.projectorLight.castShadow = this.shadows }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(elapsed: number) {
    const time = elapsed / 3

    this.projectorLight.position.x = Math.cos( time ) * 2.5
    this.projectorLight.position.z = Math.sin( time ) * 2.5
  }
}

registerEditorConfig(LightsProjectorExample, [
  ['type', ioOptionSelect({model: new Menu({options: [ 'procedural', 'texture' ]})})],
  ['intensity', ioNumberSlider({min: 0, max: 500, step: 1})],
  ['distance', ioNumberSlider({min: 0, max: 20, step: 0.1})],
  ['angle', ioNumberSlider({min: 0, max: Math.PI / 3, step: 0.01})],
  ['penumbra', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['decay', ioNumberSlider({min: 1, max: 2, step: 0.01})],
  ['focus', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(LightsProjectorExample, {
  Main: ['type', 'color', 'intensity', 'distance', 'angle', 'penumbra', 'decay', 'focus', 'shadows'],
  Hidden: ['projectorLight', 'causticEffect', 'mapTexture'],
})
