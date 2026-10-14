import { Color, DirectionalLight, Fog, HemisphereLight, LoadingManager, Mesh, MeshPhongMaterial, PlaneGeometry } from 'three/webgpu'
import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** A truck from a 3MF file with its materials, casting shadows on a floor. */
@Register
export class Loader3mfMaterialsExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0xa0a0a0 )
    this.scene.fog = new Fog( 0xa0a0a0, 10, 500 )

    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 )
    hemiLight.name = 'Hemisphere'
    hemiLight.position.set( 0, 100, 0 )
    this.scene.add( hemiLight )

    // r186 used a SunLight; later sources went back to this DirectionalLight.
    const dirLight = new DirectionalLight( 0xffffff, 3 )
    dirLight.name = 'Key'
    dirLight.position.set( - 0, 40, 50 )
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 50
    dirLight.shadow.camera.bottom = - 25
    dirLight.shadow.camera.left = - 25
    dirLight.shadow.camera.right = 25
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 200
    dirLight.shadow.mapSize.set( 1024, 1024 )
    this.scene.add( dirLight )

    const ground = new Mesh( new PlaneGeometry( 1000, 1000 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.position.y = 11
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    void this.loadModel()
  }

  private async loadModel() {
    const manager = new LoadingManager( () => this.notify({kind: 'material'}) )

    try {
      const object = await new ThreeMFLoader( manager ).loadAsync( 'https://threejs.org/examples/models/3mf/truck.3mf' )
      object.name = 'Truck'
      object.rotation.set( - Math.PI / 2, 0, 0 ) // z-up conversion
      object.traverse( ( child ) => {
        child.castShadow = true
      } )
      this.scene.add( object )

      this.notify({kind: 'structure'})
      // The truck, not the scene: the floor spans 1000 units.
      this.dispatch('frame-object', {object}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
