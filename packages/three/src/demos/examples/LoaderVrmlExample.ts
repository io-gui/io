import { AmbientLight, BufferGeometry, DirectionalLight, LoadingManager, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Scene, Vector3 } from 'three/webgpu'
import { VRMLLoader } from 'three/addons/loaders/VRMLLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

const ASSETS = [
  'creaseAngle',
  'crystal',
  'house',
  'elevationGrid1',
  'elevationGrid2',
  'extrusion1',
  'extrusion2',
  'extrusion3',
  'lines',
  'linesTransparent',
  'meshWithLines',
  'meshWithTexture',
  'pixelTexture',
  'points',
  'camera',
  'multilineString'
]

/**
 * VRML test files, picked with `asset` (Document tab). A file's `Background` node becomes 10000-unit sky and ground
 * spheres: they are unselectable, left out of the framing, and drawn around each view's camera (see `followCamera`).
 */
@Register
export class LoaderVrmlExample extends Document {

  public model?: Scene

  @Property({type: String, value: 'house'})
  declare asset: string

  // Textures arrive after the scene: report them when they do.
  private loader = new VRMLLoader( new LoadingManager( () => this.notify({kind: 'material'}) ) )
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 1e10 )
    camera.name = 'Camera'
    camera.position.set( - 10, 5, 10 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    const ambientLight = new AmbientLight( 0xffffff, 1.2 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const dirLight = new DirectionalLight( 0xffffff, 2.0 )
    dirLight.name = 'Key'
    dirLight.position.set( 200, 200, 200 )
    this.scene.add( dirLight )

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
      const object = await this.loader.loadAsync( 'https://threejs.org/examples/models/vrml/' + asset + '.wrl' )
      if ( load !== this.loads ) return

      this.disposeModel()

      object.name = asset
      this.model = object
      this.scene.add( object )

      // The loader puts a background's spheres in a group drawn first, wherever the Background node is.
      const content: Object3D[] = []
      const collect = ( node: Object3D ) => {
        if ( node.renderOrder === - Infinity ) {
          node.userData.selectable = false
          // Sky, then ground over it, as the loader adds them (neither tests depth).
          let order = 0
          node.traverse( ( child ) => {
            if ( ! ( child as Mesh ).isMesh ) return
            child.renderOrder = order ++
            followCamera( child as Mesh )
          } )
          return
        }
        if ( node.children.length === 0 ) content.push( node )
        for ( const child of node.children ) collect( child )
      }
      collect( object )

      this.notify({kind: 'structure'})
      // Framing leaves reads their world matrices, which nothing has computed yet below the file's transforms.
      object.updateMatrixWorld( true )
      if ( content.length ) this._frameTarget = content
    } catch ( e ) {
      console.error( e )
    }
  }

  private disposeModel() {
    if ( ! this.model ) return
    this.model.traverse( ( child ) => {
      const mesh = child as Mesh<BufferGeometry, MeshBasicMaterial>
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

/** The radius of the loader's background spheres. */
const BACKGROUND_RADIUS = 10000

const _cameraPosition = new Vector3()

/**
 * Draws a background sphere around the camera that draws it, halfway into its clip range. The source's camera reaches
 * 1e10; views clip near their content's bounds, so the 10000-unit sphere would lie beyond their far plane.
 */
function followCamera(mesh: Mesh) {
  mesh.onBeforeRender = ( renderer, scene, camera ) => {
    const { near, far } = camera as PerspectiveCamera
    const scale = ( near + far ) / 2 / BACKGROUND_RADIUS
    _cameraPosition.setFromMatrixPosition( camera.matrixWorld )
    mesh.matrixWorld.makeScale( scale, scale, scale ).setPosition( _cameraPosition )
  }
}

registerEditorConfig(LoaderVrmlExample, [
  ['asset', ioOptionSelect({model: new Menu({options: ASSETS})})],
])

registerEditorGroups(LoaderVrmlExample, {
  Main: ['asset'],
  Hidden: ['model', 'loader', 'loads'],
})
