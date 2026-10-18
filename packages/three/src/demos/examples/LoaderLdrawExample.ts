import {
  ACESFilmicToneMapping,
  Color,
  Group,
  LineSegments,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PMREMGenerator,
  WebGPURenderer
} from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js'
import { LDrawUtils } from 'three/addons/utils/LDrawUtils.js'
import { LDrawConditionalLineMaterial } from 'three/addons/materials/LDrawConditionalLineNodeMaterial.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/**
 * The conditional line material with its `fragmentNode` as `outputNode`. Workaround (upstream:
 * triage-fragment-node-mrt): a `fragmentNode` writes only the first color output, which the TRAA views' color and
 * velocity pass rejects; an `outputNode` merges with it.
 */
class ConditionalLineMaterial extends LDrawConditionalLineMaterial {
  constructor(parameters?: ConstructorParameters<typeof LDrawConditionalLineMaterial>[ 0 ]) {
    super( parameters )
    this.outputNode = this.fragmentNode
    this.fragmentNode = null
  }
}

const ldrawPath = 'https://threejs.org/examples/models/ldraw/officialLibrary/'

const modelFileList: Record<string, string> = {
  'Car': 'models/car.ldr_Packed.mpd',
  'Lunar Vehicle': 'models/1621-1-LunarMPVVehicle.mpd_Packed.mpd',
  'Radar Truck': 'models/889-1-RadarTruck.mpd_Packed.mpd',
  'Trailer': 'models/4838-1-MiniVehicles.mpd_Packed.mpd',
  'Bulldozer': 'models/4915-1-MiniConstruction.mpd_Packed.mpd',
  'Helicopter': 'models/4918-1-MiniFlyers.mpd_Packed.mpd',
  'Plane': 'models/5935-1-IslandHopper.mpd_Packed.mpd',
  'Lighthouse': 'models/30023-1-Lighthouse.ldr_Packed.mpd',
  'X-Wing mini': 'models/30051-1-X-wingFighter-Mini.mpd_Packed.mpd',
  'AT-ST mini': 'models/30054-1-AT-ST-Mini.mpd_Packed.mpd',
  'AT-AT mini': 'models/4489-1-AT-AT-Mini.mpd_Packed.mpd',
  'Shuttle': 'models/4494-1-Imperial Shuttle-Mini.mpd_Packed.mpd',
  'TIE Interceptor': 'models/6965-1-TIEIntercep_4h4MXk5.mpd_Packed.mpd',
  'Star fighter': 'models/6966-1-JediStarfighter-Mini.mpd_Packed.mpd',
  'X-Wing': 'models/7140-1-X-wingFighter.mpd_Packed.mpd',
  'AT-ST': 'models/10174-1-ImperialAT-ST-UCS.mpd_Packed.mpd',
  'Window': 'models/6156-1-WindowBrick.mpd_Packed.mpd'
}

/**
 * LEGO models from packed LDraw files (`LDrawLoader`), with edge lines and conditional lines (outlines that show only
 * where the surface turns away, `LDrawConditionalLineNodeMaterial`). `model`, `flatColors`, `mergeModel`,
 * `smoothNormals`, `displayLines`, `conditionalLines` and `buildingStep` (up to `buildingSteps` - 1) are in the Document
 * tab. Views frame each model as it loads. Static.
 */
@Register
export class LoaderLdrawExample extends Document {

  public model?: Group

  @Property({type: String, value: 'Car'})
  declare modelName: string

  @Property({type: Boolean, value: true})
  declare displayLines: boolean

  @Property({type: Boolean, value: true})
  declare conditionalLines: boolean

  @Property({type: Boolean, value: true})
  declare smoothNormals: boolean

  /** Shows the model built up to this step of its building instructions. */
  @Property({type: Number, value: 0})
  declare buildingStep: number

  /** Steps in the model's building instructions. Read-only. */
  @Property({type: Number, value: 0})
  declare buildingSteps: number

  @Property({type: Boolean, value: false})
  declare flatColors: boolean

  @Property({type: Boolean, value: false})
  declare mergeModel: boolean

  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    this.scene.background = new Color( 0xdeebed )

    this.reloadObject( true )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.scene.environment = new PMREMGenerator( renderer ).fromScene( new RoomEnvironment(), 0.04 ).texture
  }

  modelNameChanged() { this.reloadObject( true ) }
  flatColorsChanged() { this.reloadObject( false ) }
  mergeModelChanged() { this.reloadObject( false ) }
  smoothNormalsChanged() { this.reloadObject( false ) }

  displayLinesChanged() { this.updateObjectsVisibility() }
  conditionalLinesChanged() { this.updateObjectsVisibility() }

  buildingStepChanged() {
    const step = Math.min( Math.max( Math.round( this.buildingStep ), 0 ), Math.max( this.buildingSteps - 1, 0 ) )
    if ( step !== this.buildingStep ) {
      this.buildingStep = step
      return
    }
    this.updateObjectsVisibility()
  }

  private updateObjectsVisibility() {
    if ( ! this.model ) return

    this.model.traverse( ( c: Object3D ) => {

      if ( ( c as LineSegments ).isLineSegments ) {

        if ( ( c as LineSegments & { isConditionalLine?: boolean } ).isConditionalLine ) {

          c.visible = this.conditionalLines

        } else {

          c.visible = this.displayLines

        }

      } else if ( ( c as Group ).isGroup ) {

        // Hide objects with building step > gui setting
        c.visible = c.userData.buildingStep <= this.buildingStep

      }

    } )

    this.notify({kind: 'other'})
  }

  private reloadObject(resetCamera: boolean) {
    if ( this.loads === undefined ) return
    void this.loadObject( resetCamera )
  }

  private async loadObject(resetCamera: boolean) {
    const load = ++ this.loads

    // only smooth when not rendering with flat colors to improve processing time
    const lDrawLoader = new LDrawLoader()
    lDrawLoader.setConditionalLineMaterial( ConditionalLineMaterial as unknown as Parameters<LDrawLoader['setConditionalLineMaterial']>[ 0 ] )
    lDrawLoader.smoothNormals = this.smoothNormals && ! this.flatColors

    try {
      let model: Group = await lDrawLoader.setPath( ldrawPath ).loadAsync( modelFileList[ this.modelName ] )
      if ( load !== this.loads ) return

      if ( this.model ) {

        this.scene.remove( this.model )

      }

      // demonstrate how to use convert to flat colors to better mimic the lego instructions look
      if ( this.flatColors ) {

        const convertMaterial = ( material: Material ) => {

          const source = material as MeshStandardMaterial
          const newMaterial = new MeshBasicMaterial()
          newMaterial.color.copy( source.color )
          newMaterial.polygonOffset = source.polygonOffset
          newMaterial.polygonOffsetUnits = source.polygonOffsetUnits
          newMaterial.polygonOffsetFactor = source.polygonOffsetFactor
          newMaterial.opacity = source.opacity
          newMaterial.transparent = source.transparent
          newMaterial.depthWrite = source.depthWrite
          newMaterial.toneMapped = false

          return newMaterial

        }

        model.traverse( ( c: Object3D ) => {

          const mesh = c as Mesh
          if ( mesh.isMesh ) {

            if ( Array.isArray( mesh.material ) ) {

              mesh.material = mesh.material.map( convertMaterial )

            } else {

              mesh.material = convertMaterial( mesh.material )

            }

          }

        } )

      }

      // Merge model geometries by material
      if ( this.mergeModel ) model = LDrawUtils.mergeObject( model ) as Group

      // Convert from LDraw coordinates: rotate 180 degrees around OX
      model.name = this.modelName
      model.rotation.x = Math.PI

      this.scene.add( model )
      this.model = model

      const steps = model.userData.numBuildingSteps as number
      this.setProperties({
        buildingSteps: steps,
        buildingStep: steps - 1,
      })

      this.updateObjectsVisibility()

      this.notify({kind: 'structure'})

      if ( resetCamera ) {
        model.updateMatrixWorld( true )
        this.dispatch('frame-object', {object: model}, true)
      }
    } catch ( e ) {
      console.error( e )
    }
  }
}

registerEditorConfig(LoaderLdrawExample, [
  ['modelName', ioOptionSelect({model: new Menu({options: Object.keys( modelFileList )})})],
])

registerEditorGroups(LoaderLdrawExample, {
  Main: ['modelName', 'flatColors', 'mergeModel', 'buildingStep', 'buildingSteps', 'smoothNormals', 'displayLines', 'conditionalLines'],
  Hidden: ['model', 'loads'],
})
