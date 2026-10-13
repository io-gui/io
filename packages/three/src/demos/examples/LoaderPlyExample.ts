import {
  Color,
  ColorRepresentation,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PlaneGeometry
} from 'three/webgpu'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** Two PLY files on a floor: ASCII dolphins and the binary Lucy statue. The source's orbiting camera is dropped. */
@Register
export class LoaderPlyExample extends Document {

  public models: Group

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x72645b )
    this.scene.fog = new Fog( 0x72645b, 2, 15 )

    // Ground

    const plane = new Mesh(
      new PlaneGeometry( 40, 40 ),
      new MeshPhongMaterial( { color: 0xcbcbcb, specular: 0x474747 } )
    )
    plane.name = 'Ground'
    plane.rotation.x = - Math.PI / 2
    plane.position.y = - 0.5
    plane.receiveShadow = true
    plane.userData.selectable = false
    this.scene.add( plane )

    this.models = new Group()
    this.models.name = 'Models'
    this.scene.add( this.models )

    // Lights

    const hemiLight = new HemisphereLight( 0x8d7c7c, 0x494966, 3 )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    this.addShadowedLight( 'Key', 1, 1, 1, 0xffffff, 3.5 )
    this.addShadowedLight( 'Fill', 0.5, 1, - 1, 0xffd500, 3 )

    void this.loadModels()
  }

  private addShadowedLight(name: string, x: number, y: number, z: number, color: ColorRepresentation, intensity: number) {
    const directionalLight = new DirectionalLight( color, intensity )
    directionalLight.name = name
    directionalLight.position.set( x, y, z )
    this.scene.add( directionalLight )

    directionalLight.castShadow = true

    const d = 1

    directionalLight.shadow.camera.left = - d
    directionalLight.shadow.camera.right = d
    directionalLight.shadow.camera.top = d
    directionalLight.shadow.camera.bottom = - d

    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 4

    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024

    directionalLight.shadow.bias = - 0.001
  }

  private async loadModels() {
    const loader = new PLYLoader().setPath( 'https://threejs.org/examples/models/ply/' )

    try {
      const [ dolphins, lucy ] = await Promise.all( [
        loader.loadAsync( 'ascii/dolphins.ply' ),
        loader.loadAsync( 'binary/Lucy100k.ply' ),
      ] )

      dolphins.computeVertexNormals()

      const dolphinsMesh = new Mesh( dolphins, new MeshStandardMaterial( { color: 0x009cff, flatShading: true } ) )
      dolphinsMesh.name = 'Dolphins'
      dolphinsMesh.position.y = - 0.2
      dolphinsMesh.position.z = 0.3
      dolphinsMesh.rotation.x = - Math.PI / 2
      dolphinsMesh.scale.multiplyScalar( 0.001 )
      dolphinsMesh.castShadow = true
      dolphinsMesh.receiveShadow = true
      this.models.add( dolphinsMesh )

      lucy.computeVertexNormals()

      const lucyMesh = new Mesh( lucy, new MeshStandardMaterial( { color: 0x009cff, flatShading: true } ) )
      lucyMesh.name = 'Lucy'
      lucyMesh.position.x = - 0.2
      lucyMesh.position.y = - 0.02
      lucyMesh.position.z = - 0.2
      lucyMesh.scale.multiplyScalar( 0.0006 )
      lucyMesh.castShadow = true
      lucyMesh.receiveShadow = true
      this.models.add( lucyMesh )

      this.notify({kind: 'structure'})
      // The models, not the scene: the floor spans 40 units.
      this.dispatch('frame-object', {object: this.models}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
