import {
  BoxGeometry,
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  MeshStandardMaterial,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  SRGBColorSpace,
  TextureLoader,
  WebGPURenderer
} from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

const amount = 100
const count = Math.pow( amount, 2 )

const colors = [ new Color( 0x00ffff ), new Color( 0xffff00 ), new Color( 0xff00ff ) ]
const maxDistance = 75

/** Seconds between color waves (the source's `setInterval`) and the length of a wave (its tween). */
const WAVE_INTERVAL = 3
const WAVE_DURATION = 2

/** Seconds in which the motion repeats: three waves, one per color. The timeline length, so looping is seamless. */
const PERIOD = WAVE_INTERVAL * colors.length

/**
 * Rate of the bob `|sin( 2t )|`, rounded to six bobs per loop so looping is seamless (source: 2, a bob every π/2 s).
 */
const BOB_RATE = 6 * Math.PI / PERIOD

const dummy = new Object3D()
const color = new Color()

/** `TWEEN.Easing.Sinusoidal.In`. */
function sinusoidalIn( k: number ) {
  return 1 - Math.cos( ( k * Math.PI ) / 2 )
}

/**
 * 10000 boxes in a grid, each bobbing at its own phase, with a new tint sweeping out from the center every three
 * seconds. Instance matrices and colors are updated from document time; the tint waves, which the source starts with
 * `setInterval` and tween.js, are scheduled in timeline time (the first wave now starts at 0 s). The active camera
 * stands where the source's orbit starts (a third of a turn per loop). Plays when opened.
 */
@Register
export class InstancingDynamicExample extends Document {

  public mesh: InstancedMesh<BoxGeometry, MeshStandardMaterial>
  private seeds: number[] = []
  private baseColors: number[] = []

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 10, 10 )
    camera.lookAt( 0, 0, - 8 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xadd8e6 )

    const loader = new TextureLoader()
    // Views draw on document changes only, so report the texture when it arrives.
    const texture = loader.load( 'https://threejs.org/examples/textures/edge3.jpg', () => this.notify({kind: 'material'}) )
    texture.colorSpace = SRGBColorSpace

    const geometry = new BoxGeometry()
    const material = new MeshStandardMaterial( { map: texture } )

    this.mesh = new InstancedMesh( geometry, material, count )
    this.mesh.name = 'Boxes'
    this.mesh.instanceMatrix.setUsage( DynamicDrawUsage ) // will be updated every frame
    this.scene.add( this.mesh )

    let i = 0
    const offset = ( amount - 1 ) / 2

    for ( let x = 0; x < amount; x ++ ) {

      for ( let z = 0; z < amount; z ++ ) {

        dummy.position.set( offset - x, 0, offset - z )
        dummy.scale.set( 1, 2, 1 )
        dummy.updateMatrix()

        color.setHSL( 1, 0.5 + ( Math.random() * 0.5 ), 0.5 + ( Math.random() * 0.5 ) )
        this.baseColors.push( color.getHex() )

        this.mesh.setMatrixAt( i, dummy.matrix )
        this.mesh.setColorAt( i, color.multiply( colors[ 0 ] ) )

        i ++

        this.seeds.push( Math.random() )

      }

    }

    this.mesh.instanceColor!.setUsage( DynamicDrawUsage )

    this.pose( this.timeline.currentTime )
    this.mesh.computeBoundingBox()
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.scene.environment = new PMREMGenerator( renderer ).fromScene( new RoomEnvironment(), 0.04 ).texture
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const mesh = this.mesh
    const seeds = this.seeds

    // The wave of the current interval: from the previous color to this interval's.

    const wave = Math.floor( time / WAVE_INTERVAL )
    const progress = ( time - wave * WAVE_INTERVAL ) / WAVE_DURATION
    const currentColor = colors[ ( wave + colors.length - 1 ) % colors.length ]
    const nextColor = colors[ wave % colors.length ]
    const t = progress < 1 ? sinusoidalIn( progress ) : 1

    // animate instance positions and colors

    for ( let i = 0; i < mesh.count; i ++ ) {

      mesh.getMatrixAt( i, dummy.matrix )
      dummy.matrix.decompose( dummy.position, dummy.quaternion, dummy.scale )

      dummy.position.y = Math.abs( Math.sin( time * BOB_RATE + seeds[ i ] * 3 ) )

      dummy.updateMatrix()

      mesh.setMatrixAt( i, dummy.matrix )

      // colors

      const f = dummy.position.length() / maxDistance

      if ( f <= t ) {

        color.set( this.baseColors[ i ] ).multiply( nextColor )

      } else {

        color.set( this.baseColors[ i ] ).multiply( currentColor )

      }

      mesh.setColorAt( i, color )

    }

    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor!.needsUpdate = true

    mesh.computeBoundingSphere()
  }
}
