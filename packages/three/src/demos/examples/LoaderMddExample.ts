import { AnimationMixer, BoxGeometry, BufferGeometry, Mesh, MeshNormalMaterial, PerspectiveCamera } from 'three/webgpu'
import { MDDLoader } from 'three/addons/loaders/MDDLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/** A cube deformed by vertex animation from an MDD file: one morph target per frame, played by its clip. Plays when opened. */
@Register
export class LoaderMddExample extends Document {

  public mixer?: AnimationMixer

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 35, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 8, 8, 8 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera
    void this.loadAnimation()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadAnimation() {
    try {
      const result = await new MDDLoader().loadAsync( 'https://threejs.org/examples/models/mdd/cube.mdd' )

      const morphTargets = result.morphTargets
      const clip = result.clip
      // clip.optimize(); // optional

      const geometry = new BoxGeometry()
      geometry.morphAttributes.position = morphTargets // apply morph targets

      const material = new MeshNormalMaterial()

      const mesh = new Mesh( geometry, material )
      mesh.name = 'Cube'
      this.scene.add( mesh )

      this.timeline.duration = clip.duration
      this.mixer = new AnimationMixer( mesh )
      this.mixer.clipAction( clip ).play() // use clip
      this.mixer.setTime( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      // Framing reads the current morph influences, but the animation grows the cube far beyond its rest shape: frame
      // the extremes of all morph targets (the geometry's own bounds), through a stand-in with just those two corners.
      geometry.computeBoundingBox()
      const { min, max } = geometry.boundingBox!
      const extent = new Mesh( new BufferGeometry().setFromPoints( [ min, max ] ) )
      this._frameTarget = extent
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}
