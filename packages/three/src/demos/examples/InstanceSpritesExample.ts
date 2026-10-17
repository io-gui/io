import {
  Box3,
  Color,
  FogExp2,
  InstancedBufferAttribute,
  InstancedMesh,
  PlaneGeometry,
  SRGBColorSpace,
  Sphere,
  SpriteNodeMaterial,
  TextureLoader,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { uniform, instanceIndex, instancedBufferAttribute } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds of one turn of the sprites' hue: the timeline length. The sprites' spin jumps at the wrap. */
const PERIOD = 20

/**
 * 10000 snowflake sprites scattered in a 2000-unit cube, spinning with document time and cycling through hues.
 * `sizeAttenuation` is in the Document tab. The pointer-driven camera is dropped. The sprites are an `InstancedMesh`
 * with identity instance matrices and the cube's bounds, so framing and culling see them (the source draws a `Sprite`
 * with `count`). Plays when opened.
 */
@Register
export class InstanceSpritesExample extends Document {

  public material: SpriteNodeMaterial
  public particles: InstancedMesh
  private scaleUniform = uniform( 15 )

  @Property({type: Boolean, value: true})
  declare sizeAttenuation: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0x000000 )
    this.scene.fog = new FogExp2( 0x000000, 0.001 )

    // positions

    const count = 10000

    const positions = []

    for ( let i = 0; i < count; i ++ ) {
      positions.push( 2000 * Math.random() - 1000, 2000 * Math.random() - 1000, 2000 * Math.random() - 1000 )
    }

    const positionAttribute = new InstancedBufferAttribute( new Float32Array( positions ), 3 )

    // texture

    // Views draw on document changes only, so report the texture when it arrives.
    const map = new TextureLoader().load( 'https://threejs.org/examples/textures/sprites/snowflake1.png', () => this.notify({kind: 'material'}) )
    map.colorSpace = SRGBColorSpace

    // material

    this.material = new SpriteNodeMaterial( { sizeAttenuation: true, map, alphaMap: map, alphaTest: 0.1 } )
    this.material.color.setHSL( 1.0, 0.3, 0.7, SRGBColorSpace )
    this.material.positionNode = instancedBufferAttribute( positionAttribute )
    this.material.rotationNode = this.timeline.timeNode.add( instanceIndex ).sin()
    this.material.scaleNode = this.scaleUniform

    // sprites

    this.particles = new InstancedMesh( new PlaneGeometry( 1, 1 ), this.material, count )
    this.particles.name = 'Snowflakes'
    this.particles.boundingBox = new Box3( new Vector3( - 1010, - 1010, - 1010 ), new Vector3( 1010, 1010, 1010 ) )
    this.particles.boundingSphere = this.particles.boundingBox.getBoundingSphere( new Sphere() )
    this.scene.add( this.particles )

    this.pose( this.timeline.currentTime )
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
    if ( ! this.material ) return
    this.material.sizeAttenuation = this.sizeAttenuation
    this.material.needsUpdate = true
    this.scaleUniform.value = this.sizeAttenuation ? 15 : 0.03
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const h = ( time / PERIOD ) % 1
    this.material.color.setHSL( h, 0.5, 0.5 )
  }
}

registerEditorGroups(InstanceSpritesExample, {
  Main: ['sizeAttenuation'],
  Hidden: ['material', 'particles', 'scaleUniform'],
})
