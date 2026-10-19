import { DirectionalLight, HemisphereLight, PerspectiveCamera } from 'three/webgpu'
import { VOXLoader } from 'three/addons/loaders/VOXLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** A MagicaVoxel monument (`VOXLoader`) as one mesh, lit from above and below. */
@Register
export class LoaderVoxExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.01, 10 )
    camera.name = 'Camera'
    camera.position.set( 0.175, 0.075, 0.175 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    // light

    const hemiLight = new HemisphereLight( 0xcccccc, 0x444444, 3 )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    const dirLight = new DirectionalLight( 0xffffff, 2.5 )
    dirLight.name = 'Key'
    dirLight.position.set( 1.5, 3, 2.5 )
    this.scene.add( dirLight )

    const dirLight2 = new DirectionalLight( 0xffffff, 1.5 )
    dirLight2.name = 'Fill'
    dirLight2.position.set( - 1.5, - 3, - 2.5 )
    this.scene.add( dirLight2 )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const result = await new VOXLoader().loadAsync( 'https://threejs.org/examples/models/vox/monu10.vox' )

      const mesh = result.scene.children[ 0 ]
      mesh.name = 'Monument'
      mesh.position.y = 0
      mesh.scale.setScalar( 0.0015 )
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }
}
