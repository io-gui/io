import { ACESFilmicToneMapping, EquirectangularReflectionMapping, PerspectiveCamera } from 'three/webgpu'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { USDLoader } from 'three/addons/loaders/USDLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** A USDZ model (`USDLoader`) lit by the Venice sunset HDR environment, shown blurred behind it. */
@Register
export class LoaderUsdzExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 2.0, ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0.75, - 1.5 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera
    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
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
      this._frameTarget = model
    } catch ( e ) {
      console.error( e )
    }
  }
}
