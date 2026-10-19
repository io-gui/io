import {
  BoxGeometry,
  Color,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshNormalMaterial,
  NodeMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  RendererUtils,
  RenderTarget,
  TorusKnotGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { vec3, uniform, texture, depth, float } from 'three/tsl'
import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one loop: one turn about x and two about y (the source turns 0.01 and 0.02 rad per frame at 60 fps). */
const PERIOD = 2 * Math.PI / 0.6

const PLANE_WIDTH = 2.5
const PLANE_HEIGHT = 2.5
const CAMERA_HEIGHT = 0.3

type RendererState = ReturnType<typeof RendererUtils.resetRendererState>

/**
 * Contact shadows without lights: an orthographic camera under the objects renders their depth from below into a
 * target (darker where closer to the ground), and a plane shows it blurred. `blur`, `darkness`, `opacity` (the
 * shadow's), `planeColor` and `planeOpacity` are in the Document tab. The depth render runs before the views draw a
 * change of the document (`onBeforeDraw`). The shadow camera shows through the camera helper overlay, so the source's
 * `showWireframe` toggle is dropped. Plays when opened.
 */
@Register
export class ShadowContactExample extends Document {

  @Property({type: Number, value: 3.5})
  declare blur: number

  @Property({type: Number, value: 1})
  declare darkness: number

  @Property({type: Number, value: 1})
  declare opacity: number

  @Property({type: Color, init: null})
  declare planeColor: Color

  @Property({type: Number, value: 1})
  declare planeOpacity: number

  public meshes: Mesh[] = []
  public shadowGroup: Group
  private shadowCamera: OrthographicCamera
  private renderTarget: RenderTarget
  private depthMaterial: NodeMaterial
  private uBlur = uniform( 3.5 )
  private uDarkness = uniform( 1 )
  private uShadowOpacity = uniform( 1 )
  private uPlaneOpacity = uniform( 1 )
  private uPlaneColor = uniform( new Color( 0xffffff ) )
  private rendererState = {} as RendererState

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0.5, 1, 2 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xffffff )

    const geometries = [
      new BoxGeometry( 0.4, 0.4, 0.4 ),
      new IcosahedronGeometry( 0.3 ),
      new TorusKnotGeometry( 0.4, 0.05, 256, 24, 1, 3 )
    ]
    const names = [ 'Box', 'Icosahedron', 'Torus Knot' ]

    const material = new MeshNormalMaterial()

    for ( let i = 0, l = geometries.length; i < l; i ++ ) {

      const angle = ( i / l ) * Math.PI * 2
      const mesh = new Mesh( geometries[ i ], material )
      mesh.name = names[ i ]
      mesh.position.y = 0.1
      mesh.position.x = Math.cos( angle ) / 2.0
      mesh.position.z = Math.sin( angle ) / 2.0
      this.scene.add( mesh )
      this.meshes.push( mesh )

    }

    this.shadowGroup = new Group()
    this.shadowGroup.name = 'Contact Shadow'
    this.shadowGroup.position.y = - 0.3
    this.scene.add( this.shadowGroup )

    this.renderTarget = new RenderTarget( 512, 512, { depthBuffer: true } )
    this.renderTarget.texture.generateMipmaps = false

    const planeGeometry = new PlaneGeometry( PLANE_WIDTH, PLANE_HEIGHT ).rotateX( Math.PI / 2 )

    this.depthMaterial = new NodeMaterial()

    const alphaDepth = float( 1 ).sub( depth ).mul( this.uDarkness )

    this.depthMaterial.colorNode = vec3( 0 )
    this.depthMaterial.opacityNode = alphaDepth
    this.depthMaterial.depthTest = false
    this.depthMaterial.depthWrite = false

    const shadowPlaneMaterial = new NodeMaterial()
    shadowPlaneMaterial.transparent = true
    shadowPlaneMaterial.depthWrite = false

    if ( ! this.renderTarget.texture.image ) this.renderTarget.texture.image = { width: 512, height: 512 }

    const blurredShadow = gaussianBlur( texture( this.renderTarget.texture ), this.uBlur, 4, { premultipliedAlpha: false } )
    shadowPlaneMaterial.colorNode = vec3( 0 )
    shadowPlaneMaterial.opacityNode = blurredShadow.a.mul( this.uShadowOpacity )

    const plane = new Mesh( planeGeometry, shadowPlaneMaterial )
    plane.name = 'Shadow'
    plane.renderOrder = 1
    plane.scale.y = - 1
    plane.scale.z = - 1
    this.shadowGroup.add( plane )

    const fillPlaneMaterial = new NodeMaterial()
    fillPlaneMaterial.transparent = true
    fillPlaneMaterial.depthWrite = false
    fillPlaneMaterial.colorNode = this.uPlaneColor
    fillPlaneMaterial.opacityNode = this.uPlaneOpacity
    const fillPlane = new Mesh( planeGeometry, fillPlaneMaterial )
    fillPlane.name = 'Fill'
    fillPlane.rotateX( Math.PI )
    this.shadowGroup.add( fillPlane )

    this.shadowCamera = new OrthographicCamera( - PLANE_WIDTH / 2, PLANE_WIDTH / 2, PLANE_HEIGHT / 2, - PLANE_HEIGHT / 2, 0, CAMERA_HEIGHT )
    this.shadowCamera.name = 'Shadow Camera'
    this.shadowCamera.rotation.x = Math.PI / 2
    this.shadowGroup.add( this.shadowCamera )

    this.pose( this.timeline.currentTime )
  }

  blurChanged() { this.uBlur.value = this.blur; this.notify({kind: 'material'}) }
  darknessChanged() { this.uDarkness.value = this.darkness; this.notify({kind: 'material'}) }
  opacityChanged() { this.uShadowOpacity.value = this.opacity; this.notify({kind: 'material'}) }
  planeOpacityChanged() { this.uPlaneOpacity.value = this.planeOpacity; this.notify({kind: 'material'}) }

  planeColorMutated() {
    this.uPlaneColor.value.copy( this.planeColor )
    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    for ( const m of this.meshes ) {
      m.rotation.x = time * 0.6
      m.rotation.y = time * 1.2
    }
  }

  /** Renders the depth of everything above the plane, seen from below, into the shadow target. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    const scene = this.scene

    const initialBackground = scene.background
    scene.background = null

    const prevOverride = scene.overrideMaterial
    scene.overrideMaterial = this.depthMaterial

    const rendererState = RendererUtils.resetRendererState( renderer, this.rendererState )
    renderer.setClearAlpha( 0 )

    renderer.setRenderTarget( this.renderTarget )
    renderer.clear()
    renderer.render( scene, this.shadowCamera )

    RendererUtils.restoreRendererState( renderer, rendererState )

    scene.overrideMaterial = prevOverride
    scene.background = initialBackground
  }
}

registerEditorConfig(ShadowContactExample, [
  ['blur', ioNumberSlider({min: 0, max: 15, step: 0.1})],
  ['darkness', ioNumberSlider({min: 0.1, max: 5, step: 0.1})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['planeOpacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(ShadowContactExample, {
  Main: ['blur', 'darkness', 'opacity', 'planeColor', 'planeOpacity'],
  Hidden: ['meshes', 'shadowGroup', 'shadowCamera', 'renderTarget', 'depthMaterial', 'uBlur', 'uDarkness', 'uShadowOpacity', 'uPlaneOpacity', 'uPlaneColor', 'rendererState'],
})
