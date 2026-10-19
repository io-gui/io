import { AmbientLight, LoadingManager, PerspectiveCamera, PointLight } from 'three/webgpu'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** The male02 model from an OBJ file with its MTL materials and textures. */
@Register
export class LoaderObjExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const ambientLight = new AmbientLight( 0xffffff )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 20 )
    camera.name = 'Camera'
    camera.position.z = 2.5
    this.scene.add( camera )
    this.activeCamera = camera

    const pointLight = new PointLight( 0xffffff, 15 )
    pointLight.name = 'Point'
    camera.add( pointLight )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    // The materials load their textures in the background: report them when they arrive.
    const manager = new LoadingManager( () => this.notify({kind: 'material'}) )

    try {
      const mtlLoader = new MTLLoader( manager ).setPath( 'https://threejs.org/examples/models/obj/male02/' )
      const materials = await mtlLoader.loadAsync( 'male02.mtl' )
      materials.preload()

      const objLoader = new OBJLoader().setPath( 'https://threejs.org/examples/models/obj/male02/' )
      objLoader.setMaterials( materials ) // optional since OBJ assets can be loaded without an accompanying MTL file
      const object = await objLoader.loadAsync( 'male02.obj' )
      object.name = 'Male02'
      object.position.y = - 0.95
      object.scale.setScalar( 0.01 )
      this.scene.add( object )

      this.notify({kind: 'structure'})
      this._frameTarget = object
    } catch ( e ) {
      console.error( e )
    }
  }
}
