import { DirectionalLight, Group, Object3D, PerspectiveCamera } from 'three/webgpu'
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'

interface Rhino3dmLayer {
  name: string
  visible: boolean
}

/**
 * The Rhino logo from a Rhino 3DM file (`Rhino3dmLoader`, with the rhino3dm library from the CDN), with a visibility
 * toggle per Rhino layer in `layers` (Document tab). The source makes Z the global up axis
 * (`Object3D.DEFAULT_UP`); here the model turns Z-up to Y-up instead, and its light and the active camera with it.
 * Static.
 */
@Register
export class Loader3dmExample extends Document {

  public model?: Object3D

  /** Visibility per Rhino layer, by name. Empty until the model loads. */
  @Property({type: Object, init: null})
  declare layers: Record<string, boolean>

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    // The source's Z-up camera at (26, - 40, 5), turned Y-up like the model.
    camera.position.set( 26, 5, 40 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // The source's light at (0, 0, 2) with Z up.
    const directionalLight = new DirectionalLight( 0xffffff, 6 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 0, 2, 0 )
    this.scene.add( directionalLight )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const loader = new Rhino3dmLoader()
      loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@8.32.1/' )

      const object = await loader.loadAsync( 'https://threejs.org/examples/models/3dm/Rhino_Logo.3dm' )
      object.name = 'Rhino_Logo'

      // Z up (Rhino) to Y up.
      const model = new Group()
      model.name = 'Z Up'
      model.rotation.x = - Math.PI / 2
      model.add( object )
      this.scene.add( model )
      this.model = model

      const layers = object.userData.layers as Rhino3dmLayer[]
      const visibility: Record<string, boolean> = {}

      for ( let i = 0; i < layers.length; i ++ ) {
        const layer = layers[ i ]
        Object.defineProperty( visibility, layer.name, {
          get: () => layer.visible,
          set: ( value: boolean ) => {
            layer.visible = value
            object.traverse( ( child ) => {
              const attributes = child.userData.attributes
              if ( attributes && 'layerIndex' in attributes && attributes.layerIndex === i ) child.visible = value
            } )
          },
          enumerable: true,
        } )
      }

      this.layers = visibility

      this.notify({kind: 'structure'})
      model.updateMatrixWorld( true )
      this._frameTarget = model
    } catch ( e ) {
      console.error( e )
    }
  }

  /** A toggle changed: objects of a layer were shown or hidden in place. */
  layersMutated() {
    this.notify({kind: 'other'})
  }
}

registerEditorConfig(Loader3dmExample, [
  ['layers', ioObject({expanded: true, labelWidth: '120px'})],
])

registerEditorGroups(Loader3dmExample, {
  Main: ['layers'],
  Hidden: ['model'],
})
