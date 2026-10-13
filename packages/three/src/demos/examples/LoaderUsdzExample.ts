import { ACESFilmicToneMapping, EquirectangularReflectionMapping } from 'three/webgpu'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { USDLoader } from 'three/addons/loaders/USDLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** A USDZ model (`USDLoader`) lit by the Venice sunset HDR environment, shown blurred behind it. */
@Register
export class LoaderUsdzExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 2.0, ...args})
    void this.load()
  }

  private async load() {
    const hdrLoader = new HDRLoader()
      .setPath( 'https://threejs.org/examples/textures/equirectangular/' )

    const usdzLoader = new USDLoader()
      .setPath( 'https://threejs.org/examples/models/usdz/' )

    try {
      const [ texture, model ] = await Promise.all( [
        hdrLoader.loadAsync( 'venice_sunset_1k.hdr' ),
        usdzLoader.loadAsync( 'saeukkang.usdz' ),
      ] )

      // environment

      texture.mapping = EquirectangularReflectionMapping

      this.scene.background = texture
      this.scene.backgroundBlurriness = 0.5
      this.scene.environment = texture

      // model

      model.name ||= 'Model'
      model.position.y = 0.25
      model.position.z = - 0.25
      this.scene.add( model )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: model}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
