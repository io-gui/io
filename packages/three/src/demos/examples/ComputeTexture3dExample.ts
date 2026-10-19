import {
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ComputeNode,
  Mesh,
  MeshBasicNodeMaterial,
  NodeMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  SphereGeometry,
  Storage3DTexture,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { mx_noise_vec3, instanceIndex, textureStore, float, vec3, vec4, If, Break, Fn, smoothstep, texture3D, uniform } from 'three/tsl'
import type { Node } from 'three/webgpu'
import { RaymarchingBox } from 'three/addons/tsl/utils/Raymarching.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

const size = 200

/**
 * A cloud raymarched through a 200³ 3D texture that a compute pass fills with noise scrolling with document time,
 * before the views draw (`onBeforeDraw`). `threshold`, `opacity`, `range` and `steps` are in the Document tab. The sky
 * gradient is painted on an `OffscreenCanvas`. The source's camera, inside the cloud's box, is the active camera; views
 * frame the cloud. The noise does not repeat, so the loop jumps at the wrap. Plays when opened.
 */
@Register
export class ComputeTexture3dExample extends Document {

  @Property({type: Number, value: 0.08})
  declare threshold: number

  @Property({type: Number, value: 0.08})
  declare opacity: number

  @Property({type: Number, value: 0.1})
  declare range: number

  @Property({type: Number, value: 100})
  declare steps: number

  public mesh: Mesh<BoxGeometry, NodeMaterial>
  private computeNode: ComputeNode
  private uniforms = {
    range: uniform( 0.1 ),
    threshold: uniform( 0.08 ),
    opacity: uniform( 0.08 ),
    steps: uniform( 100 ),
  }

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 1, 1.5 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // Sky

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

    const sky = new Mesh(
      new SphereGeometry( 10 ),
      new MeshBasicNodeMaterial( { map: skyMap, side: BackSide } )
    )
    sky.name = 'Sky'
    sky.userData.selectable = false
    this.scene.add( sky )

    // Texture

    const storageTexture = new Storage3DTexture( size, size, size )
    storageTexture.generateMipmaps = false
    storageTexture.name = 'cloud'

    const computeCloud = Fn( () => {

      const scale = float( 0.05 )
      const id = instanceIndex

      const x = id.mod( size )
      const y = id.div( size ).mod( size )
      const z = id.div( size * size )

      const coord3d = vec3( x, y, z )
      const centered = coord3d.sub( size / 2 ).div( size )
      const d = float( 1.0 ).sub( centered.length() )

      const noiseCoord = coord3d.mul( scale.div( 1.5 ) ).add( this.timeline.timeNode )

      const noise = mx_noise_vec3( noiseCoord ).toConst( 'noise' )

      const data = noise.mul( d ).mul( d ).toConst( 'data' )

      textureStore( storageTexture, vec3( x, y, z ), vec4( vec3( data.x ), 1.0 ) )

    } )

    this.computeNode = computeCloud().compute( size * size * size ).setName( 'computeCloud' )

    // Shader

    const cloudTexture = texture3D( storageTexture, null, 0 )
    const { range, threshold, opacity, steps } = this.uniforms

    const transparentRaymarchingTexture = Fn( () => {

      const finalColor = vec4( 0 ).toVar()

      RaymarchingBox( steps, ( { positionRay }: { positionRay: Node<'vec3'> } ) => {

        const mapValue = float( cloudTexture.sample( positionRay.add( 0.5 ) ).r ).toVar()

        mapValue.assign( smoothstep( threshold.sub( range ), threshold.add( range ), mapValue ).mul( opacity ) )

        const shading = cloudTexture.sample( positionRay.add( vec3( - 0.01 ) ) ).r.sub( cloudTexture.sample( positionRay.add( vec3( 0.01 ) ) ).r )

        const col = shading.mul( 4.0 ).add( positionRay.x.add( positionRay.y ).mul( 0.5 ) ).add( 0.3 )

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

    const cloud3d = transparentRaymarchingTexture()

    const finalCloud = cloud3d.setRGB( cloud3d.rgb.add( baseColor ) )

    const material = new NodeMaterial()
    material.colorNode = finalCloud
    material.side = BackSide
    material.transparent = true
    material.name = 'transparentRaymarchingMaterial'

    this.mesh = new Mesh( new BoxGeometry( 10, 10, 10 ), material )
    this.mesh.name = 'Cloud'
    this.scene.add( this.mesh )

    this.mesh.rotation.y = Math.PI / 2
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  thresholdChanged() { this.uniforms.threshold.value = this.threshold; this.notify({kind: 'material'}) }
  opacityChanged() { this.uniforms.opacity.value = this.opacity; this.notify({kind: 'material'}) }
  rangeChanged() { this.uniforms.range.value = this.range; this.notify({kind: 'material'}) }
  stepsChanged() { this.uniforms.steps.value = this.steps; this.notify({kind: 'material'}) }

  /**
   * The sky would dominate whole-scene framing, and the cloud fills only the middle of its box (the raymarch samples a
   * unit cube): frame a stand-in twice that cube's size, which puts the views inside the box as the source's camera is,
   * with a far plane beyond the sky.
   */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 1, - 1, - 1 ), new Vector3( 1, 1, 1 ) ] ) )
    this._frameTarget = standIn
  }

  /** The noise is a function of time, so scrubbing shows it exactly. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    void renderer.compute( this.computeNode )
  }
}

registerEditorConfig(ComputeTexture3dExample, [
  ['threshold', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['range', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['steps', ioNumberSlider({min: 0, max: 200, step: 1})],
])

registerEditorGroups(ComputeTexture3dExample, {
  Main: ['threshold', 'opacity', 'range', 'steps'],
  Hidden: ['mesh', 'computeNode', 'uniforms'],
})
