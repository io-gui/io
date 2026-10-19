import { AnimationMixer, BoxGeometry, Color, Mesh, PerspectiveCamera } from 'three/webgpu'
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/**
 * A pirouette from a BVH motion capture file: a bare skeleton, drawn by the skeleton helpers overlay (the source's
 * `SkeletonHelper`), with the clip following timeline time. Bones have no geometry for framing, so views frame a
 * detached stand-in box around the dancer. The grid comes from the grid overlay. Plays when opened.
 */
@Register
export class LoaderBvhExample extends Document {

  public mixer?: AnimationMixer

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 200, 300 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xeeeeee )

    void this.loadMotion()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadMotion() {
    try {
      const result = await new BVHLoader().loadAsync( 'https://threejs.org/examples/models/bvh/pirouette.bvh' )

      const root = result.skeleton.bones[ 0 ]
      this.scene.add( root )

      // play animation
      this.mixer = new AnimationMixer( root )
      this.mixer.clipAction( result.clip ).play()
      this.timeline.duration = result.clip.duration
      this.mixer.setTime( this.timeline.currentTime )

      this.notify({kind: 'structure'})

      // The dancer is about 180 units tall around the origin.
      const focus = new Mesh( new BoxGeometry( 120, 200, 120 ) )
      focus.position.set( 0, 90, 0 )
      focus.updateMatrixWorld()
      this._frameTarget = focus
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}
