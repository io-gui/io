import { AmbientLight, DirectionalLight, LoadingManager, Mesh, MeshPhongMaterial, TextureLoader } from 'three/webgpu'
import { TDSLoader } from 'three/addons/loaders/TDSLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** The portal gun from a 3DS file with its textures, plus a separately loaded normal map. */
@Register
export class Loader3dsExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const ambientLight = new AmbientLight( 0xffffff, 3 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const directionalLight = new DirectionalLight( 0xffeedd, 3 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 0, 0, 2 )
    this.scene.add( directionalLight )

    void this.loadModel()
  }

  private async loadModel() {
    // The textures load in the background: report them when they arrive.
    const manager = new LoadingManager( () => this.notify({kind: 'material'}) )

    //3ds files dont store normal maps
    const normal = new TextureLoader( manager ).load( 'https://threejs.org/examples/models/3ds/portalgun/textures/normal.jpg' )

    try {
      const loader = new TDSLoader( manager )
      loader.setResourcePath( 'https://threejs.org/examples/models/3ds/portalgun/textures/' )
      const object = await loader.loadAsync( 'https://threejs.org/examples/models/3ds/portalgun/portalgun.3ds' )

      object.traverse( ( child ) => {
        if ( ( child as Mesh ).isMesh ) {
          const material = ( child as Mesh ).material as MeshPhongMaterial
          material.specular.setScalar( 0.1 )
          material.normalMap = normal
        }
      } )

      object.name = 'PortalGun'
      this.scene.add( object )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
