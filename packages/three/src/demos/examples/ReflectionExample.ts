import {
  ACESFilmicToneMapping,
  Box3,
  BoxGeometry,
  BufferGeometry,
  Color,
  DirectionalLight,
  Fog,
  InstancedBufferAttribute,
  Mesh,
  MeshPhongNodeMaterial,
  MeshStandardNodeMaterial,
  Node,
  RepeatWrapping,
  SRGBColorSpace,
  Sphere,
  TextureLoader,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { abs, color, float, Fn, instancedBufferAttribute, max, normalWorldGeometry, positionGeometry, positionLocal, pow2, reflector, sin, sub, texture, uniform, uv, vec2, vec3 } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the two effector sweeps line up again: 15 cycles of the 3.8 s sweep (0.8 s delay, 3 s ease) and
 * 19 of the 3 s sweep. The timeline length, so the sweeps loop seamlessly; the boxes' bobbing jumps at the wrap.
 */
const PERIOD = 57

/** The source's tweens: `from` to `to` over `duration` seconds after `delay`, eased sinusoidally, repeated. */
function sweep(time: number, from: number, to: number, duration: number, delay: number) {
  const local = time % ( duration + delay ) - delay
  if ( local < 0 ) return from
  const k = local / duration
  return from + ( to - from ) * 0.5 * ( 1 - Math.cos( Math.PI * k ) )
}

/**
 * A tree of instanced boxes over a floor with a TSL `reflector()` reflection bent by a normal map. Two effectors sweep
 * up the tree and swell the boxes they pass (the source's tween.js tweens, derived from document time). Blur and
 * vignette post are dropped (`document-pipeline`); the auto-rotating camera is dropped, and the views frame the tree
 * (50-unit floor). The boxes are `Mesh.count` instances as in the source (an `InstancedMesh`'s matrix buffers would
 * pass WebGPU's 8 vertex buffers in TRAA views); the box geometry carries the tree's bounds, so framing and culling see
 * it. Plays when opened.
 */
@Register
export class ReflectionExample extends Document {

  // below uniforms are animated from document time
  private uniformEffector1 = uniform( - 0.2 )
  private uniformEffector2 = uniform( - 0.2 )
  public tree: Mesh

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.fog = new Fog( 0x4195a4, 1, 20 )
    this.scene.backgroundNode = normalWorldGeometry.y.mix( color( 0x4195a4 ), color( 0x0066ff ) )

    const sunLight = new DirectionalLight( 0xFFE499, 2 )
    sunLight.name = 'Sun'
    sunLight.position.set( 7, 5, 7 )
    sunLight.castShadow = true
    sunLight.shadow.camera.zoom = 1.5
    sunLight.shadow.mapSize.set( 1024, 1024 )
    sunLight.shadow.bias = - 0.0001 // remove self-shadowing artifacts
    this.scene.add( sunLight )

    const backLight = new DirectionalLight( 0x0487e2, 0.5 )
    backLight.name = 'Back'
    backLight.position.set( 7, - 5, 7 )
    this.scene.add( backLight )

    // textures

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader()
    const onLoad = () => this.notify({kind: 'material'})

    const floorColor = textureLoader.load( 'https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg', onLoad )
    floorColor.wrapS = RepeatWrapping
    floorColor.wrapT = RepeatWrapping
    floorColor.colorSpace = SRGBColorSpace
    floorColor.repeat.set( 15, 15 )

    const floorNormal = textureLoader.load( 'https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Normal.jpg', onLoad )
    floorNormal.wrapS = RepeatWrapping
    floorNormal.wrapT = RepeatWrapping
    floorNormal.repeat.set( 15, 15 )

    // tree

    this.tree = this.createTreeMesh()
    this.tree.name = 'Tree'
    this.tree.castShadow = true
    this.tree.receiveShadow = true
    this.scene.add( this.tree )

    // floor

    const floorUV = uv().mul( 15 )
    const floorNormalOffset = texture( floorNormal, floorUV ).xy.mul( 2 ).sub( 1 ).mul( .02 )

    const reflection = reflector( { resolutionScale: 0.2 } )
    reflection.target.name = 'Reflector'
    reflection.target.rotateX( - Math.PI / 2 )
    reflection.uvNode = reflection.uvNode!.add( floorNormalOffset )
    this.scene.add( reflection.target )

    // `NodeMaterial` applies `emissiveNode` on any material; @types/three 0.186 declares it only on some.
    const floorMaterial = new MeshPhongNodeMaterial() as MeshPhongNodeMaterial & {emissiveNode: Node | null}
    floorMaterial.colorNode = texture( floorColor, floorUV )
    floorMaterial.emissiveNode = reflection.mul( 0.25 )
    floorMaterial.normalMap = floorNormal
    floorMaterial.normalScale.set( 0.2, - 0.2 )

    const floor = new Mesh( new BoxGeometry( 50, .001, 50 ), floorMaterial )
    floor.name = 'Floor'
    floor.receiveShadow = true
    floor.userData.selectable = false
    this.scene.add( floor )

    this.pose( this.timeline.currentTime )
  }

  /**
   * The 50-unit floor would dominate whole-scene framing: frame the tree once the document is on screen. Framing reads
   * vertex positions, which are one box's: frame a detached stand-in whose two vertices are the tree's corners.
   */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const box = this.tree.geometry.boundingBox!
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ box.min, box.max ] ) )
    standIn.scale.copy( this.tree.scale )
    this.dispatch('frame-object', {object: standIn}, true)
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.uniformEffector1.value = sweep( time, - 0.2, 1.2, 3, 0.8 )
    this.uniformEffector2.value = sweep( time, - 0.2, 1.2, 3, 0 )
  }

  private createTreeMesh() {
    const maxSteps = 5
    const lengthMult = 0.8

    const positions: number[] = []
    const normals: number[] = []
    const colors: number[] = []
    const data: number[] = [] // will save seed, size and time

    let instanceCount = 0

    const newPosition = new Vector3()
    const position = new Vector3()
    const normal = new Vector3()
    const color = new Color()

    const random = () => ( Math.random() - 0.5 ) * 2.0

    const createTreePart = ( angle: number, x: number, y: number, z: number, length: number, count: number ) => {
      if ( Math.random() > ( maxSteps / count ) * 0.25 ) return

      if ( count < maxSteps ) {
        const newLength = length * lengthMult
        const newX = x + Math.cos( angle ) * length
        const newY = y + Math.sin( angle ) * length
        const countSq = Math.min( 3.2, count * count )
        const newZ = z + ( Math.random() * countSq - countSq / 2 ) * length

        let size = 30 - ( count * 8 )
        if ( size > 25 ) size = 25
        if ( size < 10 ) size = 10

        size = size / 100

        const subSteps = 50

        // below loop generates the instanced data for a tree part

        for ( let i = 0; i < subSteps; i ++ ) {
          instanceCount ++

          const percent = i / subSteps
          const extra = 1 / maxSteps

          // position

          newPosition.set( x, y, z ).lerp( new Vector3( newX, newY, newZ ), percent )
          position.copy( newPosition )

          position.x += random() * size * 3
          position.y += random() * size * 3
          position.z += random() * size * 3

          positions.push( position.x, position.y, position.z )

          const scale = Math.random() + 5

          // normal

          normal.copy( position ).sub( newPosition ).normalize()
          normals.push( normal.x, normal.y, normal.z )

          // color

          color.setHSL( ( count / maxSteps ) * 0.5 + Math.random() * 0.05, 0.75, 0.6 + Math.random() * 0.1 )
          colors.push( color.r, color.g, color.b )

          // to save vertex buffers, we store the size, time and seed in a single attribute

          const instanceSize = size * scale
          const instanceTime = ( count / maxSteps ) + percent * extra
          const instanceSeed = Math.random()

          data.push( instanceSize, instanceTime, instanceSeed )
        }

        createTreePart( angle + random(), newX, newY, newZ, newLength + random(), count + 1 )
        createTreePart( angle + random(), newX, newY, newZ, newLength + random(), count + 1 )
        createTreePart( angle + random(), newX, newY, newZ, newLength + random(), count + 1 )
        createTreePart( angle + random(), newX, newY, newZ, newLength + random(), count + 1 )
        createTreePart( angle + random(), newX, newY, newZ, newLength + random(), count + 1 )
        createTreePart( angle + random(), newX, newY, newZ, newLength + random(), count + 1 )
      }
    }

    const angle = Math.PI * 0.5

    // the tree is represented as a collection of instances boxes generated with below recursive function

    createTreePart( angle, 0, 0, 0, 16, 0 )

    const geometry = new BoxGeometry()
    // The tree's bounds, for framing and culling: box centers, plus the largest box (~1.5), swell (~1.2) and bob (1.5).
    geometry.boundingBox = new Box3().setFromArray( positions ).expandByScalar( 4 )
    geometry.boundingSphere = geometry.boundingBox.getBoundingSphere( new Sphere() )
    const material = new MeshStandardNodeMaterial()
    const mesh = new Mesh( geometry, material )
    mesh.scale.setScalar( 0.05 )
    mesh.count = instanceCount

    // instanced data

    const attributePosition = new InstancedBufferAttribute( new Float32Array( positions ), 3 )
    const attributeNormal = new InstancedBufferAttribute( new Float32Array( normals ), 3 )
    const attributeColor = new InstancedBufferAttribute( new Float32Array( colors ), 3 )
    const attributeData = new InstancedBufferAttribute( new Float32Array( data ), 3 )

    // TSL

    const instancePosition = instancedBufferAttribute( attributePosition ) as Node<'vec3'>
    const instanceNormal = instancedBufferAttribute( attributeNormal ) as Node<'vec3'>
    const instanceColor = instancedBufferAttribute( attributeColor ) as Node<'vec3'>
    const instanceData = instancedBufferAttribute( attributeData ) as Node<'vec3'>

    const uniformEffector1 = this.uniformEffector1
    const uniformEffector2 = this.uniformEffector2
    const time = this.timeline.timeNode

    material.positionNode = Fn( () => {
      const instanceSize = instanceData.x
      const instanceTime = instanceData.y
      const instanceSeed = instanceData.z

      // effectors (these are responsible for the blob-like scale effects)

      const dif1 = abs( instanceTime.sub( uniformEffector1 ) ).toConst()
      let effect = dif1.lessThanEqual( 0.15 ).select( sub( 0.15, dif1 ).mul( sub( 1.7, instanceTime ).mul( 10 ) ), float( 0 ) )

      const dif2 = abs( instanceTime.sub( uniformEffector2 ) ).toConst()
      effect = dif2.lessThanEqual( 0.15 ).select( sub( 0.15, dif2 ).mul( sub( 1.7, instanceTime ).mul( 10 ) ), effect )

      // accumulate different vertex animations

      let animated: Node<'vec3'> = positionLocal.add( instancePosition ).toVar()
      const direction = positionGeometry.normalize().toConst()

      animated = animated.add( direction.mul( effect.add( instanceSize ) ) )
      animated = animated.sub( direction.mul( effect ) )
      animated = animated.add( instanceNormal.mul( effect.mul( 1 ) ) )
      animated = animated.add( instanceNormal.mul( abs( sin( time.add( instanceSeed.mul( 2 ) ) ).mul( 1.5 ) ) ) )

      return animated
    } )()

    const squareEdge = Fn( () => {
      const pos = uv().sub( vec2( 0.5, 0.5 ) )
      const squareDistance = max( abs( pos.x ), abs( pos.y ) )
      return squareDistance.div( 0.5 ).clamp( 0.85, 1 ).sub( 0.5 ).mul( 2.0 )
    } )()

    material.colorNode = Fn( () => {
      return squareEdge.sub( instanceColor )
    } )()

    material.emissiveNode = Fn( () => {
      const instanceTime = instanceData.y

      const dif1 = abs( instanceTime.sub( uniformEffector1 ) ).toConst()
      const effect1 = dif1.lessThanEqual( 0.15 ).select( sub( 0.15, dif1 ).mul( sub( 1.7, instanceTime ).mul( 10 ) ), float( 0 ) )

      const dif2 = abs( instanceTime.sub( uniformEffector2 ) ).toConst()
      const effect2 = dif2.lessThanEqual( 0.15 ).select( sub( 0.15, dif2 ).mul( sub( 1.7, instanceTime ).mul( 10 ) ), effect1 )

      return pow2( vec3( effect1, 0, effect2 ) ).mul( instanceColor )
    } )()

    return mesh
  }
}

registerEditorGroups(ReflectionExample, {
  Hidden: ['uniformEffector1', 'uniformEffector2', 'tree'],
})
