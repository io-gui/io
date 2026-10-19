import { Color, DirectionalLight, PerspectiveCamera } from 'three/webgpu'
import { KMZLoader } from 'three/addons/loaders/KMZLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** A box from a KMZ archive (zipped Collada). The source's grid is dropped. */
@Register
export class LoaderKmzExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 35, 400 / 250, 1, 500 )
    camera.name = 'Camera'
    camera.position.set( 0, 5, 10 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    this.scene.background = new Color( 0x999999 )

    const light = new DirectionalLight( 0xffffff, 3 )
    light.name = 'Key'
    light.position.set( 0.5, 1.0, 0.5 ).normalize()
    this.scene.add( light )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const kmz = await new KMZLoader().loadAsync( 'https://threejs.org/examples/models/kmz/Box.kmz' )
      kmz.scene.name = 'Box'
      kmz.scene.position.y = 0.5
      this.scene.add( kmz.scene )

      this.notify({kind: 'structure'})
      this._frameTarget = kmz.scene
    } catch ( e ) {
      console.error( e )
    }
  }
}
