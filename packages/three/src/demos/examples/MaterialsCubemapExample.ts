import { AmbientLight, CubeRefractionMapping, CubeTextureLoader, Mesh, MeshLambertMaterial, MixOperation, PerspectiveCamera, PointLight } from 'three/webgpu'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/**
 * Three Walt heads with Lambert materials and a cube environment map: reflective (center), refractive (left) and
 * reflective mixed with an orange color (right). The cube map is also the background.
 */
@Register
export class MaterialsCubemapExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 13 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    //cubemap

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/'
    const format = '.jpg'
    const urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ]

    const reflectionCube = new CubeTextureLoader().load( urls, onLoad )
    const refractionCube = new CubeTextureLoader().load( urls, onLoad )
    refractionCube.mapping = CubeRefractionMapping

    this.scene.background = reflectionCube

    //lights

    const ambient = new AmbientLight( 0xffffff, 3 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    const pointLight = new PointLight( 0xffffff, 200 )
    pointLight.name = 'Point'
    this.scene.add( pointLight )

    //materials

    const cubeMaterial3 = new MeshLambertMaterial( { color: 0xffaa00, envMap: reflectionCube, combine: MixOperation, reflectivity: 0.3 } )
    const cubeMaterial2 = new MeshLambertMaterial( { color: 0xfff700, envMap: refractionCube, refractionRatio: 0.95 } )
    const cubeMaterial1 = new MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } )

    void this.loadModels( cubeMaterial1, cubeMaterial2, cubeMaterial3 )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModels(cubeMaterial1: MeshLambertMaterial, cubeMaterial2: MeshLambertMaterial, cubeMaterial3: MeshLambertMaterial) {
    try {
      const object = await new OBJLoader().setPath( 'https://threejs.org/examples/models/obj/walt/' ).loadAsync( 'WaltHead.obj' )

      const head = object.children[ 0 ] as Mesh
      head.name = 'Reflection'
      head.scale.setScalar( 0.1 )
      head.position.y = - 3
      head.material = cubeMaterial1

      const head2 = head.clone()
      head2.name = 'Refraction'
      head2.position.x = - 6
      head2.material = cubeMaterial2

      const head3 = head.clone()
      head3.name = 'Mix'
      head3.position.x = 6
      head3.material = cubeMaterial3

      this.scene.add( head, head2, head3 )

      this.notify({kind: 'structure'})
      this._frameTarget = [ head, head2, head3 ]
    } catch ( e ) {
      console.error( e )
    }
  }
}
