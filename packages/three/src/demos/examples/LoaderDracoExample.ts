import { Color, Fog, HemisphereLight, Mesh, MeshLambertMaterial, MeshStandardMaterial, PlaneGeometry, SpotLight } from 'three/webgpu'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** The Stanford bunny decoded from a Draco-compressed file, under a soft spot light. The source's orbiting camera is dropped. */
@Register
export class LoaderDracoExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x443333 )
    this.scene.fog = new Fog( 0x443333, 1, 4 )

    // Ground
    const plane = new Mesh(
      new PlaneGeometry( 8, 8 ),
      new MeshLambertMaterial( { color: 0xcbcbcb } )
    )
    plane.name = 'Ground'
    plane.rotation.x = - Math.PI / 2
    plane.position.y = 0.03
    plane.receiveShadow = true
    plane.userData.selectable = false
    this.scene.add( plane )

    // Lights
    const hemiLight = new HemisphereLight( 0x8d7c7c, 0x494966, 3 )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    const spotLight = new SpotLight()
    spotLight.name = 'Spot'
    spotLight.intensity = 7
    spotLight.angle = Math.PI / 16
    spotLight.penumbra = 0.5
    spotLight.castShadow = true
    spotLight.shadow.radius = 8
    spotLight.position.set( - 1, 1, 1 )
    this.scene.add( spotLight )

    void this.loadModel()
  }

  private async loadModel() {
    // Configure and create Draco decoder.
    const dracoLoader = new DRACOLoader()

    try {
      const geometry = await dracoLoader.loadAsync( 'https://threejs.org/examples/models/draco/bunny.drc' )
      geometry.computeVertexNormals()

      const material = new MeshStandardMaterial( { color: 0xa5a5a5 } )
      const mesh = new Mesh( geometry, material )
      mesh.name = 'Bunny'
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      // The bunny, not the scene: the floor spans 8 units.
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    } finally {
      // Release decoder resources.
      dracoLoader.dispose()
    }
  }
}
