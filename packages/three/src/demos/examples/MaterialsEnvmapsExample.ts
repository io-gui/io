import {
  CubeReflectionMapping,
  CubeRefractionMapping,
  CubeTexture,
  CubeTextureLoader,
  EquirectangularReflectionMapping,
  EquirectangularRefractionMapping,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/**
 * Seconds of one background turn about each enabled axis: the timeline length, so looping is seamless. The source
 * turns 0.001 rad per frame, about one turn in 105 s at 60 fps.
 */
const PERIOD = 100

/**
 * A sphere reflecting or refracting its environment, a cube map or an equirectangular panorama, which is also the
 * background (Document tab). The background turns about the axes enabled with `rotateX`, `rotateY` and `rotateZ` with
 * document time, and `syncMaterial` turns the sphere's environment with it. Plays when opened.
 */
@Register
export class MaterialsEnvmapsExample extends Document {

  public sphereMesh: Mesh
  public sphereMaterial: MeshBasicMaterial
  private textureCube: CubeTexture
  private textureEquirec: Texture

  @Property({type: String, value: 'Cube'})
  declare type: string

  @Property({type: Boolean, value: false})
  declare refraction: boolean

  /** Turns the background about x (the source's `backgroundRotationX`; short names fit the Document tab). */
  @Property({type: Boolean, value: false})
  declare rotateX: boolean

  @Property({type: Boolean, value: false})
  declare rotateY: boolean

  @Property({type: Boolean, value: false})
  declare rotateZ: boolean

  @Property({type: Boolean, value: false})
  declare syncMaterial: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // Textures

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    const loader = new CubeTextureLoader()
    loader.setPath( 'https://threejs.org/examples/textures/cube/Bridge2/' )

    this.textureCube = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ], onLoad )

    const textureLoader = new TextureLoader()

    this.textureEquirec = textureLoader.load( 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg', onLoad )
    this.textureEquirec.mapping = EquirectangularReflectionMapping
    this.textureEquirec.colorSpace = SRGBColorSpace

    //

    const geometry = new IcosahedronGeometry( 1, 15 )
    this.sphereMaterial = new MeshBasicMaterial( { envMap: this.textureCube } )
    this.sphereMesh = new Mesh( geometry, this.sphereMaterial )
    this.sphereMesh.name = 'Sphere'
    this.scene.add( this.sphereMesh )

    this.typeChanged()
    this.refractionChanged()
  }

  typeChanged() {
    if ( ! this.sphereMaterial ) return
    const texture = this.type === 'Equirectangular' ? this.textureEquirec : this.textureCube
    this.scene.background = texture
    this.sphereMaterial.envMap = texture
    this.sphereMaterial.needsUpdate = true
  }

  refractionChanged() {
    if ( ! this.sphereMaterial ) return
    if ( this.refraction ) {
      this.textureEquirec.mapping = EquirectangularRefractionMapping
      this.textureCube.mapping = CubeRefractionMapping
    } else {
      this.textureEquirec.mapping = EquirectangularReflectionMapping
      this.textureCube.mapping = CubeReflectionMapping
    }
    this.sphereMaterial.needsUpdate = true
  }

  rotateXChanged() { this.pose( this.timeline.currentTime ) }
  rotateYChanged() { this.pose( this.timeline.currentTime ) }
  rotateZChanged() { this.pose( this.timeline.currentTime ) }
  syncMaterialChanged() { this.pose( this.timeline.currentTime ) }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( ! this.sphereMaterial ) return
    const angle = time / PERIOD * Math.PI * 2
    const rotation = this.scene.backgroundRotation
    rotation.set(
      this.rotateX ? angle : 0,
      this.rotateY ? angle : 0,
      this.rotateZ ? angle : 0
    )
    if ( this.syncMaterial ) {
      this.sphereMaterial.envMapRotation.copy( rotation )
    }
  }
}

registerEditorConfig(MaterialsEnvmapsExample, [
  ['type', ioOptionSelect({model: new Menu({options: [ 'Cube', 'Equirectangular' ]})})],
])

registerEditorGroups(MaterialsEnvmapsExample, {
  Main: ['type', 'refraction', 'rotateX', 'rotateY', 'rotateZ', 'syncMaterial'],
})
