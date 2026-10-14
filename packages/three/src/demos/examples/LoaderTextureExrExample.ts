import { Mesh, MeshBasicMaterial, PlaneGeometry, ReinhardToneMapping } from 'three/webgpu'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * An HDR image from an OpenEXR file on a plane of its aspect, Reinhard tone mapped. The source's exposure control is
 * the document's `toneMappingExposure` (Document tab); its orthographic camera is dropped.
 */
@Register
export class LoaderTextureExrExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, toneMappingExposure: 2.0, ...args})
    void this.loadTexture()
  }

  private async loadTexture() {
    try {
      // memorial.exr is NPOT

      // EXRLoader sets these default settings
      //texture.generateMipmaps = false;
      //texture.minFilter = LinearFilter;
      //texture.magFilter = LinearFilter;

      const texture = await new EXRLoader().loadAsync( 'https://threejs.org/examples/textures/memorial.exr' )
      const { width, height } = texture.image

      const material = new MeshBasicMaterial( { map: texture } )
      const quad = new PlaneGeometry( 1.5 * width / height, 1.5 )
      const mesh = new Mesh( quad, material )
      mesh.name = 'Image'
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
