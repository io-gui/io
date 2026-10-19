import { AmbientLight, Color, PerspectiveCamera, PointLight } from 'three/webgpu'
import { AMFLoader } from 'three/addons/loaders/AMFLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/**
 * A chess rook from an AMF file (3D printing). The file is Z-up like the source's camera; here the rook is turned
 * upright for the Y-up views, and the active camera with it. The source's grid is dropped.
 */
@Register
export class LoaderAmfExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x999999 )

    const ambientLight = new AmbientLight( 0x999999 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // The source's Z-up camera at (0, -9, 6), looking at (0, 0, 2), turned Y-up like the rook; the light rides on it.
    const camera = new PerspectiveCamera( 35, 400 / 250, 1, 500 )
    camera.name = 'Camera'
    camera.position.set( 0, 6, 9 )
    camera.lookAt( 0, 2, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    const pointLight = new PointLight( 0xffffff, 250 )
    pointLight.name = 'Point'
    camera.add( pointLight )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const amfobject = await new AMFLoader().loadAsync( 'https://threejs.org/examples/models/amf/rook.amf' )
      amfobject.name = 'Rook'
      // Z is up for objects intended to be 3D printed.
      amfobject.rotation.x = - Math.PI / 2
      this.scene.add( amfobject )

      this.notify({kind: 'structure'})
      this._frameTarget = amfobject
    } catch ( e ) {
      console.error( e )
    }
  }
}
