import {
  AmbientLight,
  CatmullRomCurve3,
  Color,
  Curve,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  TubeGeometry,
  Vector3
} from 'three/webgpu'
import * as Curves from 'three/addons/curves/CurveExtras.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds the spline camera takes along the tube: the timeline length. */
const LOOP_TIME = 20

const pipeSpline = new CatmullRomCurve3( [
  new Vector3( 0, 10, - 10 ), new Vector3( 10, 0, - 10 ),
  new Vector3( 20, 0, 0 ), new Vector3( 30, 0, 10 ),
  new Vector3( 30, 0, 20 ), new Vector3( 20, 0, 30 ),
  new Vector3( 10, 0, 30 ), new Vector3( 0, 0, 30 ),
  new Vector3( - 10, 10, 30 ), new Vector3( - 10, 20, 30 ),
  new Vector3( 0, 30, 30 ), new Vector3( 10, 30, 30 ),
  new Vector3( 20, 30, 15 ), new Vector3( 10, 30, 10 ),
  new Vector3( 0, 30, 10 ), new Vector3( - 10, 20, 10 ),
  new Vector3( - 10, 10, 10 ), new Vector3( 0, 0, 10 ),
  new Vector3( 10, - 10, 10 ), new Vector3( 20, - 15, 10 ),
  new Vector3( 30, - 15, 10 ), new Vector3( 40, - 15, 10 ),
  new Vector3( 50, - 15, 10 ), new Vector3( 60, 0, 10 ),
  new Vector3( 70, 0, 0 ), new Vector3( 80, 0, 0 ),
  new Vector3( 90, 0, 0 ), new Vector3( 100, 0, 0 )
] )

const sampleClosedSpline = new CatmullRomCurve3( [
  new Vector3( 0, - 40, - 40 ),
  new Vector3( 0, 40, - 40 ),
  new Vector3( 0, 140, - 40 ),
  new Vector3( 0, 40, 40 ),
  new Vector3( 0, - 40, 40 )
] )

sampleClosedSpline.curveType = 'catmullrom'
sampleClosedSpline.closed = true

// Keep a dictionary of Curve instances
const splines: Record<string, Curve<Vector3>> = {
  GrannyKnot: new Curves.GrannyKnot(),
  HeartCurve: new Curves.HeartCurve( 3.5 ),
  VivianiCurve: new Curves.VivianiCurve( 70 ),
  KnotCurve: new Curves.KnotCurve(),
  HelixCurve: new Curves.HelixCurve(),
  TrefoilKnot: new Curves.TrefoilKnot(),
  TorusKnot: new Curves.TorusKnot( 20 ),
  CinquefoilKnot: new Curves.CinquefoilKnot( 20 ),
  TrefoilPolynomialKnot: new Curves.TrefoilPolynomialKnot( 14 ),
  FigureEightPolynomialKnot: new Curves.FigureEightPolynomialKnot(),
  DecoratedTorusKnot4a: new Curves.DecoratedTorusKnot4a(),
  DecoratedTorusKnot4b: new Curves.DecoratedTorusKnot4b(),
  DecoratedTorusKnot5a: new Curves.DecoratedTorusKnot5a(),
  DecoratedTorusKnot5c: new Curves.DecoratedTorusKnot5c(),
  PipeSpline: pipeSpline,
  SampleClosedSpline: sampleClosedSpline
}

const direction = new Vector3()
const binormal = new Vector3()
const normal = new Vector3()
const position = new Vector3()
const lookAt = new Vector3()

/**
 * A wireframed tube extruded along one of sixteen curves (`spline`, Document tab), with a `SplineCamera` riding inside it
 * once per timeline loop, offset along the tube's normal. Look through it with a camera view (the source's
 * `animationView`); `lookAhead` aims it at the path 30 units ahead. Its helper comes from the camera helpers overlay (the
 * source's `cameraHelper` toggle and eye sphere are dropped). Plays when opened.
 */
@Register
export class GeometryExtrudeSplinesExample extends Document {

  public parent: Object3D
  public splineCamera: PerspectiveCamera
  public mesh?: Mesh<TubeGeometry, MeshLambertMaterial>
  private material = new MeshLambertMaterial( { color: 0xff00ff } )
  private wireframeMaterial = new MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } )

  @Property({type: String, value: 'GrannyKnot'})
  declare spline: string

  @Property({type: Number, value: 4})
  declare scale: number

  @Property({type: Number, value: 100})
  declare extrusionSegments: number

  @Property({type: Number, value: 3})
  declare radiusSegments: number

  @Property({type: Boolean, value: true})
  declare closed: boolean

  @Property({type: Boolean, value: false})
  declare lookAhead: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: LOOP_TIME}), ...args})

    this.scene.background = new Color( 0xf0f0f0 )

    // light

    const ambientLight = new AmbientLight( 0xffffff )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const light = new DirectionalLight( 0xffffff, 1.5 )
    light.name = 'Key'
    light.position.set( 0, 0, 1 )
    this.scene.add( light )

    // tube

    this.parent = new Object3D()
    this.parent.name = 'Tube'
    this.scene.add( this.parent )

    this.splineCamera = new PerspectiveCamera( 84, 1, 0.01, 1000 )
    this.splineCamera.name = 'SplineCamera'
    this.parent.add( this.splineCamera )

    this.addTube()
  }

  splineChanged() { this.addTube() }
  extrusionSegmentsChanged() { this.addTube() }
  radiusSegmentsChanged() { this.addTube() }
  closedChanged() { this.addTube() }

  scaleChanged() {
    if ( ! this.mesh ) return
    this.mesh.scale.setScalar( this.scale )
    this.moveCamera( this.timeline.currentTime )
    this.notify({kind: 'transform'})
  }

  lookAheadChanged() {
    if ( ! this.mesh ) return
    this.moveCamera( this.timeline.currentTime )
    this.notify({kind: 'transform'})
  }

  private addTube() {
    if ( ! this.parent ) return

    if ( this.mesh !== undefined ) {
      this.parent.remove( this.mesh )
      this.mesh.geometry.dispose()
    }

    const extrudePath = splines[ this.spline ]

    const tubeGeometry = new TubeGeometry( extrudePath, this.extrusionSegments, 2, this.radiusSegments, this.closed )

    // 3D shape

    this.mesh = new Mesh( tubeGeometry, this.material )
    this.mesh.name = this.spline
    const wireframe = new Mesh( tubeGeometry, this.wireframeMaterial )
    wireframe.name = 'Wireframe'
    this.mesh.add( wireframe )
    this.mesh.scale.setScalar( this.scale )
    this.parent.add( this.mesh )

    this.moveCamera( this.timeline.currentTime )
    this.notify({kind: 'structure'})
  }

  override onAnimate(delta: number, time: number) {
    this.moveCamera( time )
  }

  /** Places the spline camera along the tube for timeline `time`. */
  private moveCamera(time: number) {
    if ( ! this.mesh ) return

    // animate camera along spline

    const tubeGeometry = this.mesh.geometry
    const path = tubeGeometry.parameters.path
    const t = ( ( time % LOOP_TIME ) + LOOP_TIME ) % LOOP_TIME / LOOP_TIME

    path.getPointAt( t, position )
    position.multiplyScalar( this.scale )

    // interpolation

    const segments = tubeGeometry.tangents.length
    const pickt = t * segments
    const pick = Math.floor( pickt )
    const pickNext = ( pick + 1 ) % segments

    binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] )
    binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] )

    path.getTangentAt( t, direction )
    const offset = 15

    normal.copy( binormal ).cross( direction )

    // we move on a offset on its binormal

    position.add( normal.clone().multiplyScalar( offset ) )

    const splineCamera = this.splineCamera
    splineCamera.position.copy( position )

    // using arclength for stabilization in look ahead

    path.getPointAt( ( t + 30 / path.getLength() ) % 1, lookAt )
    lookAt.multiplyScalar( this.scale )

    // camera orientation 2 - up orientation via normal

    if ( ! this.lookAhead ) lookAt.copy( position ).add( direction )
    splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal )
    splineCamera.quaternion.setFromRotationMatrix( splineCamera.matrix )
  }
}

registerEditorConfig(GeometryExtrudeSplinesExample, [
  ['spline', ioOptionSelect({model: new Menu({options: Object.keys( splines )})})],
  ['scale', ioNumberSlider({min: 2, max: 10, step: 2})],
  ['extrusionSegments', ioNumberSlider({min: 50, max: 500, step: 50})],
  ['radiusSegments', ioNumberSlider({min: 2, max: 12, step: 1})],
])

registerEditorGroups(GeometryExtrudeSplinesExample, {
  Main: ['spline', 'scale', 'extrusionSegments', 'radiusSegments', 'closed', 'lookAhead'],
  Hidden: ['parent', 'splineCamera', 'mesh', 'material', 'wireframeMaterial'],
})
