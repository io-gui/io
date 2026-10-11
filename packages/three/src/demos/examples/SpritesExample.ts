import { Color, Group, Sprite, SpriteNodeMaterial, Texture, TextureLoader } from 'three/webgpu'
import { texture, uv, userData, fog, rangeFogFactor, color } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The group turns at 0.5, 0.75 and
 * 1 rad/s about x, y and z (as in the source), which all complete whole turns in 8π s.
 */
const PERIOD = 8 * Math.PI

/** Smallest sprite spin (rad/s) that completes whole turns in one period. */
const SPIN_STEP = 2 * Math.PI / PERIOD

/**
 * 200 sprites on a sphere in a turning group, each pulsing in size and spinning at its own rate through a
 * `userData`-driven rotation node, with range fog. Plays when opened.
 */
@Register
export class SpritesExample extends Document {

  public group: Group
  public map: Texture

  private imageWidth = 1
  private imageHeight = 1

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0x000000 )
    this.scene.fogNode = fog( color( 0x0000ff ), rangeFogFactor( 1500, 2100 ) )

    // create sprites

    const amount = 200
    const radius = 500

    this.map = new TextureLoader().load( 'https://threejs.org/examples/textures/sprite1.png', ( map ) => {
      const image = map.image as HTMLImageElement
      this.imageWidth = image.width
      this.imageHeight = image.height
      // The sprite scale depends on the image size: pose them again, and redraw for the texture.
      this.pose( this.timeline.currentTime )
      this.notify({kind: 'material'})
    } )

    this.group = new Group()
    this.group.name = 'Sprites'

    const textureNode = texture( this.map )

    const material = new SpriteNodeMaterial()
    material.colorNode = textureNode.mul( uv() ).mul( 2 ).saturate()
    material.opacityNode = textureNode.a
    material.rotationNode = userData( 'rotation', 'float' ) // get value of: sprite.userData.rotation

    for ( let a = 0; a < amount; a ++ ) {
      const x = Math.random() - 0.5
      const y = Math.random() - 0.5
      const z = Math.random() - 0.5

      const sprite = new Sprite( material )
      sprite.name = `Sprite ${a}`

      sprite.position.set( x, y, z )
      sprite.position.normalize()
      sprite.position.multiplyScalar( radius )

      // individual rotation per sprite; the source's 0.1 * ( i / l ) rad per frame, rounded to whole turns per period
      sprite.userData.rotation = 0
      sprite.userData.spin = Math.round( 6 * ( a / amount ) / SPIN_STEP ) * SPIN_STEP

      this.group.add( sprite )
    }

    this.scene.add( this.group )
    this.pose( 0 )
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const children = this.group.children
    for ( let i = 0, l = children.length; i < l; i ++ ) {
      const sprite = children[ i ]
      const scale = Math.sin( time + sprite.position.x * 0.01 ) * 0.3 + 1.0

      sprite.userData.rotation = sprite.userData.spin * time
      sprite.scale.set( scale * this.imageWidth, scale * this.imageHeight, 1.0 )
    }

    this.group.rotation.x = time * 0.5
    this.group.rotation.y = time * 0.75
    this.group.rotation.z = time * 1.0
  }
}
