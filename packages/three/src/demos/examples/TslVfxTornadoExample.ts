import {
  ACESFilmicToneMapping,
  Color,
  CylinderGeometry,
  DoubleSide,
  Mesh,
  MeshBasicNodeMaterial,
  Node,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  TextureLoader
} from 'three/webgpu'
import { luminance, cos, min, atan, uniform, PI, TWO_PI, color, positionLocal, sin, texture, Fn, uv, vec2, vec3, vec4 } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Bloom, Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds in which the noise textures scroll back into place at the default `timeScale` (0.2): the timeline length.
 * The turbulence ripple has its own period and jumps at the wrap.
 */
const PERIOD = 20

/**
 * A tornado of two twisted, open cylinders (an emissive one and a dark one) over a swirling floor decal, all drawn with
 * TSL output nodes from scrolling Perlin noise. TSL `time` is the document's. `emissiveColor`, `timeScale` and the
 * parabola's `parabolStrength`, `parabolOffset` and `parabolAmplitude` are in the Document tab. The source's bloom
 * (strength 1, radius 0.1, threshold 1) is the document's `bloom`, drawn by views that follow it (the Scene Camera view
 * in the demo host). Plays when opened.
 */
@Register
export class TslVfxTornadoExample extends Document {

  private emissiveColorUniform = uniform( color( '#ff8b4d' ) )
  private timeScaleUniform = uniform( 0.2 )
  private parabolStrengthUniform = uniform( 1 )
  private parabolOffsetUniform = uniform( 0.3 )
  private parabolAmplitudeUniform = uniform( 0.2 )

  @Property({type: Color, init: null})
  declare emissiveColor: Color

  @Property({type: Number, value: 0.2})
  declare timeScale: number

  @Property({type: Number, value: 1})
  declare parabolStrength: number

  @Property({type: Number, value: 0.3})
  declare parabolOffset: number

  @Property({type: Number, value: 0.2})
  declare parabolAmplitude: number

  constructor(args?: DocumentProps) {
    super({
      toneMapping: ACESFilmicToneMapping,
      bloom: new Bloom({enabled: true, strength: 1, radius: 0.1, threshold: 1}),
      timeline: new Timeline({autoplay: true, duration: PERIOD}),
      ...args,
    })

    const camera = new PerspectiveCamera( 25, 400 / 250, 0.1, 50 )
    camera.name = 'Camera'
    camera.position.set( 1, 1, 3 )
    camera.lookAt( 0, 0.4, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x201919 )

    const time = this.timeline.timeNode

    // textures

    // Views draw on document changes only, so report the texture when it arrives.
    const perlinTexture = new TextureLoader().load( 'https://threejs.org/examples/textures/noises/perlin/rgb-256x256.png', () => this.notify({kind: 'material'}) )
    perlinTexture.wrapS = RepeatWrapping
    perlinTexture.wrapT = RepeatWrapping

    // TSL functions

    const toRadialUv = Fn( ( [ uv, multiplier, rotation, offset ]: [ Node<'vec2'>, Node<'vec2'>, Node<'float'>, Node<'float'> ] ) => {
      const centeredUv = uv.sub( 0.5 ).toVar()
      const distanceToCenter = centeredUv.length()
      const angle = atan( centeredUv.y, centeredUv.x )
      const radialUv = vec2( angle.add( PI ).div( TWO_PI ), distanceToCenter ).toVar()
      radialUv.mulAssign( multiplier )
      radialUv.x.addAssign( rotation )
      radialUv.y.addAssign( offset )

      return radialUv
    } )

    const toSkewedUv = Fn( ( [ uv, skew ]: [ Node<'vec2'>, Node<'vec2'> ] ) => {
      return vec2(
        uv.x.add( uv.y.mul( skew.x ) ),
        uv.y.add( uv.x.mul( skew.y ) )
      )
    } )

    const twistedCylinder = Fn( ( [ position, parabolStrength, parabolOffset, parabolAmplitude, time ]: [ Node<'vec3'>, Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'> ] ) => {
      const angle = atan( position.z, position.x ).toVar()
      const elevation = position.y

      // parabol
      const radius = parabolStrength.mul( position.y.sub( parabolOffset ) ).pow( 2 ).add( parabolAmplitude ).toVar()

      // turbulences
      radius.addAssign( sin( elevation.sub( time ).mul( 20 ).add( angle.mul( 2 ) ) ).mul( 0.05 ) )

      const twistedPosition = vec3(
        cos( angle ).mul( radius ),
        elevation,
        sin( angle ).mul( radius )
      )

      return twistedPosition
    } )

    // uniforms

    const emissiveColor = this.emissiveColorUniform
    const timeScale = this.timeScaleUniform
    const parabolStrength = this.parabolStrengthUniform
    const parabolOffset = this.parabolOffsetUniform
    const parabolAmplitude = this.parabolAmplitudeUniform

    // tornado floor

    const floorMaterial = new MeshBasicNodeMaterial( { transparent: true, wireframe: false } )
    floorMaterial.outputNode = Fn( () => {
      const scaledTime = time.mul( timeScale )

      // noise 1
      const noise1Uv = toRadialUv(
        uv(),
        vec2( 0.5, 0.5 ),
        scaledTime,
        scaledTime
      )
      noise1Uv.assign( toSkewedUv(
        noise1Uv,
        vec2( - 1, 0 )
      ) )
      noise1Uv.mulAssign( vec2( 4, 1 ) )
      const noise1 = texture( perlinTexture, noise1Uv, 1 ).r.remap( 0.45, 0.7 )

      // noise 2
      const noise2Uv = toRadialUv(
        uv(),
        vec2( 2, 8 ),
        scaledTime.mul( 2 ),
        scaledTime.mul( 8 )
      )
      noise2Uv.assign( toSkewedUv(
        noise2Uv,
        vec2( - 0.25, 0 )
      ) )
      noise2Uv.mulAssign( vec2( 2, 0.25 ) )
      const noise2 = texture( perlinTexture, noise2Uv, 1 ).b.remap( 0.45, 0.7 )

      // outer fade
      const distanceToCenter = uv().sub( 0.5 ).toVar()
      const outerFade = min(
        distanceToCenter.length().oneMinus().smoothstep( 0.5, 0.9 ),
        distanceToCenter.length().smoothstep( 0, 0.2 )
      )

      // effect
      const effect = noise1.mul( noise2 ).mul( outerFade ).toVar()

      // output
      return vec4(
        emissiveColor.mul( effect.step( 0.2 ) ).mul( 3 ), // Emissive
        effect.smoothstep( 0, 0.01 ) // Alpha
      )
    } )()

    const floor = new Mesh( new PlaneGeometry( 2, 2 ), floorMaterial )
    floor.name = 'Floor'
    floor.rotation.x = - Math.PI * 0.5
    this.scene.add( floor )

    // tornado cylinder geometry

    const cylinderGeometry = new CylinderGeometry( 1, 1, 1, 20, 20, true )
    cylinderGeometry.translate( 0, 0.5, 0 )

    // tornado emissive cylinder

    const emissiveMaterial = new MeshBasicNodeMaterial( { transparent: true, side: DoubleSide, wireframe: false } )
    emissiveMaterial.positionNode = twistedCylinder( positionLocal, parabolStrength, parabolOffset, parabolAmplitude.sub( 0.05 ), time.mul( timeScale ) )
    emissiveMaterial.outputNode = Fn( () => {
      const scaledTime = time.mul( timeScale )

      // noise 1
      const noise1Uv = uv().add( vec2( scaledTime, scaledTime.negate() ) ).toVar()
      noise1Uv.assign( toSkewedUv(
        noise1Uv,
        vec2( - 1, 0 )
      ) )
      noise1Uv.mulAssign( vec2( 2, 0.25 ) )
      const noise1 = texture( perlinTexture, noise1Uv, 1 ).r.remap( 0.45, 0.7 )

      // noise 2
      const noise2Uv = uv().add( vec2( scaledTime.mul( 0.5 ), scaledTime.negate() ) ).toVar()
      noise2Uv.assign( toSkewedUv(
        noise2Uv,
        vec2( - 1, 0 )
      ) )
      noise2Uv.mulAssign( vec2( 5, 1 ) )
      const noise2 = texture( perlinTexture, noise2Uv, 1 ).g.remap( 0.45, 0.7 )

      // outer fade
      const outerFade = min(
        uv().y.smoothstep( 0, 0.1 ),
        uv().y.oneMinus().smoothstep( 0, 0.4 )
      )

      // effect
      const effect = noise1.mul( noise2 ).mul( outerFade )

      const emissiveColorLuminance = luminance( emissiveColor )

      // output
      return vec4(
        emissiveColor.mul( 1.2 ).div( emissiveColorLuminance ), // emissive
        effect.smoothstep( 0, 0.1 ) // alpha
      )
    } )()

    const emissive = new Mesh( cylinderGeometry, emissiveMaterial )
    emissive.name = 'Emissive'
    emissive.scale.set( 1, 1, 1 )
    this.scene.add( emissive )

    // tornado dark cylinder

    const darkMaterial = new MeshBasicNodeMaterial( { transparent: true, side: DoubleSide, wireframe: false } )
    darkMaterial.positionNode = twistedCylinder( positionLocal, parabolStrength, parabolOffset, parabolAmplitude, time.mul( timeScale ) )
    darkMaterial.outputNode = Fn( () => {
      const scaledTime = time.mul( timeScale ).add( 123.4 )

      // noise 1
      const noise1Uv = uv().add( vec2( scaledTime, scaledTime.negate() ) ).toVar()
      noise1Uv.assign( toSkewedUv(
        noise1Uv,
        vec2( - 1, 0 )
      ) )
      noise1Uv.mulAssign( vec2( 2, 0.25 ) )
      const noise1 = texture( perlinTexture, noise1Uv, 1 ).g.remap( 0.45, 0.7 )

      // noise 2
      const noise2Uv = uv().add( vec2( scaledTime.mul( 0.5 ), scaledTime.negate() ) ).toVar()
      noise2Uv.assign( toSkewedUv(
        noise2Uv,
        vec2( - 1, 0 )
      ) )
      noise2Uv.mulAssign( vec2( 5, 1 ) )
      const noise2 = texture( perlinTexture, noise2Uv, 1 ).b.remap( 0.45, 0.7 )

      // outer fade
      const outerFade = min(
        uv().y.smoothstep( 0, 0.2 ),
        uv().y.oneMinus().smoothstep( 0, 0.4 )
      )

      // effect
      const effect = noise1.mul( noise2 ).mul( outerFade )

      return vec4(
        vec3( 0 ),
        effect.smoothstep( 0, 0.01 )
      )
    } )()

    const dark = new Mesh( cylinderGeometry, darkMaterial )
    dark.name = 'Dark'
    dark.scale.set( 1, 1, 1 )
    this.scene.add( dark )

    this.emissiveColor.copy( this.emissiveColorUniform.value )
  }

  emissiveColorChanged() {
    this.emissiveColorMutated()
  }

  /** The color editor changes the color in place. */
  emissiveColorMutated() {
    if ( ! this.emissiveColorUniform ) return
    this.emissiveColorUniform.value.copy( this.emissiveColor )
    this.notify({kind: 'material'})
  }

  timeScaleChanged() { this.timeScaleUniform.value = this.timeScale }
  parabolStrengthChanged() { this.parabolStrengthUniform.value = this.parabolStrength }
  parabolOffsetChanged() { this.parabolOffsetUniform.value = this.parabolOffset }
  parabolAmplitudeChanged() { this.parabolAmplitudeUniform.value = this.parabolAmplitude }
}

registerEditorConfig(TslVfxTornadoExample, [
  ['timeScale', ioNumberSlider({min: - 1, max: 1, step: 0.01})],
  ['parabolStrength', ioNumberSlider({min: 0, max: 2, step: 0.01})],
  ['parabolOffset', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['parabolAmplitude', ioNumberSlider({min: 0, max: 2, step: 0.01})],
])

registerEditorGroups(TslVfxTornadoExample, {
  Main: ['emissiveColor', 'timeScale', 'parabolStrength', 'parabolOffset', 'parabolAmplitude'],
  Hidden: ['emissiveColorUniform', 'timeScaleUniform', 'parabolStrengthUniform', 'parabolOffsetUniform', 'parabolAmplitudeUniform'],
})
