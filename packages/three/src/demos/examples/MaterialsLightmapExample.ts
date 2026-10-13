import { BackSide, Color, DirectionalLight, Mesh, MeshBasicNodeMaterial, MeshPhongMaterial, ObjectLoader, SphereGeometry } from 'three/webgpu'
import { vec4, color, positionLocal, mix } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A stone scene (JSON, `ObjectLoader`) with baked ambient occlusion and shadows in its light map, under a gradient sky
 * dome. The light map intensity is in the Document tab.
 */
@Register
export class MaterialsLightmapExample extends Document {

  public model?: Mesh

  @Property({type: Number, value: 1})
  declare lightMapIntensity: number

  constructor(args?: DocumentProps) {
    super(args)

    // LIGHTS

    const light = new DirectionalLight( 0xd5deff )
    light.name = 'Key'
    light.position.x = 300
    light.position.y = 250
    light.position.z = - 500
    this.scene.add( light )

    // SKYDOME

    const topColor = new Color().copy( light.color )
    const bottomColor = new Color( 0xffffff )
    const offset = 400
    const exponent = 0.6

    const h = positionLocal.add( offset ).normalize().y

    const skyMat = new MeshBasicNodeMaterial()
    skyMat.colorNode = vec4( mix( color( bottomColor ), color( topColor ), h.max( 0.0 ).pow( exponent ) ), 1.0 )
    skyMat.side = BackSide

    const sky = new Mesh( new SphereGeometry( 4000, 32, 15 ), skyMat )
    sky.name = 'Sky'
    sky.userData.selectable = false
    this.scene.add( sky )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const object = await new ObjectLoader().loadAsync( 'https://threejs.org/examples/models/json/lightmap/lightmap.json' ) as Mesh
      object.name = 'Model'
      this.scene.add( object )
      this.model = object
      this.lightMapIntensityChanged()

      this.notify({kind: 'structure'})
      // The model, not the scene: the sky dome spans 8000 units.
      this.dispatch('frame-object', {object}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  lightMapIntensityChanged() {
    if ( ! this.model ) return
    for ( const material of this.model.material as MeshPhongMaterial[] ) {
      material.lightMapIntensity = this.lightMapIntensity
    }
  }
}

registerEditorConfig(MaterialsLightmapExample, [
  ['lightMapIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsLightmapExample, {
  Main: ['lightMapIntensity'],
})
