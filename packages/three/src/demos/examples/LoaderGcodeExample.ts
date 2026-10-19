import { BufferGeometry, Group, LineBasicMaterial, LineSegments, PerspectiveCamera, Vector3 } from 'three/webgpu'
import { GCodeLoader } from 'three/addons/loaders/GCodeLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

const ASSETS = [
  'benchy',
  'test_m82',
  'test_m83',
]

const POSITIONS = [
  new Vector3( - 100, - 20, 100 ),
  new Vector3( 0, 0, 0 ),
  new Vector3( 0, 0, 0 ),
]

/** 3D printer toolpaths from G-code files, picked with `asset` (Document tab). No background (source: black clear). */
@Register
export class LoaderGcodeExample extends Document {

  public model?: Group

  @Property({type: String, value: 'benchy'})
  declare asset: string

  private loader = new GCodeLoader()
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 70 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera
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
      const object = await this.loader.loadAsync( 'https://threejs.org/examples/models/gcode/' + asset + '.gcode' )
      if ( load !== this.loads ) return

      this.disposeModel()

      object.name = asset
      object.position.copy( POSITIONS[ ASSETS.indexOf( asset ) ] )
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
      const line = child as LineSegments<BufferGeometry, LineBasicMaterial>
      line.material?.dispose()
      line.geometry?.dispose()
    } )
    this.scene.remove( this.model )
    this.model = undefined
  }
}

registerEditorConfig(LoaderGcodeExample, [
  ['asset', ioOptionSelect({model: new Menu({options: ASSETS})})],
])

registerEditorGroups(LoaderGcodeExample, {
  Main: ['asset'],
  Hidden: ['model', 'loader', 'loads'],
})
