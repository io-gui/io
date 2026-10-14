import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** NURBS curves from an FBX file, drawn as lines. The source's grid is dropped; no background (source: black clear). */
@Register
export class LoaderFbxNurbsExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)
    void this.loadModel()
  }

  private async loadModel() {
    try {
      const object = await new FBXLoader().loadAsync( 'https://threejs.org/examples/models/fbx/nurbs.fbx' )
      object.name = 'Nurbs'
      this.scene.add( object )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
