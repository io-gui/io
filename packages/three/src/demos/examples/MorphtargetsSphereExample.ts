import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  InstancedBufferAttribute,
  InterleavedBufferAttribute,
  Material,
  Mesh,
  PointLight,
  PointsNodeMaterial,
  SphereGeometry,
  Sprite,
  TextureLoader
} from 'three/webgpu'
import { instancedBufferAttribute, uniform } from 'three/tsl'
import type { Node } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The sphere turns 0.5 rad/s, and
 * its second morph target swings 0 -> 1 -> 0 three times (source: 0.5 per second, every 4 s).
 */
const PERIOD = 4 * Math.PI
const SWINGS = 3

/** The xyz of each item of `attribute` as a tightly packed array (glTF attributes can be interleaved). */
function packed( attribute: BufferAttribute | InterleavedBufferAttribute ) {
  const array = new Float32Array( attribute.count * 3 )
  for ( let i = 0; i < attribute.count; i ++ ) {
    array[ i * 3 ] = attribute.getX( i )
    array[ i * 3 + 1 ] = attribute.getY( i )
    array[ i * 3 + 2 ] = attribute.getZ( i )
  }
  return array
}

/**
 * A glTF sphere morphing between shapes and turning with document time, with a disc on each vertex that follows the
 * morph. WebGPU draws `Points` 1 px wide, and quads drawn from an instanced attribute do not see morph targets, so the
 * child `Points` sprite applies them itself: each target's offsets are instanced attributes weighted by the mesh's
 * influences. Plays when opened.
 */
@Register
export class MorphtargetsSphereExample extends Document {

  public mesh?: Mesh<BufferGeometry, Material>

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const light1 = new PointLight( 0xff2200, 50000 )
    light1.name = 'Red'
    light1.position.set( 100, 100, 100 )
    this.scene.add( light1 )

    const light2 = new PointLight( 0x22ff00, 10000 )
    light2.name = 'Green'
    light2.position.set( - 100, - 100, - 100 )
    this.scene.add( light2 )

    const ambientLight = new AmbientLight( 0x111111 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/AnimatedMorphSphere/glTF/AnimatedMorphSphere.gltf' )

      const mesh = gltf.scene.getObjectByName( 'AnimatedMorphSphere' ) as Mesh<BufferGeometry, Material>
      mesh.rotation.z = Math.PI / 2
      this.scene.add( mesh )
      this.mesh = mesh

      //

      const geometry = mesh.geometry
      const influences = mesh.morphTargetInfluences!

      let positionNode: Node<'vec3'> = instancedBufferAttribute<'vec3'>( new InstancedBufferAttribute( packed( geometry.attributes.position ), 3 ) )

      const targets = geometry.morphAttributes.position ?? []
      targets.forEach( ( target, i ) => {
        const influence = uniform( 0 ).onObjectUpdate( () => influences[ i ] )
        const offset = instancedBufferAttribute<'vec3'>( new InstancedBufferAttribute( packed( target ), 3 ) )
        positionNode = positionNode.add( offset.mul( influence ) )
      } )

      // Views draw on document changes only, so report the texture when it arrives.
      const map = new TextureLoader().load( 'https://threejs.org/examples/textures/sprites/disc.png', () => this.notify({kind: 'material'}) )

      const pointsMaterial = new PointsNodeMaterial( {
        positionNode,
        size: 10,
        sizeAttenuation: false,
        map,
        alphaTest: 0.5
      } )

      const points = new Sprite( pointsMaterial )
      points.name = 'Points'
      points.count = geometry.attributes.position.count
      // A sprite's bounds are one quad at its origin.
      points.frustumCulled = false
      points.userData.selectable = false
      mesh.add( points )

      this.pose( this.timeline.currentTime )

      this.notify({kind: 'structure'})

      // The sprite's quad, scaled with the mesh (100), would dwarf the sphere in framing: frame a detached stand-in of
      // the morph-inclusive bounds instead.
      geometry.computeBoundingSphere()
      const focus = new Mesh( new SphereGeometry( geometry.boundingSphere!.radius * mesh.scale.x ) )
      focus.updateMatrixWorld()
      this.dispatch('frame-object', {object: focus}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const mesh = this.mesh
    if ( ! mesh ) return

    mesh.rotation.y = time * 0.5

    // A triangle wave from 0 to 1 and back.
    const phase = ( time / PERIOD * SWINGS * 2 ) % 2
    mesh.morphTargetInfluences![ 1 ] = 1 - Math.abs( phase - 1 )
  }
}
