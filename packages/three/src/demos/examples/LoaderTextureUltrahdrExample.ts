import {
  ACESFilmicToneMapping,
  DataTexture,
  EquirectangularReflectionMapping,
  FloatType,
  HalfFloatType,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  TorusKnotGeometry
} from 'three/webgpu'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one turn of the knot: the timeline length, so looping is seamless (the source turns 0.005 rad per frame). */
const PERIOD = 20

const TYPES = { HalfFloatType, FloatType }

/**
 * A metallic torus knot in an Ultra HDR (gain map JPEG) environment that is also the background. The environment's
 * `resolution` and texture `type` reload it; `metalness` and `roughness` set the knot's material (Document tab). The
 * source's exposure control is the document's `toneMappingExposure`. While `autoRotate` is on the knot turns with
 * document time, and it holds its angle when off. Plays when opened.
 */
@Register
export class LoaderTextureUltrahdrExample extends Document {

  public torusMesh: Mesh<TorusKnotGeometry, MeshStandardMaterial>

  @Property({type: Boolean, value: true})
  declare autoRotate: boolean

  @Property({type: Number, value: 1.0})
  declare metalness: number

  @Property({type: Number, value: 0.0})
  declare roughness: number

  @Property({type: String, value: '2k'})
  declare resolution: string

  @Property({type: String, value: 'HalfFloatType'})
  declare type: string

  private loader = new UltraHDRLoader()
  private environment?: DataTexture
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 500 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, - 6 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.torusMesh = new Mesh(
      new TorusKnotGeometry( 1, 0.4, 128, 128, 1, 3 ),
      new MeshStandardMaterial( { roughness: this.roughness, metalness: this.metalness } )
    )
    this.torusMesh.name = 'TorusKnot'
    this.scene.add( this.torusMesh )

    this.pose( this.timeline.currentTime )
    void this.loadEnvironment()
  }

  metalnessChanged() {
    if ( ! this.torusMesh ) return
    this.torusMesh.material.metalness = this.metalness
  }

  roughnessChanged() {
    if ( ! this.torusMesh ) return
    this.torusMesh.material.roughness = this.roughness
  }

  resolutionChanged() {
    if ( this.torusMesh ) void this.loadEnvironment()
  }

  typeChanged() {
    if ( this.torusMesh ) void this.loadEnvironment()
  }

  autoRotateChanged() {
    this.pose( this.timeline.currentTime )
  }

  private async loadEnvironment() {
    const load = ++ this.loads
    this.loader.setDataType( TYPES[ this.type as keyof typeof TYPES ] ?? HalfFloatType )

    try {
      const texture = await this.loader.loadAsync( `https://threejs.org/examples/textures/equirectangular/spruit_sunrise_${this.resolution}.hdr.jpg` )
      if ( load !== this.loads ) {
        texture.dispose()
        return
      }

      texture.mapping = EquirectangularReflectionMapping
      texture.needsUpdate = true

      this.environment?.dispose()
      this.environment = texture
      this.scene.background = texture
      this.scene.environment = texture

      this.notify({kind: 'material'})
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( ! this.torusMesh || ! this.autoRotate ) return
    this.torusMesh.rotation.y = time / PERIOD * Math.PI * 2
  }
}

registerEditorConfig(LoaderTextureUltrahdrExample, [
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['resolution', ioOptionSelect({model: new Menu({options: [ '2k', '4k' ]})})],
  ['type', ioOptionSelect({model: new Menu({options: Object.keys( TYPES )})})],
])

registerEditorGroups(LoaderTextureUltrahdrExample, {
  Main: ['autoRotate', 'metalness', 'roughness', 'resolution', 'type'],
  Hidden: ['loader', 'environment', 'loads'],
})
