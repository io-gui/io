import { ACESFilmicToneMapping, EquirectangularReflectionMapping, Material, Mesh, Object3D, PerspectiveCamera } from 'three/webgpu'
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/** The variants the shoe defines (`KHR_materials_variants`); the dropdown lists them before the model loads. */
const VARIANTS = [ 'midnight', 'beach', 'street' ]

type VariantsExtension = {variants: {name: string}[]}
type MeshVariants = {mappings: {material: number; variants: number[]}[]}

/**
 * A shoe from a glTF with material variants (`KHR_materials_variants`), picked with `variant` (Document tab), in an
 * HDR environment that is also the background. The environment and model load together (the source loads the model
 * after the environment).
 */
@Register
export class LoaderGltfVariantsExample extends Document {

  @Property({type: String, value: 'midnight'})
  declare variant: string

  private gltf?: GLTF

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( 2.5, 1.5, 3 )
    camera.lookAt( 0, 0.5, - 0.2 )
    this.activeCamera = camera
    void this.loadEnvironment()
    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  variantChanged() {
    void this.selectVariant( this.variant )
  }

  private async loadEnvironment() {
    try {
      const texture = await new HDRLoader()
        .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
        .loadAsync( 'quarry_01_1k.hdr' )

      texture.mapping = EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.environment = texture

      this.notify({kind: 'material'})
    } catch ( e ) {
      console.error( e )
    }
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader()
        .setPath( 'https://threejs.org/examples/models/gltf/MaterialsVariantsShoe/glTF/' )
        .loadAsync( 'MaterialsVariantsShoe.gltf' )

      this.gltf = gltf
      gltf.scene.name = 'Shoe'
      gltf.scene.scale.set( 10.0, 10.0, 10.0 )
      this.scene.add( gltf.scene )

      await this.selectVariant( this.variant )

      this.notify({kind: 'structure'})
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }

  private async selectVariant(variantName: string) {
    if ( ! this.gltf ) return

    // Details of the KHR_materials_variants extension used here can be found below
    // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_variants
    const parser = this.gltf.parser
    const extension = this.gltf.userData.gltfExtensions[ 'KHR_materials_variants' ] as VariantsExtension
    const variantIndex = extension.variants.findIndex( ( v ) => v.name.includes( variantName ) )

    const meshes: Mesh[] = []
    this.gltf.scene.traverse( ( object: Object3D ) => {
      if ( ( object as Mesh ).isMesh && object.userData.gltfExtensions ) meshes.push( object as Mesh )
    } )

    await Promise.all( meshes.map( async ( object ) => {
      const meshVariantDef = object.userData.gltfExtensions[ 'KHR_materials_variants' ] as MeshVariants | undefined
      if ( ! meshVariantDef ) return

      if ( ! object.userData.originalMaterial ) {
        object.userData.originalMaterial = object.material
      }

      const mapping = meshVariantDef.mappings
        .find( ( mapping ) => mapping.variants.includes( variantIndex ) )

      if ( mapping ) {
        object.material = await parser.getDependency( 'material', mapping.material ) as Material
        parser.assignFinalMaterial( object )
      } else {
        object.material = object.userData.originalMaterial as Material
      }
    } ) )

    this.notify({kind: 'material'})
  }
}

registerEditorConfig(LoaderGltfVariantsExample, [
  ['variant', ioOptionSelect({model: new Menu({options: VARIANTS})})],
])

registerEditorGroups(LoaderGltfVariantsExample, {
  Main: ['variant'],
  Hidden: ['gltf'],
})
