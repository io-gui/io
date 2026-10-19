import {
  ConeGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  Quaternion,
  SphereGeometry,
  Spherical,
  Vector3
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds between new targets (the source's `setTimeout`). */
const INTERVAL = 2

/** Targets per loop: the timeline is `TARGETS * INTERVAL` seconds and starts from the last target, so looping is seamless. */
const TARGETS = 10

/** Rotation speed in radians per second. At most π to turn, so each turn ends before the next target. */
const speed = Math.PI / 2

/**
 * A cone turning to face a target that jumps to a random point on a sphere every two seconds, with
 * `Quaternion.rotateTowards` at π/2 rad/s, or at once with `useLookAt` (Document tab). The targets are drawn once and
 * scheduled in timeline time instead of by `setTimeout`, so the turn is derived from time. Plays when opened.
 */
@Register
export class MathOrientationTransformExample extends Document {

  public mesh: Mesh<ConeGeometry, MeshNormalMaterial>
  public target: Mesh<SphereGeometry, MeshBasicMaterial>
  private targets: Vector3[] = []
  private targetQuaternions: Quaternion[] = []

  @Property({type: Boolean, value: false})
  declare useLookAt: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: TARGETS * INTERVAL}), ...args})

    const camera = new PerspectiveCamera( 70, 400 / 250, 0.01, 10 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 5 )
    this.activeCamera = camera

    const geometry = new ConeGeometry( 0.1, 0.5, 8 )
    geometry.rotateX( Math.PI * 0.5 )
    const material = new MeshNormalMaterial()

    this.mesh = new Mesh( geometry, material )
    this.mesh.name = 'Cone'
    this.scene.add( this.mesh )

    //

    const targetGeometry = new SphereGeometry( 0.05 )
    const targetMaterial = new MeshBasicMaterial( { color: 0xff0000 } )
    this.target = new Mesh( targetGeometry, targetMaterial )
    this.target.name = 'Target'
    this.scene.add( this.target )

    //

    const sphereGeometry = new SphereGeometry( 2, 32, 32 )
    const sphereMaterial = new MeshBasicMaterial( { color: 0xcccccc, wireframe: true, transparent: true, opacity: 0.3 } )
    const sphere = new Mesh( sphereGeometry, sphereMaterial )
    sphere.name = 'Sphere'
    sphere.userData.selectable = false
    this.scene.add( sphere )

    //

    const spherical = new Spherical()
    const rotationMatrix = new Matrix4()

    for ( let i = 0; i < TARGETS; i ++ ) {

      // generate a random point on a sphere

      spherical.theta = Math.random() * Math.PI * 2
      spherical.phi = Math.acos( ( 2 * Math.random() ) - 1 )
      spherical.radius = 2

      const target = new Vector3().setFromSpherical( spherical )

      // compute target rotation

      rotationMatrix.lookAt( target, this.mesh.position, this.mesh.up )

      this.targets.push( target )
      this.targetQuaternions.push( new Quaternion().setFromRotationMatrix( rotationMatrix ) )

    }

    this.pose( this.timeline.currentTime )
  }

  useLookAtChanged() {
    if ( ! this.mesh ) return
    this.pose( this.timeline.currentTime )
    this.notify({kind: 'transform'})
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** Places the target of the current interval and turns the cone from the previous target toward it. */
  private pose(time: number) {
    const index = Math.min( Math.max( Math.floor( time / INTERVAL ), 0 ), TARGETS - 1 )

    this.target.position.copy( this.targets[ index ] )

    const targetQuaternion = this.targetQuaternions[ index ]

    if ( this.useLookAt === true ) {

      // using lookAt() will make the mesh instantly look at the target

      this.mesh.lookAt( this.target.position )

    } else {

      // using rotateTowards() will gradually rotate the mesh towards the target
      // the "speed" variable represents the rotation speed in radians per seconds

      const step = speed * ( time - index * INTERVAL )
      this.mesh.quaternion.copy( this.targetQuaternions[ ( index + TARGETS - 1 ) % TARGETS ] )
      this.mesh.quaternion.rotateTowards( targetQuaternion, step )

    }
  }
}

registerEditorGroups(MathOrientationTransformExample, {
  Main: ['useLookAt'],
  Hidden: ['mesh', 'target', 'targets', 'targetQuaternions'],
})
