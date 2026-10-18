import { HemisphereLight, MathUtils, Object3D } from 'three/webgpu'
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Random poses per loop: the timeline is their total length and starts from the last pose, so looping is seamless. */
const POSES = 10

interface Joint {
  static: boolean
  zeroPosition: number
  limits: { min: number; max: number }
}

interface Kinematics {
  joints: Record<string, Joint>
  setJointValue( name: string, value: number ): void
}

/** One move: random joint targets, eased over 1 to 5 seconds. */
interface Pose {
  start: number
  duration: number
  targets: Record<string, number>
}

/** `TWEEN.Easing.Quadratic.Out`. */
function quadraticOut( k: number ) {
  return k * ( 2 - k )
}

/**
 * An ABB IRB 52 industrial robot from a COLLADA file with kinematics, moving its joints to random poses within their
 * limits. The source chains tween.js tweens with `setTimeout`; here ten poses are drawn once and the moves derived from
 * document time. The orbiting camera is dropped; the grid comes from the grid overlay. Plays when opened.
 */
@Register
export class LoaderColladaKinematicsExample extends Document {

  public dae?: Object3D
  private kinematics?: Kinematics
  private poses: Pose[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    // Lights

    const light = new HemisphereLight( 0xfff7f7, 0x494966, 3 )
    light.name = 'Hemisphere'
    this.scene.add( light )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const collada = await new ColladaLoader().loadAsync( 'https://threejs.org/examples/models/collada/abb_irb52_7_120.dae' )
      if ( ! collada ) throw new Error( 'LoaderColladaKinematics: no COLLADA content' )

      const dae = collada.scene
      dae.name = 'abb_irb52_7_120'
      dae.scale.x = dae.scale.y = dae.scale.z = 10.0
      dae.updateMatrix()
      this.dae = dae

      this.kinematics = collada.kinematics as unknown as Kinematics
      this.createPoses( this.kinematics )

      this.scene.add( dae )

      this.pose( this.timeline.currentTime )
      this.notify({kind: 'structure'})
      dae.updateMatrixWorld( true )
      this.dispatch('frame-object', {object: dae}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  private createPoses(kinematics: Kinematics) {
    let start = 0

    for ( let i = 0; i < POSES; i ++ ) {

      const duration = MathUtils.randInt( 1000, 5000 ) / 1000
      const targets: Record<string, number> = {}

      for ( const prop in kinematics.joints ) {

        const joint = kinematics.joints[ prop ]
        if ( ! joint.static ) targets[ prop ] = MathUtils.randInt( joint.limits.min, joint.limits.max )

      }

      this.poses.push( { start, duration, targets } )
      start += duration

    }

    this.timeline.duration = start
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** Eases the joints from the previous pose toward the pose of the move `time` falls in. */
  private pose(time: number) {
    const kinematics = this.kinematics
    if ( ! kinematics ) return

    const poses = this.poses
    let index = poses.length - 1
    while ( index > 0 && poses[ index ].start > time ) index --

    const from = poses[ ( index + poses.length - 1 ) % poses.length ]
    const to = poses[ index ]
    const k = quadraticOut( MathUtils.clamp( ( time - to.start ) / to.duration, 0, 1 ) )

    for ( const prop in to.targets ) {

      kinematics.setJointValue( prop, from.targets[ prop ] + ( to.targets[ prop ] - from.targets[ prop ] ) * k )

    }
  }
}
