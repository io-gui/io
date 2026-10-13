import { DirectionalLight, HemisphereLight } from 'three/webgpu'
import { VOXLoader } from 'three/addons/loaders/VOXLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** A MagicaVoxel monument (`VOXLoader`) as one mesh, lit from above and below. */
@Register
export class LoaderVoxExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

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

  private async loadModel() {
    try {
      const result = await new VOXLoader().loadAsync( 'https://threejs.org/examples/models/vox/monu10.vox' )

      const mesh = result.scene.children[ 0 ]
      mesh.name = 'Monument'
      mesh.position.y = 0
      mesh.scale.setScalar( 0.0015 )
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
