import { AmbientLight, Color, PointLight } from 'three/webgpu'
import { AMFLoader } from 'three/addons/loaders/AMFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * A chess rook from an AMF file (3D printing). The file is Z-up like the source's camera; here the rook is turned
 * upright for the Y-up views. The source's grid is dropped.
 */
@Register
export class LoaderAmfExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x999999 )

    const ambientLight = new AmbientLight( 0x999999 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // The source attaches the light to its Z-up camera at (0, -9, 6): (0, 6, 9) once turned Y-up.
    const pointLight = new PointLight( 0xffffff, 250 )
    pointLight.name = 'Point'
    pointLight.position.set( 0, 6, 9 )
    this.scene.add( pointLight )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const amfobject = await new AMFLoader().loadAsync( 'https://threejs.org/examples/models/amf/rook.amf' )
      amfobject.name = 'Rook'
      // Z is up for objects intended to be 3D printed.
      amfobject.rotation.x = - Math.PI / 2
      this.scene.add( amfobject )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: amfobject}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
