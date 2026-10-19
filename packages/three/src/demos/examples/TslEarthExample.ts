import {
  BackSide,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicNodeMaterial,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader
} from 'three/webgpu'
import { step, normalWorldGeometry, output, texture, vec3, vec4, normalize, positionWorld, bumpMap, cameraPosition, color, uniform, mix, uv, max } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one turn of the globe (0.025 rad/s, as in the source): the timeline length, so looping is seamless. */
const PERIOD = 80 * Math.PI

/**
 * The Earth in TSL: day and night maps blended by the sun's side, clouds, bump and roughness from one packed
 * texture, and a fresnel atmosphere that turns from blue to orange at the terminator, on the globe and on a slightly
 * larger back-faced shell. The atmosphere colors and the roughness range are in the Document tab. The globe turns
 * with document time. Plays when opened.
 */
@Register
export class TslEarthExample extends Document {

  public globe: Mesh

  private atmosphereDayColor = uniform( color( '#4db2ff' ) )
  private atmosphereTwilightColor = uniform( color( '#bc490b' ) )
  private roughnessLowUniform = uniform( 0.25 )
  private roughnessHighUniform = uniform( 0.35 )

  @Property({type: Color, init: null})
  declare dayColor: Color

  @Property({type: Color, init: null})
  declare twilightColor: Color

  @Property({type: Number, value: 0.25})
  declare roughnessLow: number

  @Property({type: Number, value: 0.35})
  declare roughnessHigh: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 25, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 4.5, 2, 3 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )

    // sun

    const sun = new DirectionalLight( '#ffffff', 2 )
    sun.name = 'Sun'
    sun.position.set( 0, 0, 3 )
    this.scene.add( sun )

    // textures

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})
    const textureLoader = new TextureLoader().setPath( 'https://threejs.org/examples/textures/planets/' )

    const dayTexture = textureLoader.load( 'earth_day_4096.jpg', onLoad )
    dayTexture.colorSpace = SRGBColorSpace
    dayTexture.anisotropy = 8

    const nightTexture = textureLoader.load( 'earth_night_4096.jpg', onLoad )
    nightTexture.colorSpace = SRGBColorSpace
    nightTexture.anisotropy = 8

    const bumpRoughnessCloudsTexture = textureLoader.load( 'earth_bump_roughness_clouds_4096.jpg', onLoad )
    bumpRoughnessCloudsTexture.anisotropy = 8

    // fresnel

    const viewDirection = positionWorld.sub( cameraPosition ).normalize()
    const fresnel = viewDirection.dot( normalWorldGeometry ).abs().oneMinus().toVar()

    // sun orientation

    const sunOrientation = normalWorldGeometry.dot( normalize( sun.position ) ).toVar()

    // atmosphere color

    const atmosphereColor = mix( this.atmosphereTwilightColor, this.atmosphereDayColor, sunOrientation.smoothstep( - 0.25, 0.75 ) )

    // globe

    const globeMaterial = new MeshStandardNodeMaterial()

    const cloudsStrength = texture( bumpRoughnessCloudsTexture, uv() ).b.smoothstep( 0.2, 1 )

    globeMaterial.colorNode = mix( texture( dayTexture ), vec3( 1 ), cloudsStrength.mul( 2 ) )

    const roughness = max(
      texture( bumpRoughnessCloudsTexture ).g,
      step( 0.01, cloudsStrength )
    )
    globeMaterial.roughnessNode = roughness.remap( 0, 1, this.roughnessLowUniform, this.roughnessHighUniform )

    const night = texture( nightTexture )
    const dayStrength = sunOrientation.smoothstep( - 0.25, 0.5 )

    const atmosphereDayStrength = sunOrientation.smoothstep( - 0.5, 1 )
    const atmosphereMix = atmosphereDayStrength.mul( fresnel.pow( 2 ) ).clamp( 0, 1 )

    let finalOutput = mix( night.rgb, output.rgb, dayStrength )
    finalOutput = mix( finalOutput, atmosphereColor, atmosphereMix )

    globeMaterial.outputNode = vec4( finalOutput, output.a )

    const bumpElevation = max(
      texture( bumpRoughnessCloudsTexture ).r,
      cloudsStrength
    )
    globeMaterial.normalNode = bumpMap( bumpElevation )

    const sphereGeometry = new SphereGeometry( 1, 64, 64 )
    this.globe = new Mesh( sphereGeometry, globeMaterial )
    this.globe.name = 'Globe'
    this.scene.add( this.globe )

    // atmosphere

    const atmosphereMaterial = new MeshBasicNodeMaterial( { side: BackSide, transparent: true } )
    let alpha = fresnel.remap( 0.73, 1, 1, 0 ).pow( 3 )
    alpha = alpha.mul( sunOrientation.smoothstep( - 0.5, 1 ) )
    atmosphereMaterial.outputNode = vec4( atmosphereColor, alpha )

    const atmosphere = new Mesh( sphereGeometry, atmosphereMaterial )
    atmosphere.name = 'Atmosphere'
    atmosphere.scale.setScalar( 1.04 )
    atmosphere.userData.selectable = false
    this.scene.add( atmosphere )

    this.dayColor.copy( this.atmosphereDayColor.value )
    this.twilightColor.copy( this.atmosphereTwilightColor.value )
    this.pose( this.timeline.currentTime )
  }

  dayColorChanged() { this.dayColorMutated() }
  twilightColorChanged() { this.twilightColorMutated() }

  /** The color editors change the colors in place. */
  dayColorMutated() {
    if ( ! this.atmosphereDayColor ) return
    this.atmosphereDayColor.value.copy( this.dayColor )
    this.notify({kind: 'material'})
  }

  twilightColorMutated() {
    if ( ! this.atmosphereTwilightColor ) return
    this.atmosphereTwilightColor.value.copy( this.twilightColor )
    this.notify({kind: 'material'})
  }

  roughnessLowChanged() { this.roughnessLowUniform.value = this.roughnessLow }
  roughnessHighChanged() { this.roughnessHighUniform.value = this.roughnessHigh }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.globe.rotation.y = time * 0.025
  }
}

registerEditorConfig(TslEarthExample, [
  ['roughnessLow', ioNumberSlider({min: 0, max: 1, step: 0.001})],
  ['roughnessHigh', ioNumberSlider({min: 0, max: 1, step: 0.001})],
])

registerEditorGroups(TslEarthExample, {
  Main: ['dayColor', 'twilightColor', 'roughnessLow', 'roughnessHigh'],
  Hidden: ['globe', 'atmosphereDayColor', 'atmosphereTwilightColor', 'roughnessLowUniform', 'roughnessHighUniform'],
})
