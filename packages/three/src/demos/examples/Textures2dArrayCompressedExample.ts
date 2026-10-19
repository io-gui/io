import { Mesh, NodeMaterial, PerspectiveCamera, PlaneGeometry, Texture, WebGPURenderer } from 'three/webgpu'
import { texture, uniform, uv } from 'three/tsl'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Layers in the texture array, and layers shown per second. */
const LAYERS = 5
const RATE = 10

/** Seconds of ten sweeps through the layers: the timeline length, so looping is seamless. */
const PERIOD = 10 * LAYERS / RATE

const planeWidth = 50
const planeHeight = 25

/**
 * A compressed (KTX2) 2D texture array on a plane, stepping through its five layers ten times a second with document
 * time. The texture loads in `onRendererInitialized`, after `detectSupport` picks a format the device supports; the
 * plane joins then. Plays when opened.
 */
@Register
export class Textures2dArrayCompressedExample extends Document {

  private depth = uniform( 0 )

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 2000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 70 )
    this.activeCamera = camera
    this.pose( this.timeline.currentTime )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void this.load( renderer )
  }

  private async load( renderer: WebGPURenderer ) {
    try {
      const ktx2Loader = new KTX2Loader().detectSupport( renderer )
      const texturearray = await ktx2Loader.loadAsync( 'https://threejs.org/examples/textures/spiritedaway.ktx2' ) as Texture
      ktx2Loader.dispose()

      const material = new NodeMaterial()
      material.colorNode = texture( texturearray, uv().flipY() ).depth( this.depth )

      const geometry = new PlaneGeometry( planeWidth, planeHeight )

      const mesh = new Mesh( geometry, material )
      mesh.name = 'Plane'
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.depth.value = ( 1 + time * RATE ) % LAYERS
  }
}

registerEditorGroups(Textures2dArrayCompressedExample, {
  Hidden: ['depth'],
})
