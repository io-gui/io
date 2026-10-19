import { AmbientLight, Box3, DoubleSide, Group, Mesh, MeshStandardMaterial, ObjectSpaceNormalMap, PerspectiveCamera, PointLight } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** The Nefertiti bust shaded with an object-space normal map and no vertex normals. */
@Register
export class MaterialsNormalmapObjectSpaceExample extends Document {

  public bust: Group

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    // ambient

    const ambientLight = new AmbientLight( 0xffffff, 0.6 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // light

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( - 10, 0, 23 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    const light = new PointLight( 0xffffff, 4.5, 0, 0 )
    light.name = 'Point'
    camera.add( light )

    this.bust = new Group()
    this.bust.name = 'Nefertiti'
    this.scene.add( this.bust )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
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
      this._frameTarget = this.bust
    } catch ( e ) {
      console.error( e )
    }
  }
}
