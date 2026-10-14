import { AmbientLight, Box3, DoubleSide, Group, Mesh, MeshStandardMaterial, ObjectSpaceNormalMap, PointLight } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** The Nefertiti bust shaded with an object-space normal map and no vertex normals. */
@Register
export class MaterialsNormalmapObjectSpaceExample extends Document {

  public bust: Group

  constructor(args?: DocumentProps) {
    super(args)

    // ambient

    const ambientLight = new AmbientLight( 0xffffff, 0.6 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // light

    // The source attaches the light to its camera at (- 10, 0, 23).
    const light = new PointLight( 0xffffff, 4.5, 0, 0 )
    light.name = 'Point'
    light.position.set( - 10, 0, 23 )
    this.scene.add( light )

    this.bust = new Group()
    this.bust.name = 'Nefertiti'
    this.scene.add( this.bust )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Nefertiti/Nefertiti.glb' )

      const meshes: Mesh[] = []
      gltf.scene.traverse( ( child ) => {
        if ( ( child as Mesh ).isMesh ) meshes.push( child as Mesh )
      } )

      for ( const child of meshes ) {
        const material = child.material as MeshStandardMaterial

        // glTF currently supports only tangent-space normal maps.
        // this model has been modified to demonstrate the use of an object-space normal map.

        material.normalMapType = ObjectSpaceNormalMap

        // attribute normals are not required with an object-space normal map. remove them.

        child.geometry.deleteAttribute( 'normal' )

        //

        material.side = DoubleSide

        child.scale.multiplyScalar( 0.5 )

        // recenter

        new Box3().setFromObject( child ).getCenter( child.position ).multiplyScalar( - 1 )

        this.bust.add( child )
      }

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: this.bust}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
