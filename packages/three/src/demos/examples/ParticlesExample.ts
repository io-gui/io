import {
  AdditiveBlending,
  Box3,
  Color,
  IndirectStorageBufferAttribute,
  InstancedMesh,
  PerspectiveCamera,
  PlaneGeometry,
  Sphere,
  SpriteNodeMaterial,
  TextureLoader,
  Vector3
} from 'three/webgpu'
import { range, texture, mix, uv, color, rotateUV, positionLocal, uniform } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of playback. Each particle has its own life length, so the loop jumps at the wrap. */
const DURATION = 20

/**
 * Smoke and fire from instanced sprites whose position, size, rotation, color and fade are TSL functions of document
 * time and per-instance random ranges; the fire is drawn through an indirect draw call. `speed` is in the Document
 * tab. The sprites are `InstancedMesh`es with identity instance matrices and the plumes' bounds, so framing and
 * culling see them (the source draws them as `Mesh.count` instances). The source's grid helper is dropped (the grid
 * overlay). Plays when opened.
 */
@Register
export class ParticlesExample extends Document {

  private speedUniform = uniform( .2 )

  @Property({type: Number, value: .2})
  declare speed: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: DURATION}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 5000 )
    camera.name = 'Camera'
    camera.position.set( 1300, 500, 0 )
    camera.lookAt( 0, 500, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x333333 )

    // textures

    // Views draw on document changes only, so report the texture when it arrives.
    const map = new TextureLoader().load( 'https://threejs.org/examples/textures/opengameart/smoke1.png', () => this.notify({kind: 'material'}) )

    // create nodes

    const lifeRange = range( .1, 1 )
    const offsetRange = range( new Vector3( - 2, 3, - 2 ), new Vector3( 2, 5, 2 ) )

    const scaledTime = this.timeline.timeNode.add( 5 ).mul( this.speedUniform )

    const lifeTime = scaledTime.mul( lifeRange ).mod( 1 )
    const scaleRange = range( .3, 2 )
    const rotateRange = range( .1, 4 )

    const life = lifeTime.div( lifeRange )

    const fakeLightEffect = positionLocal.y.oneMinus().max( 0.2 )

    const textureNode = texture( map, rotateUV( uv(), scaledTime.mul( rotateRange ) ) )

    const opacityNode = textureNode.a.mul( life.oneMinus() )

    const smokeColor = mix( color( 0x2c1501 ), color( 0x222222 ), positionLocal.y.mul( 3 ).clamp() )

    // create particles

    const smokeNodeMaterial = new SpriteNodeMaterial()
    smokeNodeMaterial.colorNode = mix( color( 0xf27d0c ), smokeColor, life.mul( 2.5 ).min( 1 ) ).mul( fakeLightEffect )
    smokeNodeMaterial.opacityNode = opacityNode
    smokeNodeMaterial.positionNode = offsetRange.mul( lifeTime )
    smokeNodeMaterial.scaleNode = scaleRange.mul( lifeTime.max( 0.3 ) )
    smokeNodeMaterial.depthWrite = false

    const smokeInstancedSprite = new InstancedMesh( new PlaneGeometry( 1, 1 ), smokeNodeMaterial, 2000 )
    smokeInstancedSprite.name = 'Smoke'
    // Positions up to (±2, 5, ±2), sprites up to 2 wide.
    smokeInstancedSprite.boundingBox = new Box3( new Vector3( - 3, - 1, - 3 ), new Vector3( 3, 6, 3 ) )
    smokeInstancedSprite.boundingSphere = smokeInstancedSprite.boundingBox.getBoundingSphere( new Sphere() )
    smokeInstancedSprite.scale.setScalar( 400 )
    this.scene.add( smokeInstancedSprite )

    //

    const fireGeometry = new PlaneGeometry( 1, 1 )
    const fireCount = 1000

    const fireNodeMaterial = new SpriteNodeMaterial()
    fireNodeMaterial.colorNode = mix( color( 0xb72f17 ), color( 0xb72f17 ), life )
    fireNodeMaterial.positionNode = range( new Vector3( - 1, 1, - 1 ), new Vector3( 1, 2, 1 ) ).mul( lifeTime )
    fireNodeMaterial.scaleNode = smokeNodeMaterial.scaleNode
    fireNodeMaterial.opacityNode = opacityNode.mul( .5 )
    fireNodeMaterial.blending = AdditiveBlending
    fireNodeMaterial.transparent = true
    fireNodeMaterial.depthWrite = false

    const fireInstancedSprite = new InstancedMesh( fireGeometry, fireNodeMaterial, fireCount )
    fireInstancedSprite.name = 'Fire'
    // Positions up to (±1, 2, ±1), sprites up to 2 wide.
    fireInstancedSprite.boundingBox = new Box3( new Vector3( - 2, - 1, - 2 ), new Vector3( 2, 3, 2 ) )
    fireInstancedSprite.boundingSphere = fireInstancedSprite.boundingBox.getBoundingSphere( new Sphere() )
    fireInstancedSprite.scale.setScalar( 400 )
    fireInstancedSprite.position.y = - 100
    fireInstancedSprite.renderOrder = 1
    this.scene.add( fireInstancedSprite )

    // indirect draw ( optional )
    // each indirect draw call is 5 uint32 values for indexes ( different structure for non-indexed draw calls using 4 uint32 values )

    const indexCount = fireGeometry.index!.array.length

    const uint32 = new Uint32Array( 5 )
    uint32[ 0 ] = indexCount // indexCount
    uint32[ 1 ] = fireCount // instanceCount
    uint32[ 2 ] = 0 // firstIndex
    uint32[ 3 ] = 0 // baseVertex
    uint32[ 4 ] = 0 // firstInstance

    const indirectAttribute = new IndirectStorageBufferAttribute( uint32, 5 )
    fireGeometry.setIndirect( indirectAttribute )
  }

  speedChanged() { this.speedUniform.value = this.speed }
}

registerEditorConfig(ParticlesExample, [
  ['speed', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(ParticlesExample, {
  Main: ['speed'],
  Hidden: ['speedUniform'],
})
