import { AmbientLight, Box3, BufferGeometry, Color, DirectionalLight, Group, LoadingManager, Mesh, MeshPhongMaterial, PerspectiveCamera, Vector3 } from 'three/webgpu'
import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

const ASSETS = [
  'cube_gears',
  'facecolors',
  'multipletextures',
  'pyramid',
  'spinal implant',
  'variable voronoi',
  'vertexcolors'
]

/**
 * 3MF test files, picked with `asset` (Document tab), centered at the origin. 3MF models are Z-up (made for 3D
 * printing): the source turns its camera's up axis to z, the conversion turns the model upright (-90° about x) for the
 * Y-up views, and the light and the active camera with it.
 */
@Register
export class Loader3mfExample extends Document {

  public model?: Group

  @Property({type: String, value: 'cube_gears'})
  declare asset: string

  private loader: ThreeMFLoader
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    // The source's Z-up camera at (-100, -250, 100), turned like the model.
    const camera = new PerspectiveCamera( 35, 400 / 250, 1, 500 )
    camera.name = 'Camera'
    camera.position.set( - 100, 100, 250 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    this.scene.background = new Color( 0x333333 )

    const ambientLight = new AmbientLight( 0xffffff, 0.6 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // The source's (-1, -2.5, 1), turned upright with the model.
    const light = new DirectionalLight( 0xffffff, 2 )
    light.name = 'Key'
    light.position.set( - 1, 1, 2.5 )
    this.scene.add( light )

    // Textures arrive after the model: report them when they do.
    this.loader = new ThreeMFLoader( new LoadingManager( () => this.notify({kind: 'material'}) ) )

    this.assetChanged()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  assetChanged() {
    if ( ! this.loader ) return
    void this.loadAsset( this.asset )
  }

  private async loadAsset(asset: string) {
    const load = ++ this.loads

    try {
      const object = await this.loader.loadAsync( 'https://threejs.org/examples/models/3mf/' + asset + '.3mf' )
      if ( load !== this.loads ) return

      this.disposeModel()

      object.name = asset
      object.rotation.x = - Math.PI / 2
      object.updateMatrixWorld( true )
      const center = new Box3().setFromObject( object ).getCenter( new Vector3() )
      object.position.sub( center )

      this.model = object
      this.scene.add( object )

      this.notify({kind: 'structure'})
      this._frameTarget = object
    } catch ( e ) {
      console.error( e )
    }
  }

  private disposeModel() {
    if ( ! this.model ) return
    this.model.traverse( ( child ) => {
      const mesh = child as Mesh<BufferGeometry, MeshPhongMaterial>
      if ( mesh.material ) {
        mesh.material.map?.dispose()
        mesh.material.dispose()
      }
      mesh.geometry?.dispose()
    } )
    this.scene.remove( this.model )
    this.model = undefined
  }
}

registerEditorConfig(Loader3mfExample, [
  ['asset', ioOptionSelect({model: new Menu({options: ASSETS})})],
])

registerEditorGroups(Loader3mfExample, {
  Main: ['asset'],
  Hidden: ['model', 'loader', 'loads'],
})
