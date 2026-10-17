import {
  BackSide,
  BoxGeometry,
  CanvasTexture,
  Color,
  Data3DTexture,
  LinearFilter,
  Mesh,
  Node,
  NodeMaterial,
  RedFormat,
  SRGBColorSpace,
  Texture3DNode,
  Vector3
} from 'three/webgpu'
import { equirectUV, float, vec3, vec4, If, Break, Fn, smoothstep, texture, texture3D, uniform } from 'three/tsl'
import { RaymarchingBox } from 'three/addons/tsl/utils/Raymarching.js'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one turn of the cloud (1/7.5 rad/s, as in the source): the timeline length, so looping is seamless. */
const PERIOD = 15 * Math.PI

/** A vertical gradient, top to bottom: the sky. */
function createSkyMap() {
  const canvas = new OffscreenCanvas( 1, 32 )

  const context = canvas.getContext( '2d' )!
  const gradient = context.createLinearGradient( 0, 0, 0, 32 )
  gradient.addColorStop( 0.0, '#014a84' )
  gradient.addColorStop( 0.5, '#0561a0' )
  gradient.addColorStop( 1.0, '#437ab6' )
  context.fillStyle = gradient
  context.fillRect( 0, 0, 1, 32 )

  const skyMap = new CanvasTexture( canvas )
  skyMap.colorSpace = SRGBColorSpace

  return skyMap
}

/** A 128³ Perlin noise density, faded toward the cube's corners. */
function createCloudTexture() {
  const size = 128
  const data = new Uint8Array( size * size * size )

  let i = 0
  const scale = 0.05
  const perlin = new ImprovedNoise()
  const vector = new Vector3()

  for ( let z = 0; z < size; z ++ ) {
    for ( let y = 0; y < size; y ++ ) {
      for ( let x = 0; x < size; x ++ ) {
        const d = 1.0 - vector.set( x, y, z ).subScalar( size / 2 ).divideScalar( size ).length()
        data[ i ] = ( 128 + 128 * perlin.noise( x * scale / 1.5, y * scale, z * scale / 1.5 ) ) * d * d
        i ++
      }
    }
  }

  const texture = new Data3DTexture( data, size, size, size )
  texture.format = RedFormat
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.unpackAlignment = 1
  texture.needsUpdate = true

  return texture
}

/**
 * A cloud raymarched in TSL through a 3D Perlin noise texture inside a turning box, with `threshold`, `opacity`,
 * `range` and `steps` in the Document tab. The source's sky is a 10-unit back-faced sphere with a gradient map; here
 * the same map is the background (sampled by direction, as seen from the sphere's center), so the sky does not
 * dominate framing. The cloud does not write depth: its transparent box would hide the grid and overlays behind it.
 * Plays when opened.
 */
@Register
export class VolumeCloudExample extends Document {

  public mesh: Mesh

  private rangeUniform = uniform( 0.1 )
  private thresholdUniform = uniform( 0.25 )
  private opacityUniform = uniform( 0.25 )
  private stepsUniform = uniform( 100 )

  @Property({type: Number, value: 0.25})
  declare threshold: number

  @Property({type: Number, value: 0.25})
  declare opacity: number

  @Property({type: Number, value: 0.1})
  declare range: number

  @Property({type: Number, value: 100})
  declare steps: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // Sky

    this.scene.backgroundNode = texture( createSkyMap(), equirectUV() )

    // Shader

    const transparentRaymarchingTexture = Fn( ( {
      texture,
      range = float( 0.1 ),
      threshold = float( 0.25 ),
      opacity = float( 0.25 ),
      steps = float( 100 )
    }: { texture: Texture3DNode; range: Node<'float'>; threshold: Node<'float'>; opacity: Node<'float'>; steps: Node<'float'> } ) => {
      const finalColor = vec4( 0 ).toVar()

      RaymarchingBox( steps, ( { positionRay }: { positionRay: Node<'vec3'> } ) => {
        const mapValue = float( texture.sample( positionRay.add( 0.5 ) ).r ).toVar()

        mapValue.assign( smoothstep( threshold.sub( range ), threshold.add( range ), mapValue ).mul( opacity ) )

        const shading = texture.sample( positionRay.add( vec3( - 0.01 ) ) ).r.sub( texture.sample( positionRay.add( vec3( 0.01 ) ) ).r )

        const col = shading.mul( 3.0 ).add( positionRay.x.add( positionRay.y ).mul( 0.25 ) ).add( 0.2 )

        finalColor.rgb.addAssign( finalColor.a.oneMinus().mul( mapValue ).mul( col ) )

        finalColor.a.addAssign( finalColor.a.oneMinus().mul( mapValue ) )

        If( finalColor.a.greaterThanEqual( 0.95 ), () => {
          Break()
        } )
      } )

      return finalColor
    } )

    // Material

    const baseColor = uniform( new Color( 0x798aa0 ) )

    const cloud3d = transparentRaymarchingTexture( {
      texture: texture3D( createCloudTexture(), null, 0 ),
      range: this.rangeUniform,
      threshold: this.thresholdUniform,
      opacity: this.opacityUniform,
      steps: this.stepsUniform
    } )

    const finalCloud = cloud3d.setRGB( cloud3d.rgb.add( baseColor ) )

    const material = new NodeMaterial()
    material.colorNode = finalCloud
    material.side = BackSide
    material.transparent = true
    material.depthWrite = false

    this.mesh = new Mesh( new BoxGeometry( 1, 1, 1 ), material )
    this.mesh.name = 'Cloud'
    this.scene.add( this.mesh )

    this.pose( this.timeline.currentTime )
  }

  thresholdChanged() { this.thresholdUniform.value = this.threshold }
  opacityChanged() { this.opacityUniform.value = this.opacity }
  rangeChanged() { this.rangeUniform.value = this.range }
  stepsChanged() { this.stepsUniform.value = this.steps }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.mesh.rotation.y = - time / 7.5
  }
}

registerEditorConfig(VolumeCloudExample, [
  ['threshold', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['range', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['steps', ioNumberSlider({min: 0, max: 200, step: 1})],
])

registerEditorGroups(VolumeCloudExample, {
  Main: ['threshold', 'opacity', 'range', 'steps'],
  Hidden: ['mesh', 'rangeUniform', 'thresholdUniform', 'opacityUniform', 'stepsUniform'],
})
