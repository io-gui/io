import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  FogExp2,
  InstancedBufferAttribute,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  PointsNodeMaterial,
  Sprite,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3
} from 'three/webgpu'
import { instancedBufferAttribute } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** What views frame: inside the cube, about where the source camera stands (whole-scene framing stands beyond the fog). */
const FRAME_EXTENT = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 400, - 400, - 400 ), new Vector3( 400, 400, 400 ) ] ) )

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The layers turn 0.05, 0.1, 0.15,
 * 0.2 and -0.25 rad/s (one to five turns); the hues cycle six times (source: every 20 s).
 */
const PERIOD = 40 * Math.PI
const HUE_CYCLES = 6

/** Each layer's HSL color, snowflake texture and point size. */
const LAYERS: [ [ number, number, number ], number, number ][] = [
  [[ 1.0, 0.2, 0.5 ], 2, 20 ],
  [[ 0.95, 0.1, 0.5 ], 3, 15 ],
  [[ 0.90, 0.05, 0.5 ], 1, 10 ],
  [[ 0.85, 0, 0.5 ], 5, 8 ],
  [[ 0.80, 0, 0.5 ], 4, 5 ]
]

/**
 * Snow: five layers of points sharing one geometry, each with its own snowflake texture, size and hue, turning at
 * different rates with document time. `texture` (Document tab) draws plain squares instead. WebGPU draws `Points` 1 px
 * wide, so each layer has a child `Sprite` named `Sprites` that draws the flakes. Views frame from inside the cube, as whole-scene framing would stand beyond the fog. The active camera stands where the source's
 * pointer-driven camera rests.
 * Plays when opened.
 */
@Register
export class PointsSpritesExample extends Document {

  public layers: Points<BufferGeometry, PointsMaterial>[] = []
  private spriteMaterials: PointsNodeMaterial[] = []
  private textures: Texture[] = []

  @Property({type: Boolean, value: true})
  declare texture: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 75, 400 / 250, 1, 2000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 1000 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.fog = new FogExp2( 0x000000, 0.0008 )

    const geometry = new BufferGeometry()
    const vertices: number[] = []

    const textureLoader = new TextureLoader()

    // Views draw on document changes only, so report the textures when they arrive.
    const load = ( index: number ) => {
      const texture = textureLoader.load( `https://threejs.org/examples/textures/sprites/snowflake${index}.png`, () => this.notify({kind: 'material'}) )
      texture.colorSpace = SRGBColorSpace
      return texture
    }

    for ( let i = 0; i < 10000; i ++ ) {

      const x = Math.random() * 2000 - 1000
      const y = Math.random() * 2000 - 1000
      const z = Math.random() * 2000 - 1000

      vertices.push( x, y, z )

    }

    geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )

    const spritePositions = new InstancedBufferAttribute( geometry.getAttribute( 'position' ).array, 3 )

    for ( let i = 0; i < LAYERS.length; i ++ ) {

      const color = LAYERS[ i ][ 0 ]
      const sprite = load( LAYERS[ i ][ 1 ] )
      const size = LAYERS[ i ][ 2 ]

      // The 1 px points have no uvs for the flake: only the sprites take the map.
      const material = new PointsMaterial( { size: size, blending: AdditiveBlending, depthTest: false, transparent: true } )
      material.color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ], SRGBColorSpace )

      const particles = new Points( geometry, material )
      particles.name = `Layer ${i + 1}`

      particles.rotation.x = Math.random() * 6
      particles.rotation.y = Math.random() * 6
      particles.rotation.z = Math.random() * 6

      // A flake per point at the layer's size and color.

      const spriteMaterial = new PointsNodeMaterial( {
        positionNode: instancedBufferAttribute( spritePositions ),
        map: sprite,
        size: size,
        sizeAttenuation: true,
        blending: AdditiveBlending,
        depthTest: false,
        transparent: true,
      } )
      spriteMaterial.color = material.color

      const sprites = new Sprite( spriteMaterial )
      sprites.name = 'Sprites'
      sprites.count = vertices.length / 3
      // A sprite's bounds are one quad at its origin.
      sprites.frustumCulled = false
      sprites.userData.selectable = false
      particles.add( sprites )

      this.scene.add( particles )
      this.layers.push( particles )
      this.spriteMaterials.push( spriteMaterial )
      this.textures.push( sprite )

    }
  }

  override getEditorFrameTarget() {
    return FRAME_EXTENT
  }

  textureChanged() {
    for ( let i = 0; i < this.spriteMaterials.length; i ++ ) {
      const map = this.texture ? this.textures[ i ] : null
      this.spriteMaterials[ i ].map = map
      this.spriteMaterials[ i ].needsUpdate = true
    }
    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    const turn = time / PERIOD * Math.PI * 2

    for ( let i = 0; i < this.layers.length; i ++ ) {
      this.layers[ i ].rotation.y = turn * ( i < 4 ? i + 1 : - ( i + 1 ) )

      const color = LAYERS[ i ][ 0 ]
      const h = ( color[ 0 ] + time / PERIOD * HUE_CYCLES ) % 1
      this.layers[ i ].material.color.setHSL( h, color[ 1 ], color[ 2 ], SRGBColorSpace )
    }
  }
}

registerEditorGroups(PointsSpritesExample, {
  Main: ['texture'],
  Hidden: ['layers', 'spriteMaterials', 'textures'],
})
