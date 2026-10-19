import { AmbientLight, DirectionalLight, LoadingManager, Mesh, MeshPhongMaterial, PerspectiveCamera, TextureLoader } from 'three/webgpu'
import { TDSLoader } from 'three/addons/loaders/TDSLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** The portal gun from a 3DS file with its textures, plus a separately loaded normal map. */
@Register
export class Loader3dsExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 10 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 2 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const ambientLight = new AmbientLight( 0xffffff, 3 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const directionalLight = new DirectionalLight( 0xffeedd, 3 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 0, 0, 2 )
    this.scene.add( directionalLight )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
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
      this._frameTarget = object
    } catch ( e ) {
      console.error( e )
    }
  }
}
