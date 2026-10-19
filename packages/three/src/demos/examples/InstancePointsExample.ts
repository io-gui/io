import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ComputeNode,
  InstancedBufferAttribute,
  Mesh,
  PerspectiveCamera,
  PointsNodeMaterial,
  Sprite,
  SRGBColorSpace,
  StorageInstancedBufferAttribute,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { storage, Fn, instancedBufferAttribute, instanceIndex, sin, float, uniform, shapeCircle, mix, vec3 } from 'three/tsl'
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of ten pulses at the default `pulseSpeed` (6 rad/s): the timeline length. */
const PERIOD = 10 * 2 * Math.PI / 6

/**
 * Points along a 3D Hilbert curve, colored along it, whose sizes in pixels pulse in a wave: a compute pass writes each
 * point's size from document time before the views draw (`onBeforeDraw`). `alphaToCoverage`, `minWidth`, `maxWidth`
 * and `pulseSpeed` are in the Document tab; `alphaToCoverage` shows in views with MSAA only. The source's inset view,
 * the same camera on a dark background, is dropped. Plays when opened.
 */
@Register
export class InstancePointsExample extends Document {

  @Property({type: Boolean, value: true})
  declare alphaToCoverage: boolean

  @Property({type: Number, value: 6})
  declare minWidth: number

  @Property({type: Number, value: 20})
  declare maxWidth: number

  @Property({type: Number, value: 6})
  declare pulseSpeed: number

  public instancedPoints: Sprite
  private material: PointsNodeMaterial
  private computeSize: ComputeNode
  private effectController = {
    pulseSpeed: uniform( 6 ),
    minWidth: uniform( 6 ),
    maxWidth: uniform( 20 )
  }

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( - 40, 0, 60 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )

    const effectController = this.effectController

    // Position and Color Data

    const points = GeometryUtils.hilbert3D( new Vector3( 0, 0, 0 ), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 )

    const spline = new CatmullRomCurve3( points )
    const divisions = Math.round( 4 * points.length )
    const point = new Vector3()
    const pointColor = new Color()

    const positions: number[] = []
    const colors: number[] = []
    const sizes = new Float32Array( divisions )

    for ( let i = 0, l = divisions; i < l; i ++ ) {

      const t = i / l

      spline.getPoint( t, point )
      positions.push( point.x, point.y, point.z )

      pointColor.setHSL( t, 1.0, 0.5, SRGBColorSpace )
      colors.push( pointColor.r, pointColor.g, pointColor.b )

      sizes[ i ] = 10.0

    }

    // Instanced Points

    const positionAttribute = new InstancedBufferAttribute( new Float32Array( positions ), 3 )
    const colorsAttribute = new InstancedBufferAttribute( new Float32Array( colors ), 3 )

    const instanceSizeBufferAttribute = new StorageInstancedBufferAttribute( sizes, 1 )
    const instanceSizeStorage = storage( instanceSizeBufferAttribute, 'float', instanceSizeBufferAttribute.count )

    this.computeSize = Fn( () => {

      const { pulseSpeed, minWidth, maxWidth } = effectController

      const relativeTime = this.timeline.timeNode.add( float( instanceIndex ) )

      const sizeFactor = sin( relativeTime.mul( pulseSpeed ) ).add( 1 ).div( 2 )

      instanceSizeStorage.element( instanceIndex ).assign( sizeFactor.mul( maxWidth.sub( minWidth ) ).add( minWidth ) )

    } )().compute( divisions )

    // Material / Sprites

    const attributeRange = instancedBufferAttribute<'float'>( instanceSizeBufferAttribute, 'float' )
    const pointColors = mix( vec3( 0.0 ), instancedBufferAttribute<'vec3'>( colorsAttribute, 'vec3' ), attributeRange.div( float( effectController.maxWidth ) ) )

    this.material = new PointsNodeMaterial( {

      colorNode: pointColors,
      opacityNode: shapeCircle(),
      positionNode: instancedBufferAttribute( positionAttribute ),
      sizeNode: instancedBufferAttribute( instanceSizeBufferAttribute ),
      vertexColors: true,
      sizeAttenuation: false,
      alphaToCoverage: true

    } )

    this.instancedPoints = new Sprite( this.material )
    this.instancedPoints.name = 'Points'
    this.instancedPoints.count = divisions
    // A sprite's bounds are one quad at its origin.
    this.instancedPoints.frustumCulled = false
    this.scene.add( this.instancedPoints )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  alphaToCoverageChanged() {
    if ( ! this.material ) return
    this.material.alphaToCoverage = this.alphaToCoverage
    this.material.needsUpdate = true
    this.notify({kind: 'material'})
  }

  minWidthChanged() { this.effectController.minWidth.value = this.minWidth; this.notify({kind: 'material'}) }
  maxWidthChanged() { this.effectController.maxWidth.value = this.maxWidth; this.notify({kind: 'material'}) }
  pulseSpeedChanged() { this.effectController.pulseSpeed.value = this.pulseSpeed; this.notify({kind: 'material'}) }

  /** Framing reads one quad: frame a stand-in for the curve (40 units wide). */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 20, - 20, - 20 ), new Vector3( 20, 20, 20 ) ] ) )
    this._frameTarget = standIn
  }

  /** The sizes are a function of time, so scrubbing and loop wraps show them exactly. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    void renderer.compute( this.computeSize )
  }
}

registerEditorConfig(InstancePointsExample, [
  ['minWidth', ioNumberSlider({min: 1, max: 30, step: 1})],
  ['maxWidth', ioNumberSlider({min: 2, max: 30, step: 1})],
  ['pulseSpeed', ioNumberSlider({min: 1, max: 20, step: 0.1})],
])

registerEditorGroups(InstancePointsExample, {
  Main: ['alphaToCoverage', 'minWidth', 'maxWidth', 'pulseSpeed'],
  Hidden: ['instancedPoints', 'material', 'computeSize', 'effectController'],
})
