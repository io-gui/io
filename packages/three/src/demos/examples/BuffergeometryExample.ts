import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Fog,
  Mesh,
  MeshPhongMaterial,
  Vector3
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds in which the spin repeats (0.25 and 0.5 rad/s): the timeline length. */
const PERIOD = 8 * Math.PI

/**
 * 160,000 random, translucent, vertex-colored triangles in an 800-unit cube: one non-indexed BufferGeometry with flat
 * normals and RGBA colors. Spins with document time; plays when opened.
 */
@Register
export class BuffergeometryExample extends Document {

  public mesh: Mesh

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0x050505 )
    this.scene.fog = new Fog( 0x050505, 2000, 3500 )

    //

    const ambientLight = new AmbientLight( 0xcccccc )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const light1 = new DirectionalLight( 0xffffff, 1.5 )
    light1.name = 'Key'
    light1.position.set( 1, 1, 1 )
    this.scene.add( light1 )

    const light2 = new DirectionalLight( 0xffffff, 4.5 )
    light2.name = 'Bottom'
    light2.position.set( 0, - 1, 0 )
    this.scene.add( light2 )

    //

    const triangles = 160000

    const geometry = new BufferGeometry()

    const positions: number[] = []
    const normals: number[] = []
    const colors: number[] = []

    const color = new Color()

    const n = 800, n2 = n / 2 // triangles spread in the cube
    const d = 12, d2 = d / 2 // individual triangle size

    const pA = new Vector3()
    const pB = new Vector3()
    const pC = new Vector3()

    const cb = new Vector3()
    const ab = new Vector3()

    for ( let i = 0; i < triangles; i ++ ) {
      // positions

      const x = Math.random() * n - n2
      const y = Math.random() * n - n2
      const z = Math.random() * n - n2

      const ax = x + Math.random() * d - d2
      const ay = y + Math.random() * d - d2
      const az = z + Math.random() * d - d2

      const bx = x + Math.random() * d - d2
      const by = y + Math.random() * d - d2
      const bz = z + Math.random() * d - d2

      const cx = x + Math.random() * d - d2
      const cy = y + Math.random() * d - d2
      const cz = z + Math.random() * d - d2

      positions.push( ax, ay, az )
      positions.push( bx, by, bz )
      positions.push( cx, cy, cz )

      // flat face normals

      pA.set( ax, ay, az )
      pB.set( bx, by, bz )
      pC.set( cx, cy, cz )

      cb.subVectors( pC, pB )
      ab.subVectors( pA, pB )
      cb.cross( ab )

      cb.normalize()

      const nx = cb.x
      const ny = cb.y
      const nz = cb.z

      normals.push( nx, ny, nz )
      normals.push( nx, ny, nz )
      normals.push( nx, ny, nz )

      // colors

      const vx = ( x / n ) + 0.5
      const vy = ( y / n ) + 0.5
      const vz = ( z / n ) + 0.5

      color.setRGB( vx, vy, vz )

      const alpha = Math.random()

      colors.push( color.r, color.g, color.b, alpha )
      colors.push( color.r, color.g, color.b, alpha )
      colors.push( color.r, color.g, color.b, alpha )
    }

    // The source frees the arrays after upload (`onUpload`); framing and picking read them, so they stay.
    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
    geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) )
    geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 4 ) )

    geometry.computeBoundingSphere()

    const material = new MeshPhongMaterial( {
      color: 0xd5d5d5, specular: 0xffffff, shininess: 250,
      side: DoubleSide, vertexColors: true, transparent: true
    } )

    this.mesh = new Mesh( geometry, material )
    this.mesh.name = 'Triangles'
    this.scene.add( this.mesh )
  }

  override onAnimate(delta: number, time: number) {
    this.mesh.rotation.x = time * 0.25
    this.mesh.rotation.y = time * 0.5
  }
}
