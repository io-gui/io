import {
  Color,
  CubeReflectionMapping,
  CubeRefractionMapping,
  CubeTexture,
  CubeTextureLoader,
  CubeTextureMapping,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  SphereGeometry
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds in which the spheres' paths repeat (0.1 rad/s): the timeline length, so looping is seamless. */
const PERIOD = 20 * Math.PI

const mappings: Record<string, CubeTextureMapping> = {
  ReflectionMapping: CubeReflectionMapping,
  RefractionMapping: CubeRefractionMapping,
}

/**
 * Five hundred spheres sharing one `MeshBasicMaterial` that reflects or refracts the Pisa cube map behind them. The
 * material's color, mapping, refraction ratio and opacity are in the Document tab. The active camera stands where
 * the source's mouse-following camera rests. Plays when opened.
 */
@Register
export class MaterialsBasicExample extends Document {

  public material: MeshBasicMaterial
  public spheres: Group
  private textureCube: CubeTexture

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: String, value: 'ReflectionMapping'})
  declare mapping: string

  @Property({type: Number, value: 0.98})
  declare refractionRatio: number

  @Property({type: Boolean, value: false})
  declare transparent: boolean

  @Property({type: Number, value: 1})
  declare opacity: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.01, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 3 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const path = 'https://threejs.org/examples/textures/cube/pisa/'
    const format = '.png'
    const urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ]

    // Views draw on document changes only, so report the texture when it arrives.
    this.textureCube = new CubeTextureLoader().load( urls, () => this.notify({kind: 'material'}) )

    this.scene.background = this.textureCube

    const geometry = new SphereGeometry( 0.1, 32, 16 )
    this.material = new MeshBasicMaterial( { color: 0xffffff, envMap: this.textureCube } )

    this.spheres = new Group()
    this.spheres.name = 'Spheres'
    this.scene.add( this.spheres )

    for ( let i = 0; i < 500; i ++ ) {
      const mesh = new Mesh( geometry, this.material )
      mesh.name = `Sphere ${i}`

      mesh.position.x = Math.random() * 10 - 5
      mesh.position.y = Math.random() * 10 - 5
      mesh.position.z = Math.random() * 10 - 5

      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1

      this.spheres.add( mesh )
    }

    this.colorChanged()
    this.mappingChanged()
    this.refractionRatioChanged()
    this.transparentChanged()
    this.opacityChanged()
    this.pose( 0 )
  }

  colorChanged() {
    this.colorMutated()
  }

  /** The color editor changes the color in place. */
  colorMutated() {
    if ( ! this.material ) return
    this.material.color.copy( this.color )
    this.notify({kind: 'material'})
  }

  mappingChanged() {
    if ( ! this.material ) return
    this.textureCube.mapping = mappings[ this.mapping ]
    this.material.needsUpdate = true
  }

  refractionRatioChanged() {
    if ( this.material ) this.material.refractionRatio = this.refractionRatio
  }

  transparentChanged() {
    if ( ! this.material ) return
    this.material.transparent = this.transparent
    this.material.needsUpdate = true
  }

  opacityChanged() {
    if ( this.material ) this.material.opacity = this.opacity
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const timer = time * 0.1
    const spheres = this.spheres.children

    for ( let i = 0, il = spheres.length; i < il; i ++ ) {
      const sphere = spheres[ i ]
      sphere.position.x = 5 * Math.cos( timer + i )
      sphere.position.y = 5 * Math.sin( timer + i * 1.1 )
    }
  }
}

registerEditorConfig(MaterialsBasicExample, [
  ['mapping', ioOptionSelect({model: new Menu({options: Object.keys( mappings )})})],
  ['refractionRatio', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsBasicExample, {
  Main: ['color', 'mapping', 'refractionRatio', 'transparent', 'opacity'],
  Hidden: ['spheres'],
})
