import {
  ACESFilmicToneMapping,
  Color,
  EquirectangularReflectionMapping,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry
} from 'three/webgpu'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The source's HTML table behind its transparent canvas: four colored cells across the page, red to black. */
const TABLE_COLORS = [ 0xff0000, 0x00ff00, 0x0000ff, 0x000000 ]

/** The active camera's view at the table's distance (25 units, fov 40, aspect 400 / 250), which the cells fill. */
const TABLE_HEIGHT = 2 * 25 * Math.tan( 20 * Math.PI / 180 )
const TABLE_WIDTH = TABLE_HEIGHT * 400 / 250

/**
 * The Dragon Attenuation glTF (a transmissive, attenuating dragon on a checkered backdrop) lit by the Royal Esplanade
 * HDR. The source draws on a transparent canvas over an HTML table of colored cells, which shows through the dragon;
 * here four unlit quads behind the model stand in for the table. The controls start from the dragon's material, as
 * in the source; exposure is in Rendering. Static.
 */
@Register
export class MaterialsPhysicalTransmissionAlphaExample extends Document {

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: Number, value: 1})
  declare transmission: number

  @Property({type: Number, value: 1})
  declare opacity: number

  @Property({type: Number, value: 0})
  declare metalness: number

  @Property({type: Number, value: 0})
  declare roughness: number

  @Property({type: Number, value: 1.5})
  declare ior: number

  @Property({type: Number, value: 0.01})
  declare thickness: number

  @Property({type: Color, init: null})
  declare attenuationColor: Color

  @Property({type: Number, value: 1})
  declare attenuationDistance: number

  @Property({type: Number, value: 1})
  declare specularIntensity: number

  @Property({type: Color, init: null})
  declare specularColor: Color

  @Property({type: Number, value: 1})
  declare envMapIntensity: number

  public table: Group
  private material: MeshPhysicalMaterial | null = null

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 2000 )
    camera.name = 'Camera'
    camera.position.set( - 5, 0.5, 0 )
    camera.lookAt( 0, 0.5, 0 )
    this.activeCamera = camera

    // the table: a wall of cells facing the camera, 25 units away along +x, left to right along +z
    this.table = new Group()
    this.table.name = 'Table'
    this.table.position.set( 20, 0.5, 0 )
    this.table.rotation.y = - Math.PI / 2
    this.table.userData.selectable = false
    this.scene.add( this.table )

    const cellWidth = TABLE_WIDTH / TABLE_COLORS.length
    const cellGeometry = new PlaneGeometry( cellWidth, TABLE_HEIGHT )

    TABLE_COLORS.forEach( ( color, i ) => {
      const cell = new Mesh( cellGeometry, new MeshBasicMaterial( { color, toneMapped: false } ) )
      cell.name = color.toString( 16 ).padStart( 6, '0' )
      cell.position.x = ( i - ( TABLE_COLORS.length - 1 ) / 2 ) * cellWidth
      this.table.add( cell )
    } )

    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async load() {
    try {
      const hdrEquirect = await new UltraHDRLoader()
        .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
        .loadAsync( 'royal_esplanade_2k.hdr.jpg' )

      hdrEquirect.mapping = EquirectangularReflectionMapping

      const gltf = await new GLTFLoader()
        .setPath( 'https://threejs.org/examples/models/gltf/' )
        .loadAsync( 'DragonAttenuation.glb' )

      let dragon: Mesh | null = null

      gltf.scene.traverse( ( child ) => {
        const mesh = child as Mesh
        if ( mesh.isMesh && ( mesh.material as MeshPhysicalMaterial ).isMeshPhysicalMaterial ) dragon = mesh
      } )

      this.scene.add( gltf.scene )
      this.scene.environment = hdrEquirect

      if ( dragon ) {
        const material = ( dragon as Mesh ).material as MeshPhysicalMaterial
        this.material = material

        // the controls start from the model's material
        this.color.copy( material.color )
        this.transmission = material.transmission
        this.opacity = material.opacity
        this.metalness = material.metalness
        this.roughness = material.roughness
        this.ior = material.ior
        this.thickness = material.thickness
        this.attenuationColor.copy( material.attenuationColor )
        this.attenuationDistance = material.attenuationDistance
        this.specularIntensity = material.specularIntensity
        this.specularColor.copy( material.specularColor )
        this.envMapIntensity = material.envMapIntensity

        this._frameTarget = dragon
      }

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  colorChanged() { this.colorMutated() }
  attenuationColorChanged() { this.attenuationColorMutated() }
  specularColorChanged() { this.specularColorMutated() }

  /** The color editors change the colors in place. */
  colorMutated() {
    if ( ! this.material ) return
    this.material.color.copy( this.color )
    this.notify({kind: 'material'})
  }

  attenuationColorMutated() {
    if ( ! this.material ) return
    this.material.attenuationColor.copy( this.attenuationColor )
    this.notify({kind: 'material'})
  }

  specularColorMutated() {
    if ( ! this.material ) return
    this.material.specularColor.copy( this.specularColor )
    this.notify({kind: 'material'})
  }

  transmissionChanged() { this.updateMaterial() }
  opacityChanged() { this.updateMaterial() }
  metalnessChanged() { this.updateMaterial() }
  roughnessChanged() { this.updateMaterial() }
  iorChanged() { this.updateMaterial() }
  thicknessChanged() { this.updateMaterial() }
  attenuationDistanceChanged() { this.updateMaterial() }
  specularIntensityChanged() { this.updateMaterial() }
  envMapIntensityChanged() { this.updateMaterial() }

  private updateMaterial() {
    const material = this.material
    if ( ! material ) return

    material.transmission = this.transmission
    material.opacity = this.opacity
    material.metalness = this.metalness
    material.roughness = this.roughness
    material.ior = this.ior
    material.thickness = this.thickness
    material.attenuationDistance = this.attenuationDistance
    material.specularIntensity = this.specularIntensity
    material.envMapIntensity = this.envMapIntensity

    const transparent = this.opacity < 1

    if ( transparent !== material.transparent ) {
      material.transparent = transparent
      material.needsUpdate = true
    }

    this.notify({kind: 'material'})
  }
}

registerEditorConfig(MaterialsPhysicalTransmissionAlphaExample, [
  ['transmission', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['ior', ioNumberSlider({min: 1, max: 2, step: 0.01})],
  ['thickness', ioNumberSlider({min: 0, max: 5, step: 0.01})],
  ['attenuationDistance', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['specularIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['envMapIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsPhysicalTransmissionAlphaExample, {
  Main: [
    'color', 'transmission', 'opacity', 'metalness', 'roughness', 'ior', 'thickness', 'attenuationColor',
    'attenuationDistance', 'specularIntensity', 'specularColor', 'envMapIntensity',
  ],
  Hidden: ['table', 'material'],
})
