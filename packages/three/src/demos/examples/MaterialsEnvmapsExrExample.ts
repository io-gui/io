import {
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  TorusKnotGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one turn of the knot: the timeline length, so looping is seamless (the source turns 0.005 rad per frame). */
const PERIOD = 20

type Environment = {background: Texture; envMap: Texture}

/**
 * A torus knot lit by a PMREM environment generated from an equirectangular image, OpenEXR or PNG (`envMap`); the
 * image is the background. The source's exposure control is the document's `toneMappingExposure`. Its `debug` plane,
 * which shows the PMREM texture as a 2D atlas, is dropped: three's WebGPU PMREM is a cube texture. The knot turns with
 * document time. Plays when opened.
 */
@Register
export class MaterialsEnvmapsExrExample extends Document {

  public torusMesh: Mesh<TorusKnotGeometry, MeshStandardMaterial>

  @Property({type: String, value: 'EXR'})
  declare envMap: string

  @Property({type: Number, value: 0.0})
  declare roughness: number

  @Property({type: Number, value: 0.0})
  declare metalness: number

  /** The source images, loading from construction. */
  private images: Promise<Record<string, Texture>>
  /** PMREM environments by `envMap` name, once generated. */
  private environments: Record<string, Environment> = {}
  private preparing?: Promise<void>

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const geometry = new TorusKnotGeometry( 18, 8, 150, 20 )
    const material = new MeshStandardMaterial( {
      metalness: this.metalness,
      roughness: this.roughness,
      envMapIntensity: 1.0
    } )

    this.torusMesh = new Mesh( geometry, material )
    this.torusMesh.name = 'TorusKnot'
    this.scene.add( this.torusMesh )

    this.images = this.loadImages()

    this.pose( this.timeline.currentTime )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.preparing ??= this.prepare( renderer )
  }

  envMapChanged() { this.applyEnvironment() }

  roughnessChanged() {
    if ( this.torusMesh ) this.torusMesh.material.roughness = this.roughness
  }

  metalnessChanged() {
    if ( this.torusMesh ) this.torusMesh.material.metalness = this.metalness
  }

  private async loadImages() {
    const [ exr, png ] = await Promise.all( [
      new EXRLoader().loadAsync( 'https://threejs.org/examples/textures/piz_compressed.exr' ),
      new TextureLoader().loadAsync( 'https://threejs.org/examples/textures/equirectangular.png' ),
    ] )

    exr.mapping = EquirectangularReflectionMapping

    png.mapping = EquirectangularReflectionMapping
    png.colorSpace = SRGBColorSpace

    return { EXR: exr, PNG: png }
  }

  /** Generates the PMREM environments with the first renderer: PMREMGenerator draws them. */
  private async prepare(renderer: WebGPURenderer) {
    try {
      const images = await this.images
      const pmremGenerator = new PMREMGenerator( renderer )

      for ( const [ name, image ] of Object.entries( images ) ) {
        this.environments[ name ] = {background: image, envMap: pmremGenerator.fromEquirectangular( image ).texture}
      }

      pmremGenerator.dispose()
      this.applyEnvironment()
    } catch ( e ) {
      console.error( e )
    }
  }

  private applyEnvironment() {
    const environment = this.environments?.[ this.envMap ]
    if ( ! environment ) return

    this.torusMesh.material.envMap = environment.envMap
    this.torusMesh.material.needsUpdate = true

    this.scene.background = environment.background
    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( this.torusMesh ) this.torusMesh.rotation.y = time / PERIOD * Math.PI * 2
  }
}

registerEditorConfig(MaterialsEnvmapsExrExample, [
  ['envMap', ioOptionSelect({model: new Menu({options: [ 'EXR', 'PNG' ]})})],
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsEnvmapsExrExample, {
  Main: ['envMap', 'roughness', 'metalness'],
  Hidden: ['torusMesh', 'images', 'environments', 'preparing'],
})
