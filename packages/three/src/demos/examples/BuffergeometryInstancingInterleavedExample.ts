import {
  BufferAttribute,
  Color,
  InstancedBufferGeometry,
  InstancedMesh,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  Matrix4,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  SRGBColorSpace,
  TextureLoader,
  Vector3
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The cloud turns 0.05 rad/s (one
 * turn); each crate spins 0.4 rad/s about (1, 1, 1) (eight turns).
 */
const PERIOD = 40 * Math.PI

/** The source's per-frame spin, a quaternion `(0.5, 0.5, 0.5) * dt` with `dt` in units of 5 s: 2/5 rad/s. */
const SPIN_RATE = 0.4
const SPIN_AXIS = new Vector3( 1, 1, 1 ).normalize()

const instances = 5000

/**
 * 5000 crates from one `InstancedMesh` whose cube geometry keeps positions and uvs in one interleaved buffer (eight
 * floats per vertex). The cloud turns, and each crate spins about its own (1, 1, 1) axis, both derived from document
 * time. The source camera, looking out from the middle of the cloud, is the active camera. Plays when opened.
 */
@Register
export class BuffergeometryInstancingInterleavedExample extends Document {

  public mesh: InstancedMesh<InstancedBufferGeometry, MeshBasicMaterial>
  /** The instance matrices at time 0. */
  private baseMatrices: Matrix4[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0x101010 )

    // The source looks out from the middle of the cloud.
    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    this.activeCamera = camera

    // geometry

    const geometry = new InstancedBufferGeometry()

    // per mesh data x,y,z,w,u,v,s,t for 4-element alignment
    // only use x,y,z and u,v; but x, y, z, nx, ny, nz, u, v would be a good layout
    const vertexBuffer = new InterleavedBuffer( new Float32Array( [
      // Front
      - 1, 1, 1, 0, 0, 0, 0, 0,
      1, 1, 1, 0, 1, 0, 0, 0,
      - 1, - 1, 1, 0, 0, 1, 0, 0,
      1, - 1, 1, 0, 1, 1, 0, 0,
      // Back
      1, 1, - 1, 0, 1, 0, 0, 0,
      - 1, 1, - 1, 0, 0, 0, 0, 0,
      1, - 1, - 1, 0, 1, 1, 0, 0,
      - 1, - 1, - 1, 0, 0, 1, 0, 0,
      // Left
      - 1, 1, - 1, 0, 1, 1, 0, 0,
      - 1, 1, 1, 0, 1, 0, 0, 0,
      - 1, - 1, - 1, 0, 0, 1, 0, 0,
      - 1, - 1, 1, 0, 0, 0, 0, 0,
      // Right
      1, 1, 1, 0, 1, 0, 0, 0,
      1, 1, - 1, 0, 1, 1, 0, 0,
      1, - 1, 1, 0, 0, 0, 0, 0,
      1, - 1, - 1, 0, 0, 1, 0, 0,
      // Top
      - 1, 1, 1, 0, 0, 0, 0, 0,
      1, 1, 1, 0, 1, 0, 0, 0,
      - 1, 1, - 1, 0, 0, 1, 0, 0,
      1, 1, - 1, 0, 1, 1, 0, 0,
      // Bottom
      1, - 1, 1, 0, 1, 0, 0, 0,
      - 1, - 1, 1, 0, 0, 0, 0, 0,
      1, - 1, - 1, 0, 1, 1, 0, 0,
      - 1, - 1, - 1, 0, 0, 1, 0, 0
    ] ), 8 )

    // Use vertexBuffer, starting at offset 0, 3 items in position attribute
    const positions = new InterleavedBufferAttribute( vertexBuffer, 3, 0 )
    geometry.setAttribute( 'position', positions )
    // Use vertexBuffer, starting at offset 4, 2 items in uv attribute
    const uvs = new InterleavedBufferAttribute( vertexBuffer, 2, 4 )
    geometry.setAttribute( 'uv', uvs )

    const indices = new Uint16Array( [
      0, 2, 1,
      2, 3, 1,
      4, 6, 5,
      6, 7, 5,
      8, 10, 9,
      10, 11, 9,
      12, 14, 13,
      14, 15, 13,
      16, 17, 18,
      18, 17, 19,
      20, 21, 22,
      22, 21, 23
    ] )

    geometry.setIndex( new BufferAttribute( indices, 1 ) )

    // material

    const material = new MeshBasicMaterial()
    // Views draw on document changes only, so report the texture when it arrives.
    material.map = new TextureLoader().load( 'https://threejs.org/examples/textures/crate.gif', () => this.notify({kind: 'material'}) )
    material.map.colorSpace = SRGBColorSpace
    material.map.flipY = false

    // per instance data

    const matrix = new Matrix4()
    const offset = new Vector3()
    const orientation = new Quaternion()
    const scale = new Vector3( 1, 1, 1 )
    let x, y, z, w

    // Workaround (upstream: instanced-mesh-instance-count): WebGPU draws an InstancedMesh of an InstancedBufferGeometry
    // with the geometry's instanceCount (Infinity by default) instead of the mesh's count, which WebGL uses.
    geometry.instanceCount = instances

    this.mesh = new InstancedMesh( geometry, material, instances )
    this.mesh.name = 'Crates'

    for ( let i = 0; i < instances; i ++ ) {

      // offsets

      x = Math.random() * 100 - 50
      y = Math.random() * 100 - 50
      z = Math.random() * 100 - 50

      offset.set( x, y, z ).normalize()
      offset.multiplyScalar( 5 ) // move out at least 5 units from center in current direction
      offset.set( x + offset.x, y + offset.y, z + offset.z )

      // orientations

      x = Math.random() * 2 - 1
      y = Math.random() * 2 - 1
      z = Math.random() * 2 - 1
      w = Math.random() * 2 - 1

      orientation.set( x, y, z, w ).normalize()

      matrix.compose( offset, orientation, scale )

      this.mesh.setMatrixAt( i, matrix )
      this.baseMatrices.push( matrix.clone() )

    }

    this.mesh.computeBoundingBox()
    this.mesh.computeBoundingSphere()
    this.scene.add( this.mesh )
  }

  private spin = new Matrix4()
  private current = new Matrix4()

  override onAnimate(delta: number, time: number) {
    const mesh = this.mesh
    mesh.rotation.y = time * 0.05

    this.spin.makeRotationAxis( SPIN_AXIS, time * SPIN_RATE )

    for ( let i = 0; i < instances; i ++ ) {
      mesh.setMatrixAt( i, this.current.multiplyMatrices( this.baseMatrices[ i ], this.spin ) )
    }

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }
}
