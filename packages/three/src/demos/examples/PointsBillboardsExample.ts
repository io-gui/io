import {
  BufferGeometry,
  Float32BufferAttribute,
  FogExp2,
  InstancedBufferAttribute,
  Points,
  PointsMaterial,
  PointsNodeMaterial,
  SRGBColorSpace,
  Sprite,
  TextureLoader,
  WebGPURenderer
} from 'three/webgpu'
import { instancedBufferAttribute } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds in which the hue cycles (source: 0.05 per second): the timeline length. */
const PERIOD = 20

/**
 * 10000 disc billboards in a cube under exponential fog, their hue cycling with document time. `sizeAttenuation` (Document
 * tab) shrinks distant discs. Views frame from inside the cube, as whole-scene framing would stand beyond the fog. WebGPU draws `Points` 1 px wide, so a child `Sprite` named `Sprites` draws the discs; the
 * `Points` stay for picking and framing. The pointer-driven camera is dropped. Plays when opened.
 */
@Register
export class PointsBillboardsExample extends Document {

  public particles: Points<BufferGeometry, PointsMaterial>
  private spriteMaterial: PointsNodeMaterial

  @Property({type: Boolean, value: true})
  declare sizeAttenuation: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.fog = new FogExp2( 0x000000, 0.001 )

    const geometry = new BufferGeometry()
    const vertices: number[] = []

    // Views draw on document changes only, so report the texture when it arrives.
    const sprite = new TextureLoader().load( 'https://threejs.org/examples/textures/sprites/disc.png', () => this.notify({kind: 'material'}) )
    sprite.colorSpace = SRGBColorSpace

    for ( let i = 0; i < 10000; i ++ ) {

      const x = 2000 * Math.random() - 1000
      const y = 2000 * Math.random() - 1000
      const z = 2000 * Math.random() - 1000

      vertices.push( x, y, z )

    }

    geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )

    // The 1 px points have no uvs for the disc: only the sprites take the map.
    const material = new PointsMaterial( { size: 35, sizeAttenuation: true, alphaTest: 0.5, transparent: true } )
    material.color.setHSL( 1.0, 0.3, 0.7, SRGBColorSpace )

    this.particles = new Points( geometry, material )
    this.particles.name = 'Particles'
    this.scene.add( this.particles )

    // A disc per point at the material's size and color.

    this.spriteMaterial = new PointsNodeMaterial( {
      positionNode: instancedBufferAttribute( new InstancedBufferAttribute( geometry.getAttribute( 'position' ).array, 3 ) ),
      map: sprite,
      size: material.size,
      sizeAttenuation: true,
      alphaTest: 0.5,
      transparent: true,
    } )
    this.spriteMaterial.color = material.color

    const sprites = new Sprite( this.spriteMaterial )
    sprites.name = 'Sprites'
    sprites.count = vertices.length / 3
    // A sprite's bounds are one quad at its origin.
    sprites.frustumCulled = false
    sprites.userData.selectable = false
    this.particles.add( sprites )
  }

  /**
   * Whole-scene framing would put the views outside the cube, where the fog hides everything: frame closer, about where
   * the source camera stands (on the cube's face), once the document is on screen.
   */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.dispatch('frame-object', {object: this.particles, overscan: 0.4}, true)
  }

  sizeAttenuationChanged() {
    if ( ! this.spriteMaterial ) return
    this.particles.material.sizeAttenuation = this.sizeAttenuation
    this.spriteMaterial.sizeAttenuation = this.sizeAttenuation
    this.spriteMaterial.needsUpdate = true
    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    const h = time / PERIOD
    this.particles.material.color.setHSL( h, 0.5, 0.5 )
  }
}

registerEditorGroups(PointsBillboardsExample, {
  Main: ['sizeAttenuation'],
  Hidden: ['particles', 'spriteMaterial'],
})
