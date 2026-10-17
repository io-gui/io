import { ACESFilmicToneMapping, Color, EquirectangularReflectionMapping, Mesh, MeshPhysicalMaterial } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * The Sheen Chair (`KHR_materials_sheen`) under an UltraHDR panorama; the fabric's `sheen` is in the Document tab.
 * Static.
 */
@Register
export class LoaderGltfSheenExample extends Document {

  public fabric?: MeshPhysicalMaterial

  @Property({type: Number, value: 1})
  declare sheen: number

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1, ...args})

    this.scene.background = new Color( 0xAAAAAA )

    new UltraHDRLoader()
      .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
      .load( 'royal_esplanade_2k.hdr.jpg', ( texture ) => {
        texture.mapping = EquirectangularReflectionMapping

        this.scene.background = texture
        //this.scene.backgroundBlurriness = 1; // @TODO: Needs PMREM
        this.scene.environment = texture
        this.notify({kind: 'material'})
      } )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader()
        .setPath( 'https://threejs.org/examples/models/gltf/' )
        .loadAsync( 'SheenChair.glb' )

      gltf.scene.name = 'SheenChair'
      this.scene.add( gltf.scene )

      const object = gltf.scene.getObjectByName( 'SheenChair_fabric' ) as Mesh<never, MeshPhysicalMaterial>
      this.fabric = object.material
      this.sheen = this.fabric.sheen

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: gltf.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  sheenChanged() {
    if ( this.fabric ) this.fabric.sheen = this.sheen
  }
}

registerEditorConfig(LoaderGltfSheenExample, [
  ['sheen', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(LoaderGltfSheenExample, {
  Main: ['sheen'],
  Hidden: ['fabric'],
})
