import { Color, DirectionalLight, Mesh, MeshStandardNodeMaterial, Node, PerspectiveCamera, PlaneGeometry, Vector2 } from 'three/webgpu'
import { float, mx_noise_float, Loop, color, positionLocal, sin, vec3, mul, uniform, Fn, transformNormalToView } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, threeVector2, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of playback. The noise scrolls without repeating, so the waves jump at the wrap. */
const DURATION = 20

/**
 * A raging sea: a subdivided plane displaced in TSL by large sine waves and layered noise, with normals from the
 * displaced neighbors and emissive crests. Material, emissive and wave settings are in the Document tab. Plays when
 * opened.
 */
@Register
export class TslRagingSeaExample extends Document {

  public sea: Mesh
  public material: MeshStandardNodeMaterial

  private emissiveColorUniform = uniform( color( '#ff0a81' ) )
  private emissiveLowUniform = uniform( - 0.25 )
  private emissiveHighUniform = uniform( 0.2 )
  private emissivePowerUniform = uniform( 7 )
  private largeWavesFrequencyUniform = uniform( new Vector2( 3, 1 ) )
  private largeWavesSpeedUniform = uniform( 1.25 )
  private largeWavesMultiplierUniform = uniform( 0.15 )
  private smallWavesIterationsUniform = uniform( 3 )
  private smallWavesFrequencyUniform = uniform( 2 )
  private smallWavesSpeedUniform = uniform( 0.3 )
  private smallWavesMultiplierUniform = uniform( 0.18 )
  private normalComputeShiftUniform = uniform( 0.01 )

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: Number, value: 0.15})
  declare roughness: number

  @Property({type: Color, init: null})
  declare emissiveColor: Color

  @Property({type: Number, value: - 0.25})
  declare emissiveLow: number

  @Property({type: Number, value: 0.2})
  declare emissiveHigh: number

  @Property({type: Number, value: 7})
  declare emissivePower: number

  @Property({type: Number, value: 1.25})
  declare largeSpeed: number

  @Property({type: Number, value: 0.15})
  declare largeMultiplier: number

  /** The source's `largeFrequencyX` and `largeFrequencyY`. The controls keep the source's short names, which fit the Document tab. */
  @Property({type: Vector2, init: null})
  declare largeFrequency: Vector2

  @Property({type: Number, value: 3})
  declare smallIterations: number

  @Property({type: Number, value: 2})
  declare smallFrequency: number

  @Property({type: Number, value: 0.3})
  declare smallSpeed: number

  @Property({type: Number, value: 0.18})
  declare smallMultiplier: number

  @Property({type: Number, value: 0.01})
  declare normalComputeShift: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: DURATION}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 10 )
    camera.name = 'Camera'
    camera.position.set( 1.25, 1.25, 1.25 )
    camera.lookAt( 0, - 0.25, 0 )
    this.activeCamera = camera

    // lights

    const directionalLight = new DirectionalLight( '#ffffff', 3 )
    directionalLight.name = 'Key'
    directionalLight.position.set( - 4, 2, 0 )
    this.scene.add( directionalLight )

    // material

    this.material = new MeshStandardNodeMaterial( { color: '#271442', roughness: 0.15 } )

    const time = this.timeline.timeNode
    const largeWavesFrequency = this.largeWavesFrequencyUniform
    const largeWavesSpeed = this.largeWavesSpeedUniform
    const largeWavesMultiplier = this.largeWavesMultiplierUniform
    const smallWavesIterations = this.smallWavesIterationsUniform
    const smallWavesFrequency = this.smallWavesFrequencyUniform
    const smallWavesSpeed = this.smallWavesSpeedUniform
    const smallWavesMultiplier = this.smallWavesMultiplierUniform
    const normalComputeShift = this.normalComputeShiftUniform

    // TSL functions

    const wavesElevation = Fn( ( [ position ]: [ Node<'vec3'> ] ) => {
      // large waves

      const elevation = mul(
        sin( position.x.mul( largeWavesFrequency.x ).add( time.mul( largeWavesSpeed ) ) ),
        sin( position.z.mul( largeWavesFrequency.y ).add( time.mul( largeWavesSpeed ) ) ),
        largeWavesMultiplier
      ).toVar()

      Loop( { start: float( 1 ), end: smallWavesIterations.add( 1 ) }, ( { i } ) => {
        const noiseInput = vec3(
          position.xz
            .add( 2 ) // avoids a-hole pattern
            .mul( smallWavesFrequency )
            .mul( i ),
          time.mul( smallWavesSpeed )
        )

        const wave = mx_noise_float( noiseInput, 1, 0 )
          .mul( smallWavesMultiplier )
          .div( i )
          .abs()

        elevation.subAssign( wave )
      } )

      return elevation
    } )

    // position

    const elevation = wavesElevation( positionLocal )
    const position = positionLocal.add( vec3( 0, elevation, 0 ) )

    this.material.positionNode = position

    // normals

    let positionA = positionLocal.add( vec3( normalComputeShift, 0, 0 ) )
    let positionB = positionLocal.add( vec3( 0, 0, normalComputeShift.negate() ) )

    positionA = positionA.add( vec3( 0, wavesElevation( positionA ), 0 ) )
    positionB = positionB.add( vec3( 0, wavesElevation( positionB ), 0 ) )

    const toA = positionA.sub( position ).normalize()
    const toB = positionB.sub( position ).normalize()
    const normal = toA.cross( toB )

    this.material.normalNode = transformNormalToView( normal )

    // emissive

    const emissive = elevation.remap( this.emissiveHighUniform, this.emissiveLowUniform ).pow( this.emissivePowerUniform )
    this.material.emissiveNode = this.emissiveColorUniform.mul( emissive )

    // mesh

    const geometry = new PlaneGeometry( 2, 2, 256, 256 )
    geometry.rotateX( - Math.PI * 0.5 )
    this.sea = new Mesh( geometry, this.material )
    this.sea.name = 'Sea'
    this.scene.add( this.sea )

    this.largeFrequency.copy( this.largeWavesFrequencyUniform.value )
    this.color.copy( this.material.color )
    this.emissiveColor.copy( this.emissiveColorUniform.value )
  }

  /** The color editors change the colors in place. */
  colorMutated() {
    if ( ! this.material ) return
    this.material.color.copy( this.color )
    this.notify({kind: 'material'})
  }

  emissiveColorMutated() {
    if ( ! this.material ) return
    this.emissiveColorUniform.value.copy( this.emissiveColor )
    this.notify({kind: 'material'})
  }

  largeFrequencyMutated() {
    if ( ! this.material ) return
    this.largeWavesFrequencyUniform.value.copy( this.largeFrequency )
    this.notify({kind: 'material'})
  }

  colorChanged() { this.colorMutated() }
  largeFrequencyChanged() { this.largeFrequencyMutated() }
  emissiveColorChanged() { this.emissiveColorMutated() }
  roughnessChanged() { if ( this.material ) this.material.roughness = this.roughness }
  emissiveLowChanged() { this.emissiveLowUniform.value = this.emissiveLow }
  emissiveHighChanged() { this.emissiveHighUniform.value = this.emissiveHigh }
  emissivePowerChanged() { this.emissivePowerUniform.value = this.emissivePower }
  largeSpeedChanged() { this.largeWavesSpeedUniform.value = this.largeSpeed }
  largeMultiplierChanged() { this.largeWavesMultiplierUniform.value = this.largeMultiplier }
  smallIterationsChanged() { this.smallWavesIterationsUniform.value = this.smallIterations }
  smallFrequencyChanged() { this.smallWavesFrequencyUniform.value = this.smallFrequency }
  smallSpeedChanged() { this.smallWavesSpeedUniform.value = this.smallSpeed }
  smallMultiplierChanged() { this.smallWavesMultiplierUniform.value = this.smallMultiplier }
  normalComputeShiftChanged() { this.normalComputeShiftUniform.value = this.normalComputeShift }
}

registerEditorConfig(TslRagingSeaExample, [
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.001})],
  ['emissiveLow', ioNumberSlider({min: - 1, max: 0, step: 0.001})],
  ['emissiveHigh', ioNumberSlider({min: 0, max: 1, step: 0.001})],
  ['emissivePower', ioNumberSlider({min: 1, max: 10, step: 1})],
  ['largeSpeed', ioNumberSlider({min: 0, max: 5, step: 0.01})],
  ['largeMultiplier', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['largeFrequency', threeVector2({min: 0, max: 10, step: 0.01})],
  ['smallIterations', ioNumberSlider({min: 0, max: 5, step: 1})],
  ['smallFrequency', ioNumberSlider({min: 0, max: 10, step: 0.01})],
  ['smallSpeed', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['smallMultiplier', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['normalComputeShift', ioNumberSlider({min: 0, max: 0.1, step: 0.0001})],
])

registerEditorGroups(TslRagingSeaExample, {
  Main: ['color', 'roughness'],
  Emissive: ['emissiveColor', 'emissiveLow', 'emissiveHigh', 'emissivePower'],
  Waves: [
    'largeSpeed', 'largeMultiplier', 'largeFrequency',
    'smallIterations', 'smallFrequency', 'smallSpeed', 'smallMultiplier',
    'normalComputeShift',
  ],
})
