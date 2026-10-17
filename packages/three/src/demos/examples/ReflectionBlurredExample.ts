import {
  AnimationMixer,
  BoxGeometry,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshStandardNodeMaterial,
  NeutralToneMapping,
  Node,
  PlaneGeometry,
  PointLight,
  SRGBColorSpace,
  TextureLoader
} from 'three/webgpu'
import { Fn, vec4, fract, sample, abs, uniform, pow, color, max, length, rangeFogFactor, sub, reflector, normalWorld, hue, mix, positionWorld } from 'three/tsl'
import { hashBlur } from 'three/addons/tsl/display/hashBlur.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Michelle dancing on a floor that blurs its TSL `reflector()` reflection by roughness, masked by the reflection's
 * depth, under rings of light drawn by a point light's `colorNode`. `roughness`, `radius` and the reflection's
 * `resolutionScale` are in the Document tab. TSL `time` is the document's, so the rings and the background hue
 * follow the timeline (they jump at the wrap); duration = the clip. Plays when opened.
 */
@Register
export class ReflectionBlurredExample extends Document {

  public mixer?: AnimationMixer
  private roughnessUniform = uniform( .9 )
  private radiusUniform = uniform( 0.2 )
  // 0.5 is half of the rendering view
  private reflection = reflector( { resolutionScale: .5, depth: true, bounces: false } )

  @Property({type: Number, value: .9})
  declare roughness: number

  @Property({type: Number, value: 0.2})
  declare radius: number

  @Property({type: Number, value: .5})
  declare resolutionScale: number

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, toneMappingExposure: 1.3, timeline: new Timeline({autoplay: true}), ...args})

    const time = this.timeline.timeNode

    this.scene.backgroundNode = hue( normalWorld.y.mix( 0, color( 0x0066ff ) ).mul( .1 ), time )

    const waterAmbientLight = new HemisphereLight( 0xffffff, 0x0066ff, 10 )
    waterAmbientLight.name = 'Ambient'
    this.scene.add( waterAmbientLight )

    void this.loadModel()

    // textures

    // Views draw on document changes only, so report the texture when it arrives.
    const textureLoader = new TextureLoader()
    const uvMap = textureLoader.load( 'https://threejs.org/examples/textures/uv_grid_directx.jpg', () => this.notify({kind: 'material'}) )
    uvMap.colorSpace = SRGBColorSpace

    // uv map for debugging

    const uvMaterial = new MeshStandardNodeMaterial( {
      map: uvMap,
      side: DoubleSide
    } )

    const uvMesh = new Mesh( new PlaneGeometry( 2, 2 ), uvMaterial )
    uvMesh.name = 'UVGrid'
    uvMesh.position.set( 0, 1, - 3 )
    this.scene.add( uvMesh )

    // circle effect

    const drawCircle = Fn( ( [ pos, radius, width, power, color, timer = time.mul( .5 ) ]: [ Node<'vec2'>, Node<'float'>, Node<'float'>, Node<'float'>, Node<'vec3'>, Node<'float'>? ] ) => {
      // https://www.shadertoy.com/view/3tdSRn

      const dist1 = length( pos ).toVar()
      dist1.assign( fract( dist1.mul( 5.0 ).sub( fract( timer ) ) ) )

      const dist2 = dist1.sub( radius )
      const intensity = pow( radius.div( abs( dist2 ) ), width )
      const col = color.rgb.mul( intensity ).mul( power ).mul( max( sub( 0.8, abs( dist2 ) ), 0.0 ) )

      return col
    } )

    const circleFadeY = positionWorld.y.mul( .7 ).oneMinus().max( 0 )
    const animatedColor = mix( color( 0x74ccf4 ), color( 0x7f00c5 ), positionWorld.xz.distance( 0 ).div( 10 ).clamp() )
    const animatedCircle = hue( drawCircle( positionWorld.xz.mul( .1 ), 0.5, 0.8, .01, animatedColor ).mul( circleFadeY ), time )

    // Lights take a `colorNode` (evaluated per lit fragment); @types/three 0.186 does not declare it.
    const floorLight = new PointLight( 0xffffff ) as PointLight & {colorNode: Node | null}
    floorLight.name = 'FloorLight'
    floorLight.colorNode = animatedCircle.mul( 50 )
    this.scene.add( floorLight )

    // reflection

    const roughness = this.roughnessUniform
    const radius = this.radiusUniform

    const reflection = this.reflection
    const reflectionDepth = reflection.getDepthNode()
    reflection.target.name = 'Reflector'
    reflection.target.rotateX( - Math.PI / 2 )
    this.scene.add( reflection.target )

    const floorMaterial = new MeshStandardNodeMaterial()
    floorMaterial.transparent = true
    floorMaterial.colorNode = Fn( () => {
      // ranges adjustment

      const radiusRange = mix( 0.01, 0.1, radius ) // range [ 0.01, 0.1 ]
      const roughnessRange = mix( 0.3, 0.03, roughness ) // range [ 0.03, 0.3 ]

      // mask the sample

      const maskReflection = sample( ( uv ) => {
        const sample = reflection.sample( uv )
        const mask = reflectionDepth.sample( uv )

        return vec4( sample.rgb, sample.a.mul( mask.r ) )
      }, reflection.uvNode as Node<'vec2'> )

      // blur the reflection

      const reflectionBlurred = hashBlur( maskReflection, radiusRange, {
        repeats: 40,
        premultipliedAlpha: true
      } )

      // reflection composite

      const reflectionMask = reflectionBlurred.a.mul( reflectionDepth ).remapClamp( 0, roughnessRange )
      const reflectionIntensity = .1
      const reflectionMixFactor = reflectionMask.mul( roughness.mul( 2 ).min( 1 ) )
      const reflectionFinal = mix( reflection.rgb, reflectionBlurred.rgb, reflectionMixFactor ).mul( reflectionIntensity )

      // mix reflection with animated circle

      const output = animatedCircle.add( reflectionFinal )

      // falloff opacity by distance like an opacity-fog

      const opacity = rangeFogFactor( 7, 25 ).oneMinus()

      // final output

      return vec4( output, opacity )
    } )()

    const floor = new Mesh( new BoxGeometry( 50, .001, 50 ), floorMaterial )
    floor.name = 'Floor'
    floor.position.set( 0, 0, 0 )
    floor.userData.selectable = false
    this.scene.add( floor )
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Michelle.glb' )
      const model = gltf.scene
      model.name = 'Michelle'

      this.timeline.duration = gltf.animations[ 0 ].duration
      this.mixer = new AnimationMixer( model )
      this.mixer.clipAction( gltf.animations[ 0 ] ).play()
      this.mixer.setTime( this.timeline.currentTime )

      this.scene.add( model )

      this.notify({kind: 'structure'})
      // The 50-unit floor would dominate whole-scene framing.
      this.dispatch('frame-object', {object: model}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  roughnessChanged() { this.roughnessUniform.value = this.roughness }
  radiusChanged() { this.radiusUniform.value = this.radius }
  resolutionScaleChanged() { this.reflection.reflector.resolutionScale = this.resolutionScale }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}

registerEditorConfig(ReflectionBlurredExample, [
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['radius', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['resolutionScale', ioNumberSlider({min: .25, max: 1, step: 0.01})],
])

registerEditorGroups(ReflectionBlurredExample, {
  Main: ['roughness', 'radius', 'resolutionScale'],
  Hidden: ['mixer', 'roughnessUniform', 'radiusUniform', 'reflection'],
})
