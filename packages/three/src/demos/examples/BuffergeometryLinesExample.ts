import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, PerspectiveCamera } from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds in which the motion repeats (spin at 0.25 and 0.5 rad/s, morph at |sin(0.5 t)|): the timeline length. */
const PERIOD = 8 * Math.PI

const segments = 10000
const r = 800

/** One line strip through 10,000 random, vertex-colored points, morphing toward a second random set. Spins with document time; plays when opened. */
@Register
export class BuffergeometryLinesExample extends Document {

  public line: Line

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 27, 400 / 250, 1, 4000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 2750 )
    this.activeCamera = camera

    const geometry = new BufferGeometry()
    const material = new LineBasicMaterial( { vertexColors: true } )

    const positions: number[] = []
    const colors: number[] = []

    for ( let i = 0; i < segments; i ++ ) {
      const x = Math.random() * r - r / 2
      const y = Math.random() * r - r / 2
      const z = Math.random() * r - r / 2

      // positions

      positions.push( x, y, z )

      // colors

      colors.push( ( x / r ) + 0.5 )
      colors.push( ( y / r ) + 0.5 )
      colors.push( ( z / r ) + 0.5 )
    }

    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
    geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) )
    generateMorphTargets( geometry )

    geometry.computeBoundingSphere()

    this.line = new Line( geometry, material )
    this.line.name = 'Line'
    this.scene.add( this.line )
  }

  override onAnimate(delta: number, time: number) {
    this.line.rotation.x = time * 0.25
    this.line.rotation.y = time * 0.5

    this.line.morphTargetInfluences![ 0 ] = Math.abs( Math.sin( time * 0.5 ) )
  }
}

function generateMorphTargets( geometry: BufferGeometry ) {
  const data: number[] = []

  for ( let i = 0; i < segments; i ++ ) {
    const x = Math.random() * r - r / 2
    const y = Math.random() * r - r / 2
    const z = Math.random() * r - r / 2

    data.push( x, y, z )
  }

  const morphTarget = new Float32BufferAttribute( data, 3 )
  morphTarget.name = 'target1'

  geometry.morphAttributes.position = [ morphTarget ]
}
