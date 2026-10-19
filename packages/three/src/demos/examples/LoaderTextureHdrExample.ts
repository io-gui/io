import { Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, ReinhardToneMapping } from 'three/webgpu'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/**
 * An HDR image from a Radiance HDR file on a plane of its aspect, Reinhard tone mapped. The source's exposure control
 * is the document's `toneMappingExposure` (Document tab); its orthographic camera is the active camera.
 */
@Register
export class LoaderTextureHdrExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, toneMappingExposure: 2.0, ...args})

    const aspect = 400 / 250
    const camera = new OrthographicCamera( - aspect, aspect, 1, - 1, 0, 1 )
    camera.name = 'Camera'
    this.activeCamera = camera
    void this.loadTexture()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadTexture() {
    try {
      const texture = await new HDRLoader().loadAsync( 'https://threejs.org/examples/textures/memorial.hdr' )
      const { width, height } = texture.image

      const material = new MeshBasicMaterial( { map: texture } )
      const quad = new PlaneGeometry( 1.5 * width / height, 1.5 )
      const mesh = new Mesh( quad, material )
      mesh.name = 'Image'
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }
}
