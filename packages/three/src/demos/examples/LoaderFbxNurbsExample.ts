import { PerspectiveCamera } from 'three/webgpu'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** NURBS curves from an FBX file, drawn as lines. The source's grid is dropped; no background (source: black clear). */
@Register
export class LoaderFbxNurbsExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 2000 )
    camera.name = 'Camera'
    camera.position.set( 2, 18, 28 )
    camera.lookAt( 0, 12, 0 )
    this.activeCamera = camera
    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const object = await new FBXLoader().loadAsync( 'https://threejs.org/examples/models/fbx/nurbs.fbx' )
      object.name = 'Nurbs'
      this.scene.add( object )

      this.notify({kind: 'structure'})
      this._frameTarget = object
    } catch ( e ) {
      console.error( e )
    }
  }
}
