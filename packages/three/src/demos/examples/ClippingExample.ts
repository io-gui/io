import {
  AmbientLight,
  ClippingGroup,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshPhongNodeMaterial,
  Plane,
  PlaneGeometry,
  SpotLight,
  TorusKnotGeometry,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Seconds in which the knot's motion repeats: the timeline length, so looping is seamless. It turns at 0.5 and
 * 0.2 rad/s and pulses at 1 rad/s, whole multiples of 0.1 rad/s.
 */
const PERIOD = 20 * Math.PI

/**
 * A tumbling torus knot clipped by two clipping groups: a global group whose plane cuts the knot and the ground, and
 * a knot group with two planes that clip their intersection (or union). The groups' settings and `alphaToCoverage`
 * are in the Document tab; `alphaToCoverage` smooths the cut edges in views drawn with MSAA (`View.msaa`), and the
 * clipping helpers overlay draws the planes. The fill light is a `DirectionalLight` as at HEAD (r186 had `SunLight`). Plays when
 * opened.
 */
@Register
export class ClippingExample extends Document {

  public object: Mesh<TorusKnotGeometry, MeshPhongNodeMaterial>
  public ground: Mesh<PlaneGeometry, MeshPhongNodeMaterial>
  public globalClippingGroup: ClippingGroup
  public knotClippingGroup: ClippingGroup
  private globalClipPlane = new Plane( new Vector3( - 1, 0, 0 ), 0.1 )
  private localPlane1 = new Plane( new Vector3( 0, - 1, 0 ), 0.8 )
  private localPlane2 = new Plane( new Vector3( 0, 0, - 1 ), 0.1 )

  @Property({type: Boolean, value: true})
  declare alphaToCoverage: boolean

  @Property({type: Boolean, value: true})
  declare knotEnabled: boolean

  @Property({type: Boolean, value: false})
  declare knotShadows: boolean

  @Property({type: Boolean, value: true})
  declare knotIntersection: boolean

  @Property({type: Number, value: 0.8})
  declare knotPlane: number

  @Property({type: Boolean, value: true})
  declare globalEnabled: boolean

  @Property({type: Number, value: 0.1})
  declare globalPlane: number

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // Lights

    const ambientLight = new AmbientLight( 0xcccccc )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const spotLight = new SpotLight( 0xffffff, 60 )
    spotLight.name = 'Key'
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.position.set( 2, 3, 3 )
    spotLight.castShadow = true
    spotLight.shadow.camera.near = 3
    spotLight.shadow.camera.far = 10
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048
    spotLight.shadow.radius = 4
    this.scene.add( spotLight )

    const dirLight = new DirectionalLight( 0x55505a, 3 )
    dirLight.name = 'Fill'
    dirLight.position.set( 0, 3, 0 )
    dirLight.castShadow = true
    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 10

    dirLight.shadow.camera.right = 1
    dirLight.shadow.camera.left = - 1
    dirLight.shadow.camera.top = 1
    dirLight.shadow.camera.bottom = - 1

    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    this.scene.add( dirLight )

    // Clipping Groups

    this.globalClippingGroup = new ClippingGroup()
    this.globalClippingGroup.name = 'GlobalClipping'
    this.globalClippingGroup.clippingPlanes = [ this.globalClipPlane ]

    this.knotClippingGroup = new ClippingGroup()
    this.knotClippingGroup.name = 'KnotClipping'
    this.knotClippingGroup.clippingPlanes = [ this.localPlane1, this.localPlane2 ]
    this.knotClippingGroup.clipIntersection = true

    this.scene.add( this.globalClippingGroup )
    this.globalClippingGroup.add( this.knotClippingGroup )

    // Geometry

    const material = new MeshPhongNodeMaterial( {
      color: 0x80ee10,
      shininess: 0,
      side: DoubleSide,
      alphaToCoverage: true
    } )

    const geometry = new TorusKnotGeometry( 0.4, 0.08, 95, 20 )

    this.object = new Mesh( geometry, material )
    this.object.name = 'TorusKnot'
    this.object.castShadow = true
    this.object.position.y = 0.8
    this.knotClippingGroup.add( this.object )

    this.ground = new Mesh(
      new PlaneGeometry( 9, 9, 1, 1 ),
      new MeshPhongNodeMaterial( { color: 0xa0adaf, shininess: 150, alphaToCoverage: true } )
    )
    this.ground.name = 'Ground'
    this.ground.rotation.x = - Math.PI / 2 // rotates X/Y to X/Z
    this.ground.receiveShadow = true
    this.ground.userData.selectable = false
    this.globalClippingGroup.add( this.ground )

    this.pose( this.timeline.currentTime )
  }

  /** The 9-unit ground would dominate whole-scene framing: frame the knot once the document is on screen. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.dispatch('frame-object', {object: this.object}, true)
  }

  alphaToCoverageChanged() {
    if ( ! this.object ) return
    for ( const material of [ this.ground.material, this.object.material ] ) {
      material.alphaToCoverage = this.alphaToCoverage
      material.needsUpdate = true
    }
  }

  knotEnabledChanged() { this.knotClippingGroup.enabled = this.knotEnabled }
  knotShadowsChanged() { this.knotClippingGroup.clipShadows = this.knotShadows }
  knotIntersectionChanged() { this.knotClippingGroup.clipIntersection = this.knotIntersection }
  knotPlaneChanged() { this.localPlane1.constant = this.knotPlane }
  globalEnabledChanged() { this.globalClippingGroup.enabled = this.globalEnabled }
  globalPlaneChanged() { this.globalClipPlane.constant = this.globalPlane }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.object.rotation.x = time * 0.5
    this.object.rotation.y = time * 0.2
    this.object.scale.setScalar( Math.cos( time ) * 0.125 + 0.875 )
  }
}

registerEditorConfig(ClippingExample, [
  ['knotPlane', ioNumberSlider({min: 0.3, max: 1.25, step: 0.01})],
  ['globalPlane', ioNumberSlider({min: - 0.4, max: 3, step: 0.01})],
])

registerEditorGroups(ClippingExample, {
  Main: ['alphaToCoverage', 'knotEnabled', 'knotShadows', 'knotIntersection', 'knotPlane', 'globalEnabled', 'globalPlane'],
  Hidden: ['object', 'ground', 'globalClippingGroup', 'knotClippingGroup', 'globalClipPlane', 'localPlane1', 'localPlane2'],
})
