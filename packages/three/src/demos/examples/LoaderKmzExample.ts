import { Color, DirectionalLight } from 'three/webgpu'
import { KMZLoader } from 'three/addons/loaders/KMZLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** A box from a KMZ archive (zipped Collada). The source's grid is dropped. */
@Register
export class LoaderKmzExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x999999 )

    const light = new DirectionalLight( 0xffffff, 3 )
    light.name = 'Key'
    light.position.set( 0.5, 1.0, 0.5 ).normalize()
    this.scene.add( light )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const kmz = await new KMZLoader().loadAsync( 'https://threejs.org/examples/models/kmz/Box.kmz' )
      kmz.scene.name = 'Box'
      kmz.scene.position.y = 0.5
      this.scene.add( kmz.scene )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: kmz.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
